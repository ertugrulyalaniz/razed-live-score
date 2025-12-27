export interface SubTeam {
  id: number;
  name: string;
  slug: string;
}

export interface Team {
  id: number;
  name: string;
  slug: string;
  gender: 'M' | 'F';
  subTeams: SubTeam[];
}

export interface Score {
  current: number;
  period1: number;
  normaltime: number;
}

export type MatchStatusType = 'inprogress' | 'notstarted' | 'finished' | 'canceled';

export interface MatchStatus {
  code: number;
  type: MatchStatusType;
}

export type LiveStatus = 'FT' | 'HT' | '-' | 'Cancelled' | string;

export interface Match {
  id: string;
  name: string;
  competitionId: string;
  competition: string;
  countryId: string;
  country: string;
  timestamp: number;
  date: string;
  time: string;
  status: MatchStatus;
  round: {
    round: number;
  };
  homeTeam: Team;
  awayTeam: Team;
  homeScore: Score;
  awayScore: Score;
  liveStatus: LiveStatus;
}

export type MatchDisplayStatus = 'live' | 'prematch' | 'finished' | 'halftime' | 'cancelled';
