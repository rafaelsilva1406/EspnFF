import { ESPNClient } from './espn-client';
import type { ESPNConfig, League, Team, Player, Matchup } from '@/types/espn';

export class FootballLeague {
  private client: ESPNClient;
  public teams: Team[] = [];
  public currentWeek: number = 1;
  public settings: any = {};
  public members: any[] = [];

  constructor(config: ESPNConfig) {
    this.client = new ESPNClient({ ...config, sport: 'nfl' });
  }

  async fetchLeague(): Promise<void> {
    const data = await this.client.getLeague();
    
    this.currentWeek = data.status?.latestScoringPeriod || 1;
    this.settings = data.settings || {};
    this.members = data.members || [];
    
    this.teams = this.parseTeams(data.teams || []);
  }

  private parseTeams(teamsData: any[]): Team[] {
    return teamsData.map(team => ({
      id: team.id,
      abbrev: team.abbrev,
      name: team.name || team.location,
      location: team.location || '',
      logo: team.logo || '',
      record: {
        wins: team.record?.overall?.wins || 0,
        losses: team.record?.overall?.losses || 0,
        ties: team.record?.overall?.ties || 0
      },
      pointsFor: team.record?.overall?.pointsFor || 0,
      pointsAgainst: team.record?.overall?.pointsAgainst || 0,
      roster: this.parseRoster(team.roster?.entries || []),
      owners: team.owners || []
    }));
  }

  private parseRoster(rosterData: any[]): Player[] {
    return rosterData.map(entry => ({
      id: entry.playerId,
      name: entry.playerPoolEntry?.player?.fullName || '',
      firstName: entry.playerPoolEntry?.player?.firstName || '',
      lastName: entry.playerPoolEntry?.player?.lastName || '',
      position: entry.playerPoolEntry?.player?.defaultPositionId || '',
      team: entry.playerPoolEntry?.player?.proTeamId || '',
      injuryStatus: entry.playerPoolEntry?.player?.injuryStatus || 'ACTIVE',
      stats: {
        appliedTotal: entry.playerPoolEntry?.player?.stats?.[0]?.appliedTotal || 0,
        projectedTotal: entry.playerPoolEntry?.player?.stats?.[0]?.projectedTotal || 0,
        breakdown: entry.playerPoolEntry?.player?.stats?.[0]?.stats || {}
      },
      ownership: {
        percentOwned: entry.playerPoolEntry?.player?.ownership?.percentOwned || 0,
        percentChange: entry.playerPoolEntry?.player?.ownership?.percentChange || 0
      }
    }));
  }

  async getMatchups(week?: number): Promise<Matchup[]> {
    return this.client.getMatchups(week);
  }

  async getBoxScore(matchupId: number, week: number) {
    return this.client.getBoxscore(matchupId, week);
  }

  async getRecentActivity() {
    return this.client.getRecentActivity();
  }

  async getDraft() {
    return this.client.getLeagueDraft();
  }

  async getFreeAgents(): Promise<Player[]> {
    const data = await this.client.getProPlayers();
    return this.parseRoster(data.players || []);
  }

  async getPlayerNews(playerId: number) {
    return this.client.getPlayerNews(playerId);
  }
}

export class BasketballLeague extends FootballLeague {
  constructor(config: ESPNConfig) {
    super({ ...config, sport: 'nba' });
  }
}

export class HockeyLeague extends FootballLeague {
  constructor(config: ESPNConfig) {
    super({ ...config, sport: 'nhl' });
  }
}

export class BaseballLeague extends FootballLeague {
  constructor(config: ESPNConfig) {
    super({ ...config, sport: 'mlb' });
  }
}

export class WNBALeague extends FootballLeague {
  constructor(config: ESPNConfig) {
    super({ ...config, sport: 'wnba' });
  }
}