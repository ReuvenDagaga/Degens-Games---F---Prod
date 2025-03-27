import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const TournamentBracket = ({ bracket }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  const calculateFullRounds = (initialLength) => {
    const rounds = [];
    let current = initialLength;
    if (!current || current <= 0) return rounds;
    while (current >= 1) {
      rounds.push(current);
      current = Math.ceil(current / 2);
      if (current === 1) {
        rounds.push(1);
        break;
      }
    }
    return rounds;
  };

  const buildFullBracket = (inputBracket) => {
    const firstRoundLength = Array.isArray(inputBracket[0]) ? inputBracket[0].length : 0;
    const roundsLength = calculateFullRounds(firstRoundLength);
    return roundsLength.map((length, i) => {
      const current = inputBracket[i] || [];
      const filled = [...current];
      while (filled.length < length) filled.push("SOON");
      return filled;
    });
  };

  const fullBracket = buildFullBracket(bracket);
  const baseReward = 100;

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden mb-6">
      <button
        onClick={toggleOpen}
        className="w-full flex justify-between items-center px-6 py-4 bg-gray-800 hover:bg-gray-700 transition-colors"
      >
        <h2 className="text-lg font-bold text-white">Tournament Leaderboard</h2>
        {isOpen ? <ChevronUp className="text-white" /> : <ChevronDown className="text-white" />}
      </button>

      <div
        className={`transition-all duration-700 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100 scale-y-100' : 'max-h-0 opacity-0 scale-y-0'} origin-top transform overflow-hidden`}
      >
        <div className="overflow-x-auto py-10 px-6 bg-gray-900">
          <div className="flex flex-col gap-12 items-center w-full mx-auto">
            {fullBracket.map((round, roundIndex) => (
              <div
                key={roundIndex}
                className="flex flex-wrap justify-center gap-4"
              >
                {round.map((player, i) => (
                  <div key={i} className="relative w-[120px]">
                    <div
                      className={`bg-gray-800 border border-gray-600 text-white rounded-lg px-4 py-2 text-center text-sm w-full transition-all shadow-md
                        ${player === "SOON" ? "text-gray-500 italic" : "font-bold"}`}
                    >
                      {typeof player === "number" ? `Player ${player}` : player}
                      <div className="text-yellow-400 text-xs mt-1 font-medium">
                        +{baseReward * Math.pow(10, roundIndex)} ePVP
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )).reverse()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentBracket;