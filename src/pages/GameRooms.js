import React from 'react';
import { Users, Brain, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Updated sample data with correct structure
const gameRooms = [
  {
    id: 101,
    name: "Chess",
    entryFeeUSDT: 10,
    entryFeeEPVP: null, // null indicates this is a USDT-only room
    playersPerMatch: 2, // Exactly 2 players needed for a chess match
    currentlyOnline: 42, // Players currently online for this game
    image: "/Chess.png",
    type: "Chess",
    currency: "USDT" // This room uses USDT
  },
  {
    id: 102,
    name: "2048",
    entryFeeUSDT: 20,
    entryFeeEPVP: null,
    playersPerMatch: 1, // Single player game
    currentlyOnline: 78, // Players currently online for this game
    image: "/2048.png",
    type: "2048",
    currency: "USDT"
  },
  {
    id: 104,
    name: "Snake",
    entryFeeUSDT: null,
    entryFeeEPVP: 1000,
    playersPerMatch: 1, // Single player game
    currentlyOnline: 51, // Players currently online for this game
    image: "/Snake.png",
    type: "Snake",
    currency: "ePVP" // This room uses ePVP
  },
  {
    id: 105,
    name: "Bitcoin Conquest",
    entryFeeUSDT: 50,
    entryFeeEPVP: null,
    playersPerMatch: 2,
    currentlyOnline: 12, 
    image: "/Bitcoin Conquest.png",
    type: "Conquest",
    currency: "USDT"
  },
  {
    id: 106,
    name: "Zip",
    entryFeeUSDT: 5,
    entryFeeEPVP: null,
    playersPerMatch: 2,
    currentlyOnline: 2, 
    image: "/ZIP.png",
    type: "ACC",
    currency: "USDT"
  },
];

// Animation for pulsing green dot
const pulsingDotAnimation = `
@keyframes pulse {
  0% {
    opacity: 0.6;
    transform: scale(0.9);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
  100% {
    opacity: 0.6;
    transform: scale(0.9);
  }
}

.pulse-dot {
  animation: pulse 1.5s infinite;
}
`;

const GameRooms = () => {
  const navigate = useNavigate();

  const handleRoomClick = (room) => {
    // Create URL-friendly game name (lowercase, spaces to hyphens)
    const gameSlug = room.name
    navigate(`/gamedetails/${gameSlug}/${room.entryFeeUSDT}`, { state: { roomData: room } });
  };
  
  return (
    <div className="mb-10">
      {/* Add the pulsing animation */}
      <style>{pulsingDotAnimation}</style>
    
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold text-gray-100">Open Game Rooms</h2>
        <button className="text-red-400 hover:text-red-300 text-sm font-medium">
          View all rooms &gt;
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {gameRooms.map((room) => (
          <div 
            key={room.id} 
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700 hover:border-red-500 transition-colors duration-200 group cursor-pointer transform hover:-translate-y-1 hover:shadow-xl"
            onClick={() => handleRoomClick(room)}
          >
            <div className="relative h-48">
              <img
                src={room.image || "/default-room.jpg"}
                alt={room.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
              
              {/* Online Players Badge */}
              <div className="absolute top-3 right-3 bg-gray-900 bg-opacity-80 px-2 py-1 rounded-md text-sm font-medium flex items-center">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full mr-2 pulse-dot"></div>
                <span className="text-green-400">{room.currentlyOnline}</span>
                <span className="text-gray-300 ml-1">Online</span>
              </div>
              
              {/* Game Type Badge */}
              <div className="absolute top-3 left-3 bg-purple-600 px-2 py-1 rounded-md text-sm font-medium">
                {room.type}
              </div>
              
              {/* Currency Badge */}
              <div 
                className="absolute top-14 left-3 px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1"
                style={{ 
                  backgroundColor: room.currency === 'USDT' ? 'rgba(0,128,0,0.7)' : 'rgba(255,215,0,0.3)',
                  color: room.currency === 'USDT' ? 'white' : 'rgb(255,215,0)'
                }}
              >
                {room.currency === 'USDT' ? (
                  <>
                    <img src="/USDT.png" alt="USDT" className="w-4 h-4" />
                    <span>USDT</span>
                  </>
                ) : (
                  <>
                    <img src="/favi.png" alt="ePVP" className="w-4 h-4" />
                    <span>ePVP</span>
                  </>
                )}
              </div>
              
              <div className="absolute bottom-0 right-0 left-0 p-3">
                <div className="flex justify-between items-end">
                  <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors">{room.name}</h3>
                  <div className="bg-gray-900 bg-opacity-70 rounded px-2 py-1">
                    <div className="flex items-center text-sm">
                      <Users size={16} className="text-gray-300 mr-1" />
                      <span>{room.playersPerMatch} {room.playersPerMatch === 1 ? 'player' : 'players'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                  {room.currency === 'USDT' ? (
                    <>
                      <img src="/USDT.png" alt="USDT" className="w-5 h-5 mr-1" />
                      <span className="font-medium text-green-400 text-lg">{room.entryFeeUSDT}</span>
                    </>
                  ) : (
                    <>
                      <img src="/favi.png" alt="ePVP" className="w-5 h-5 mr-1" />
                      <span className="font-medium text-yellow-400 text-lg">{room.entryFeeEPVP} ePVP</span>
                    </>
                  )}
                </div>
                <div className="text-xs text-gray-400 bg-gray-750 px-2 py-1 rounded">
                  {room.playersPerMatch === 1 ? 'Single player' : `${room.playersPerMatch} per match`}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-400 flex items-center">
                  <Brain size={14} className="mr-1 text-purple-400" />
                  <span>Skill-based game</span>
                </div>
                <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-sm transition-colors">
                  View Details
                </button>
              </div>

              {/* Reward information */}
              <div className="mt-3 pt-3 border-t border-gray-700">
                <div className="bg-gray-750 rounded-md p-2.5 text-xs">
                  {room.currency === 'USDT' ? (
                    <div className="flex justify-between">
                      <div>
                        <div className="text-gray-400 mb-1">Win Rewards:</div>
                        <div className="flex items-center">
                          <img src="/USDT.png" alt="USDT" className="w-3 h-3 mr-1" />
                          <span className="text-green-400">+{room.entryFeeUSDT * 2} USDT</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <img src="/favi.png" alt="ePVP" className="w-3 h-3 mr-1" />
                          <span className="text-yellow-400">+100 ePVP</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-gray-400 mb-1">Participation:</div>
                        <div className="flex items-center justify-end">
                          <img src="/favi.png" alt="ePVP" className="w-3 h-3 mr-1" />
                          <span className="text-yellow-400">+10 ePVP</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <span className="text-gray-400">Rewards based on entry fee + performance</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameRooms;