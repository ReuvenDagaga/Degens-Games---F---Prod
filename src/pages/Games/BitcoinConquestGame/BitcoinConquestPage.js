import React, { useState } from 'react';

const initialOwnership = {
  BTC: null,
  ETH: null,
  SOL: null,
  LTC: null,
  XRP: null,
  KAS: null,
};

const territoryColors = {
  null: '#ddd',
  player1: '#4facfe',
  player2: '#ff6b6b',
};

const RiskBoard = () => {
  const [ownership, setOwnership] = useState(initialOwnership);
  const [currentPlayer, setCurrentPlayer] = useState('player1');

  const handleTerritoryClick = (territory) => {
    setOwnership((prev) => ({
      ...prev,
      [territory]: currentPlayer,
    }));
    setCurrentPlayer((prev) => (prev === 'player1' ? 'player2' : 'player1'));
  };

  return (
    <div>
      <h2>משחק כיבוש ביטקוין</h2>
      <p>תור של: {currentPlayer}</p>

      <svg viewBox="0 0 500 500" width="500" height="500">
        {/* רקע עיגול */}
        <circle cx="250" cy="250" r="240" fill="#fcd7a3" />

        {/* צורות לא סימטריות מדומיינות */}
        <path
          d="M200,180 C220,120 320,120 300,200 L250,250 Z"
          fill={territoryColors[ownership.KAS]}
          stroke="black"
          onClick={() => handleTerritoryClick('KAS')}
        />
        <path
          d="M300,200 C360,200 380,280 320,300 L250,250 Z"
          fill={territoryColors[ownership.XRP]}
          stroke="black"
          onClick={() => handleTerritoryClick('XRP')}
        />
        <path
          d="M320,300 C300,360 220,360 200,300 L250,250 Z"
          fill={territoryColors[ownership.ETH]}
          stroke="black"
          onClick={() => handleTerritoryClick('ETH')}
        />
        <path
          d="M200,300 C140,280 120,200 180,200 L250,250 Z"
          fill={territoryColors[ownership.SOL]}
          stroke="black"
          onClick={() => handleTerritoryClick('SOL')}
        />
        <path
          d="M180,200 C160,140 200,100 250,150 L250,250 Z"
          fill={territoryColors[ownership.LTC]}
          stroke="black"
          onClick={() => handleTerritoryClick('LTC')}
        />
        <path
          d="M250,150 C300,100 340,140 320,200 L250,250 Z"
          fill={territoryColors[ownership.BTC]}
          stroke="black"
          onClick={() => handleTerritoryClick('BTC')}
        />

        {/* שמות טריטוריות */}
        <text x="250" y="140" textAnchor="middle" fontSize="16">BTC</text>
        <text x="340" y="240" textAnchor="middle" fontSize="16">XRP</text>
        <text x="250" y="340" textAnchor="middle" fontSize="16">ETH</text>
        <text x="160" y="240" textAnchor="middle" fontSize="16">SOL</text>
        <text x="200" y="160" textAnchor="middle" fontSize="16">LTC</text>
        <text x="280" y="180" textAnchor="middle" fontSize="16">KAS</text>
      </svg>
    </div>
  );
};

export default RiskBoard;
