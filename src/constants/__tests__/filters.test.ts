import { describe, expect, it } from 'vitest';
import {
  FILTER_OPTIONS,
  FILTER_TO_STATUS_TYPE,
  STATUS_TYPE_TO_FILTER,
} from '../filters';

describe('FILTER_OPTIONS', () => {
  it('has 4 filter options', () => {
    expect(FILTER_OPTIONS).toHaveLength(4);
  });

  it('contains "all" filter with null statusType', () => {
    const allFilter = FILTER_OPTIONS.find((f) => f.id === 'all');
    expect(allFilter).toBeDefined();
    expect(allFilter?.statusType).toBeNull();
  });

  it('contains "result" filter with "finished" statusType', () => {
    const resultFilter = FILTER_OPTIONS.find((f) => f.id === 'result');
    expect(resultFilter).toBeDefined();
    expect(resultFilter?.statusType).toBe('finished');
  });

  it('contains "live" filter with "inprogress" statusType', () => {
    const liveFilter = FILTER_OPTIONS.find((f) => f.id === 'live');
    expect(liveFilter).toBeDefined();
    expect(liveFilter?.statusType).toBe('inprogress');
  });

  it('contains "upcoming" filter with "notstarted" statusType', () => {
    const upcomingFilter = FILTER_OPTIONS.find((f) => f.id === 'upcoming');
    expect(upcomingFilter).toBeDefined();
    expect(upcomingFilter?.statusType).toBe('notstarted');
  });
});

describe('STATUS_TYPE_TO_FILTER', () => {
  it('maps "finished" to "result"', () => {
    expect(STATUS_TYPE_TO_FILTER.finished).toBe('result');
  });

  it('maps "inprogress" to "live"', () => {
    expect(STATUS_TYPE_TO_FILTER.inprogress).toBe('live');
  });

  it('maps "notstarted" to "upcoming"', () => {
    expect(STATUS_TYPE_TO_FILTER.notstarted).toBe('upcoming');
  });

  it('covers all match status types', () => {
    const statusTypes = ['finished', 'inprogress', 'notstarted'] as const;
    for (const status of statusTypes) {
      expect(STATUS_TYPE_TO_FILTER[status]).toBeDefined();
    }
  });
});

describe('FILTER_TO_STATUS_TYPE', () => {
  it('maps "result" to "finished"', () => {
    expect(FILTER_TO_STATUS_TYPE.result).toBe('finished');
  });

  it('maps "live" to "inprogress"', () => {
    expect(FILTER_TO_STATUS_TYPE.live).toBe('inprogress');
  });

  it('maps "upcoming" to "notstarted"', () => {
    expect(FILTER_TO_STATUS_TYPE.upcoming).toBe('notstarted');
  });

  it('covers all non-all filters', () => {
    const filters = ['result', 'live', 'upcoming'] as const;
    for (const filter of filters) {
      expect(FILTER_TO_STATUS_TYPE[filter]).toBeDefined();
    }
  });
});

describe('bidirectional mapping', () => {
  it('STATUS_TYPE_TO_FILTER and FILTER_TO_STATUS_TYPE are inverse mappings for primary types', () => {
    // Skip 'canceled' as it maps to 'result' but 'result' maps back to 'finished'
    const primaryStatusTypes = ['finished', 'inprogress', 'notstarted'] as const;
    for (const status of primaryStatusTypes) {
      const filter = STATUS_TYPE_TO_FILTER[status];
      expect(FILTER_TO_STATUS_TYPE[filter as keyof typeof FILTER_TO_STATUS_TYPE]).toBe(status);
    }
  });

  it('maps canceled status to result filter', () => {
    expect(STATUS_TYPE_TO_FILTER.canceled).toBe('result');
  });
});
