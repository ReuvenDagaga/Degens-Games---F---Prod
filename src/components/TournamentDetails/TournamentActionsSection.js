import React from 'react';
import { Trophy, AlertTriangle, DollarSign } from 'lucide-react';

const TournamentActionsSection = ({ handleJoin, showConfirmModal, tournament, cancelJoin, confirmJoin }) => {
  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 p-4 border-t border-gray-800 md:hidden z-10">
        <button 
          onClick={handleJoin}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
        >
          <Trophy size={20} className="mr-2" />
          Join Tournament
        </button>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700">
            <div className="text-center mb-4">
              <AlertTriangle size={40} className="text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Confirm Participation</h3>
              <p className="text-gray-300">
                You're about to join the tournament. Entry fee:
                <span className="text-green-400 font-bold"> {tournament.entryFeeUSDT} USDT</span>.
              </p>
            </div>

            <div className="flex space-x-3">
              <button 
                onClick={cancelJoin}
                className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmJoin}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
              >
                <DollarSign size={18} className="mr-1" />
                Confirm Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TournamentActionsSection;
