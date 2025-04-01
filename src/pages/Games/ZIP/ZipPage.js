// ZipGame.js
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

const ZipPage = () => {
  const { user } = useAuth();
  const { contextRoom } = useRoom();

  const [points, setPoints] = useState([]);
  const [progress, setProgress] = useState(0);
  const [opponentProgress, setOpponentProgress] = useState(0);
  const [totalPoints, setTotalPoints] = useState(25);
  const [boardId, setBoardId] = useState('');
  const [winner, setWinner] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [opponentId, setOpponentId] = useState(null);

  const linesRef = useRef([]);

  useEffect(() => {
    const generated = generateBoard(totalPoints);
    setPoints(generated);
  }, [totalPoints]);

  useEffect(() => {
    if (!user || !contextRoom?._id) return;

    socket.emit('joinRoom', { roomId: contextRoom._id, userId: user._id });

    socket.on('waitingForPlayer', ({ message }) => setStatusMessage(message));

    socket.on('playerInfo', ({ p1Player, p2Player }) => {
      const opponent = [p1Player, p2Player].find((p) => p.username !== user.username);
      setOpponentId(opponent?.username);
    });

    socket.on('gameState', ({ boardId, totalPoints, progress: p, message }) => {
      setBoardId(boardId);
      setTotalPoints(totalPoints);
      setProgress(p?.[user.username] || 0);
      const other = Object.keys(p || {}).find((id) => id !== user.username);
      setOpponentProgress(p?.[other] || 0);
      setOpponentId(other);
      setStatusMessage(message);
    });

    socket.on('gameOver', ({ winner }) => {
      setWinner(winner);
      setStatusMessage(winner === user.username ? '🏆 You Won!' : '❌ You Lost');
    });

    return () => {
      socket.off('gameState');
      socket.off('gameOver');
      socket.off('waitingForPlayer');
      socket.off('playerInfo');
    };
  }, [user, contextRoom?._id]);

  const handleDragStop = (_, data, pointId) => {
    const point = points[progress];
    if (!point) return;
    const dx = data.x - point.x;
    const dy = data.y - point.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 30 && point.id === pointId) {
      socket.emit('makeMove', { roomId: contextRoom._id, userId: user.username });
    }
  };

  const renderLines = () => {
    const segments = [];
    for (let i = 1; i < progress; i++) {
      const from = points[i - 1];
      const to = points[i];
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);

      segments.push(
        <div
          key={`line-${i}`}
          className="absolute bg-yellow-400 z-0"
          style={{
            width: `${length}px`,
            height: '4px',
            left: `${from.x}px`,
            top: `${from.y}px`,
            transform: `rotate(${angle}deg) translateY(-50%)`,
            transformOrigin: 'left center',
            borderRadius: '2px'
          }}
        />
      );
    }
    return segments;
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h2 className="text-2xl font-bold text-purple-400 mb-2">ZIP Duel: Board {boardId}</h2>
      <p className="mb-4 text-gray-300">Connect the dots in order faster than your opponent</p>

      <div
        className="relative border border-gray-700 rounded-md bg-gray-900"
        style={{ width: BOARD_WIDTH, height: BOARD_HEIGHT }}
      >
        {renderLines()}

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

export default ZipPage;