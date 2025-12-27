import { describe, expect, it } from 'vitest';
import { formatMatchDate, formatMatchTime } from '../date.utils';

describe('formatMatchTime', () => {
  it('formats time in 24-hour format', () => {
    // Unix timestamp for 2024-01-15 14:30:00 UTC
    const timestamp = 1705329000;
    const result = formatMatchTime(timestamp);
    // Result depends on local timezone, but should be in HH:MM format
    expect(result).toMatch(/^\d{2}:\d{2}$/);
  });

  it('pads single-digit hours and minutes', () => {
    // Use a timestamp that gives consistent format
    const timestamp = 1705329000;
    const result = formatMatchTime(timestamp);
    expect(result.length).toBe(5);
    expect(result[2]).toBe(':');
  });

  it('handles midnight correctly', () => {
    // Unix timestamp for 2024-01-15 00:00:00 UTC
    const timestamp = 1705276800;
    const result = formatMatchTime(timestamp);
    expect(result).toMatch(/^\d{2}:\d{2}$/);
  });

  it('handles noon correctly', () => {
    // Unix timestamp for 2024-01-15 12:00:00 UTC
    const timestamp = 1705320000;
    const result = formatMatchTime(timestamp);
    expect(result).toMatch(/^\d{2}:\d{2}$/);
  });
});

describe('formatMatchDate', () => {
  it('formats date in DD/MM/YYYY format', () => {
    // Unix timestamp for 2024-01-15 14:30:00 UTC
    const timestamp = 1705329000;
    const result = formatMatchDate(timestamp);
    // Result should be in DD/MM/YYYY format
    expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
  });

  it('pads single-digit days and months', () => {
    // Unix timestamp for 2024-01-05
    const timestamp = 1704412800;
    const result = formatMatchDate(timestamp);
    expect(result.length).toBe(10);
  });

  it('handles year correctly', () => {
    // Unix timestamp for 2024-12-31
    const timestamp = 1735603200;
    const result = formatMatchDate(timestamp);
    expect(result).toContain('2024');
  });

  it('handles different months', () => {
    // Unix timestamp for 2024-06-15
    const timestamp = 1718409600;
    const result = formatMatchDate(timestamp);
    expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
  });
});
