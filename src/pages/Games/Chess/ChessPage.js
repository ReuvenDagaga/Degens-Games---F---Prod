import React, { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import { io } from "socket.io-client";
import { useAuth } from "../../../context/AuthContext";
import { useRoom } from "../../../context/RoomsContext";

const socket = io("https://nb5wb7tn-3456.euw.devtunnels.ms");

// Helper to get up to 2 initials from username
function getInitials(username = "") {
  const parts = username.trim().split(" ");
  if (parts.length === 1) {
    // Single word: just take first 2 letters
    return parts[0].slice(0, 2).toUpperCase();
  } else {
    // Two or more words: take first letter of first two words
    return parts
      .slice(0, 2)
      .map((p) => p[0].toUpperCase())
      .join("");
  }
}

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

  // Detailed player info (pulled from the server)
  const [whitePlayerInfo, setWhitePlayerInfo] = useState(null);
  const [blackPlayerInfo, setBlackPlayerInfo] = useState(null);

  // Countdown state for the popup
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!user || !contextRoom || !contextRoom._id) return;

    // Join the room
    socket.emit("joinRoom", { roomId: contextRoom._id, userId: user._id });

    // Listening for "playerInfo" to load actual data for each player
    socket.on("playerInfo", ({ whitePlayer, blackPlayer }) => {
      setWhitePlayerInfo(whitePlayer);
      setBlackPlayerInfo(blackPlayer);
    });

    // The rest of your usual listeners
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
      socket.off("playerInfo");
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
      username: user._id, // or user.username if that's what your server expects
    });
    return true;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // When the game is over, start a 3-second timer, then go back
  useEffect(() => {
    if (isGameOver) {
      setCountdown(3);
      const intervalId = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(intervalId);
            window.history.back();
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [isGameOver]);

  // Renders either the player's actual avatar or a placeholder
  const renderPlayerAvatar = (playerInfo) => {
    if (!playerInfo) {
      return (
        <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center text-lg text-white">
          --
        </div>
      );
    }

    if (playerInfo.avatar) {
      return (
        <img
          src={playerInfo.avatar}
          alt="Player Avatar"
          className="w-20 h-20 rounded-full border-4 border-red-500 object-cover"
        />
      );
    }

    // fallback: no avatar => show red circle with initials
    const initials = getInitials(playerInfo.username);
    return (
      <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center text-2xl font-bold text-white">
        {initials}
      </div>
    );
  };

  // Renders wins/losses
  const renderStats = (playerInfo) => {
    if (!playerInfo) return null;
    return (
      <>
        <p className="text-sm text-gray-300">Wins: {playerInfo.wins ?? 0}</p>
        <p className="text-sm text-gray-300">Losses: {playerInfo.losses ?? 0}</p>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-start p-6">
      {/* Player info + Timer */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-6 px-2">
        {/* White player */}
        <div className="flex flex-col items-center text-left">
          {renderPlayerAvatar(whitePlayerInfo)}
          <h2 className="text-lg font-semibold text-red-400 mt-2">
            {whitePlayerInfo?.username || whitePlayer}
          </h2>
          {renderStats(whitePlayerInfo)}
        </div>

        {/* Timer / turn display */}
        <div className="flex flex-col items-center">
          <p className="text-xs text-gray-400 mb-1">Current Turn</p>
          <div className="text-xl font-bold text-red-300 mb-1">
            {currentTurn === "w" ? whitePlayer : blackPlayer}
          </div>
          <div className="text-3xl font-mono bg-gray-800 px-6 py-2 rounded-xl shadow-md border border-gray-600">
            ⏱ {formatTime(timer)}
          </div>
          <p className="mt-2 text-xs text-yellow-400">
            Entry: {contextRoom?.price || 0} USDT | Prize:{" "}
            {(contextRoom?.price * 1.9).toFixed(2)} USDT
          </p>
        </div>

        {/* Black player */}
        <div className="flex flex-col items-center text-right">
          {renderPlayerAvatar(blackPlayerInfo)}
          <h2 className="text-lg font-semibold text-red-400 mt-2">
            {blackPlayerInfo?.username || blackPlayer}
          </h2>
          {renderStats(blackPlayerInfo)}
        </div>
      </div>

      {/* Chessboard */}
      <div className="border-2 border-gray-700 rounded-2xl p-4 shadow-lg bg-gray-900">
        <Chessboard position={fen} onPieceDrop={onDrop} boardWidth={500} />
      </div>

      {/* Game Over message */}
      {isGameOver && winner && (
        <h2 className="mt-6 text-green-400 text-xl font-semibold">
          🏆 Game Over! Winner: {winner}
        </h2>
      )}

      {/* Status messages */}
      <p className="mt-4 text-sm text-gray-400">{statusMessage}</p>

      {/* Full-screen popup after the game ends */}
      {isGameOver && (
        <div className="fixed inset-0 flex flex-col justify-center items-center bg-black bg-opacity-80 z-50 transition-opacity duration-500">
          <div className="text-4xl font-bold mb-6 text-center">
            {winner === user?._id ? "🎉 You Won!" : "😢 You Lost!"}
          </div>
          {countdown !== null && (
            <div className="text-2xl text-center">{`${countdown}...`}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChessPage;
