import React from 'react';
import { Clock, Award } from 'lucide-react';

const recentPlayers = [
  {
    id: 1,
    username: "Daniel Israeli",
    avatar: "/avatars/player1.jpg",
    result: "win",
    score: 1250,
    date: "09.03.2025 15:32",
    reward: {
      usdt: 45,
      epvp: 100
    }
  },
  {
    id: 2,
    username: "Ronen Cohen",
    avatar: "/avatars/player2.jpg",
    result: "loss",
    score: 980,
    date: "09.03.2025 14:45",
    reward: {
      usdt: 0,
      epvp: 10
    }
  },
  {
    id: 3,
    username: "Sarah Levi",
    avatar: "/avatars/player3.jpg",
    result: "win",
    score: 1420,
    date: "09.03.2025 13:20",
    reward: {
      usdt: 50,
      epvp: 100
    }
  },
  {
    id: 4,
    username: "Aviv Mizrahi",
    avatar: "/avatars/player4.jpg",
    result: "loss",
    score: 850,
    date: "09.03.2025 12:10",
    reward: {
      usdt: 0,
      epvp: 10
    }
  },
  {
    id: 5,
    username: "Tamar Ben",
    avatar: "/avatars/player5.jpg",
    result: "win",
    score: 1380,
    date: "09.03.2025 11:05",
    reward: {
      usdt: 48,
      epvp: 100
    }
  }
];

const GameSidebarSection = () => {
  return (
    <div>
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <Clock size={20} className="mr-2 text-purple-400" />
          Recent Players
        </h2>
        
        <div className="space-y-3">
          {recentPlayers.map(player => (
            <div key={player.id} className="flex items-center p-3 bg-gray-750 rounded-lg border border-gray-700">
              <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden bg-gray-600 mr-3">
                {player.avatar ? (
                  <img src={player.avatar} alt={player.username} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white font-bold">
                    {player.username.substring(0, 2)}
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-white">{player.username}</div>
                  <span className={`text-sm font-medium ${player.result === 'win' ? 'text-green-400' : 'text-red-400'}`}>
                    {player.result === 'win' ? 'Win' : 'Loss'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="text-gray-400">{player.date}</div>
                  <div className="flex items-center">
                    <Award size={12} className="text-purple-400 mr-1" />
                    <span className="text-purple-400">{player.score}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button className="w-full mt-4 py-2 text-gray-400 hover:text-white transition-colors text-sm">
          View All Players
        </button>
      </div>
      
      {/* Game stats */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <Award size={20} className="mr-2 text-purple-400" />
          Game Stats
        </h2>
        
        <div className="space-y-4">
          <div className="bg-gray-750 rounded-lg p-3 border border-gray-700">
            <div className="text-sm text-gray-400 mb-1">Total Games Played</div>
            <div className="text-xl font-bold text-white">2,487</div>
          </div>
          
          <div className="bg-gray-750 rounded-lg p-3 border border-gray-700">
            <div className="text-sm text-gray-400 mb-1">Total Prize Pool Awarded</div>
            <div className="flex items-center">
              <img src="/USDT.png" alt="USDT" className="w-5 h-5 mr-2" />
              <span className="text-xl font-bold text-green-400">87,650 USDT</span>
            </div>
          </div>
          
          <div className="bg-gray-750 rounded-lg p-3 border border-gray-700">
            <div className="text-sm text-gray-400 mb-1">Highest Score</div>
            <div className="flex items-center">
              <span className="text-xl font-bold text-white mr-2">24,860</span>
              <span className="text-sm text-gray-400">by David87</span>
            </div>
          </div>
          
          <div className="bg-gray-750 rounded-lg p-3 border border-gray-700">
            <div className="text-sm text-gray-400 mb-1">Average Game Duration</div>
            <div className="text-xl font-bold text-white">18 minutes</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameSidebarSection;