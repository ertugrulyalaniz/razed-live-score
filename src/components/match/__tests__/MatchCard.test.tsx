import { describe, expect, it } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { MatchCard } from '../MatchCard';
import {
  createCanceledMatch,
  createFinishedMatch,
  createHalftimeMatch,
  createLiveMatch,
  createPrematchMatch,
} from '@/test/mocks/match.mock';

describe('MatchCard', () => {
  describe('basic rendering', () => {
    it('renders with data-testid', () => {
      const match = createLiveMatch();
      render(<MatchCard match={match} />);
      expect(screen.getByTestId('match-card')).toBeInTheDocument();
    });

    it('displays team names', () => {
      const match = createLiveMatch();
      render(<MatchCard match={match} />);
      expect(screen.getByText('Team A')).toBeInTheDocument();
      expect(screen.getByText('Team B')).toBeInTheDocument();
    });

    it('displays competition name', () => {
      const match = createLiveMatch();
      render(<MatchCard match={match} />);
      expect(screen.getByText('Test League')).toBeInTheDocument();
    });

    it('displays country', () => {
      const match = createLiveMatch();
      render(<MatchCard match={match} />);
      expect(screen.getByText('Test Country')).toBeInTheDocument();
    });
  });

  describe('live match', () => {
    it('displays LIVE status badge', () => {
      const match = createLiveMatch();
      render(<MatchCard match={match} />);
      expect(screen.getByText('LIVE')).toBeInTheDocument();
    });

    it('displays live scores', () => {
      const match = createLiveMatch();
      render(<MatchCard match={match} />);
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('renders live status indicator', () => {
      const match = createLiveMatch(45);
      render(<MatchCard match={match} />);
      expect(screen.getByTestId('status-live')).toBeInTheDocument();
    });
  });

  describe('finished match', () => {
    it('displays ENDED status badge', () => {
      const match = createFinishedMatch();
      render(<MatchCard match={match} />);
      expect(screen.getByText('ENDED')).toBeInTheDocument();
    });

    it('displays final scores', () => {
      const match = createFinishedMatch();
      render(<MatchCard match={match} />);
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('renders finished status indicator', () => {
      const match = createFinishedMatch();
      render(<MatchCard match={match} />);
      expect(screen.getByTestId('status-finished')).toBeInTheDocument();
    });
  });

  describe('halftime match', () => {
    it('displays HALF TIME status badge', () => {
      const match = createHalftimeMatch();
      render(<MatchCard match={match} />);
      expect(screen.getByText('HALF TIME')).toBeInTheDocument();
    });

    it('renders halftime status indicator', () => {
      const match = createHalftimeMatch();
      render(<MatchCard match={match} />);
      expect(screen.getByTestId('status-halftime')).toBeInTheDocument();
    });
  });

  describe('prematch', () => {
    it('displays date and time', () => {
      const match = createPrematchMatch();
      render(<MatchCard match={match} />);
      // Should contain month and time format
      const statusBadge = screen.getByText(/TH/); // Date format includes TH
      expect(statusBadge).toBeInTheDocument();
    });

    it('displays 0-0 score', () => {
      const match = createPrematchMatch();
      render(<MatchCard match={match} />);
      const zeros = screen.getAllByText('0');
      expect(zeros.length).toBe(2);
    });

    it('renders prematch status indicator', () => {
      const match = createPrematchMatch();
      render(<MatchCard match={match} />);
      expect(screen.getByTestId('status-prematch')).toBeInTheDocument();
    });
  });

  describe('canceled match', () => {
    it('displays CANCELED status badge', () => {
      const match = createCanceledMatch();
      render(<MatchCard match={match} />);
      expect(screen.getByText('CANCELED')).toBeInTheDocument();
    });

    it('renders canceled status indicator', () => {
      const match = createCanceledMatch();
      render(<MatchCard match={match} />);
      expect(screen.getByTestId('status-canceled')).toBeInTheDocument();
    });
  });

  describe('score display', () => {
    it('displays score separator', () => {
      const match = createLiveMatch();
      render(<MatchCard match={match} />);
      expect(screen.getByText('-')).toBeInTheDocument();
    });
  });
});
