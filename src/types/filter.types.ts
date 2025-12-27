import type { MatchStatusType } from './match.types';

export type FilterType = 'all' | 'result' | 'live' | 'upcoming';

export interface FilterOption {
  id: FilterType;
  label: string;
  statusType: MatchStatusType | null;
}

export interface FilterCounts {
  all: number;
  result: number;
  live: number;
  upcoming: number;
}
