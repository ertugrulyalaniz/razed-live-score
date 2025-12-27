import { FILTER_TO_STATUS_TYPE, STATUS_TYPE_TO_FILTER } from '@/constants';
import type { FilterCounts, FilterType, Match, MatchDisplayStatus, MatchStatusType } from '@/types';

export function getMatchDisplayStatus(match: Match): MatchDisplayStatus {
  const { status, liveStatus } = match;

  if (liveStatus === 'Cancelled' || liveStatus === 'Canceled') {
    return 'canceled';
  }

  if (status.type === 'canceled') {
    return 'canceled';
  }

  if (liveStatus === 'HT') {
    return 'halftime';
  }

  switch (status.type) {
    case 'inprogress':
      return 'live';
    case 'finished':
      return 'finished';
    default:
      return 'prematch';
  }
}

export function isMatchLive(match: Match): boolean {
  return match.status.type === 'inprogress' && match.liveStatus !== 'HT';
}

export function getLiveMinute(liveStatus: string): string | null {
  const nonMinuteStatuses = ['FT', 'HT', '-', 'Cancelled', 'Canceled'];

  if (nonMinuteStatuses.includes(liveStatus)) {
    return null;
  }

  return liveStatus;
}

export function calculateFilterCounts(matches: Match[]): FilterCounts {
  const counts: FilterCounts = {
    all: 0,
    result: 0,
    live: 0,
    upcoming: 0,
  };

  for (const match of matches) {
    counts.all++;
    const filterType = STATUS_TYPE_TO_FILTER[match.status.type];
    if (filterType) {
      counts[filterType]++;
    }
  }

  return counts;
}

export function filterMatches(matches: Match[], filter: FilterType): Match[] {
  if (filter === 'all') {
    return matches;
  }

  const targetStatusType: MatchStatusType = FILTER_TO_STATUS_TYPE[filter];

  // Result filter should include both finished and canceled matches
  if (filter === 'result') {
    return matches.filter((match) =>
      match.status.type === 'finished' || match.status.type === 'canceled'
    );
  }

  return matches.filter((match) => match.status.type === targetStatusType);
}

export function sortMatches(matches: Match[]): Match[] {
  return [...matches].sort((a, b) => {
    const aIsLive = a.status.type === 'inprogress';
    const bIsLive = b.status.type === 'inprogress';

    if (aIsLive && !bIsLive) return -1;
    if (!aIsLive && bIsLive) return 1;

    return a.timestamp - b.timestamp;
  });
}
