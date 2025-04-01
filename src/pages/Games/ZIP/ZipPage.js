import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useRoom } from "../../../context/RoomsContext";
import { useAuth } from "../../../context/AuthContext";

// החלף לכתובת השרת האמיתית שלך:
const socket = io("https://degensgamesprod.onrender.com");

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

const ZipPage = () => {
  const { user } = useAuth();
  const { contextRoom } = useRoom();

  // מצב המשחק (boardId, p1, p2, progress וכו')
  const [gameState, setGameState] = useState(null);

  // מידע על כל שחקן, זה מגיע מאירוע "playerInfo"
  const [p1PlayerInfo, setP1PlayerInfo] = useState(null);
  const [p2PlayerInfo, setP2PlayerInfo] = useState(null);

  // בודקים אם המשחק נגמר, ומי ניצח
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  // הצגת הודעות למשתמש
  const [statusMessage, setStatusMessage] = useState("");

  // טיימר פנימי (רק להמחשה, כמו בשחמט)
  const [timer, setTimer] = useState(0);

  // ספירה לאחור לאחר סיום המשחק, מנווט חזרה וכד'
  const [countdown, setCountdown] = useState(null);

  // אפקט לספירת זמן מהרגע שנכנסנו למשחק
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // מצטרפים לחדר ZIP ברגע שיש user + room
  useEffect(() => {
    if (!user || !contextRoom || !contextRoom._id) return;

    // Join the ZIP room
    socket.emit("joinRoom", { roomId: contextRoom._id, userId: user._id });

    // מאזינים לאירועים השונים מהשרת
    socket.on("playerInfo", ({ p1Player, p2Player }) => {
      setP1PlayerInfo(p1Player);
      setP2PlayerInfo(p2Player);
    });

    socket.on("waitingForPlayer", ({ message }) => {
      setStatusMessage(message);
    });

    socket.on("gameState", (newState) => {
      setGameState(newState);
      setStatusMessage(newState?.message || "");
    });

    socket.on("gameOver", (data) => {
      setIsGameOver(true);
      setWinner(data.winner);
      setStatusMessage(data.message);
    });

    socket.on("error", (msg) => {
      setStatusMessage(`ERROR: ${msg}`);
    });

    return () => {
      socket.off("playerInfo");
      socket.off("waitingForPlayer");
      socket.off("gameState");
      socket.off("gameOver");
      socket.off("error");
    };
  }, [user?._id, contextRoom?._id]);

  // כאשר שחקן רוצה להתחבר לנקודה הבאה (למשל לחיצה על כפתור)
  const handleMakeMove = () => {
    if (isGameOver) return;
    socket.emit("makeMove", {
      roomId: contextRoom._id,
      userId: user._id,
    });
  };

  // אפקט שמתרחש כשמשחק נגמר: סופרים 3 שניות ואז חוזרים אחורה, לדוגמה
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

  // פונקציה להצגת ה־avatar / אינישן לשחקנים
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
    // fallback initials
    const initials = getInitials(playerInfo.username);
    return (
      <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center text-2xl font-bold text-white">
        {initials}
      </div>
    );
  };

  // פונקציה להצגת נתונים סטטיסטיים (נצחונות, הפסדים)
  const renderStats = (playerInfo) => {
    if (!playerInfo) return null;
    return (
      <>
        <p className="text-sm text-gray-300">Wins: {playerInfo.wins ?? 0}</p>
        <p className="text-sm text-gray-300">Losses: {playerInfo.losses ?? 0}</p>
      </>
    );
  };

  // עיצוב פשוט לזמן
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // מחשב אם זה userId===p1 או userId===p2
  const isUserPlayer1 = (gameState?.p1 === user?._id || gameState?.p1 === user?.username);

  // התקדמות נוכחית (progress) של כל שחקן
  const p1Progress = gameState?.progress?.[gameState?.p1] || 0;
  const p2Progress = gameState?.progress?.[gameState?.p2] || 0;

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-start p-6">
      {/* כותרת */}      
      <div className="w-full max-w-6xl flex justify-between items-center mb-6 px-2">
        {/* צד שמאל: שחקן 1 */}
        <div className="flex flex-col items-center text-left">
          {renderPlayerAvatar(p1PlayerInfo)}
          <h2 className="text-lg font-semibold text-red-400 mt-2">
            {p1PlayerInfo?.username || gameState?.p1 || "P1"}
          </h2>
          {renderStats(p1PlayerInfo)}
        </div>

        {/* מרכז: טיימר */}
        <div className="flex flex-col items-center">
          <p className="text-xs text-gray-400 mb-1">Total Time</p>
          <div className="text-3xl font-mono bg-gray-800 px-6 py-2 rounded-xl shadow-md border border-gray-600">
            ⏱ {formatTime(timer)}
          </div>
          <p className="mt-2 text-xs text-yellow-400">
            Entry: {contextRoom?.price || 0} USDT | Prize:{" "}
            {(contextRoom?.price * 1.9).toFixed(2)} USDT
          </p>
        </div>

        {/* צד ימין: שחקן 2 */}
        <div className="flex flex-col items-center text-right">
          {renderPlayerAvatar(p2PlayerInfo)}
          <h2 className="text-lg font-semibold text-red-400 mt-2">
            {p2PlayerInfo?.username || gameState?.p2 || "P2"}
          </h2>
          {renderStats(p2PlayerInfo)}
        </div>
      </div>

      {/* גוף המשחק */}
      <div className="border-2 border-gray-700 rounded-2xl p-4 shadow-lg bg-gray-900 flex flex-col items-center w-full max-w-4xl">
        {/* כותרת המייצגת באיזה לוח אנחנו וכו' */}
        <div className="mb-3">
          <h3 className="text-xl font-bold text-purple-400">
            Board: {gameState?.boardId || "--"}
          </h3>
          <p className="text-gray-400">
            Total Points: {gameState?.totalPoints ?? "--"}
          </p>
        </div>

        {/* מד התקדמות לכל שחקן */}
        <div className="flex w-full justify-around mt-4">
          <div className="flex flex-col items-center w-1/3 px-3">
            <p className="text-sm text-gray-400 mb-1">Progress of {gameState?.p1}</p>
            <div className="w-full bg-gray-700 rounded-full h-6 relative">
              <div
                className="bg-green-600 h-6 rounded-full transition-all duration-300"
                style={{
                  width: `${(p1Progress / (gameState?.totalPoints || 1)) * 100}%`,
                }}
              ></div>
              <span className="absolute inset-0 flex justify-center items-center font-bold text-black">
                {p1Progress}/{gameState?.totalPoints}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center w-1/3 px-3">
            <p className="text-sm text-gray-400 mb-1">Progress of {gameState?.p2}</p>
            <div className="w-full bg-gray-700 rounded-full h-6 relative">
              <div
                className="bg-blue-600 h-6 rounded-full transition-all duration-300"
                style={{
                  width: `${(p2Progress / (gameState?.totalPoints || 1)) * 100}%`,
                }}
              ></div>
              <span className="absolute inset-0 flex justify-center items-center font-bold text-black">
                {p2Progress}/{gameState?.totalPoints}
              </span>
            </div>
          </div>
        </div>

        {/* כפתור שמייצג מהלך - חיבור נקודה נוספת */}
        <div className="mt-5">
          {(!isGameOver && gameState) ? (
            <button
              onClick={handleMakeMove}
              className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-md text-lg font-semibold"
            >
              Connect Next Point
            </button>
          ) : (
            <p className="text-gray-400 italic">Game ended or not started</p>
          )}
        </div>
      </div>

      {/* מצב המשחק + הודעות */}
      <p className="mt-4 text-sm text-gray-400">{statusMessage}</p>

      {/* הודעת סיום */}
      {isGameOver && winner && (
        <h2 className="mt-6 text-green-400 text-xl font-semibold">
          🏆 Game Over! Winner: {winner}
        </h2>
      )}

      {/* שכבת סיום על כל המסך (אופציונלי) */}
      {isGameOver && (
        <div className="fixed inset-0 flex flex-col justify-center items-center bg-black bg-opacity-80 z-50 transition-opacity duration-500">
          <div className="text-4xl font-bold mb-6 text-center">
            {winner === user?._id ? "🎉 You Won the ZIP game!" : `😢 You Lost! Winner: ${winner}`}
          </div>
          {countdown !== null && (
            <div className="text-2xl text-center">{`${countdown}...`}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ZipPage;