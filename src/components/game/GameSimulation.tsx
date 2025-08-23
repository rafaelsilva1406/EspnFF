'use client';

import { useState, useEffect, useCallback } from 'react';
import FootballField from './FootballField';
import PlayerToken from './PlayerToken';
import ColorWheel from './ColorWheel';
import type { Team, Player, Matchup } from '@/types/espn';

interface GameSimulationProps {
  matchup: Matchup;
  onMatchupChange: (week: number, matchupId: number) => void;
  availableWeeks: number[];
  availableMatchups: Matchup[];
}

interface PlayerPosition {
  player: Player;
  x: number;
  y: number;
  team: 'home' | 'away';
}

export default function GameSimulation({ 
  matchup, 
  onMatchupChange, 
  availableWeeks, 
  availableMatchups 
}: GameSimulationProps) {
  const [playerPositions, setPlayerPositions] = useState<PlayerPosition[]>([]);
  const [homeTeamColor, setHomeTeamColor] = useState('#3b82f6');
  const [awayTeamColor, setAwayTeamColor] = useState('#ef4444');
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  const fieldWidth = 1000;
  const fieldHeight = 600;
  const fieldMargin = 40;

  // Load team colors from session storage
  useEffect(() => {
    const savedHomeColor = sessionStorage.getItem(`teamColor_${matchup.home.team.id}`);
    const savedAwayColor = sessionStorage.getItem(`teamColor_${matchup.away.team.id}`);
    
    if (savedHomeColor) setHomeTeamColor(savedHomeColor);
    if (savedAwayColor) setAwayTeamColor(savedAwayColor);
  }, [matchup.home.team.id, matchup.away.team.id]);

  // Save team colors to session storage
  const handleHomeColorChange = (color: string) => {
    setHomeTeamColor(color);
    sessionStorage.setItem(`teamColor_${matchup.home.team.id}`, color);
  };

  const handleAwayColorChange = (color: string) => {
    setAwayTeamColor(color);
    sessionStorage.setItem(`teamColor_${matchup.away.team.id}`, color);
  };

  // Calculate player positions based on their performance
  const calculatePlayerPositions = useCallback(() => {
    const positions: PlayerPosition[] = [];
    
    const homeScore = matchup.home.score;
    const awayScore = matchup.away.score;
    const totalScore = homeScore + awayScore;
    
    // Calculate field progression (0-100 yard field)
    const homeProgress = totalScore > 0 ? (homeScore / totalScore) * 100 : 50;
    const awayProgress = 100 - homeProgress;

    // Position home team players
    const homeTeamX = fieldMargin + (fieldWidth - fieldMargin * 2) * (homeProgress / 100);
    matchup.home.team.roster.slice(0, 11).forEach((player, index) => {
      positions.push({
        player,
        x: homeTeamX + (Math.random() - 0.5) * 60,
        y: fieldMargin + 60 + (index * 40) + (Math.random() - 0.5) * 30,
        team: 'home'
      });
    });

    // Position away team players
    const awayTeamX = fieldMargin + (fieldWidth - fieldMargin * 2) * (awayProgress / 100);
    matchup.away.team.roster.slice(0, 11).forEach((player, index) => {
      positions.push({
        player,
        x: awayTeamX + (Math.random() - 0.5) * 60,
        y: fieldMargin + 60 + (index * 40) + (Math.random() - 0.5) * 30,
        team: 'away'
      });
    });

    setPlayerPositions(positions);
  }, [matchup, fieldWidth, fieldMargin]);

  // Update positions when matchup changes
  useEffect(() => {
    calculatePlayerPositions();
  }, [calculatePlayerPositions]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      calculatePlayerPositions();
      setLastUpdate(Date.now());
    }, 30000);

    return () => clearInterval(interval);
  }, [calculatePlayerPositions]);

  return (
    <div className="space-y-6">
      {/* Game HUD */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Week Selector */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Week:</label>
            <select
              value={matchup.week}
              onChange={(e) => onMatchupChange(parseInt(e.target.value), matchup.id)}
              className="rounded border border-gray-300 px-3 py-1 text-sm"
            >
              {availableWeeks.map(week => (
                <option key={week} value={week}>Week {week}</option>
              ))}
            </select>
          </div>

          {/* Matchup Selector */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Matchup:</label>
            <select
              value={matchup.id}
              onChange={(e) => onMatchupChange(matchup.week, parseInt(e.target.value))}
              className="rounded border border-gray-300 px-3 py-1 text-sm"
            >
              {availableMatchups.map(m => (
                <option key={m.id} value={m.id}>
                  {m.home.team.name} vs {m.away.team.name}
                </option>
              ))}
            </select>
          </div>

          {/* Team Color Controls */}
          <div className="flex items-center space-x-4">
            <ColorWheel
              currentColor={homeTeamColor}
              onColorChange={handleHomeColorChange}
              teamName={matchup.home.team.name}
            />
            <ColorWheel
              currentColor={awayTeamColor}
              onColorChange={handleAwayColorChange}
              teamName={matchup.away.team.name}
            />
          </div>

          {/* Last Update */}
          <div className="text-xs text-gray-500">
            Last updated: {new Date(lastUpdate).toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Score Display */}
      <div className="bg-gray-900 text-white rounded-lg p-4">
        <div className="flex justify-between items-center">
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: homeTeamColor }}>
              {matchup.home.team.name}
            </div>
            <div className="text-4xl font-bold mt-2">{matchup.home.score.toFixed(1)}</div>
          </div>
          
          <div className="text-center">
            <div className="text-xl text-gray-400">VS</div>
            <div className="text-sm text-gray-400 mt-2">Week {matchup.week}</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: awayTeamColor }}>
              {matchup.away.team.name}
            </div>
            <div className="text-4xl font-bold mt-2">{matchup.away.score.toFixed(1)}</div>
          </div>
        </div>
      </div>

      {/* Football Field with Players */}
      <div className="relative bg-gray-100 rounded-lg p-4 overflow-hidden">
        <FootballField width={fieldWidth} height={fieldHeight} />
        
        {/* Player tokens overlay */}
        <div className="absolute inset-0">
          {playerPositions.map((position, index) => (
            <PlayerToken
              key={`${position.player.id}-${index}`}
              player={position.player}
              position={{ x: position.x, y: position.y }}
              teamColor={position.team === 'home' ? homeTeamColor : awayTeamColor}
            />
          ))}
        </div>

        {/* Field Legend */}
        <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white rounded p-3 text-sm">
          <div className="flex items-center space-x-2 mb-1">
            <div 
              className="w-4 h-4 rounded-full border border-white"
              style={{ backgroundColor: homeTeamColor }}
            />
            <span>{matchup.home.team.name} ({matchup.home.score.toFixed(1)})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div 
              className="w-4 h-4 rounded-full border border-white"
              style={{ backgroundColor: awayTeamColor }}
            />
            <span>{matchup.away.team.name} ({matchup.away.score.toFixed(1)})</span>
          </div>
        </div>

        {/* Auto-refresh indicator */}
        <div className="absolute top-4 right-4 bg-green-600 text-white rounded-full px-3 py-1 text-xs">
          🔄 Auto-refresh: 30s
        </div>
      </div>
    </div>
  );
}