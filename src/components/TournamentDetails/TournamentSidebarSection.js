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
];

const TournamentSidebarSection = () => {
  return (
    <div>
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <Clock size={20} className="mr-2 text-purple-400" />
          Recent Participants
        </h2>
        
        <div className="space-y-3">
          {recentPlayers.map(player => (
            <div key={player.id} className="flex items-center p-3 bg-gray-750 rounded-lg border border-gray-700">
              <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden bg-gray-600 mr-3">
                <img src={player.avatar} alt={player.username} className="w-full h-full object-cover" />
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
          View All Participants
        </button>
      </div>
    </div>
  );
};

export default TournamentSidebarSection;
