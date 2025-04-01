// ZipGame.js
import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../../../context/AuthContext';
import { useRoom } from '../../../context/RoomsContext';

const socket = io('https://degensgamesprod.onrender.com');

const POINT_RADIUS = 20;
const BOARD_WIDTH = 500;
const BOARD_HEIGHT = 500;
const BOARD_PADDING = 50; // Padding from edges

// Helper function to get 2 initials from username
function getInitials(username = "") {
  const parts = username.trim().split(" ");
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  } else {
    return parts.slice(0, 2).map((p) => p[0].toUpperCase()).join("");
  }
}

// Generate randomly positioned points that aren't too close together
const generateBoard = (totalPoints) => {
  const points = [];
  const minDistance = 70; // Minimum distance between points
  
  let attempts = 0;
  const maxAttempts = 1000; // Prevent infinite loops
  
  for (let i = 0; i < totalPoints; i++) {
    let valid = false;
    let newPoint;
    
    while (!valid && attempts < maxAttempts) {
      attempts++;
      
      // Generate random position with padding from edges
      newPoint = {
        id: i + 1,
        x: BOARD_PADDING + Math.random() * (BOARD_WIDTH - 2 * BOARD_PADDING),
        y: BOARD_PADDING + Math.random() * (BOARD_HEIGHT - 2 * BOARD_PADDING)
      };
      
      // Check distance from all existing points
      valid = true;
      for (const point of points) {
        const dx = newPoint.x - point.x;
        const dy = newPoint.y - point.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < minDistance) {
          valid = false;
          break;
        }
      }
    }
    
    if (valid) {
      points.push(newPoint);
    } else {
      console.warn('Could not place all points with minimum distance');
      break;
    }
  }
  
  return points;
};

// Check if a new line would intersect with any existing lines
const wouldIntersect = (p1, p2, existingLines) => {
  for (const line of existingLines) {
    const p3 = line.from;
    const p4 = line.to;
    
    // Line segment intersection algorithm
    const d = (p2.y - p1.y) * (p4.x - p3.x) - (p2.x - p1.x) * (p4.y - p3.y);
    
    // Lines are parallel
    if (d === 0) continue;
    
    const ua = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / d;
    const ub = ((p2.x - p1.x) * (p1.y - p3.y) - (p2.y - p1.y) * (p1.x - p3.x)) / d;
    
    // Check if intersection point is on both line segments
    if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
      return true;
    }
  }
  
  return false;
};

const ZipPage = () => {
  const { user } = useAuth();
  const { contextRoom } = useRoom();
  
  const [points, setPoints] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [progress, setProgress] = useState(0);
  const [opponentProgress, setOpponentProgress] = useState(0);
  const [totalPoints, setTotalPoints] = useState(25);
  const [boardId, setBoardId] = useState('');
  const [winner, setWinner] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [opponentId, setOpponentId] = useState(null);
  const [currentLines, setCurrentLines] = useState([]);
  const [opponentLines, setOpponentLines] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [p1Info, setP1Info] = useState(null);
  const [p2Info, setP2Info] = useState(null);
  const [timer, setTimer] = useState(0);
  
  const boardRef = useRef(null);
  const intervalRef = useRef(null);
  
  // Start timer when game starts
  useEffect(() => {
    if (gameStarted && !winner) {
      intervalRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [gameStarted, winner]);
  
  // Generate board initially or when totalPoints changes
  useEffect(() => {
    if (boardId) {
      const generated = generateBoard(totalPoints);
      setPoints(generated);
    }
  }, [totalPoints, boardId]);
  
  // Socket connection and listeners
  useEffect(() => {
    if (!user || !contextRoom?._id) return;
    
    socket.emit('joinRoom', { roomId: contextRoom._id, userId: user._id });
    
    socket.on('waitingForPlayer', ({ message }) => {
      setStatusMessage(message);
      setGameStarted(false);
    });
    
    socket.on('playerInfo', ({ p1Player, p2Player }) => {
      setP1Info(p1Player);
      setP2Info(p2Player);
      
      // Find opponent
      const opponent = user.username === p1Player.username ? p2Player.username : p1Player.username;
      setOpponentId(opponent);
    });
    
    socket.on('gameState', ({ boardId, totalPoints, progress, lines, opponentLines, message }) => {
      setBoardId(boardId);
      setTotalPoints(totalPoints);
      setGameStarted(true);
      
      if (progress) {
        setProgress(progress[user.username] || 0);
        
        // Find opponent's progress
        const otherPlayer = Object.keys(progress).find(id => id !== user.username);
        if (otherPlayer) {
          setOpponentId(otherPlayer);
          setOpponentProgress(progress[otherPlayer] || 0);
        }
      }
      
      if (lines) {
        // Process our lines and opponent lines
        const myLines = lines[user.username] || [];
        setCurrentLines(myLines);
        
        // Find opponent's lines
        const otherPlayer = Object.keys(lines).find(id => id !== user.username);
        if (otherPlayer) {
          setOpponentLines(lines[otherPlayer] || []);
        }
      }
      
      setStatusMessage(message || '');
    });
    
    socket.on('gameOver', ({ winner, message }) => {
      setWinner(winner);
      setStatusMessage(message || `Game Over - Winner: ${winner}`);
      
      // Stop timer
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      // Show an overlay or something to indicate game over
      setTimeout(() => {
        if (window.confirm(`Game Over! ${winner === user.username ? 'You Won! 🎉' : 'You Lost 😢'}\nReturn to lobby?`)) {
          window.history.back();
        }
      }, 1500);
    });
    
    socket.on('error', (message) => {
      setStatusMessage(`Error: ${message}`);
    });
    
    return () => {
      socket.off('gameState');
      socket.off('gameOver');
      socket.off('waitingForPlayer');
      socket.off('playerInfo');
      socket.off('error');
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [user, contextRoom?._id]);
  
  const handlePointClick = (pointId) => {
    if (winner || !gameStarted) return;
    
    const clickedPoint = points.find(p => p.id === pointId);
    
    // If we're at the beginning or clicked on the next point in sequence
    if (progress === 0 || pointId === progress + 1) {
      if (progress === 0) {
        // First point selection - just mark it as selected
        setSelectedPoint(clickedPoint);
        setProgress(1);
        
        // Send to server
        socket.emit('makeMove', { 
          roomId: contextRoom._id, 
          userId: user.username,
          from: null,
          to: clickedPoint,
          pointId
        });
      } else if (selectedPoint) {
        // We have a selected point and are clicking on the next one
        // Check if this connection would intersect with existing lines
        const newLine = { from: selectedPoint, to: clickedPoint };
        
        const allExistingLines = [...currentLines, ...opponentLines];
        
        if (!wouldIntersect(selectedPoint, clickedPoint, allExistingLines)) {
          // Valid move
          setCurrentLines([...currentLines, newLine]);
          setSelectedPoint(clickedPoint);
          setProgress(progress + 1);
          
          // Send to server
          socket.emit('makeMove', { 
            roomId: contextRoom._id, 
            userId: user.username,
            from: selectedPoint,
            to: clickedPoint,
            pointId
          });
        } else {
          // Invalid move - intersection detected
          setStatusMessage('Cannot cross existing lines!');
          setTimeout(() => setStatusMessage(''), 2000);
        }
      }
    } else {
      setStatusMessage(`Connect the dots in order! Next: ${progress + 1}`);
      setTimeout(() => setStatusMessage(''), 2000);
    }
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Render player info
  const renderPlayerInfo = (playerInfo, isCurrentPlayer) => {
    if (!playerInfo) return null;
    
    const initials = getInitials(playerInfo.username);
    
    return (
      <div className={`flex flex-col items-center ${isCurrentPlayer ? 'text-blue-400' : 'text-red-400'}`}>
        <div className={`w-14 h-14 rounded-full ${isCurrentPlayer ? 'bg-blue-600' : 'bg-red-600'} flex items-center justify-center text-xl font-bold text-white`}>
          {initials}
        </div>
        <p className="text-sm font-semibold mt-1">{playerInfo.username}</p>
        <p className="text-xs">{isCurrentPlayer ? progress : opponentProgress} / {totalPoints}</p>
        <p className="text-xs">W: {playerInfo.wins} L: {playerInfo.losses}</p>
      </div>
    );
  };
  
  // Render the game board with points and lines
  const renderBoard = () => {
    return (
      <div 
        ref={boardRef} 
        className="relative border-2 border-gray-700 rounded-md bg-gray-900"
        style={{ width: BOARD_WIDTH, height: BOARD_HEIGHT }}
      >
        {/* Render my lines */}
        {currentLines.map((line, i) => (
          <div
            key={`my-line-${i}`}
            className="absolute bg-blue-500 z-10"
            style={{
              width: `${Math.sqrt(Math.pow(line.to.x - line.from.x, 2) + Math.pow(line.to.y - line.from.y, 2))}px`,
              height: '3px',
              left: `${line.from.x}px`,
              top: `${line.from.y}px`,
              transformOrigin: 'left center',
              transform: `rotate(${Math.atan2(line.to.y - line.from.y, line.to.x - line.from.x) * (180 / Math.PI)}deg)`,
              opacity: 0.8
            }}
          />
        ))}
        
        {/* Render opponent lines */}
        {opponentLines.map((line, i) => (
          <div
            key={`op-line-${i}`}
            className="absolute bg-red-500 z-10"
            style={{
              width: `${Math.sqrt(Math.pow(line.to.x - line.from.x, 2) + Math.pow(line.to.y - line.from.y, 2))}px`,
              height: '3px',
              left: `${line.from.x}px`,
              top: `${line.from.y}px`,
              transformOrigin: 'left center',
              transform: `rotate(${Math.atan2(line.to.y - line.from.y, line.to.x - line.from.x) * (180 / Math.PI)}deg)`,
              opacity: 0.8
            }}
          />
        ))}
        
        {/* Render all points */}
        {points.map((point) => {
          // Determine if this point has been connected
          const isConnected = progress >= point.id;
          const isNextPoint = point.id === progress + 1;
          
          return (
            <div
              key={point.id}
              className={`absolute flex items-center justify-center rounded-full font-bold text-white cursor-pointer select-none z-20 transition-all duration-200 ${
                isConnected 
                  ? 'bg-blue-600 scale-90 border-2 border-white' 
                  : isNextPoint 
                    ? 'bg-green-500 animate-pulse scale-110' 
                    : 'bg-purple-600'
              }`}
              style={{
                width: POINT_RADIUS * 2,
                height: POINT_RADIUS * 2,
                left: point.x,
                top: point.y,
                transform: 'translate(-50%, -50%)'
              }}
              onClick={() => handlePointClick(point.id)}
            >
              {point.id}
            </div>
          );
        })}
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-start p-6">
      <h2 className="text-2xl font-bold text-purple-400 mb-2">ZIP Challenge - Board #{boardId}</h2>
      
      {/* Status Message */}
      <div className="mb-4 text-yellow-300 h-6">{statusMessage}</div>
      
      {/* Players Info + Timer */}
      <div className="w-full max-w-xl flex justify-between items-center mb-6">
        {/* My Info */}
        {renderPlayerInfo(p1Info?.username === user.username ? p1Info : p2Info, true)}
        
        {/* Timer */}
        <div className="text-center">
          <div className="text-lg font-mono bg-gray-800 px-4 py-2 rounded border border-gray-700">
            ⏱️ {formatTime(timer)}
          </div>
          <p className="mt-1 text-xs text-yellow-400">
            Prize: {(contextRoom?.price * 1.9).toFixed(2)} USDT
          </p>
        </div>
        
        {/* Opponent Info */}
        {renderPlayerInfo(p1Info?.username === user.username ? p2Info : p1Info, false)}
      </div>
      
      {/* Game Board */}
      {gameStarted ? renderBoard() : (
        <div className="flex flex-col items-center justify-center h-96 w-full">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mb-4"></div>
          <p className="text-lg text-gray-400">Waiting for another player...</p>
        </div>
      )}
      
      {/* Game Instructions */}
      <div className="mt-6 max-w-md text-center text-sm text-gray-400">
        <p className="font-semibold mb-1">How to play:</p>
        <p>Connect the numbered dots in order (1 → 2 → 3 etc.) without crossing any lines.</p>
        <p>First player to connect all dots wins!</p>
      </div>
      
      {/* Winner Overlay */}
      {winner && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50">
          <div className="text-4xl font-bold mb-4">
            {winner === user.username ? "🏆 You Won!" : "😢 You Lost!"}
          </div>
          <div className="text-xl">Returning to lobby...</div>
        </div>
      )}
    </div>
  );
};

export default ZipPage;