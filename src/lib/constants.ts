export const FANTASY_BASE_ENDPOINT = 'https://lm-api-reads.fantasy.espn.com/apis/v3/games/';
export const NEWS_BASE_ENDPOINT = 'https://site.api.espn.com/apis/fantasy/v3/games/';

export const FANTASY_SPORTS = {
  nfl: 'ffl',
  nba: 'fba',
  nhl: 'fhl',
  mlb: 'flb',
  wnba: 'wfba'
} as const;

export const POSITION_MAP: Record<number, string> = {
  1: 'QB',
  2: 'RB',
  3: 'WR',
  4: 'TE',
  5: 'K',
  16: 'D/ST',
  17: 'LB',
  18: 'DL',
  19: 'DB',
  20: 'BENCH',
  21: 'IR'
};

export const ACTIVITY_MAP: Record<number, string> = {
  178: 'ADDED',
  179: 'DROPPED',
  180: 'ROSTER_MOVE',
  181: 'TRADED',
  239: 'WAIVER_ADDED'
};

export const NFL_WEEKS = 18;
export const NBA_WEEKS = 24;
export const NHL_WEEKS = 24;
export const MLB_WEEKS = 25;