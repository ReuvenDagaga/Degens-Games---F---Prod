import React, { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import { io } from "socket.io-client";
import { useAuth } from "../../../context/AuthContext";
import { useRoom } from "../../../context/RoomsContext";



const socket = io("http://localhost:3456")

const defaultAvatarWhite = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png";
const defaultAvatarBlack = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png";

const ChessPage = () => {
  const { user } = useAuth();
  const { contextRoom } = useRoom();

  const [fen, setFen] = useState("start");
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [whitePlayer, setWhitePlayer] = useState("");
  const [blackPlayer, setBlackPlayer] = useState("");
  const [currentTurn, setCurrentTurn] = useState("w");
  const [timer, setTimer] = useState(0);

  const whitePlayerData = { wins: 12, losses: 3 };
  const blackPlayerData = { wins: 7, losses: 8 };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!user || !contextRoom || !contextRoom._id) return;

    socket.emit("joinRoom", { roomId: contextRoom._id, userId: user._id });

    socket.on("waitingForPlayer", ({ message }) => {
      setStatusMessage(message);
    });

    socket.on("gameState", ({ fen, message, white, black, turn }) => {
      setFen(fen);
      setWhitePlayer(white);
      setBlackPlayer(black);
      setCurrentTurn(turn);
      setStatusMessage(message || "");
    });

    socket.on("gameOver", ({ fen, winner, message }) => {
      setFen(fen);
      setWinner(winner);
      setIsGameOver(true);
      setStatusMessage(message);
    });

    socket.on("invalidMove", () => {
      setStatusMessage("move is invalid");
    });

    socket.on("notYourTurn", (msg) => {
      setStatusMessage(msg);
    });

    socket.on("error", (msg) => {
      setStatusMessage(`error: ${msg}`);
    });

    return () => {
      socket.off("gameState");
      socket.off("gameOver");
      socket.off("invalidMove");
      socket.off("notYourTurn");
      socket.off("waitingForPlayer");
      socket.off("error");
    };
  }, [user?._id, contextRoom?._id]);

  const onDrop = (sourceSquare, targetSquare) => {
    if (isGameOver) return false;

    socket.emit("makeMove", {
      roomId: contextRoom._id,
      from: sourceSquare,
      to: targetSquare,
      username: user._id,
    });
    return true;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-start p-6">
      <div className="w-full max-w-6xl flex justify-between items-center mb-6 px-2">
        <div className="flex flex-col items-center text-left">
          <img src={defaultAvatarWhite} alt="White Avatar" className="w-20 h-20 rounded-full border-4 border-purple-500 mb-2" />
          <h2 className="text-lg font-semibold text-purple-400">{whitePlayer}</h2>
          <p className="text-sm text-gray-300">Wins: {whitePlayerData.wins}</p>
          <p className="text-sm text-gray-300">Losses: {whitePlayerData.losses}</p>
        </div>

        <div className="flex flex-col items-center">
          <p className="text-xs text-gray-400 mb-1">Current Turn</p>
          <div className="text-xl font-bold text-green-300 mb-1">
            {currentTurn === "w" ? whitePlayer : blackPlayer}
          </div>
          <div className="text-3xl font-mono bg-gray-800 px-6 py-2 rounded-xl shadow-md border border-gray-600">
            ⏱ {formatTime(timer)}
          </div>
          <p className="mt-2 text-xs text-yellow-400">
            Entry: {contextRoom?.price || 0} USDT | Prize: {(contextRoom?.price * 1.9).toFixed(2)} USDT
          </p>
        </div>

        <div className="flex flex-col items-center text-right">
          <img src={defaultAvatarBlack} alt="Black Avatar" className="w-20 h-20 rounded-full border-4 border-orange-500 mb-2" />
          <h2 className="text-lg font-semibold text-orange-400">{blackPlayer}</h2>
          <p className="text-sm text-gray-300">Wins: {blackPlayerData.wins}</p>
          <p className="text-sm text-gray-300">Losses: {blackPlayerData.losses}</p>
        </div>
      </div>

      <div className="border-2 border-gray-700 rounded-2xl p-4 shadow-lg bg-gray-900">
        <Chessboard position={fen} onPieceDrop={onDrop} boardWidth={500} />
      </div>

      {isGameOver && winner && (
        <h2 className="mt-6 text-green-400 text-xl font-semibold">
          🏆 Game Over! Winner: {winner}
        </h2>
      )}

      <p className="mt-4 text-sm text-gray-400">{statusMessage}</p>
    </div>
  );
};

export default ChessPage;