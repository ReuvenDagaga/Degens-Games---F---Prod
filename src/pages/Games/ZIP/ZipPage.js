// ZipGame.tsx
import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import Draggable from 'react-draggable';
import { useAuth } from '../../../context/AuthContext';
import { useRoom } from '../../../context/RoomsContext';

const socket = io('https://degensgamesprod.onrender.com');

const POINT_RADIUS = 20;
const BOARD_WIDTH = 400;
const BOARD_HEIGHT = 400;

const generateBoard = (totalPoints) => {
  const spacing = 60;
  const points = [];
  for (let i = 0; i < totalPoints; i++) {
    points.push({
      id: i + 1,
      x: 50 + (i % 5) * spacing,
      y: 50 + Math.floor(i / 5) * spacing
    });
  }
  return points;
};

const ZipGame = () => {
  const { user } = useAuth();
  const { contextRoom } = useRoom();

  const [points, setPoints] = useState([]);
  const [progress, setProgress] = useState(0);
  const [opponentProgress, setOpponentProgress] = useState(0);
  const [totalPoints, setTotalPoints] = useState(25);
  const [boardId, setBoardId] = useState('');
  const [winner, setWinner] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  const playerColor = useRef(getRandomColor());
  const lineCanvas = useRef(null);

  useEffect(() => {
    const generated = generateBoard(totalPoints);
    setPoints(generated);
  }, [totalPoints]);

  useEffect(() => {
    if (!user || !contextRoom?._id) return;

    socket.emit('joinRoom', { roomId: contextRoom._id, userId: user._id });

    socket.on('waitingForPlayer', ({ message }) => setStatusMessage(message));

    socket.on('playerInfo', () => {});

    socket.on('gameState', ({ boardId, totalPoints, progress: p, message }) => {
      setBoardId(boardId);
      setTotalPoints(totalPoints);
      setProgress(p?.[user._id] || 0);
      const other = Object.keys(p || {}).find((id) => id !== user._id);
      setOpponentProgress(p?.[other] || 0);
      setStatusMessage(message);
    });

    socket.on('gameOver', ({ winner }) => {
      setWinner(winner);
      setStatusMessage(winner === user._id ? '🏆 You Won!' : '❌ You Lost');
    });

    return () => {
      socket.off('gameState');
      socket.off('gameOver');
      socket.off('waitingForPlayer');
    };
  }, [user, contextRoom?._id]);

  const handleDragStop = (_, data, pointId) => {
    const point = points[progress];
    const dx = data.x - point.x;
    const dy = data.y - point.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 30 && point.id === pointId) {
      socket.emit('makeMove', { roomId: contextRoom._id, userId: user._id });
    }
  };

  const drawLines = () => {
    if (!lineCanvas.current) return;
    const ctx = lineCanvas.current.getContext('2d');
    ctx.clearRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
    ctx.strokeStyle = playerColor.current;
    ctx.lineWidth = 4;
    ctx.beginPath();
    for (let i = 0; i < progress; i++) {
      const p = points[i];
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
  };

  useEffect(() => {
    drawLines();
  }, [progress, points]);

  return (
    <div className="flex flex-col items-center p-6">
      <h2 className="text-2xl font-bold text-purple-400 mb-2">ZIP Duel: Board {boardId}</h2>
      <p className="mb-4 text-gray-300">Connect points in the correct order faster than your opponent</p>
      <canvas ref={lineCanvas} width={BOARD_WIDTH} height={BOARD_HEIGHT} className="absolute z-0 border border-gray-700" />
      <div style={{ width: BOARD_WIDTH, height: BOARD_HEIGHT, position: 'relative' }}>
        {points.map((point, i) => (
          <Draggable
            key={point.id}
            position={{ x: point.x, y: point.y }}
            disabled={i !== progress || !!winner}
            onStop={(e, data) => handleDragStop(e, data, point.id)}
          >
            <div
              className={`absolute flex items-center justify-center rounded-full font-bold text-white z-10 shadow-md cursor-pointer select-none transition-transform duration-200 ${
                i < progress ? 'bg-green-500 scale-75' : 'bg-blue-600'
              }`}
              style={{
                width: POINT_RADIUS * 2,
                height: POINT_RADIUS * 2,
                transform: 'translate(-50%, -50%)'
              }}
            >
              {point.id}
            </div>
          </Draggable>
        ))}
      </div>
      <div className="mt-6 text-sm text-gray-300">
        You: {progress} / {totalPoints} | Opponent: {opponentProgress} / {totalPoints}
      </div>
      {winner && (
        <div className="mt-4 text-2xl font-semibold text-yellow-400">
          {statusMessage}
        </div>
      )}
    </div>
  );
};

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export default ZipGame;