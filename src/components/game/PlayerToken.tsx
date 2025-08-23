'use client';

import { useState } from 'react';
import type { Player } from '@/types/espn';

interface PlayerTokenProps {
  player: Player;
  position: { x: number; y: number };
  teamColor: string;
  onClick?: () => void;
}

export default function PlayerToken({ player, position, teamColor, onClick }: PlayerTokenProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={onClick}
    >
      {/* Player token */}
      <div
        className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-lg hover:scale-110 transition-transform"
        style={{ backgroundColor: teamColor }}
      >
        {player.position}
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
          <div className="bg-black text-white text-xs rounded py-2 px-3 whitespace-nowrap shadow-lg">
            <div className="font-semibold">{player.name}</div>
            <div className="text-gray-300">{player.position}</div>
            <div className="text-green-400">
              {player.stats.appliedTotal.toFixed(1)} pts
            </div>
            {/* Tooltip arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
          </div>
        </div>
      )}
    </div>
  );
}