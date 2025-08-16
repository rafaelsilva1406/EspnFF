export interface ESPNConfig {
  espn_s2?: string;
  swid?: string;
  league_id: number;
  year: number;
  sport: 'nfl' | 'nba' | 'nhl' | 'mlb' | 'wnba';
}

export interface Team {
  id: number;
  abbrev: string;
  name: string;
  location: string;
  logo: string;
  record: {
    wins: number;
    losses: number;
    ties: number;
  };
  pointsFor: number;
  pointsAgainst: number;
  roster: Player[];
  owners: string[];
}

export interface Player {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  position: string;
  team: string;
  injuryStatus: string;
  stats: PlayerStats;
  ownership: {
    percentOwned: number;
    percentChange: number;
  };
}

export interface PlayerStats {
  appliedTotal: number;
  projectedTotal: number;
  breakdown: Record<string, number>;
}

export interface Matchup {
  id: number;
  week: number;
  home: {
    team: Team;
    score: number;
  };
  away: {
    team: Team;
    score: number;
  };
  winner: 'home' | 'away' | 'tie' | 'undecided';
}

export interface League {
  id: number;
  name: string;
  year: number;
  sport: string;
  teams: Team[];
  settings: LeagueSettings;
  currentWeek: number;
  scoringPeriod: number;
  members: Member[];
}

export interface LeagueSettings {
  name: string;
  size: number;
  scoringType: string;
  playoffTeamCount: number;
  regularSeasonMatchupPeriodCount: number;
  rosterPositions: RosterPosition[];
}

export interface RosterPosition {
  position: string;
  count: number;
}

export interface Member {
  id: string;
  displayName: string;
  firstName: string;
  lastName: string;
}

export interface Activity {
  id: string;
  date: number;
  type: string;
  team: Team;
  player?: Player;
  msg: string;
}

export interface BoxScore {
  week: number;
  home: BoxScoreTeam;
  away: BoxScoreTeam;
}

export interface BoxScoreTeam {
  team: Team;
  score: number;
  players: BoxPlayer[];
}

export interface BoxPlayer {
  player: Player;
  points: number;
  projectedPoints: number;
  slotPosition: string;
  stats: Record<string, number>;
}

export interface Draft {
  picks: DraftPick[];
  tradedPicks: DraftPick[];
}

export interface DraftPick {
  round: number;
  pick: number;
  overall: number;
  team: Team;
  player: Player;
  keeper: boolean;
}