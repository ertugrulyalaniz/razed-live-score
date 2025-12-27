import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  selectActiveFilter,
  selectError,
  selectFilterCounts,
  selectFilteredMatches,
  selectIsLoading,
  useMatchStore,
} from '../match.store';
import { createFinishedMatch, createLiveMatch, createMatchList, createPrematchMatch } from '@/test/mocks/match.mock';

// Mock the match service
vi.mock('@/services', () => ({
  matchService: {
    getMatches: vi.fn(),
    clearCache: vi.fn(),
  },
}));

import { matchService } from '@/services';

describe('match.store', () => {
  beforeEach(() => {
    // Reset store to initial state
    useMatchStore.getState().reset();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('has empty matches array', () => {
      const state = useMatchStore.getState();
      expect(state.matches).toEqual([]);
    });

    it('has empty filteredMatches array', () => {
      const state = useMatchStore.getState();
      expect(state.filteredMatches).toEqual([]);
    });

    it('has zero filter counts', () => {
      const state = useMatchStore.getState();
      expect(state.filterCounts).toEqual({
        all: 0,
        result: 0,
        live: 0,
        upcoming: 0,
      });
    });

    it('has "all" as default active filter', () => {
      const state = useMatchStore.getState();
      expect(state.activeFilter).toBe('all');
    });

    it('is not loading initially', () => {
      const state = useMatchStore.getState();
      expect(state.isLoading).toBe(false);
    });

    it('has no error initially', () => {
      const state = useMatchStore.getState();
      expect(state.error).toBeNull();
    });
  });

  describe('fetchMatches', () => {
    it('sets isLoading to true while fetching', async () => {
      const mockMatches = createMatchList();
      vi.mocked(matchService.getMatches).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(mockMatches), 100))
      );

      const fetchPromise = useMatchStore.getState().fetchMatches();

      // Check loading state immediately
      expect(useMatchStore.getState().isLoading).toBe(true);

      await fetchPromise;
    });

    it('populates matches on success', async () => {
      const mockMatches = createMatchList();
      vi.mocked(matchService.getMatches).mockResolvedValue(mockMatches);

      await useMatchStore.getState().fetchMatches();

      const state = useMatchStore.getState();
      expect(state.matches.length).toBe(mockMatches.length);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('calculates filter counts correctly', async () => {
      const mockMatches = [
        createLiveMatch(),
        createFinishedMatch(),
        createPrematchMatch(),
      ];
      vi.mocked(matchService.getMatches).mockResolvedValue(mockMatches);

      await useMatchStore.getState().fetchMatches();

      const state = useMatchStore.getState();
      expect(state.filterCounts.all).toBe(3);
      expect(state.filterCounts.live).toBe(1);
      expect(state.filterCounts.result).toBe(1);
      expect(state.filterCounts.upcoming).toBe(1);
    });

    it('sorts matches with live first', async () => {
      const prematch = createPrematchMatch();
      const live = createLiveMatch();
      const finished = createFinishedMatch();
      vi.mocked(matchService.getMatches).mockResolvedValue([finished, prematch, live]);

      await useMatchStore.getState().fetchMatches();

      const state = useMatchStore.getState();
      expect(state.matches[0].status.type).toBe('inprogress');
    });

    it('sets error on failure', async () => {
      vi.mocked(matchService.getMatches).mockRejectedValue(new Error('Network error'));

      await useMatchStore.getState().fetchMatches();

      const state = useMatchStore.getState();
      expect(state.error).toBe('Network error');
      expect(state.isLoading).toBe(false);
    });

    it('handles non-Error objects in catch', async () => {
      vi.mocked(matchService.getMatches).mockRejectedValue('String error');

      await useMatchStore.getState().fetchMatches();

      const state = useMatchStore.getState();
      expect(state.error).toBe('An unexpected error occurred');
    });

    it('prevents duplicate requests while loading', async () => {
      const mockMatches = createMatchList();
      vi.mocked(matchService.getMatches).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(mockMatches), 100))
      );

      // Start first fetch
      const fetch1 = useMatchStore.getState().fetchMatches();
      // Try to start second fetch while first is in progress
      const fetch2 = useMatchStore.getState().fetchMatches();

      await Promise.all([fetch1, fetch2]);

      // Should only have called getMatches once
      expect(matchService.getMatches).toHaveBeenCalledTimes(1);
    });

    it('clears error on successful fetch after failure', async () => {
      // First, cause an error
      vi.mocked(matchService.getMatches).mockRejectedValueOnce(new Error('First error'));
      await useMatchStore.getState().fetchMatches();
      expect(useMatchStore.getState().error).toBe('First error');

      // Reset loading state
      useMatchStore.setState({ isLoading: false });

      // Then succeed
      vi.mocked(matchService.getMatches).mockResolvedValueOnce(createMatchList());
      await useMatchStore.getState().fetchMatches();
      expect(useMatchStore.getState().error).toBeNull();
    });
  });

  describe('setActiveFilter', () => {
    it('updates active filter', async () => {
      const mockMatches = createMatchList();
      vi.mocked(matchService.getMatches).mockResolvedValue(mockMatches);
      await useMatchStore.getState().fetchMatches();

      useMatchStore.getState().setActiveFilter('live');

      expect(useMatchStore.getState().activeFilter).toBe('live');
    });

    it('filters matches correctly for "live"', async () => {
      const mockMatches = [
        createLiveMatch(),
        createFinishedMatch(),
        createPrematchMatch(),
      ];
      vi.mocked(matchService.getMatches).mockResolvedValue(mockMatches);
      await useMatchStore.getState().fetchMatches();

      useMatchStore.getState().setActiveFilter('live');

      const state = useMatchStore.getState();
      expect(state.filteredMatches).toHaveLength(1);
      expect(state.filteredMatches[0].status.type).toBe('inprogress');
    });

    it('filters matches correctly for "result"', async () => {
      const mockMatches = [
        createLiveMatch(),
        createFinishedMatch(),
        createPrematchMatch(),
      ];
      vi.mocked(matchService.getMatches).mockResolvedValue(mockMatches);
      await useMatchStore.getState().fetchMatches();

      useMatchStore.getState().setActiveFilter('result');

      const state = useMatchStore.getState();
      expect(state.filteredMatches).toHaveLength(1);
      expect(state.filteredMatches[0].status.type).toBe('finished');
    });

    it('filters matches correctly for "upcoming"', async () => {
      const mockMatches = [
        createLiveMatch(),
        createFinishedMatch(),
        createPrematchMatch(),
      ];
      vi.mocked(matchService.getMatches).mockResolvedValue(mockMatches);
      await useMatchStore.getState().fetchMatches();

      useMatchStore.getState().setActiveFilter('upcoming');

      const state = useMatchStore.getState();
      expect(state.filteredMatches).toHaveLength(1);
      expect(state.filteredMatches[0].status.type).toBe('notstarted');
    });

    it('shows all matches for "all" filter', async () => {
      const mockMatches = createMatchList();
      vi.mocked(matchService.getMatches).mockResolvedValue(mockMatches);
      await useMatchStore.getState().fetchMatches();

      // First filter to something else
      useMatchStore.getState().setActiveFilter('live');
      // Then back to all
      useMatchStore.getState().setActiveFilter('all');

      const state = useMatchStore.getState();
      expect(state.filteredMatches.length).toBe(mockMatches.length);
    });
  });

  describe('reset', () => {
    it('resets to initial state', async () => {
      const mockMatches = createMatchList();
      vi.mocked(matchService.getMatches).mockResolvedValue(mockMatches);
      await useMatchStore.getState().fetchMatches();
      useMatchStore.getState().setActiveFilter('live');

      useMatchStore.getState().reset();

      const state = useMatchStore.getState();
      expect(state.matches).toEqual([]);
      expect(state.filteredMatches).toEqual([]);
      expect(state.activeFilter).toBe('all');
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('clears service cache', async () => {
      useMatchStore.getState().reset();
      expect(matchService.clearCache).toHaveBeenCalled();
    });
  });

  describe('selectors', () => {
    it('selectFilteredMatches returns filtered matches', async () => {
      const mockMatches = createMatchList();
      vi.mocked(matchService.getMatches).mockResolvedValue(mockMatches);
      await useMatchStore.getState().fetchMatches();

      const filteredMatches = selectFilteredMatches(useMatchStore.getState());
      expect(filteredMatches).toEqual(useMatchStore.getState().filteredMatches);
    });

    it('selectFilterCounts returns filter counts', async () => {
      const mockMatches = createMatchList();
      vi.mocked(matchService.getMatches).mockResolvedValue(mockMatches);
      await useMatchStore.getState().fetchMatches();

      const counts = selectFilterCounts(useMatchStore.getState());
      expect(counts).toEqual(useMatchStore.getState().filterCounts);
    });

    it('selectActiveFilter returns active filter', () => {
      expect(selectActiveFilter(useMatchStore.getState())).toBe('all');
    });

    it('selectIsLoading returns loading state', () => {
      expect(selectIsLoading(useMatchStore.getState())).toBe(false);
    });

    it('selectError returns error state', () => {
      expect(selectError(useMatchStore.getState())).toBeNull();
    });
  });
});
