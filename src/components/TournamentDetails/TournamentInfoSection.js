import React from 'react';
import { Info, Users, List, Trophy } from 'lucide-react';

const TournamentInfoSection = ({ tournament }) => {
  return (
    <div className="lg:col-span-2">
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <Info size={20} className="mr-2 text-purple-400" />
          Tournament Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-750 rounded-lg p-4 border border-gray-700">
            <div className="text-sm text-gray-400 mb-1">Entry Fee</div>
            <div className="flex items-center">
              <img src="/USDT.png" alt="USDT" className="w-5 h-5 mr-2" />
              <span className="text-xl font-bold text-green-400">{tournament.entryFeeUSDT} USDT</span>
            </div>
          </div>

          <div className="bg-gray-750 rounded-lg p-4 border border-gray-700">
            <div className="text-sm text-gray-400 mb-1">Total Prize Pool</div>
            <div className="flex items-center">
              <img src="/USDT.png" alt="USDT" className="w-5 h-5 mr-2" />
              <span className="text-xl font-bold text-yellow-400">{tournament.entryFeeUSDT * tournament.participantsRequired} USDT</span>
            </div>
          </div>

          <div className="bg-gray-750 rounded-lg p-4 border border-gray-700">
            <div className="text-sm text-gray-400 mb-1">Participants Required</div>
            <div className="text-xl font-bold text-white">{tournament.participantsRequired} Players</div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <Trophy size={20} className="mr-2 text-purple-400" />
          Winning Criteria
        </h2>
        <ul className="space-y-3 text-gray-300">
          <li className="flex items-start"><span className="text-yellow-400 mr-2">•</span> Knockout rounds with 1v1 matches</li>
          <li className="flex items-start"><span className="text-yellow-400 mr-2">•</span> The winner advances to the next round</li>
          <li className="flex items-start"><span className="text-yellow-400 mr-2">•</span> Grand prize awarded to the final winner</li>
          <li className="flex items-start"><span className="text-yellow-400 mr-2">•</span> Semi-finalists receive bonus rewards</li>
        </ul>
      </div>
    </div>
  );
};

export default TournamentInfoSection;
