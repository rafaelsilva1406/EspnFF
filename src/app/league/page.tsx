'use client';

import { useState, useEffect, useCallback } from 'react';
import TeamCard from '@/components/TeamCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import type { Team } from '@/types/espn';

export default function LeaguePage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [leagueId, setLeagueId] = useState('1605970260');
  const [year, setYear] = useState('2025');

  const fetchLeague = useCallback(async () => {
    if (!leagueId) return;
    
    setLoading(true);
    setError('');
    
    try {
      const params = new URLSearchParams({
        league_id: leagueId,
        year: year
      });

      const espnS2 = process.env.NEXT_PUBLIC_ESPN_S2;
      const swid = process.env.NEXT_PUBLIC_SWID;
      
      if (espnS2) params.append('espn_s2', espnS2);
      if (swid) params.append('swid', swid);

      const response = await fetch(`/api/league?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch league data');
      }

      const data = await response.json();
      setTeams(data.teams || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [leagueId, year]);

  useEffect(() => {
    const defaultLeagueId = process.env.DEFAULT_LEAGUE_ID;
    if (defaultLeagueId) {
      setLeagueId(defaultLeagueId);
    }
  }, []);

  useEffect(() => {
    if (leagueId) {
      fetchLeague();
    }
  }, [leagueId, year, fetchLeague]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">League Overview</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="leagueId" className="block text-sm font-medium text-gray-700">
                  League ID
                </label>
                <input
                  type="text"
                  id="leagueId"
                  value={leagueId}
                  onChange={(e) => setLeagueId(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter ESPN League ID"
                />
              </div>
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                  Year
                </label>
                <input
                  type="number"
                  id="year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min="2015"
                  max="2024"
                />
              </div>
            </div>
            <button
              onClick={fetchLeague}
              disabled={!leagueId || loading}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Fetch League'}
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {loading && <LoadingSpinner />}

          {!loading && teams.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map((team) => (
                <TeamCard key={team.id} team={team} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}