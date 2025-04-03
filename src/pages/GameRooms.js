import React from 'react';
import { Sword, Users } from 'lucide-react';
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
    currency: "USDT"
  },
];

const pulsingDotAnimation = `
@keyframes pulse {
  0% { opacity: 0.6; transform: scale(0.9); }
  50% { opacity: 1; transform: scale(1.1); }
  100% { opacity: 0.6; transform: scale(0.9); }
}
.pulse-dot {
  animation: pulse 1.5s infinite;
}
`;

const GameRooms = () => {
  const navigate = useNavigate();

  const handleRoomClick = (room) => {
    const gameSlug = room.name;
    navigate(`/gamedetails/${gameSlug}/${room.entryFeeUSDT}`, { state: { roomData: room } });
  };

  return (
    <div className="mb-10">
      <style>{pulsingDotAnimation}</style>

      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold text-gray-100">Open Game Rooms</h2>
        <button className="text-red-400 hover:text-red-300 text-sm font-medium">
          View all rooms &gt;
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {gameRooms.map((room) => (
          <div
            key={room.id}
            className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 hover:border-red-500 transition-all duration-300 group cursor-pointer transform hover:-translate-y-1 hover:shadow-2xl"
          >
            {/* Image section (85% height) */}
            <div className="relative h-[270px] sm:h-[300px]">
              <img
                src={room.image || "/default-room.jpg"}
                alt={room.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />

              {/* Currency Badge */}
              <div
                className="absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1 z-20"
                style={{
                  backgroundColor: room.currency === 'USDT' ? 'rgba(0,128,0,0.9)' : 'rgba(86, 79, 41, 0.8)',
                  color: room.currency === 'USDT' ? 'white' : 'rgb(255,215,0)'
                }}
              >
                <img
                  src={room.currency === 'USDT' ? "/USDT.png" : "/favi.png"}
                  alt={room.currency}
                  className="w-4 h-4"
                />
                <span>{room.currency}</span>
              </div>

              {/* Online Players */}
              <div className="absolute top-3 right-3 bg-gray-900 bg-opacity-80 px-2 py-1 rounded-md text-xs font-medium flex items-center z-20">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full mr-2 pulse-dot"></div>
                <span className="text-green-400">{room.currentlyOnline}</span>
                <span className="text-gray-300 ml-1">Online</span>
              </div>

              {/* PLAY Button on Image */}
              <div className="absolute bottom-3 right-3 z-20">
                <button
                  onClick={() => handleRoomClick(room)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg flex items-center gap-2 shadow-md text-sm sm:text-base font-semibold"
                >
                  <Sword size={18} className="text-white" />
                  Play
                </button>
              </div>

              {/* Game Name + Players */}
              <div className="absolute bottom-3 left-3 text-white z-20">
                <h3 className="text-lg sm:text-xl font-bold group-hover:text-red-400 transition-colors">
                  {room.name}
                </h3>
                <div className="flex items-center text-xs bg-gray-900 bg-opacity-70 px-2 py-1 rounded mt-1 w-fit">
                  <Users size={14} className="mr-1 text-gray-300" />
                  {room.playersPerMatch} {room.playersPerMatch === 1 ? 'player' : 'players'}
                </div>
              </div>
            </div>

            {/* Bottom Section (15% height) */}
            <div className="p-4 space-y-2">
              {/* Entry Fee & Type */}
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <img
                    src={room.currency === 'USDT' ? "/USDT.png" : "/favi.png"}
                    alt="Currency"
                    className="w-5 h-5 mr-1"
                  />
                  <span className={`text-lg font-medium ${room.currency === 'USDT' ? 'text-green-400' : 'text-yellow-400'}`}>
                    {room.currency === 'USDT' ? `${room.entryFeeUSDT}` : `${room.entryFeeEPVP} ePVP`}
                  </span>
                </div>
                <div className="text-xs text-gray-400 bg-gray-750 px-2 py-1 rounded">
                  {room.playersPerMatch === 1 ? 'Single player' : `${room.playersPerMatch} per match`}
                </div>
              </div>

              {/* Rewards */}
              <div className="bg-gray-750 rounded-md p-3 text-xs border-t border-gray-700">
                {room.currency === 'USDT' ? (
                  <div className="flex justify-between">
                    <div>
                      <div className="text-gray-400 mb-1">Win Rewards:</div>
                      <div className="flex items-center">
                        <img src="/USDT.png" alt="USDT" className="w-5 h-5 mr-1" />
                        <span className="text-green-400">+{room.entryFeeUSDT * 2} USDT</span>
                      </div>
                      <div className="flex items-center mt-1">
                        <img src="/favi.png" alt="ePVP" className="w-5 h-5 mr-1" />
                        <span className="text-yellow-400">+100 ePVP</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-400 mb-1">Participation:</div>
                      <div className="flex items-center justify-end">
                        <img src="/favi.png" alt="ePVP" className="w-4 h-4 mr-1" />
                        <span className="text-yellow-400">+10 ePVP</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-400">
                    Rewards based on entry fee + performance
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