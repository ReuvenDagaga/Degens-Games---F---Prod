import React from 'react';
import { ArrowLeft, Users, Trophy } from 'lucide-react';

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

const GameHeaderSection = ({ room, handleBack, handlePlay }) => {
  return (
    <>
      <style>{pulsingDotAnimation}</style>
      
      <button 
        onClick={handleBack}
        className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={20} className="mr-2" />
        <span>Back to Game Rooms</span>
      </button>

      <div className="relative rounded-xl overflow-hidden mb-8 h-64 md:h-80">
        <img 
          src={room.image || "/default-room.jpg"} 
          alt={room.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
        
        <div className="absolute top-4 right-4 bg-gray-900 bg-opacity-80 px-3 py-2 rounded-lg text-sm font-medium flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2 pulse-dot"></div>
          <span className="text-green-400 text-lg">{room.currentlyOnline}</span>
          <span className="text-gray-300 ml-1">Players Online</span>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between">
            <div>
              <div className="flex items-center mb-3">
                <span className="bg-purple-600 text-white px-3 py-1 rounded-md text-sm font-medium mr-3">
                  {room.type}
                </span>
                <span 
                  className="px-2 py-1 rounded-md text-xs font-medium flex items-center"
                  style={{ 
                    backgroundColor: room.currency === 'USDT' ? 'rgba(0,128,0,0.7)' : 'rgba(255,215,0,0.3)',
                    color: room.currency === 'USDT' ? 'white' : 'rgb(255,215,0)'
                  }}
                >
                  {room.currency === 'USDT' ? (
                    <>
                      <img src="/USDT.png" alt="USDT" className="w-4 h-4 mr-1" />
                      <span>USDT</span>
                    </>
                  ) : (
                    <>
                      <img src="/favi.png" alt="ePVP" className="w-4 h-4 mr-1" />
                      <span>ePVP</span>
                    </>
                  )}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">{room.name}</h1>
              <div className="flex items-center text-gray-300">
                <Users size={16} className="mr-2" />
                <span>
                  {room.playersPerMatch === 1 
                    ? 'Single player game' 
                    : `${room.playersPerMatch} players per match`}
                </span>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0">
              <button 
                onClick={handlePlay}
                className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
              >
                <Trophy size={20} className="mr-2" />
                Play Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GameHeaderSection;