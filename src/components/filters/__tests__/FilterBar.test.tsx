import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import { FilterBar } from '../FilterBar';
import type { FilterCounts, FilterType } from '@/types';

describe('FilterBar', () => {
  const defaultCounts: FilterCounts = {
    all: 10,
    result: 3,
    live: 2,
    upcoming: 5,
  };

  const defaultProps = {
    activeFilter: 'all' as FilterType,
    counts: defaultCounts,
    onFilterChange: vi.fn(),
  };

  it('renders all filter options', () => {
    render(<FilterBar {...defaultProps} />);
    expect(screen.getByTestId('filter-all')).toBeInTheDocument();
    expect(screen.getByTestId('filter-result')).toBeInTheDocument();
    expect(screen.getByTestId('filter-live')).toBeInTheDocument();
    expect(screen.getByTestId('filter-upcoming')).toBeInTheDocument();
  });

  it('renders Filters title', () => {
    render(<FilterBar {...defaultProps} />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Filters');
  });

  it('has role="tablist"', () => {
    render(<FilterBar {...defaultProps} />);
    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });

  it('has aria-label for accessibility', () => {
    render(<FilterBar {...defaultProps} />);
    expect(screen.getByRole('tablist')).toHaveAttribute('aria-label', 'Match filters');
  });

  it('displays correct counts for each filter', () => {
    render(<FilterBar {...defaultProps} />);
    expect(screen.getByText('10')).toBeInTheDocument(); // all
    expect(screen.getByText('3')).toBeInTheDocument(); // result
    expect(screen.getByText('2')).toBeInTheDocument(); // live
    expect(screen.getByText('5')).toBeInTheDocument(); // upcoming
  });

  it('calls onFilterChange when filter is clicked', async () => {
    const onFilterChange = vi.fn();
    render(<FilterBar {...defaultProps} onFilterChange={onFilterChange} />);

    await userEvent.click(screen.getByTestId('filter-live'));
    expect(onFilterChange).toHaveBeenCalledWith('live');
  });

  it('marks active filter correctly', () => {
    render(<FilterBar {...defaultProps} activeFilter="live" />);
    const liveTab = screen.getByTestId('filter-live');
    expect(liveTab).toHaveAttribute('aria-selected', 'true');
  });

  it('marks inactive filters correctly', () => {
    render(<FilterBar {...defaultProps} activeFilter="live" />);
    const allTab = screen.getByTestId('filter-all');
    expect(allTab).toHaveAttribute('aria-selected', 'false');
  });

  it('updates when activeFilter changes', () => {
    const { rerender } = render(<FilterBar {...defaultProps} activeFilter="all" />);
    expect(screen.getByTestId('filter-all')).toHaveAttribute('aria-selected', 'true');

    rerender(<FilterBar {...defaultProps} activeFilter="result" />);
    expect(screen.getByTestId('filter-result')).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByTestId('filter-all')).toHaveAttribute('aria-selected', 'false');
  });
});
