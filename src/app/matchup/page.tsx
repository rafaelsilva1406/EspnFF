'use client';

import { useState, useEffect } from 'react';
import FootballField from '@/components/game/FootballField';
import PlayerToken from '@/components/game/PlayerToken';
import ColorWheel from '@/components/game/ColorWheel';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Mock data for testing
const mockMatchup = {
  id: 1,
  week: 1,
  home: {
    team: {
      id: 1,
      abbrev: 'BOLTS',
      name: 'Thunder Bolts',
      location: 'City',
      logo: '',
      record: { wins: 8, losses: 5, ties: 0 },
      pointsFor: 1245.5,
      pointsAgainst: 1123.2,
      roster: [
        { id: 101, name: 'John Smith', firstName: 'John', lastName: 'Smith', position: 'QB', team: 'NE', injuryStatus: 'ACTIVE', stats: { appliedTotal: 24.5, projectedTotal: 22.0, breakdown: {} }, ownership: { percentOwned: 95, percentChange: 2 } },
        { id: 102, name: 'Mike Johnson', firstName: 'Mike', lastName: 'Johnson', position: 'RB', team: 'TB', injuryStatus: 'ACTIVE', stats: { appliedTotal: 18.2, projectedTotal: 16.5, breakdown: {} }, ownership: { percentOwned: 87, percentChange: -1 } },
        { id: 103, name: 'Alex Brown', firstName: 'Alex', lastName: 'Brown', position: 'WR', team: 'GB', injuryStatus: 'ACTIVE', stats: { appliedTotal: 15.8, projectedTotal: 14.2, breakdown: {} }, ownership: { percentOwned: 92, percentChange: 3 } },
        { id: 104, name: 'Chris Wilson', firstName: 'Chris', lastName: 'Wilson', position: 'TE', team: 'KC', injuryStatus: 'ACTIVE', stats: { appliedTotal: 12.1, projectedTotal: 11.5, breakdown: {} }, ownership: { percentOwned: 78, percentChange: 0 } },
        { id: 105, name: 'David Lee', firstName: 'David', lastName: 'Lee', position: 'K', team: 'BAL', injuryStatus: 'ACTIVE', stats: { appliedTotal: 8.0, projectedTotal: 7.5, breakdown: {} }, ownership: { percentOwned: 65, percentChange: -2 } }
      ],
      owners: ['owner1']
    },
    score: 98.6
  },
  away: {
    team: {
      id: 2,
      abbrev: 'STRKS',
      name: 'Lightning Strikes',
      location: 'Metro',
      logo: '',
      record: { wins: 7, losses: 6, ties: 0 },
      pointsFor: 1189.3,
      pointsAgainst: 1167.8,
      roster: [
        { id: 201, name: 'Tom Davis', firstName: 'Tom', lastName: 'Davis', position: 'QB', team: 'BUF', injuryStatus: 'ACTIVE', stats: { appliedTotal: 21.3, projectedTotal: 20.1, breakdown: {} }, ownership: { percentOwned: 89, percentChange: 1 } },
        { id: 202, name: 'Steve Miller', firstName: 'Steve', lastName: 'Miller', position: 'RB', team: 'SF', injuryStatus: 'ACTIVE', stats: { appliedTotal: 16.7, projectedTotal: 15.9, breakdown: {} }, ownership: { percentOwned: 83, percentChange: -1 } },
        { id: 203, name: 'Ryan Clark', firstName: 'Ryan', lastName: 'Clark', position: 'WR', team: 'MIA', injuryStatus: 'ACTIVE', stats: { appliedTotal: 14.2, projectedTotal: 13.8, breakdown: {} }, ownership: { percentOwned: 76, percentChange: 2 } },
        { id: 204, name: 'Mark Taylor', firstName: 'Mark', lastName: 'Taylor', position: 'TE', team: 'LAR', injuryStatus: 'ACTIVE', stats: { appliedTotal: 9.8, projectedTotal: 10.2, breakdown: {} }, ownership: { percentOwned: 72, percentChange: -1 } },
        { id: 205, name: 'Joe Garcia', firstName: 'Joe', lastName: 'Garcia', position: 'K', team: 'DEN', injuryStatus: 'ACTIVE', stats: { appliedTotal: 6.5, projectedTotal: 7.0, breakdown: {} }, ownership: { percentOwned: 58, percentChange: 1 } }
      ],
      owners: ['owner2']
    },
    score: 68.5
  },
  winner: 'home'
};

export default function MatchupPage() {
  const [homeTeamColor, setHomeTeamColor] = useState('#3b82f6');
  const [awayTeamColor, setAwayTeamColor] = useState('#ef4444');
  const [playerPositions, setPlayerPositions] = useState<any[]>([]);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  const fieldWidth = 1000;
  const fieldHeight = 600;
  const fieldMargin = 40;

  // Calculate player positions
  useEffect(() => {
    const positions: any[] = [];
    
    const homeScore = mockMatchup.home.score;
    const awayScore = mockMatchup.away.score;
    const totalScore = homeScore + awayScore;
    
    const homeProgress = totalScore > 0 ? (homeScore / totalScore) * 100 : 50;
    const awayProgress = 100 - homeProgress;

    // Home team positions
    const homeTeamX = fieldMargin + (fieldWidth - fieldMargin * 2) * (homeProgress / 100);
    mockMatchup.home.team.roster.forEach((player, index) => {
      positions.push({
        player,
        x: homeTeamX + (Math.random() - 0.5) * 60,
        y: fieldMargin + 60 + (index * 80) + (Math.random() - 0.5) * 30,
        team: 'home'
      });
    });

    // Away team positions
    const awayTeamX = fieldMargin + (fieldWidth - fieldMargin * 2) * (awayProgress / 100);
    mockMatchup.away.team.roster.forEach((player, index) => {
      positions.push({
        player,
        x: awayTeamX + (Math.random() - 0.5) * 60,
        y: fieldMargin + 60 + (index * 80) + (Math.random() - 0.5) * 30,
        team: 'away'
      });
    });

    setPlayerPositions(positions);
  }, [fieldWidth, fieldMargin]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(Date.now());
      // Recalculate positions with slight variation
      setPlayerPositions(prev => prev.map(pos => ({
        ...pos,
        x: pos.x + (Math.random() - 0.5) * 10,
        y: pos.y + (Math.random() - 0.5) * 10
      })));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Team vs Team Live</h1>
          <p className="mt-2 text-gray-600">
            Interactive football field simulation with real-time updates
          </p>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 space-y-6">
          {/* Game HUD */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Week:</label>
                <select 
                  className="rounded border border-gray-300 px-3 py-1 text-sm" 
                  value={1}
                  onChange={() => {}}
                >
                  <option value={1}>Week 1</option>
                </select>
              </div>

              <div className="flex items-center space-x-4">
                <ColorWheel
                  currentColor={homeTeamColor}
                  onColorChange={setHomeTeamColor}
                  teamName={mockMatchup.home.team.name}
                />
                <ColorWheel
                  currentColor={awayTeamColor}
                  onColorChange={setAwayTeamColor}
                  teamName={mockMatchup.away.team.name}
                />
              </div>

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
                  {mockMatchup.home.team.name}
                </div>
                <div className="text-4xl font-bold mt-2">{mockMatchup.home.score.toFixed(1)}</div>
              </div>
              
              <div className="text-center">
                <div className="text-xl text-gray-400">VS</div>
                <div className="text-sm text-gray-400 mt-2">Week {mockMatchup.week}</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: awayTeamColor }}>
                  {mockMatchup.away.team.name}
                </div>
                <div className="text-4xl font-bold mt-2">{mockMatchup.away.score.toFixed(1)}</div>
              </div>
            </div>
          </div>

          {/* Football Field */}
          <div className="relative bg-gray-100 rounded-lg p-4 overflow-hidden">
            <FootballField width={fieldWidth} height={fieldHeight} />
            
            {/* Player tokens */}
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
                <span>{mockMatchup.home.team.name} ({mockMatchup.home.score.toFixed(1)})</span>
              </div>
              <div className="flex items-center space-x-2">
                <div 
                  className="w-4 h-4 rounded-full border border-white"
                  style={{ backgroundColor: awayTeamColor }}
                />
                <span>{mockMatchup.away.team.name} ({mockMatchup.away.score.toFixed(1)})</span>
              </div>
            </div>

            {/* Auto-refresh indicator */}
            <div className="absolute top-4 right-4 bg-green-600 text-white rounded-full px-3 py-1 text-xs">
              🔄 Auto-refresh: 30s
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}