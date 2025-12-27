import { describe, expect, it } from 'vitest';
import {
  calculateFilterCounts,
  filterMatches,
  getLiveMinute,
  getMatchDisplayStatus,
  isMatchLive,
  sortMatches,
} from '../match.utils';
import {
  createCanceledMatch,
  createFinishedMatch,
  createHalftimeMatch,
  createLiveMatch,
  createMatchWithStatus,
  createMockMatch,
  createPrematchMatch,
} from '@/test/mocks/match.mock';

describe('getMatchDisplayStatus', () => {
  it('returns "canceled" when liveStatus is "Canceled"', () => {
    const match = createCanceledMatch();
    expect(getMatchDisplayStatus(match)).toBe('canceled');
  });

  it('returns "halftime" when liveStatus is "HT"', () => {
    const match = createHalftimeMatch();
    expect(getMatchDisplayStatus(match)).toBe('halftime');
  });

  it('returns "live" when status type is "inprogress" and not HT', () => {
    const match = createLiveMatch();
    expect(getMatchDisplayStatus(match)).toBe('live');
  });

  it('returns "finished" when status type is "finished"', () => {
    const match = createFinishedMatch();
    expect(getMatchDisplayStatus(match)).toBe('finished');
  });

  it('returns "prematch" when status type is "notstarted"', () => {
    const match = createPrematchMatch();
    expect(getMatchDisplayStatus(match)).toBe('prematch');
  });

  it('returns "canceled" over any status type when liveStatus is "Canceled"', () => {
    const match = createMatchWithStatus('inprogress', 'Canceled');
    expect(getMatchDisplayStatus(match)).toBe('canceled');
  });
});

describe('isMatchLive', () => {
  it('returns true for live match with minute display', () => {
    const match = createLiveMatch(45);
    expect(isMatchLive(match)).toBe(true);
  });

  it('returns false for halftime match', () => {
    const match = createHalftimeMatch();
    expect(isMatchLive(match)).toBe(false);
  });

  it('returns false for finished match', () => {
    const match = createFinishedMatch();
    expect(isMatchLive(match)).toBe(false);
  });

  it('returns false for prematch', () => {
    const match = createPrematchMatch();
    expect(isMatchLive(match)).toBe(false);
  });

  it('returns false for canceled match', () => {
    const match = createCanceledMatch();
    expect(isMatchLive(match)).toBe(false);
  });
});

describe('getLiveMinute', () => {
  it('returns null for "FT"', () => {
    expect(getLiveMinute('FT')).toBeNull();
  });

  it('returns null for "HT"', () => {
    expect(getLiveMinute('HT')).toBeNull();
  });

  it('returns null for "-"', () => {
    expect(getLiveMinute('-')).toBeNull();
  });

  it('returns null for "Canceled"', () => {
    expect(getLiveMinute('Canceled')).toBeNull();
  });

  it('returns the minute string for "45\'"', () => {
    expect(getLiveMinute("45'")).toBe("45'");
  });

  it('returns the minute string for "90+3\'"', () => {
    expect(getLiveMinute("90+3'")).toBe("90+3'");
  });

  it('returns the minute string for "1\'"', () => {
    expect(getLiveMinute("1'")).toBe("1'");
  });
});

describe('calculateFilterCounts', () => {
  it('returns all zeros for empty array', () => {
    const counts = calculateFilterCounts([]);
    expect(counts).toEqual({
      all: 0,
      result: 0,
      live: 0,
      upcoming: 0,
    });
  });

  it('counts all matches correctly', () => {
    const matches = [
      createLiveMatch(),
      createFinishedMatch(),
      createPrematchMatch(),
    ];
    const counts = calculateFilterCounts(matches);
    expect(counts.all).toBe(3);
  });

  it('counts live matches correctly', () => {
    const matches = [
      createLiveMatch(),
      createLiveMatch(60),
      createFinishedMatch(),
    ];
    const counts = calculateFilterCounts(matches);
    expect(counts.live).toBe(2);
  });

  it('counts finished matches correctly', () => {
    const matches = [
      createFinishedMatch(),
      createFinishedMatch(),
      createLiveMatch(),
    ];
    const counts = calculateFilterCounts(matches);
    expect(counts.result).toBe(2);
  });

  it('counts upcoming matches correctly', () => {
    const matches = [
      createPrematchMatch(),
      createPrematchMatch(),
      createCanceledMatch(), // canceled type
    ];
    const counts = calculateFilterCounts(matches);
    expect(counts.upcoming).toBe(2);
  });

  it('handles mixed match types', () => {
    const matches = [
      createLiveMatch(),
      createHalftimeMatch(), // inprogress
      createFinishedMatch(),
      createPrematchMatch(),
      createCanceledMatch(),
    ];
    const counts = calculateFilterCounts(matches);
    expect(counts).toEqual({
      all: 5,
      live: 2, // live + halftime (both inprogress)
      result: 2, // finished + canceled
      upcoming: 1, // prematch only
    });
  });
});

describe('filterMatches', () => {
  const matches = [
    createLiveMatch(),
    createFinishedMatch(),
    createPrematchMatch(),
    createCanceledMatch(),
  ];

  it('returns all matches for "all" filter', () => {
    const filtered = filterMatches(matches, 'all');
    expect(filtered).toHaveLength(4);
    expect(filtered).toEqual(matches);
  });

  it('returns only live matches for "live" filter', () => {
    const filtered = filterMatches(matches, 'live');
    expect(filtered).toHaveLength(1);
    expect(filtered[0].status.type).toBe('inprogress');
  });

  it('returns only finished and canceled matches for "result" filter', () => {
    const filtered = filterMatches(matches, 'result');
    expect(filtered).toHaveLength(2); // finished + canceled
    for (const match of filtered) {
      expect(['finished', 'canceled']).toContain(match.status.type);
    }
  });

  it('returns only upcoming matches for "upcoming" filter', () => {
    const filtered = filterMatches(matches, 'upcoming');
    expect(filtered).toHaveLength(1); // prematch only
    expect(filtered[0].status.type).toBe('notstarted');
  });

  it('returns empty array when no matches match filter', () => {
    const onlyLive = [createLiveMatch()];
    const filtered = filterMatches(onlyLive, 'result');
    expect(filtered).toHaveLength(0);
  });
});

describe('sortMatches', () => {
  it('does not mutate original array', () => {
    const matches = [createFinishedMatch(), createLiveMatch()];
    const original = [...matches];
    sortMatches(matches);
    expect(matches).toEqual(original);
  });

  it('puts live matches first', () => {
    const finished = createFinishedMatch();
    const live = createLiveMatch();
    const prematch = createPrematchMatch();

    const sorted = sortMatches([finished, prematch, live]);

    expect(sorted[0].status.type).toBe('inprogress');
  });

  it('sorts non-live matches by timestamp', () => {
    const earlier = createMockMatch({
      id: 'earlier',
      timestamp: 1000,
      status: { code: 100, type: 'finished' },
    });
    const later = createMockMatch({
      id: 'later',
      timestamp: 2000,
      status: { code: 100, type: 'finished' },
    });

    const sorted = sortMatches([later, earlier]);

    expect(sorted[0].id).toBe('earlier');
    expect(sorted[1].id).toBe('later');
  });

  it('sorts live matches by timestamp among themselves', () => {
    const earlierLive = createMockMatch({
      id: 'earlier-live',
      timestamp: 1000,
      status: { code: 100, type: 'inprogress' },
      liveStatus: "30'",
    });
    const laterLive = createMockMatch({
      id: 'later-live',
      timestamp: 2000,
      status: { code: 100, type: 'inprogress' },
      liveStatus: "15'",
    });

    const sorted = sortMatches([laterLive, earlierLive]);

    expect(sorted[0].id).toBe('earlier-live');
    expect(sorted[1].id).toBe('later-live');
  });

  it('handles empty array', () => {
    const sorted = sortMatches([]);
    expect(sorted).toEqual([]);
  });

  it('handles single match', () => {
    const match = createLiveMatch();
    const sorted = sortMatches([match]);
    expect(sorted).toHaveLength(1);
    expect(sorted[0]).toEqual(match);
  });
});
