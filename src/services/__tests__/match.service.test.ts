import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MatchServiceError, matchService } from '../match.service';
import { createMatchList } from '@/test/mocks/match.mock';

// Store original fetch
const originalFetch = global.fetch;

describe('MatchService', () => {
  beforeEach(() => {
    // Clear cache before each test
    matchService.clearCache();
    vi.useFakeTimers();
  });

  afterEach(() => {
    // Restore fetch
    global.fetch = originalFetch;
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  describe('getMatches', () => {
    it('fetches data successfully', async () => {
      const mockMatches = createMatchList();
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockMatches),
      });

      const result = await matchService.getMatches();

      expect(result).toEqual(mockMatches);
      expect(fetch).toHaveBeenCalledWith('/data/sports.json', expect.any(Object));
    });

    it('handles data.events format', async () => {
      const mockMatches = createMatchList();
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ events: mockMatches }),
      });

      const result = await matchService.getMatches();

      expect(result).toEqual(mockMatches);
    });

    it('returns cached data on subsequent calls', async () => {
      const mockMatches = createMatchList();
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockMatches),
      });

      // First call
      await matchService.getMatches();
      // Second call - should use cache
      await matchService.getMatches();

      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('throws MatchServiceError on HTTP error', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      });

      await expect(matchService.getMatches()).rejects.toThrow(MatchServiceError);
      await expect(matchService.getMatches()).rejects.toMatchObject({
        code: 'HTTP_ERROR',
        statusCode: 500,
      });
    });

    it('throws MatchServiceError on network failure', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network failure'));

      await expect(matchService.getMatches()).rejects.toThrow(MatchServiceError);
      await expect(matchService.getMatches()).rejects.toMatchObject({
        code: 'NETWORK_ERROR',
      });
    });

    it('returns stale cache on network failure', async () => {
      const mockMatches = createMatchList();

      // First successful fetch
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockMatches),
      });
      await matchService.getMatches();

      // Advance time past TTL
      vi.advanceTimersByTime(6 * 60 * 1000); // 6 minutes

      // Network failure on refresh
      global.fetch = vi.fn().mockRejectedValue(new Error('Network failure'));

      // Should return stale cache
      const result = await matchService.getMatches();
      expect(result).toEqual(mockMatches);
    });

    it('throws on timeout when no cache available', async () => {
      // Use real timers for this test due to AbortController complexity
      vi.useRealTimers();

      // Create a fetch that immediately triggers an abort
      global.fetch = vi.fn().mockImplementation(() => {
        const error = new Error('Aborted');
        error.name = 'AbortError';
        return Promise.reject(error);
      });

      await expect(matchService.getMatches()).rejects.toThrow(MatchServiceError);
      await expect(matchService.getMatches()).rejects.toMatchObject({
        code: 'TIMEOUT_ERROR',
      });

      vi.useFakeTimers();
    });

    it('returns stale cache on timeout', async () => {
      const mockMatches = createMatchList();

      // First successful fetch
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockMatches),
      });
      await matchService.getMatches();

      // Advance time past TTL
      vi.advanceTimersByTime(6 * 60 * 1000);

      // Simulate timeout on refresh
      global.fetch = vi.fn().mockImplementation(() => {
        const error = new Error('Aborted');
        error.name = 'AbortError';
        return Promise.reject(error);
      });

      const result = await matchService.getMatches();
      expect(result).toEqual(mockMatches);
    });
  });

  describe('cache TTL', () => {
    it('uses cache within TTL', async () => {
      const mockMatches = createMatchList();
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockMatches),
      });

      // First call
      await matchService.getMatches();

      // Advance time but stay within TTL (5 minutes)
      vi.advanceTimersByTime(4 * 60 * 1000);

      // Second call - should use cache
      await matchService.getMatches();

      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('refetches after TTL expires', async () => {
      const mockMatches = createMatchList();
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockMatches),
      });

      // First call
      await matchService.getMatches();

      // Advance time past TTL (5 minutes)
      vi.advanceTimersByTime(6 * 60 * 1000);

      // Second call - should refetch
      await matchService.getMatches();

      expect(fetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('clearCache', () => {
    it('clears cached data', async () => {
      const mockMatches = createMatchList();
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockMatches),
      });

      // First call
      await matchService.getMatches();
      expect(fetch).toHaveBeenCalledTimes(1);

      // Clear cache
      matchService.clearCache();

      // Second call - should fetch again
      await matchService.getMatches();
      expect(fetch).toHaveBeenCalledTimes(2);
    });

    it('clears cache timestamp', async () => {
      const mockMatches = createMatchList();
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockMatches),
      });

      await matchService.getMatches();
      matchService.clearCache();

      // Advance time slightly
      vi.advanceTimersByTime(1000);

      await matchService.getMatches();

      // Should have fetched again since cache was cleared
      expect(fetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('MatchServiceError', () => {
    it('has correct properties', () => {
      const error = new MatchServiceError('Test message', 'HTTP_ERROR', 404);

      expect(error.message).toBe('Test message');
      expect(error.code).toBe('HTTP_ERROR');
      expect(error.statusCode).toBe(404);
      expect(error.name).toBe('MatchServiceError');
    });

    it('works without status code', () => {
      const error = new MatchServiceError('Test message', 'NETWORK_ERROR');

      expect(error.message).toBe('Test message');
      expect(error.code).toBe('NETWORK_ERROR');
      expect(error.statusCode).toBeUndefined();
    });
  });
});
