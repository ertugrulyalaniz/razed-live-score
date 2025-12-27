import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { matchService } from '@/services';
import type { FilterCounts, FilterType, Match } from '@/types';
import { calculateFilterCounts, filterMatches, sortMatches } from '@/utils';

interface MatchState {
  matches: Match[];
  filteredMatches: Match[];
  filterCounts: FilterCounts;
  activeFilter: FilterType;
  isLoading: boolean;
  error: string | null;

  fetchMatches: () => Promise<void>;
  setActiveFilter: (filter: FilterType) => void;
  reset: () => void;
}

const initialState = {
  matches: [],
  filteredMatches: [],
  filterCounts: { all: 0, result: 0, live: 0, upcoming: 0 },
  activeFilter: 'all' as FilterType,
  isLoading: false,
  error: null,
};

export const useMatchStore = create<MatchState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      fetchMatches: async () => {
        const { isLoading } = get();

        if (isLoading) return;

        set({ isLoading: true, error: null });

        try {
          const matches = await matchService.getMatches();
          const sortedMatches = sortMatches(matches);
          const filterCounts = calculateFilterCounts(sortedMatches);
          const { activeFilter } = get();
          const filteredMatches = filterMatches(sortedMatches, activeFilter);

          set({
            matches: sortedMatches,
            filteredMatches,
            filterCounts,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An unexpected error occurred',
            isLoading: false,
          });
        }
      },

      setActiveFilter: (filter: FilterType) => {
        const { matches } = get();
        const filteredMatches = filterMatches(matches, filter);

        set({
          activeFilter: filter,
          filteredMatches,
        });
      },

      reset: () => {
        matchService.clearCache();
        set(initialState);
      },
    }),
    { name: 'match-store' }
  )
);

export const selectFilteredMatches = (state: MatchState) => state.filteredMatches;
export const selectFilterCounts = (state: MatchState) => state.filterCounts;
export const selectActiveFilter = (state: MatchState) => state.activeFilter;
export const selectIsLoading = (state: MatchState) => state.isLoading;
export const selectError = (state: MatchState) => state.error;
