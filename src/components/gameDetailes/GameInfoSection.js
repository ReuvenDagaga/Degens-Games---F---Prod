import React from 'react';
import { Info, Brain, Users, List, Trophy } from 'lucide-react';

const gameRules = {
  "Chess": [
    "Standard chess rules apply with a 30-minute timer per player",
    "Checkmate your opponent's king to win",
    "Draw possibilities include stalemate, threefold repetition, and 50-move rule",
    "Illegal moves result in automatic loss",
    "Rating adjustments will be made based on ELO system"
  ],
  "2048": [
    "Combine tiles of the same number to create a tile with the sum of those numbers",
    "Reach the 2048 tile before your opponent to win",
    "If both players reach 2048, highest score wins",
    "Game ends when no more moves are possible",
    "Time limit of 15 minutes per game"
  ],
  "Monopoly": [
    "Digital version of the classic board game with streamlined rules",
    "First player to reach $3000 in net worth wins",
    "Automated dice rolls to ensure fairness",
    "Trading and property purchasing is allowed",
    "45-minute time limit, highest net worth wins if time expires"
  ],
  "Snake": [
    "Control your snake to eat food and grow longer",
    "Avoid collisions with walls and your own body",
    "Highest score after 5 minutes wins",
    "Special power-ups appear at random intervals",
    "Bonus points for executing risky maneuvers"
  ]
};

const gameTips = {
  "Chess": [
    "Control the center of the board early",
    "Develop your knights and bishops before making major moves",
    "Castle early to protect your king",
    "Watch for fork opportunities that attack multiple pieces",
    "In the endgame, activate your king as an attacking piece"
  ],
  "2048": [
    "Keep your highest tile in a corner",
    "Build a descending chain of tiles from your highest tile",
    "Never move your highest tile from its corner position",
    "Merge tiles early to maintain board space",
    "Plan several moves ahead when making decisions"
  ],
  "Monopoly": [
    "Focus on acquiring property sets for monopolies",
    "Orange and red properties have the best return on investment",
    "Railroads provide consistent income throughout the game",
    "Build houses as soon as you have a monopoly",
    "Manage your cash flow carefully in the early game"
  ],
  "Snake": [
    "Plan your route several moves ahead",
    "Use the edges of the board for safer movements",
    "Take calculated risks for food items with bonus points",
    "Watch your opponent's snake for potential collision opportunities",
    "Save power-ups for strategic moments"
  ]
};

const GameInfoSection = ({ room }) => {
  return (
    <div className="lg:col-span-2">
      {/* Entry fee and rewards */}
      <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <Info size={20} className="mr-2 text-purple-400" />
          Game Details
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Entry Fee */}
          <div className="bg-gray-750 rounded-lg p-4 border border-gray-700">
            <div className="text-sm text-gray-400 mb-1">Entry Fee</div>
            <div className="flex items-center">
              {room.currency === 'USDT' ? (
                <>
                  <img src="/USDT.png" alt="USDT" className="w-5 h-5 mr-2" />
                  <span className="text-xl font-bold text-green-400">{room.entryFeeUSDT} USDT</span>
                </>
              ) : (
                <>
                  <img src="/favi.png" alt="ePVP" className="w-5 h-5 mr-2" />
                  <span className="text-xl font-bold text-yellow-400">{room.entryFeeEPVP} ePVP</span>
                </>
              )}
            </div>
          </div>
          
          {/* Win Reward */}
          <div className="bg-gray-750 rounded-lg p-4 border border-gray-700">
            <div className="text-sm text-gray-400 mb-1">Win Reward</div>
            <div className="flex flex-col">
              {room.currency === 'USDT' && (
                <div className="flex items-center mb-1">
                  <img src="/USDT.png" alt="USDT" className="w-4 h-4 mr-1" />
                  <span className="text-lg font-bold text-green-400">+{room.entryFeeUSDT * 2} USDT</span>
                </div>
              )}
              <div className="flex items-center">
                <img src="/favi.png" alt="ePVP" className="w-4 h-4 mr-1" />
                <span className="text-lg font-bold text-yellow-400">+100 ePVP</span>
              </div>
            </div>
          </div>
          
          {/* Lose Reward */}
          <div className="bg-gray-750 rounded-lg p-4 border border-gray-700">
            <div className="text-sm text-gray-400 mb-1">Participation Reward</div>
            <div className="flex items-center">
              <img src="/favi.png" alt="ePVP" className="w-4 h-4 mr-1" />
              <span className="text-lg font-bold text-yellow-400">+10 ePVP</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Game explanation section */}
      <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <Brain size={20} className="mr-2 text-purple-400" />
          About {room.name}
        </h2>
        
        <p className="text-gray-300 mb-4">
          {room.type === "Chess" && "Chess is a strategic board game played between two opponents. It's one of the world's oldest and most popular games, known for its depth and complexity. Each player commands an army of 16 pieces across a checkered board, aiming to checkmate the opponent's king."}
          {room.type === "2048" && "2048 is an addictive single-player sliding tile puzzle game. Players combine tiles with the same numbers to create a tile with the value of 2048. Our competitive version pits players against each other to see who can reach higher scores or the 2048 tile faster."}
          {room.type === "Monopoly" && "Monopoly is a classic property trading board game where players buy, sell, and develop properties to build their wealth. In our digital version, up to 4 players compete to build their real estate empire and bankrupt their opponents through strategic purchases and development."}
          {room.type === "Snake" && "Snake is a timeless arcade game where players control a growing snake that must eat food while avoiding obstacles. Our competitive version challenges players to achieve the highest score within a time limit, with special power-ups and bonus challenges to add excitement."}
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
                  ? 'Single player game mode' 
                  : `${room.playersPerMatch} players required per match`}
              </span>
            </li>
            <li className="flex items-center">
              <span className="text-purple-400 mr-2">•</span>
              <span>
                {room.currentlyOnline} currently active players
              </span>
            </li>
            <li className="flex items-center">
              <span className="text-purple-400 mr-2">•</span>
              <span>Matchmaking based on skill level</span>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Rules and How to Win */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GameInfoSection;