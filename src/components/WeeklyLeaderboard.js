import React, { useState, useEffect } from 'react';
import { Trophy, Clock, Gift, DollarSign } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const WeeklyLeaderboard = () => {
  const { user } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [loading, setLoading] = useState(true);
  
  // פונקציה שתחשב את הזמן שנותר עד לריסט הטבלה השבועית (יום ראשון בשעה 2 בלילה שעון ארה"ב)
  const calculateTimeRemaining = () => {
    const now = new Date();
    const resetTime = new Date();
    
    // קביעת יום ושעת הריסט ליום ראשון 2 בלילה שעון אמריקה (timezone = -5)
    resetTime.setUTCHours(7, 0, 0, 0); // 2AM EST = 7AM UTC
    
    // קביעת היום ליום ראשון (0 = יום ראשון, 1 = יום שני, וכו')
    const dayOfWeek = resetTime.getUTCDay();
    const daysUntilSunday = (7 - dayOfWeek) % 7;
    
    resetTime.setUTCDate(resetTime.getUTCDate() + daysUntilSunday);
    
    // אם עכשיו יום ראשון והשעה עברה את שעת הריסט, קבע ליום ראשון הבא
    if (dayOfWeek === 0 && now > resetTime) {
      resetTime.setUTCDate(resetTime.getUTCDate() + 7);
    }
    
    // חשב את הזמן שנותר בשניות
    const diffInSeconds = Math.floor((resetTime - now) / 1000);
    
    // המר לימים, שעות, דקות ושניות
    const days = Math.floor(diffInSeconds / 86400);
    const hours = Math.floor((diffInSeconds % 86400) / 3600);
    const minutes = Math.floor((diffInSeconds % 3600) / 60);
    const seconds = diffInSeconds % 60;
    
    return `${days}d ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const generateMockData = () => {
    const mockUsers = [];
    const names = ["Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Avery", "Quinn", "Skyler", "Dakota"];
    
    for (let i = 0; i < 25; i++) {
      const wins = Math.floor(Math.random() * 100) + (25 - i) * 3; // יותר ניצחונות לשחקנים במקומות גבוהים
      const losses = Math.floor(Math.random() * 50);
      
      mockUsers.push({
        id: i + 1,
        username: `${names[Math.floor(Math.random() * names.length)]}${Math.floor(Math.random() * 1000)}`,
        wins,
        losses,
        winRate: Math.round((wins / (wins + losses)) * 100),
        isCurrentUser: i === 5 && user ? true : false // דוגמה - המשתמש הנוכחי במקום השישי
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
    
    const userInLeaderboard = leaderboardData.find(item => item.isCurrentUser);
    if (userInLeaderboard) {
      return leaderboardData.indexOf(userInLeaderboard) + 1;
    }
    
    return null;
  };
  
  // מחזיר את סוג הפרס לפי מיקום
  const getPrizeDetails = (rank) => {
    if (rank === 1) {
      return {
        usdtAmount: 1000,
        epvpAmount: 10000,
        type: 'main'
      };
    } else if (rank === 2) {
      return {
        usdtAmount: 500,
        epvpAmount: 10000,
        type: 'main'
      };
    } else if (rank === 3) {
      return {
        usdtAmount: 250,
        epvpAmount: 10000,
        type: 'main'
      };
    } else {
      return {
        usdtAmount: 'Raffle for 1000',
        epvpAmount: 10000,
        type: 'raffle'
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
            Weekly Leaderboard
          </h2>
          <div className="flex items-center text-sm text-gray-400">
            <Clock size={16} className="mr-2" />
            <span>Resets in: {timeRemaining}</span>
          </div>
        </div>
      </div>
      
      {/* Prize information */}
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center bg-gray-750 rounded-md px-3 py-2 border border-gray-700">
            <div className="w-8 h-8 rounded-full bg-yellow-900 flex items-center justify-center mr-2">
              <Trophy size={16} className="text-yellow-400" />
            </div>
            <div>
              <div className="text-xs text-gray-400">1st Place</div>
              <div className="text-sm font-semibold text-white">
                <span className="text-green-400 flex items-center">
                  <DollarSign size={14} className="mr-0.5" />1000 USDT
                </span>
                <span className="text-yellow-400 text-xs">+10000 ePVP</span>
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
                  <DollarSign size={14} className="mr-0.5" />500 USDT
                </span>
                <span className="text-yellow-400 text-xs">+10000 ePVP</span>
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
                  <DollarSign size={14} className="mr-0.5" />250 USDT
                </span>
                <span className="text-yellow-400 text-xs">+10000 ePVP</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center bg-gray-750 rounded-md px-3 py-2 border border-gray-700">
            <div className="w-8 h-8 rounded-full bg-purple-900 flex items-center justify-center mr-2">
              <Gift size={16} className="text-purple-400" />
            </div>
            <div>
              <div className="text-xs text-gray-400">All Others</div>
              <div className="text-sm font-semibold text-white">
                <span className="text-purple-400">Raffle for $1000 USDT</span>
                <span className="text-yellow-400 text-xs">+10000 ePVP</span>
              </div>
            </div>
          </div>
        </div>
      </div>
        
      {/* User's rank */}
      {user && findUserRank() && (
        <div className="p-3 bg-gray-750 border-b border-gray-700">
          <div className="flex items-center">
            <div className="w-8 h-8 flex items-center justify-center mr-3">
              {getRankIcon(findUserRank())}
            </div>
            <div className="flex-1 flex items-center">
              <div className="flex-1">
                <div className="flex items-center">
                  <div className="font-semibold text-gray-200">Your Position: {findUserRank()} of 25</div>
                </div>
                <div className="text-sm text-gray-400 mt-0.5">
                  Win more games this week to climb the ranks!
                </div>
              </div>
              <div className="text-red-400 font-medium">
                {leaderboardData.find(item => item.isCurrentUser)?.wins || 0} Wins
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Leaderboard Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-dotted border-red-500 mx-auto"></div>
            <p className="mt-2 text-gray-400">Loading leaderboard...</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-16">
                  Rank
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Player
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Wins
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Win Rate
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
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
                    className={`${player.isCurrentUser ? 'bg-gray-750' : (rank % 2 === 0 ? 'bg-gray-850' : 'bg-gray-900')}`}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center justify-center w-8 h-8">
                        {getRankIcon(rank)}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-200">{player.username}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <div className="text-sm text-red-400 font-medium">{player.wins}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <div className="text-sm text-gray-300">{player.winRate}%</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <div className="flex flex-col items-end">
                        <div className={`text-sm font-medium ${prize.type === 'main' ? 'text-green-400' : 'text-purple-400'} flex items-center`}>
                          {prize.type === 'main' && <DollarSign size={14} className="mr-0.5" />}
                          {prize.usdtAmount} {prize.type === 'main' ? 'USDT' : ''}
                        </div>
                        <div className="text-xs text-yellow-400">+{prize.epvpAmount} ePVP</div>
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

export default WeeklyLeaderboard;