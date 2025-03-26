import React from 'react';
import { Clock, Trophy, X, DollarSign } from 'lucide-react';

// Updated sample data - Recent games with both USDT and ePVP
const recentGames = [
  {
    id: 5001,
    player1: "Israel Israeli",
    player2: "Daniel Dan",
    winnerProfitUSDT: 45,
    loserLossUSDT: 45,
    winnerProfitEPVP: 100,
    loserLossEPVP: 10,
    gameType: "2048",
    currency: "USDT", // Main currency of the game
    endTime: "08.03.2025 14:32"
  },
  {
    id: 5002,
    player1: "Ronen Cohen",
    player2: "Moshe Levi",
    winnerProfitUSDT: 30,
    loserLossUSDT: 30,
    winnerProfitEPVP: 100,
    loserLossEPVP: 10,
    gameType: "Chess",
    currency: "USDT",
    endTime: "08.03.2025 14:18"
  },
  {
    id: 5003,
    player1: "Rotem Abraham",
    player2: "Lior Avidan",
    winnerProfitUSDT: null,
    loserLossUSDT: null,
    winnerProfitEPVP: 1200,
    loserLossEPVP: 1200,
    gameType: "Chess",
    currency: "ePVP", // This game was played with ePVP
    endTime: "08.03.2025 13:55"
  },
  {
    id: 5004,
    player1: "Shahar Haim",
    player2: "Gil Ilan",
    winnerProfitUSDT: 78,
    loserLossUSDT: 78,
    winnerProfitEPVP: 100,
    loserLossEPVP: 10,
    gameType: "Chess",
    currency: "USDT",
    endTime: "08.03.2025 13:42"
  },
  {
    id: 5005,
    player1: "Noam Sadeh",
    player2: "Omer Carmi",
    winnerProfitUSDT: null,
    loserLossUSDT: null,
    winnerProfitEPVP: 520,
    loserLossEPVP: 520,
    gameType: "Bitcoin",
    currency: "ePVP",
    endTime: "08.03.2025 13:30"
  }
];

// Modern scrollbar style CSS as a string
const scrollbarStyle = `
  /* Modern scrollbar styles */
  .modern-scrollbar {
    overflow-x: auto;
    scrollbar-width: thin;
    scrollbar-color: rgba(239, 68, 68, 0.5) rgba(31, 41, 55, 0.5);
  }

  .modern-scrollbar::-webkit-scrollbar {
    height: 6px;
  }

  .modern-scrollbar::-webkit-scrollbar-track {
    background: rgba(31, 41, 55, 0.5);
    border-radius: 10px;
  }

  .modern-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(239, 68, 68, 0.5);
    border-radius: 10px;
    transition: all 0.3s ease;
  }

  .modern-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(239, 68, 68, 0.8);
  }

  /* Hide scrollbar for most devices but keep functionality */
  @media (pointer: coarse) {
    .modern-scrollbar {
      scrollbar-width: none;
    }
    .modern-scrollbar::-webkit-scrollbar {
      display: none;
    }
  }
`;

const RecentGames = () => {
  return (
    <div>
      {/* Add the scrollbar styles */}
      <style>{scrollbarStyle}</style>
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-100">Recent Games</h2>
        <button className="text-red-400 hover:text-red-300 text-sm font-medium">
          Game History &gt;
        </button>
      </div>

      {/* Apply the modern-scrollbar class */}
      <div className="modern-scrollbar pb-3">
        <div className="inline-flex space-x-4 min-w-full">
          {recentGames.map((game) => (
            <div key={game.id} className="bg-gray-800 rounded-lg shadow-md border border-gray-700 p-4 min-w-[280px] flex-shrink-0">
              <div className="flex justify-between mb-3">
                <span className="text-sm text-gray-400 flex items-center">
                  <Clock size={14} className="mr-1" />
                  {game.endTime}
                </span>
                <div className="flex items-center">
                  <span className="text-sm font-medium px-2 py-0.5 bg-gray-700 rounded-full text-gray-300 mr-1">
                    {game.gameType}
                  </span>
                  
                  {/* Currency Badge */}
                  <span 
                    className="text-xs font-medium px-1.5 py-0.5 rounded-full flex items-center"
                    style={{ 
                      backgroundColor: game.currency === 'USDT' ? 'rgba(0,128,0,0.3)' : 'rgba(255,215,0,0.2)',
                      color: game.currency === 'USDT' ? 'rgb(74,222,128)' : 'rgb(253,224,71)'
                    }}
                  >
                    {game.currency === 'USDT' ? (
                      <>
                        <img src="/USDT.png" alt="USDT" className="w-3 h-3 mr-0.5" />
                        <span>USDT</span>
                      </>
                    ) : (
                      <>
                        <img src="/favi.png" alt="ePVP" className="w-3 h-3 mr-0.5" />
                        <span>ePVP</span>
                      </>
                    )}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center text-white font-bold text-xs">
                    {game.player1.substring(0, 2)}
                  </div>
                  <div className="ml-2">
                    <div className="font-medium text-white">{game.player1}</div>
                    
                    {/* Winner profit display - handles both currencies */}
                    <div className="flex flex-col">
                      {game.currency === 'USDT' && (
                        <div className="text-sm text-green-400 flex items-center">
                          <DollarSign size={12} className="mr-0.5" />
                          +${game.winnerProfitUSDT}
                        </div>
                      )}
                      
                      {/* Always show ePVP rewards */}
                      <div className="text-sm text-yellow-400 flex items-center">
                        <img src="/favi.png" alt="ePVP" className="w-3 h-3 mr-0.5" />
                        +{game.winnerProfitEPVP} ePVP
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-red-800 flex items-center justify-center text-white font-bold text-xs">
                    {game.player2.substring(0, 2)}
                  </div>
                  <div className="ml-2">
                    <div className="font-medium text-white">{game.player2}</div>
                    
                    {/* Loser loss display - handles both currencies */}
                    <div className="flex flex-col">
                      {game.currency === 'USDT' && (
                        <div className="text-sm text-red-400 flex items-center">
                          <DollarSign size={12} className="mr-0.5" />
                          -${game.loserLossUSDT}
                        </div>
                      )}
                      
                      <div className="text-sm text-yellow-400 flex items-center">
                        <img src="/favi.png" alt="ePVP" className="w-3 h-3 mr-0.5" />
                        {game.currency === 'USDT' ? '+' : '-'}{game.loserLossEPVP} ePVP
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentGames;