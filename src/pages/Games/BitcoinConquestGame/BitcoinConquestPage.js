import React from 'react';

const territories = [
  { id: 'BTC', fill: '#fcd996', label: 'BTC' },
  { id: 'ETH', fill: '#9fd5b4', label: 'ETH' },
  { id: 'SOL', fill: '#f3a3a3', label: 'SOL' },
  { id: 'LTC', fill: '#d0d0d0', label: 'LTC' },
  { id: 'XRP', fill: '#96bde0', label: 'XRP' },
  { id: 'KAS', fill: '#fcd996', label: 'KAS' },
];

const CryptoMap = () => {
  const handleClick = (id) => {
    console.log('נבחרה טריטוריה:', id);
  };

  return (
    <svg viewBox="0 0 500 500" width="500" height="500">
      <circle cx="250" cy="250" r="240" fill="#fcd996" />

      {/* כל אזור בנוי מ־path נפרד. ניתן לעצב בצורה הרבה יותר מורכבת דרך כלים כמו Inkscape / Figma */}
      {/* BTC (מרכז) */}
      <path
        d="M210,230 Q250,200 290,230 Q280,250 290,270 Q250,300 210,270 Q220,250 210,230 Z"
        fill={territories[0].fill}
        stroke="black"
        strokeWidth="2"
        onClick={() => handleClick(territories[0].id)}
      />
      {/* ETH (למטה) */}
      <path
        d="M210,270 Q250,300 270,340 Q250,360 200,340 Q190,300 210,270 Z"
        fill={territories[1].fill}
        stroke="black"
        strokeWidth="2"
        onClick={() => handleClick(territories[1].id)}
      />
      {/* SOL (שמאל תחתון) */}
      <path
        d="M210,230 Q180,240 150,270 Q160,300 190,300 Q200,270 210,270 Q220,250 210,230 Z"
        fill={territories[2].fill}
        stroke="black"
        strokeWidth="2"
        onClick={() => handleClick(territories[2].id)}
      />
      {/* LTC (שמאל עליון) */}
      <path
        d="M210,230 Q180,200 160,160 Q180,140 210,170 Q220,190 210,230 Z"
        fill={territories[3].fill}
        stroke="black"
        strokeWidth="2"
        onClick={() => handleClick(territories[3].id)}
      />
      {/* XRP (ימין) */}
      <path
        d="M290,230 Q320,240 350,270 Q330,300 290,270 Q280,250 290,230 Z"
        fill={territories[4].fill}
        stroke="black"
        strokeWidth="2"
        onClick={() => handleClick(territories[4].id)}
      />
      {/* KAS (עליון) */}
      <path
        d="M250,150 Q230,170 210,170 Q220,150 250,130 Q280,150 290,170 Q270,170 250,150 Z"
        fill={territories[5].fill}
        stroke="black"
        strokeWidth="2"
        onClick={() => handleClick(territories[5].id)}
      />

      {/* טקסטים */}
      <text x="250" y="255" textAnchor="middle" fontSize="16" fill="black">BTC</text>
      <text x="240" y="330" textAnchor="middle" fontSize="16" fill="black">ETH</text>
      <text x="170" y="280" textAnchor="middle" fontSize="16" fill="black">SOL</text>
      <text x="180" y="180" textAnchor="middle" fontSize="16" fill="black">LTC</text>
      <text x="320" y="260" textAnchor="middle" fontSize="16" fill="black">XRP</text>
      <text x="250" y="160" textAnchor="middle" fontSize="16" fill="black">KAS</text>
    </svg>
  );
};

export default CryptoMap;
