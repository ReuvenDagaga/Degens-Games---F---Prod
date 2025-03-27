import React from "react";
import { Info, Brain, Users, List, Trophy } from "lucide-react";


const gameRules = {
  "Chess": [
    "Use standard chess rules including check, checkmate, and stalemate.",
    "Each player has 30 minutes total time.",
    "No takebacks allowed — each move is final.",
    "Illegal moves result in automatic loss.",
    "Tiebreakers determined by ELO score."
  ],
  "chess-monad-tournament": [
    "Tournament based on standard chess rules.",
    "Each match is 1v1 knockout style.",
    "Each player has 20 minutes per game.",
    "Illegal moves are instantly forfeited.",
    "Advancement determined by victory, tie-breaks by ELO."
  ],
  "2048": [
    "Combine matching tiles to reach 2048.",
    "Game ends after 15 minutes or when no moves are possible.",
    "You can only move in four directions.",
    "Highest tile wins if 2048 is not reached.",
    "Ties are broken by total score."
  ],
  "Monopoly": [
    "Each player starts with $1500.",
    "Turn-based property buying, building, and trading.",
    "Bankruptcy eliminates a player.",
    "Victory by reaching $3000 or being last standing.",
    "Game ends after 45 minutes — most assets wins."
  ],
  "Snake": [
    "Move your snake to eat food and grow.",
    "Avoid walls and your own body.",
    "Game lasts 5 minutes.",
    "Power-ups spawn randomly.",
    "Each food gives +10 points."
  ]
};

const gameTips = {
  "Chess": [
    "Control the center early with pawns and pieces.",
    "Develop knights before bishops.",
    "Castle early for king safety.",
    "Watch for forks and pins.",
    "In the endgame, activate your king!"
  ],
  "chess-monad-tournament": [
    "Play fast but carefully — the time is limited.",
    "Use opening theory to gain an early edge.",
    "Avoid long trades unless you're ahead.",
    "Exploit your opponent's time pressure.",
    "Stay calm in sudden-death scenarios."
  ],
  "2048": [
    "Keep your highest tile in a corner.",
    "Don't swipe up unless absolutely necessary.",
    "Think 2-3 moves ahead.",
    "Combine large tiles carefully.",
    "Clear low tiles to make space."
  ],
  "Monopoly": [
    "Focus on color sets — orange is best ROI.",
    "Buy railroads — passive income is powerful.",
    "Don't overspend early, keep cash buffer.",
    "Trade smart — always negotiate from strength.",
    "Upgrade properties evenly at first."
  ],
  "Snake": [
    "Stick to the edges early on.",
    "Plan your turns in advance.",
    "Time your movements for power-up spawns.",
    "Leave yourself escape routes.",
    "Use opponent’s movement to block them."
  ]
};





const GameInfoSection = ({ room }) => {
  return (
    <div className="lg:col-span-2">
      <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <Info size={20} className="mr-2 text-purple-400" />
          Game Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-750 rounded-lg p-4 border border-gray-700">
            <div className="text-sm text-gray-400 mb-1">Entry Fee</div>
            <div className="flex items-center">
              {room.currency === "USDT" ? (
                <>
                  <img src="/USDT.png" alt="USDT" className="w-5 h-5 mr-2" />
                  <span className="text-xl font-bold text-green-400">
                    {room.entryFeeUSDT} USDT
                  </span>
                </>
              ) : (
                <>
                  <img src="/favi.png" alt="ePVP" className="w-5 h-5 mr-2" />
                  <span className="text-xl font-bold text-yellow-400">
                    {room.entryFeeEPVP} ePVP
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="bg-gray-750 rounded-lg p-4 border border-gray-700">
            <div className="text-sm text-gray-400 mb-1">Win Reward</div>
            <div className="flex flex-col">
              {room.currency === "USDT" && (
                <div className="flex items-center mb-1">
                  <img src="/USDT.png" alt="USDT" className="w-4 h-4 mr-1" />
                  <span className="text-lg font-bold text-green-400">
                    +{room.entryFeeUSDT * 2} USDT
                  </span>
                </div>
              )}
              <div className="flex items-center">
                <img src="/favi.png" alt="ePVP" className="w-4 h-4 mr-1" />
                <span className="text-lg font-bold text-yellow-400">
                  +100 ePVP
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-750 rounded-lg p-4 border border-gray-700">
            <div className="text-sm text-gray-400 mb-1">
              Participation Reward
            </div>
            <div className="flex items-center">
              <img src="/favi.png" alt="ePVP" className="w-4 h-4 mr-1" />
              <span className="text-lg font-bold text-yellow-400">
                +10 ePVP
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <Brain size={20} className="mr-2 text-purple-400" />
          About {room.name}
        </h2>

        <p className="text-gray-300 mb-4">
          {room.type === "Chess" &&
            "Chess is a strategic board game played between two opponents. It's one of the world's oldest and most popular games, known for its depth and complexity. Each player commands an army of 16 pieces across a checkered board, aiming to checkmate the opponent's king."}
          {room.type === "Chess Monad Tournament" &&
            "Chess is a strategic board game played between two opponents. It's one of the world's oldest and most popular games, known for its depth and complexity. Each player commands an army of 16 pieces across a checkered board, aiming to checkmate the opponent's king."}
          {room.type === "2048" &&
            "2048 is an addictive single-player sliding tile puzzle game. Players combine tiles with the same numbers to create a tile with the value of 2048. Our competitive version pits players against each other to see who can reach higher scores or the 2048 tile faster."}
          {room.type === "Monopoly" &&
            "Monopoly is a classic property trading board game where players buy, sell, and develop properties to build their wealth. In our digital version, up to 4 players compete to build their real estate empire and bankrupt their opponents through strategic purchases and development."}
          {room.type === "Snake" &&
            "Snake is a timeless arcade game where players control a growing snake that must eat food while avoiding obstacles. Our competitive version challenges players to achieve the highest score within a time limit, with special power-ups and bonus challenges to add excitement."}
        </p>

        <div className="bg-gray-750 rounded-lg p-4 border border-gray-700 mb-4">
          <div className="flex items-center mb-2">
            <Users size={16} className="text-purple-400 mr-2" />
            <span className="text-white font-medium">Player Information</span>
          </div>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-center">
              <span className="text-purple-400 mr-2">•</span>
              <span>
                {room.playersPerMatch === 1
                  ? "Single player game mode"
                  : `${room.playersPerMatch} players required per match`}
              </span>
            </li>
            <li className="flex items-center">
              <span className="text-purple-400 mr-2">•</span>
              <span>{room.currentlyOnline} currently active players</span>
            </li>
            <li className="flex items-center">
              <span className="text-purple-400 mr-2">•</span>
              <span>Matchmaking based on skill level</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Game Rules */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <List size={20} className="mr-2 text-purple-400" />
          Game Rules
        </h2>
        <ul className="space-y-3">
          {gameRules[room.type]?.map((rule, index) => (
            <li key={index} className="flex">
              <span className="text-purple-400 mr-2">•</span>
              <span className="text-gray-300">{rule}</span>
            </li>
          ))}
          {!gameRules[room.type] && (
            <li className="text-gray-400 italic">
              No specific rules available for this game.
            </li>
          )}
        </ul>
      </div>

      {/* How to Win */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <Trophy size={20} className="mr-2 text-purple-400" />
          How to Win
        </h2>
        <ul className="space-y-3">
          {gameTips[room.type]?.map((tip, index) => (
            <li key={index} className="flex">
              <span className="text-yellow-400 mr-2">•</span>
              <span className="text-gray-300">{tip}</span>
            </li>
          ))}
          {!gameTips[room.type] && (
            <li className="text-gray-400 italic">
              No winning tips available for this game.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default GameInfoSection;
