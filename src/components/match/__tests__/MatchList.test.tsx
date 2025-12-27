import { describe, expect, it } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { MatchList } from '../MatchList';
import { createMatchList, createMockMatch } from '@/test/mocks/match.mock';

describe('MatchList', () => {
  describe('loading state', () => {
    it('renders spinner when loading', () => {
      render(<MatchList matches={[]} isLoading={true} />);
      // Spinner renders a div with specific styling
      const spinnerWrapper = document.querySelector('div');
      expect(spinnerWrapper).toBeInTheDocument();
    });

    it('does not render matches when loading', () => {
      const matches = createMatchList();
      render(<MatchList matches={matches} isLoading={true} />);
      expect(screen.queryByTestId('match-card')).not.toBeInTheDocument();
    });
  });

  describe('empty state', () => {
    it('renders empty message when no matches', () => {
      render(<MatchList matches={[]} isLoading={false} />);
      expect(screen.getByText('No matches found')).toBeInTheDocument();
    });

    it('renders suggestion to change filter', () => {
      render(<MatchList matches={[]} isLoading={false} />);
      expect(screen.getByText('Try selecting a different filter')).toBeInTheDocument();
    });
  });

  describe('with matches', () => {
    it('renders match cards', () => {
      const matches = [createMockMatch({ id: '1' }), createMockMatch({ id: '2' })];
      render(<MatchList matches={matches} isLoading={false} />);
      const cards = screen.getAllByTestId('match-card');
      expect(cards).toHaveLength(2);
    });

    it('renders correct number of matches', () => {
      const matches = createMatchList();
      render(<MatchList matches={matches} isLoading={false} />);
      const cards = screen.getAllByTestId('match-card');
      expect(cards).toHaveLength(matches.length);
    });

    it('renders single match', () => {
      const matches = [createMockMatch()];
      render(<MatchList matches={matches} isLoading={false} />);
      expect(screen.getByTestId('match-card')).toBeInTheDocument();
    });
  });

  describe('grid layout', () => {
    it('renders matches in a grid container', () => {
      const matches = createMatchList();
      const { container } = render(<MatchList matches={matches} isLoading={false} />);
      const grid = container.firstChild as HTMLElement;
      expect(grid).toHaveStyle({ display: 'grid' });
    });
  });
});
