import React, { useState, useEffect } from "react";
import { Trophy, Clock, Gift, DollarSign } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Loading from "./Loading";

const DailyLeaderboard = () => {
  const { user } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState("");
  const [loading, setLoading] = useState(true);

  // פונקציה שתחשב את הזמן שנותר עד לריסט הטבלה היומית (2 בלילה שעון ארה"ב)
  const calculateTimeRemaining = () => {
    const now = new Date();
    const resetTime = new Date();

    // קביעת שעת הריסט ל-2 בלילה שעון אמריקה (timezone = -5)
    resetTime.setUTCHours(7, 0, 0, 0); // 2AM EST = 7AM UTC

    // אם הזמן עבר כבר היום, קבע ל-2 בלילה של מחר
    if (now > resetTime) {
      resetTime.setDate(resetTime.getDate() + 1);
    }

    // חשב את הזמן שנותר בשניות
    const diffInSeconds = Math.floor((resetTime - now) / 1000);

    // המר לשעות, דקות ושניות
    const hours = Math.floor(diffInSeconds / 3600);
    const minutes = Math.floor((diffInSeconds % 3600) / 60);
    const seconds = diffInSeconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const generateMockData = () => {
    const mockUsers = [];
    const names = [
      "Alex",
      "Jordan",
      "Taylor",
      "Morgan",
      "Casey",
      "Riley",
      "Avery",
      "Quinn",
      "Skyler",
      "Dakota",
    ];

    for (let i = 0; i < 25; i++) {
      const wins = Math.floor(Math.random() * 30) + (25 - i); // יותר ניצחונות לשחקנים במקומות גבוהים
      const losses = Math.floor(Math.random() * 15);

      mockUsers.push({
        id: i + 1,
        username: `${
          names[Math.floor(Math.random() * names.length)]
        }${Math.floor(Math.random() * 1000)}`,
        wins,
        losses,
        winRate: Math.round((wins / (wins + losses)) * 100),
        isCurrentUser: i === 5 && user ? true : false, // דוגמה - המשתמש הנוכחי במקום השישי
      });
    }

    // מיון לפי מספר ניצחונות
    return mockUsers.sort((a, b) => b.wins - a.wins);
  };

  // עדכון הזמן שנותר
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // טעינת נתוני הליידרבורד
  useEffect(() => {
    setTimeout(() => {
      setLeaderboardData(generateMockData());
      setTimeRemaining(calculateTimeRemaining());
      setLoading(false);
    }, 800); // מדמה זמן טעינה
  }, []);

  // מוצא את המיקום של המשתמש בליידרבורד
  const findUserRank = () => {
    if (!user) return null;

    const userInLeaderboard = leaderboardData.find(
      (item) => item.isCurrentUser
    );
    if (userInLeaderboard) {
      return leaderboardData.indexOf(userInLeaderboard) + 1;
    }

    return null;
  };

  // מחזיר את סוג הפרס לפי מיקום
  const getPrizeDetails = (rank) => {
    if (rank === 1) {
      return {
        usdtAmount: 100,
        epvpAmount: 1000,
        type: "main",
      };
    } else if (rank === 2) {
      return {
        usdtAmount: 50,
        epvpAmount: 1000,
        type: "main",
      };
    } else if (rank === 3) {
      return {
        usdtAmount: 25,
        epvpAmount: 1000,
        type: "main",
      };
    } else {
      return {
        epvpAmount: 1000,
        type: "raffle",
      };
    }
  };

  // מחזיר את האיקון המתאים למיקום
  const getRankIcon = (rank) => {
    if (rank === 1) {
      return <Trophy className="text-yellow-400" />;
    } else if (rank === 2) {
      return <Trophy className="text-gray-400" />;
    } else if (rank === 3) {
      return <Trophy className="text-amber-700" />;
    } else {
      return <span className="font-semibold text-gray-400">{rank}</span>;
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-800 overflow-hidden">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 border-b border-gray-800">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-100 flex items-center">
            <Trophy size={22} className="text-yellow-400 mr-2" />
            Daily Leaderboard
          </h2>
          <div className="flex items-center text-sm text-gray-400">
            <Clock size={16} className="mr-2" />
            <span>Resets in: {timeRemaining}</span>
          </div>
        </div>
      </div>

      {/* Prize information */}
      <div className="bg-gray-800 p-4 border-b border-gray-700 ">
        <div className="flex flex-wrap gap-4 justify-between">
          <div className="flex items-center bg-gray-750 rounded-md px-3 py-2 border border-gray-700">
            <div className="w-8 h-8 rounded-full bg-yellow-900 flex items-center justify-center mr-2">
              <Trophy size={16} className="text-yellow-400" />
            </div>
            <div>
              <div className="text-xs text-gray-400">1st Place</div>
              <div className="text-sm font-semibold text-white">
                <span className="text-green-400 flex items-center">
                  <DollarSign size={14} className="mr-0.5" />
                  100 USDT
                </span>
                <span className="text-yellow-400 text-xs">+1000 ePVP</span>
              </div>
            </div>
          </div>

          <div className="flex items-center bg-gray-750 rounded-md px-3 py-2 border border-gray-700">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-2">
              <Trophy size={16} className="text-gray-400" />
            </div>
            <div>
              <div className="text-xs text-gray-400">2nd Place</div>
              <div className="text-sm font-semibold text-white">
                <span className="text-green-400 flex items-center">
                  <DollarSign size={14} className="mr-0.5" />
                  50 USDT
                </span>
                <span className="text-yellow-400 text-xs">+1000 ePVP</span>
              </div>
            </div>
          </div>

          <div className="flex items-center bg-gray-750 rounded-md px-3 py-2 border border-gray-700">
            <div className="w-8 h-8 rounded-full bg-amber-900 flex items-center justify-center mr-2">
              <Trophy size={16} className="text-amber-700" />
            </div>
            <div>
              <div className="text-xs text-gray-400">3rd Place</div>
              <div className="text-sm font-semibold text-white">
                <span className="text-green-400 flex items-center">
                  <DollarSign size={14} className="mr-0.5" />
                  25 USDT
                </span>
                <span className="text-yellow-400 text-xs">+1000 ePVP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {user && findUserRank() && (
        <div className="p-3 bg-gray-750 border-b border-gray-700">
          <div className="flex items-center">
            <div className="w-8 h-8 flex items-center justify-center mr-3">
              {getRankIcon(findUserRank())}
            </div>
            <div className="flex-1 flex items-center">
              <div className="flex-1">
                <div className="flex items-center">
                  <div className="font-semibold text-gray-200">
                    Your Position: {findUserRank()} of 25
                  </div>
                </div>
                <div className="text-sm text-gray-400 mt-0.5">
                  Win more games today to climb the ranks!
                </div>
              </div>
              <div className="text-red-400 font-medium">
                {leaderboardData.find((item) => item.isCurrentUser)?.wins || 0}{" "}
                Wins
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <Loading />
        ) : (
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-16"
                >
                  Rank
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  Player
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  Wins
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  Win Rate
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  Prize
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {leaderboardData.map((player, index) => {
                const rank = index + 1;
                const prize = getPrizeDetails(rank);

                return (
                  <tr
                    key={player.id}
                    className={`${
                      player.isCurrentUser
                        ? "bg-gray-750"
                        : rank % 2 === 0
                        ? "bg-gray-850"
                        : "bg-gray-900"
                    }`}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center justify-center w-8 h-8">
                        {getRankIcon(rank)}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-200">
                        {player.username}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <div className="text-sm text-red-400 font-medium">
                        {player.wins}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <div className="text-sm text-gray-300">
                        {player.winRate}%
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <div className="flex flex-col items-end">
                        <div
                          className={`text-sm font-medium ${
                            prize.type === "main"
                              ? "text-green-400"
                              : "text-purple-400"
                          } flex items-center`}
                        >
                          {prize.type === "main" && (
                            <DollarSign size={14} className="mr-0.5" />
                          )}
                          {prize.usdtAmount}{" "}
                          {prize.type === "main" ? "USDT" : ""}
                        </div>
                        <div className="text-xs text-yellow-400">
                          +{prize.epvpAmount} ePVP
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DailyLeaderboard;
