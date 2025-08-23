import { NextRequest, NextResponse } from 'next/server';
import { FootballLeague } from '@/lib/espn-leagues';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const leagueId = searchParams.get('league_id');
    const year = searchParams.get('year');
    const week = searchParams.get('week');
    const espnS2 = searchParams.get('espn_s2');
    const swid = searchParams.get('swid');

    if (!leagueId || !year) {
      return NextResponse.json(
        { error: 'league_id and year are required' },
        { status: 400 }
      );
    }

    // For now, return mock data for testing
    const mockMatchups = [
      {
        id: 1,
        week: parseInt(week || '1'),
        home: {
          team: {
            id: 1,
            abbrev: 'TEAM1',
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
            abbrev: 'TEAM2',
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
      }
    ];

    return NextResponse.json({ matchups: mockMatchups });

    // TODO: Uncomment when ready to use real ESPN API
    // const league = new FootballLeague({
    //   league_id: parseInt(leagueId),
    //   year: parseInt(year),
    //   sport: 'nfl',
    //   espn_s2: espnS2 || undefined,
    //   swid: swid || undefined
    // });

    // const matchups = await league.getMatchups(week ? parseInt(week) : undefined);
    // return NextResponse.json({ matchups });

  } catch (error) {
    console.error('Matchups API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch matchups data' },
      { status: 500 }
    );
  }
}