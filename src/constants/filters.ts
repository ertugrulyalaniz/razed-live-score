import type { FilterOption, FilterType, MatchStatusType } from '@/types';

export const FILTER_OPTIONS: FilterOption[] = [
  { id: 'all', label: 'All', statusType: null },
  { id: 'result', label: 'Result', statusType: 'finished' },
  { id: 'live', label: 'Live', statusType: 'inprogress' },
  { id: 'upcoming', label: 'Upcoming', statusType: 'notstarted' },
];

export const STATUS_TYPE_TO_FILTER: Record<MatchStatusType, Exclude<FilterType, 'all'>> = {
  finished: 'result',
  inprogress: 'live',
  notstarted: 'upcoming',
  canceled: 'result',
};

export const FILTER_TO_STATUS_TYPE: Record<Exclude<FilterType, 'all'>, MatchStatusType> = {
  result: 'finished',
  live: 'inprogress',
  upcoming: 'notstarted',
};
