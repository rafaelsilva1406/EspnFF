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

    const league = new FootballLeague({
      league_id: parseInt(leagueId),
      year: parseInt(year),
      sport: 'nfl',
      espn_s2: espnS2 || undefined,
      swid: swid || undefined
    });

    const matchups = await league.getMatchups(week ? parseInt(week) : undefined);

    return NextResponse.json({ matchups });
  } catch (error) {
    console.error('Matchups API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch matchups data' },
      { status: 500 }
    );
  }
}