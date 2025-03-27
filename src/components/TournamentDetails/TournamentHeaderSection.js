import React from 'react';
import { ArrowLeft, Users, Trophy } from 'lucide-react';

const TournamentHeaderSection = ({ tournament, handleBack, handleJoin }) => {
  return (
    <>
      <button 
        onClick={handleBack}
        className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={20} className="mr-2" />
        <span>Back to Tournaments</span>
      </button>

      <div className="relative rounded-xl overflow-hidden mb-8 h-64 md:h-80">
        <img 
          src={tournament.image || "./default-tournament.jpg"} 
          alt={tournament.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between">
            <div>
              <div className="flex items-center mb-3">
                <span className="bg-purple-600 text-white px-3 py-1 rounded-md text-sm font-medium mr-3">
                  {tournament.type}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">{tournament.name}</h1>
              <div className="flex items-center text-gray-300">
                <Users size={16} className="mr-2" />
                <span>{tournament.participantsRequired} players required</span>
              </div>
            </div>

            <div className="mt-4 md:mt-0">
              <button 
                onClick={handleJoin}
                className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
              >
                <Trophy size={20} className="mr-2" />
                Join Tournament
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TournamentHeaderSection;
