import React from 'react';
import { Users, Award, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Updated sample data with correct structure
const gameRooms = [
  {
    id: 101,
    name: "Pro Chess Arena",
    entryFeeUSDT: 50,
    entryFeeEPVP: null, // null indicates this is a USDT-only room
    playersPerMatch: 2, // Exactly 2 players needed for a chess match
    currentlyOnline: 42, // Players currently online for this game
    image: "/chess-room.jpg",
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
    id: 103,
    name: "Monopoly Masters",
    entryFeeUSDT: 30,
    entryFeeEPVP: null,
    playersPerMatch: 4, // 4 players per Monopoly game
    currentlyOnline: 27, // Players currently online for this game
    image: "/monopoly-room.jpg",
    type: "Monopoly",
    currency: "USDT"
  },
  {
    id: 104,
    name: "Snake",
    entryFeeUSDT: null,
    entryFeeEPVP: 1000,
    playersPerMatch: 1, // Single player game
    currentlyOnline: 51, // Players currently online for this game
    image: "/sneak.png",
    type: "Snake",
    currency: "ePVP" // This room uses ePVP
  }
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
    const gameSlug = room.name.toLowerCase().replace(/\s+/g, '-');
    navigate(`/gamedetails/${gameSlug}`, { state: { roomData: room } });
  };
  
  return (
    <div className="mb-10">
      {/* Add the pulsing animation */}
      <style>{pulsingDotAnimation}</style>
    
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-100">Open Game Rooms</h2>
        <button className="text-red-400 hover:text-red-300 text-sm font-medium">
          View all rooms &gt;
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {gameRooms.map((room) => (
          <div 
            key={room.id} 
            className="bg-gray-800 rounded-lg overflow-hidden shadow-md border border-gray-700 hover:border-red-500 transition-colors duration-200 group cursor-pointer transform hover:-translate-y-1 hover:shadow-xl"
            onClick={() => handleRoomClick(room)}
          >
            <div className="relative h-40">
              <img
                src={room.image || "/default-room.jpg"}
                alt={room.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
              
              {/* Online Players Badge - Changed from Game Type */}
              <div className="absolute top-2 right-2 bg-gray-900 bg-opacity-80 px-2 py-1 rounded text-sm font-medium flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 pulse-dot"></div>
                <span className="text-green-400">{room.currentlyOnline}</span>
                <span className="text-gray-300 ml-1">Online</span>
              </div>
              
              {/* Game Type Badge - Moved to left side */}
              <div className="absolute top-2 left-2 bg-purple-600 px-2 py-1 rounded text-sm font-medium">
                {room.type}
              </div>
              
              {/* Currency Badge - Moved below game type */}
              <div 
                className="absolute top-11 left-2 px-2 py-1 rounded text-xs font-medium flex items-center gap-1"
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
                      <Users size={14} className="text-gray-300 mr-1" />
                      <span>{room.playersPerMatch} {room.playersPerMatch === 1 ? 'player' : 'players'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-3">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  {room.currency === 'USDT' ? (
                    <>
                      <img src="/USDT.png" alt="USDT" className="w-4 h-4 mr-1" />
                      <span className="font-medium text-green-400">{room.entryFeeUSDT}</span>
                    </>
                  ) : (
                    <>
                      <img src="/favi.png" alt="ePVP" className="w-4 h-4 mr-1" />
                      <span className="font-medium text-yellow-400">{room.entryFeeEPVP} ePVP</span>
                    </>
                  )}
                </div>
                <div className="text-xs text-gray-400">
                  {room.playersPerMatch === 1 ? 'Single player' : `${room.playersPerMatch} per match`}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-400 flex items-center">
                  <Brain size={14} className="mr-1" />
                  <span>Skill-based game</span>
                </div>
                <div className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm transition-colors">
                  Details
                </div>
              </div>

              {/* Reward information */}
              <div className="mt-2 pt-2 border-t border-gray-700 text-xs text-gray-400">
                {room.currency === 'USDT' ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img src="/favi.png" alt="ePVP" className="w-3 h-3 mr-1" />
                      <span className="text-yellow-400">Win: +100 ePVP</span>
                    </div>
                    <div className="flex items-center">
                      <img src="/favi.png" alt="ePVP" className="w-3 h-3 mr-1" />
                      <span className="text-yellow-400">Lose: +10 ePVP</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <span>Rewards based on entry fee</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameRooms;