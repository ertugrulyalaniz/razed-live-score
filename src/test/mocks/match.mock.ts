import type { Match, MatchDisplayStatus, MatchStatusType } from '@/types';

export function createMockMatch(overrides: Partial<Match> = {}): Match {
  return {
    id: 'test-match-1',
    name: 'Team A - Team B',
    competitionId: 'comp-1',
    competition: 'Test League',
    countryId: 'country-1',
    country: 'Test Country',
    timestamp: Date.now() / 1000,
    date: '01.01.2024',
    time: '15:00',
    status: {
      code: 100,
      type: 'notstarted',
    },
    round: { round: 1 },
    homeTeam: {
      id: 1,
      name: 'Team A',
      slug: 'team-a',
      gender: 'M',
      subTeams: [],
    },
    awayTeam: {
      id: 2,
      name: 'Team B',
      slug: 'team-b',
      gender: 'M',
      subTeams: [],
    },
    homeScore: {
      current: 0,
      period1: 0,
      normaltime: 0,
    },
    awayScore: {
      current: 0,
      period1: 0,
      normaltime: 0,
    },
    liveStatus: '-',
    ...overrides,
  };
}

export function createLiveMatch(minute = 45): Match {
  return createMockMatch({
    id: 'live-match',
    status: { code: 100, type: 'inprogress' },
    liveStatus: `${minute}'`,
    homeScore: { current: 1, period1: 1, normaltime: 1 },
    awayScore: { current: 0, period1: 0, normaltime: 0 },
  });
}

export function createFinishedMatch(): Match {
  return createMockMatch({
    id: 'finished-match',
    status: { code: 100, type: 'finished' },
    liveStatus: 'FT',
    homeScore: { current: 2, period1: 1, normaltime: 2 },
    awayScore: { current: 1, period1: 0, normaltime: 1 },
  });
}

export function createHalftimeMatch(): Match {
  return createMockMatch({
    id: 'halftime-match',
    status: { code: 100, type: 'inprogress' },
    liveStatus: 'HT',
    homeScore: { current: 1, period1: 1, normaltime: 1 },
    awayScore: { current: 1, period1: 1, normaltime: 1 },
  });
}

export function createCanceledMatch(): Match {
  return createMockMatch({
    id: 'canceled-match',
    status: { code: 100, type: 'canceled' },
    liveStatus: 'Canceled',
  });
}

export function createPrematchMatch(): Match {
  return createMockMatch({
    id: 'prematch-match',
    status: { code: 100, type: 'notstarted' },
    liveStatus: '-',
    timestamp: Math.floor(Date.now() / 1000) + 86400, // Tomorrow
  });
}

export function createMatchWithStatus(
  statusType: MatchStatusType,
  liveStatus: string
): Match {
  return createMockMatch({
    id: `match-${statusType}-${liveStatus}`,
    status: { code: 100, type: statusType },
    liveStatus,
  });
}

export function createMatchList(): Match[] {
  return [
    createLiveMatch(32),
    createHalftimeMatch(),
    createFinishedMatch(),
    createPrematchMatch(),
    createCanceledMatch(),
  ];
}

export const mockDisplayStatuses: Record<MatchDisplayStatus, Match> = {
  live: createLiveMatch(),
  halftime: createHalftimeMatch(),
  finished: createFinishedMatch(),
  prematch: createPrematchMatch(),
  canceled: createCanceledMatch(),
};
