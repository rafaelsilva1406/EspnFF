import { FANTASY_BASE_ENDPOINT, NEWS_BASE_ENDPOINT, FANTASY_SPORTS } from './constants';
import type { ESPNConfig, League, Team, Player, Matchup, BoxScore, Activity, Draft } from '@/types/espn';

export class ESPNAccessDenied extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ESPNAccessDenied';
  }
}

export class ESPNInvalidLeague extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ESPNInvalidLeague';
  }
}

export class ESPNUnknownError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ESPNUnknownError';
  }
}

export class ESPNClient {
  private config: ESPNConfig;
  private endpoint: string;
  private leagueEndpoint: string;
  private newsEndpoint: string;
  private cookies?: Record<string, string>;

  constructor(config: ESPNConfig) {
    this.config = config;
    
    if (!(config.sport in FANTASY_SPORTS)) {
      throw new Error(`Unknown sport: ${config.sport}, available options are ${Object.keys(FANTASY_SPORTS).join(', ')}`);
    }

    this.endpoint = FANTASY_BASE_ENDPOINT + FANTASY_SPORTS[config.sport] + '/seasons/' + config.year;
    this.newsEndpoint = NEWS_BASE_ENDPOINT + FANTASY_SPORTS[config.sport] + '/news/players';

    if (config.year < 2018) {
      this.leagueEndpoint = FANTASY_BASE_ENDPOINT + FANTASY_SPORTS[config.sport] + 
        "/leagueHistory/" + config.league_id + "?seasonId=" + config.year;
    } else {
      this.leagueEndpoint = FANTASY_BASE_ENDPOINT + FANTASY_SPORTS[config.sport] + 
        "/seasons/" + config.year + "/segments/0/leagues/" + config.league_id;
    }

    if (config.espn_s2 && config.swid) {
      this.cookies = {
        'espn_s2': config.espn_s2,
        'SWID': config.swid
      };
    }
  }

  private async checkRequestStatus(response: Response, extend = '', params?: URLSearchParams, headers?: HeadersInit): Promise<any> {
    if (response.status === 401) {
      let alternateEndpoint: string;
      
      if (this.leagueEndpoint.includes("/leagueHistory/")) {
        const baseEndpoint = this.leagueEndpoint.split("/leagueHistory/")[0];
        alternateEndpoint = `${baseEndpoint}/seasons/${this.config.year}/segments/0/leagues/${this.config.league_id}`;
      } else {
        const baseEndpoint = this.leagueEndpoint.split("/seasons/")[0];
        alternateEndpoint = `${baseEndpoint}/leagueHistory/${this.config.league_id}?seasonId=${this.config.year}`;
      }

      const url = new URL(alternateEndpoint + extend);
      if (params) url.search = params.toString();

      const alternateResponse = await fetch(url.toString(), {
        headers: headers || {},
        credentials: 'include',
        ...(this.cookies && {
          headers: {
            ...headers,
            'Cookie': Object.entries(this.cookies).map(([k, v]) => `${k}=${v}`).join('; ')
          }
        })
      });

      if (alternateResponse.ok) {
        this.leagueEndpoint = alternateEndpoint;
        return alternateResponse.json();
      }

      throw new ESPNAccessDenied(
        `League ${this.config.league_id} cannot be accessed with espn_s2=${this.cookies?.espn_s2} and swid=${this.cookies?.SWID}`
      );
    }

    if (response.status === 404) {
      throw new ESPNInvalidLeague(`League ${this.config.league_id} does not exist`);
    }

    if (response.status !== 200) {
      throw new ESPNUnknownError(`ESPN returned an HTTP ${response.status}`);
    }

    return null;
  }

  private async makeRequest(url: string, params?: Record<string, any>, headers?: HeadersInit): Promise<any> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          searchParams.append(key, value.join(','));
        } else {
          searchParams.append(key, String(value));
        }
      });
    }

    const fullUrl = searchParams.toString() ? `${url}?${searchParams}` : url;

    const response = await fetch(fullUrl, {
      headers: headers || {},
      credentials: 'include',
      ...(this.cookies && {
        headers: {
          ...headers,
          'Cookie': Object.entries(this.cookies).map(([k, v]) => `${k}=${v}`).join('; ')
        }
      })
    });

    const alternateResponse = await this.checkRequestStatus(response, '', searchParams, headers);
    
    if (alternateResponse) {
      return alternateResponse;
    }

    const data = await response.json();
    return Array.isArray(data) ? data[0] : data;
  }

  async getLeague(): Promise<any> {
    const params = {
      view: ['mTeam', 'mRoster', 'mMatchup', 'mSettings', 'mStandings']
    };
    return this.makeRequest(this.leagueEndpoint, params);
  }

  async getProSchedule(): Promise<any> {
    const params = {
      view: 'proTeamSchedules_wl'
    };
    return this.makeRequest(this.endpoint, params);
  }

  async getProPlayers(): Promise<any> {
    const params = {
      view: 'players_wl'
    };
    const filters = { "filterActive": { "value": true } };
    const headers = { 'x-fantasy-filter': JSON.stringify(filters) };
    return this.makeRequest(this.endpoint + '/players', params, headers);
  }

  async getLeagueDraft(): Promise<any> {
    const params = {
      view: 'mDraftDetail'
    };
    return this.makeRequest(this.leagueEndpoint, params);
  }

  async getPlayerCard(playerIds: number[], maxScoringPeriod: number, additionalFilters: string[] = []): Promise<any> {
    const params = { view: 'kona_playercard' };
    
    const additionalValue = [`00${this.config.year}`, `10${this.config.year}`, ...additionalFilters];
    const filters = {
      'players': {
        'filterIds': { 'value': playerIds },
        'filterStatsForTopScoringPeriodIds': {
          'value': maxScoringPeriod,
          'additionalValue': additionalValue
        }
      }
    };
    const headers = { 'x-fantasy-filter': JSON.stringify(filters) };
    
    return this.makeRequest(this.leagueEndpoint, params, headers);
  }

  async getPlayerNews(playerId: number): Promise<any> {
    const params = { playerId: playerId.toString() };
    return this.makeRequest(this.newsEndpoint, params);
  }

  async getRecentActivity(): Promise<Activity[]> {
    const params = {
      view: 'kona_league_messageboard'
    };
    const extend = `/segments/0/leagues/${this.config.league_id}/communication`;
    return this.makeRequest(this.endpoint + extend, params);
  }

  async getMatchups(week?: number): Promise<Matchup[]> {
    const params: Record<string, any> = {
      view: ['mMatchup', 'mMatchupScore']
    };
    
    if (week) {
      params.scoringPeriodId = week;
    }
    
    return this.makeRequest(this.leagueEndpoint, params);
  }

  async getBoxscore(matchupId: number, week: number): Promise<BoxScore> {
    const params = {
      view: ['mBoxscore', 'mMatchupScore'],
      matchupId,
      scoringPeriodId: week
    };
    
    return this.makeRequest(this.leagueEndpoint, params);
  }
}