import type { Match } from '@/types';

const DATA_URL = '/data/sports.json';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const FETCH_TIMEOUT_MS = 10 * 1000; // 10 seconds

export class MatchServiceError extends Error {
  constructor(
    message: string,
    public readonly code: 'NETWORK_ERROR' | 'HTTP_ERROR' | 'PARSE_ERROR' | 'TIMEOUT_ERROR',
    public readonly statusCode?: number
  ) {
    super(message);
    this.name = 'MatchServiceError';
  }
}

class MatchService {
  private cache: Match[] | null = null;
  private cacheTimestamp: number | null = null;

  private isCacheValid(): boolean {
    if (!this.cache || !this.cacheTimestamp) {
      return false;
    }
    return Date.now() - this.cacheTimestamp < CACHE_TTL_MS;
  }

  async getMatches(): Promise<Match[]> {
    if (this.isCacheValid() && this.cache) {
      return this.cache;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
      const response = await fetch(DATA_URL, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new MatchServiceError(
          `Failed to fetch matches: Server returned ${response.status}`,
          'HTTP_ERROR',
          response.status
        );
      }

      const data = await response.json();
      const matches: Match[] = Array.isArray(data) ? data : data.events || [];
      this.cache = matches;
      this.cacheTimestamp = Date.now();
      return matches;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof MatchServiceError) {
        throw error;
      }

      if (error instanceof Error && error.name === 'AbortError') {
        if (this.cache) {
          console.warn('Fetch timeout, returning stale cache');
          return this.cache;
        }
        throw new MatchServiceError(
          'Request timed out. Please check your connection and try again.',
          'TIMEOUT_ERROR'
        );
      }

      console.error('Failed to fetch matches:', error);

      if (this.cache) {
        console.warn('Fetch failed, returning stale cache');
        return this.cache;
      }

      throw new MatchServiceError(
        'Unable to load matches. Please check your connection and try again.',
        'NETWORK_ERROR'
      );
    }
  }

  clearCache(): void {
    this.cache = null;
    this.cacheTimestamp = null;
  }
}

export const matchService = new MatchService();
