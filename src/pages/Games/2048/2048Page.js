import React, { useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../../../context/AuthContext";
import { useRoom } from "../../../context/RoomsContext";

const socket = io("http://localhost:3456");

const BOARD_SIZE = 4;

const createEmptyBoard = () =>
  Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(0));

const getRandomEmptyCell = (grid) => {
  const empty = [];
  grid.forEach((row, i) =>
    row.forEach((val, j) => {
      if (val === 0) empty.push([i, j]);
    })
  );
  return empty.length ? empty[Math.floor(Math.random() * empty.length)] : null;
};

const addRandomTile = (grid) => {
  const cell = getRandomEmptyCell(grid);
  if (!cell) return grid;
  const [i, j] = cell;
  const newGrid = grid.map((row) => [...row]);
  newGrid[i][j] = Math.random() < 0.9 ? 2 : 4;
  return newGrid;
};

const moveRowLeft = (row) => {
  let newRow = row.filter((val) => val !== 0);
  let score = 0;
  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      score += newRow[i];
      newRow[i + 1] = 0;
    }
  }
  newRow = newRow.filter((val) => val !== 0);
  while (newRow.length < BOARD_SIZE) newRow.push(0);
  return { newRow, score };
};

const move = (grid, direction) => {
  const transpose = (m) => m[0].map((_, i) => m.map((r) => r[i]));
  const reverse = (m) => m.map((r) => [...r].reverse());

  let rotated = grid;
  if (direction === "up") rotated = transpose(grid);
  if (direction === "down") rotated = reverse(transpose(grid));
  if (direction === "right") rotated = reverse(grid);

  let newGrid = [], totalScore = 0;
  for (let row of rotated) {
    const { newRow, score } = moveRowLeft(row);
    newGrid.push(newRow);
    totalScore += score;
  }

  if (direction === "up") newGrid = transpose(newGrid);
  if (direction === "down") newGrid = transpose(reverse(newGrid));
  if (direction === "right") newGrid = reverse(newGrid);

  return { newGrid, score: totalScore };
};

const gridsEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const isGameOver = (grid) => {
  const dirs = ["left", "right", "up", "down"];
  return dirs.every((d) => gridsEqual(move(grid, d).newGrid, grid));
};

const Tile = ({ value }) => (
  <div className={`w-16 h-16 flex items-center justify-center rounded-md text-xl font-bold transition-all
    ${value === 0 ? "bg-gray-700" : "bg-yellow-400 text-black"}`}>
    {value || ""}
  </div>
);

const Grid = ({ grid }) => (
  <div className="grid grid-cols-4 gap-2 bg-gray-800 p-4 rounded-lg shadow-inner">
    {grid.flat().map((val, i) => <Tile key={i} value={val} />)}
  </div>
);

const Game2048Page = () => {
  const { user } = useAuth();
  const { contextRoom } = useRoom();

  const [grid, setGrid] = useState(() => addRandomTile(addRandomTile(createEmptyBoard())));
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);

  const [opponentGrid, setOpponentGrid] = useState(createEmptyBoard());
  const [opponentScore, setOpponentScore] = useState(0);
  const [opponentOver, setOpponentOver] = useState(false);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    if (!user || !contextRoom) return;

    socket.emit("join2048Room", {
      roomId: contextRoom._id,
      userId: user._id,
    });

    socket.on("joined2048", () => console.log("✅ joined 2048 room"));
    socket.on("opponent2048", ({ grid, score, isOver }) => {
      setOpponentGrid(grid);
      setOpponentScore(score);
      setOpponentOver(isOver);
    });
    socket.on("gameOver2048", ({ scores, winner }) => {
      setWinner(winner);
    });

    return () => {
      socket.off("joined2048");
      socket.off("opponent2048");
      socket.off("gameOver2048");
    };
  }, [user, contextRoom]);

  const handleKeyDown = useCallback((e) => {
    if (over || winner) return;
    const dirMap = {
      ArrowLeft: "left",
      ArrowRight: "right",
      ArrowUp: "up",
      ArrowDown: "down",
    };
    const direction = dirMap[e.key];
    if (!direction) return;

    const { newGrid, score: gained } = move(grid, direction);
    if (!gridsEqual(newGrid, grid)) {
      const withTile = addRandomTile(newGrid);
      const newScore = score + gained;
      const gameOver = isGameOver(withTile);

      setGrid(withTile);
      setScore(newScore);
      setOver(gameOver);

      socket.emit("update2048", {
        roomId: contextRoom._id,
        userId: user._id,
        grid: withTile,
        score: newScore,
        isOver: gameOver,
      });
    }
  }, [grid, score, over, winner, contextRoom, user]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
if (!user || contextRoom.user.length !== 2) return null;
  return (    
    <div className="min-h-screen bg-gray-950 text-white p-6 flex flex-col items-center justify-center">
    <h1 className="text-3xl font-bold mb-6">2048 Multiplayer</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
    <div className="flex flex-col items-center">
    <h2 className="text-lg mb-2 font-semibold">{user?.username || "You"}</h2>
          <Grid grid={grid} />
          <p className="mt-2 text-green-400 font-bold">Score: {score}</p>
        </div>
        <div className="flex flex-col items-center opacity-80">
          <h2 className="text-lg mb-2 font-semibold">Opponent</h2>
          <Grid grid={opponentGrid} />
          <p className="mt-2 text-yellow-400 font-bold">Score: {opponentScore}</p>
        </div>
        </div>
        
        {winner && (
          <div className="mt-6 text-2xl font-bold text-cyan-400">
          {winner === user._id ? "🎉 You won!" : "😢 You lost!"}
          </div>
        )}
        </div>
  );
};

export default Game2048Page;
