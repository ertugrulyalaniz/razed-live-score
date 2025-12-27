import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import { FilterButton } from '../FilterButton';

describe('FilterButton', () => {
  const defaultProps = {
    label: 'All',
    count: 10,
    isActive: false,
    onClick: vi.fn(),
  };

  it('renders label correctly', () => {
    render(<FilterButton {...defaultProps} />);
    expect(screen.getByText('All')).toBeInTheDocument();
  });

  it('renders count correctly', () => {
    render(<FilterButton {...defaultProps} count={25} />);
    expect(screen.getByText('25')).toBeInTheDocument();
  });

  it('has correct test id', () => {
    render(<FilterButton {...defaultProps} label="Live" />);
    expect(screen.getByTestId('filter-live')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<FilterButton {...defaultProps} onClick={onClick} />);

    await userEvent.click(screen.getByRole('tab'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('has role="tab"', () => {
    render(<FilterButton {...defaultProps} />);
    expect(screen.getByRole('tab')).toBeInTheDocument();
  });

  it('has aria-selected=true when active', () => {
    render(<FilterButton {...defaultProps} isActive={true} />);
    expect(screen.getByRole('tab')).toHaveAttribute('aria-selected', 'true');
  });

  it('has aria-selected=false when not active', () => {
    render(<FilterButton {...defaultProps} isActive={false} />);
    expect(screen.getByRole('tab')).toHaveAttribute('aria-selected', 'false');
  });

  it('renders with zero count', () => {
    render(<FilterButton {...defaultProps} count={0} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('converts label to lowercase for testid', () => {
    render(<FilterButton {...defaultProps} label="Upcoming" />);
    expect(screen.getByTestId('filter-upcoming')).toBeInTheDocument();
  });
});
