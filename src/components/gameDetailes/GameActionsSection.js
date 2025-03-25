import React from 'react';
import { Trophy, AlertTriangle, DollarSign } from 'lucide-react';

const GameActionsSection = ({ handlePlay, showConfirmModal, room, cancelPlay, confirmPlay }) => {
  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 p-4 border-t border-gray-800 md:hidden z-10">
        <button 
          onClick={handlePlay}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
        >
          <Trophy size={20} className="mr-2" />
          Play Now
        </button>
      </div>
      
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700">
            <div className="text-center mb-4">
              <AlertTriangle size={40} className="text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Confirm Entry</h3>
              <p className="text-gray-300">
                By clicking "Confirm" you agree to pay the entry fee of 
                {room.currency === 'USDT' ? (
                  <span className="text-green-400 font-bold"> {room.entryFeeUSDT} USDT</span>
                ) : (
                  <span className="text-yellow-400 font-bold"> {room.entryFeeEPVP} ePVP</span>
                )} from your account.
              </p>
            </div>
            
            <div className="bg-gray-750 rounded-lg p-3 mb-5 border border-gray-700">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Your Balance:</span>
                <div>
                  {room.currency === 'USDT' ? (
                    <div className="flex items-center">
                      <img src="/USDT.png" alt="USDT" className="w-4 h-4 mr-1" />
                      <span className="font-medium text-green-400">100 USDT</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <img src="/favi.png" alt="ePVP" className="w-4 h-4 mr-1" />
                      <span className="font-medium text-yellow-400">5,000 ePVP</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-400">Entry Fee:</span>
                <div>
                  {room.currency === 'USDT' ? (
                    <div className="flex items-center">
                      <img src="/USDT.png" alt="USDT" className="w-4 h-4 mr-1" />
                      <span className="font-medium text-red-400">-{room.entryFeeUSDT} USDT</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <img src="/favi.png" alt="ePVP" className="w-4 h-4 mr-1" />
                      <span className="font-medium text-red-400">-{room.entryFeeEPVP} ePVP</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="border-t border-gray-700 mt-2 pt-2 flex justify-between items-center">
                <span className="text-gray-200 font-medium">Remaining Balance:</span>
                <div>
                  {room.currency === 'USDT' ? (
                    <div className="flex items-center">
                      <img src="/USDT.png" alt="USDT" className="w-4 h-4 mr-1" />
                      <span className="font-medium text-white">{100 - room.entryFeeUSDT} USDT</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <img src="/favi.png" alt="ePVP" className="w-4 h-4 mr-1" />
                      <span className="font-medium text-white">{5000 - room.entryFeeEPVP} ePVP</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button 
                onClick={cancelPlay}
                className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmPlay}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
              >
                <DollarSign size={18} className="mr-1" />
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GameActionsSection;