import React from 'react';
import { Clock, DollarSign } from 'lucide-react';

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
    currency: "USDT",
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
    currency: "ePVP",
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

const RecentGames = () => {
  return (
    <div className="w-full overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-100">Recent Games</h2>
        <button className="text-red-400 hover:text-red-300 text-sm font-medium">
          Game History &gt;
        </button>
      </div>

      <table className="min-w-full table-auto border border-gray-700/40 rounded-lg overflow-hidden text-sm">
        <thead className="bg-gray-700 text-gray-300 text-center">
          <tr>
            <th className="px-3 py-2">Date</th>
            <th className="px-3 py-2">Game</th>
            <th className="px-3 py-2">Currency</th>
            <th className="px-3 py-2">Winner</th>
            <th className="px-3 py-2">Loser</th>
          </tr>
        </thead>
        <tbody>
          {recentGames.map((game, index) => (
            <tr
              key={game.id}
              className={`text-center ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'} border-t border-gray-700/30`}
            >
              <td className="px-3 py-2 text-gray-400 align-middle">
                <div className="flex justify-center items-center gap-1">
                  <Clock size={14} />
                  {game.endTime}
                </div>
              </td>
              <td className="px-3 py-2 text-white font-medium align-middle">{game.gameType}</td>
              <td className="px-3 py-2 align-middle">
                <div className="flex justify-center items-center gap-1">
                  <img
                    src={game.currency === "USDT" ? "/USDT.png" : "/favi.png"}
                    alt={game.currency}
                    className="w-4 h-4"
                  />
                  <span className={game.currency === "USDT" ? "text-green-400" : "text-yellow-400"}>
                    {game.currency}
                  </span>
                </div>
              </td>
              <td className="px-3 py-2 align-middle">
                <div className="text-white font-medium">{game.player1}</div>
                <div className="text-sm text-green-400 flex justify-center items-center gap-1">
                  {game.winnerProfitUSDT && (
                    <>
                      <DollarSign size={12} />
                      +${game.winnerProfitUSDT}
                    </>
                  )}
                </div>
                <div className="text-sm text-yellow-400 flex justify-center items-center gap-1">
                  <img src="/favi.png" alt="ePVP" className="w-3 h-3" />
                  +{game.winnerProfitEPVP} ePVP
                </div>
              </td>
              <td className="px-3 py-2 align-middle">
                <div className="text-white font-medium">{game.player2}</div>
                {game.loserLossUSDT && (
                  <div className="text-sm text-red-400 flex justify-center items-center gap-1">
                    <DollarSign size={12} />
                    -${game.loserLossUSDT}
                  </div>
                )}
                <div className="text-sm text-yellow-400 flex justify-center items-center gap-1">
                  <img src="/favi.png" alt="ePVP" className="w-3 h-3" />
                  -{game.loserLossEPVP} ePVP
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentGames;
