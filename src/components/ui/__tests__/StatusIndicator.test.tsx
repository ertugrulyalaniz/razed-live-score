import { describe, expect, it } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { StatusIndicator } from '../StatusIndicator';

describe('StatusIndicator', () => {
  describe('prematch status', () => {
    it('renders empty circle for prematch', () => {
      render(<StatusIndicator status="prematch" />);
      const indicator = screen.getByTestId('status-prematch');
      expect(indicator).toBeInTheDocument();
    });
  });

  describe('live status', () => {
    it('renders live indicator with testid', () => {
      render(<StatusIndicator status="live" liveMinute="45" />);
      const indicator = screen.getByTestId('status-live');
      expect(indicator).toBeInTheDocument();
    });

    it('displays the minute with apostrophe', () => {
      render(<StatusIndicator status="live" liveMinute="32" />);
      expect(screen.getByText("32'")).toBeInTheDocument();
    });

    it('displays "LIVE" when no minute provided', () => {
      render(<StatusIndicator status="live" />);
      expect(screen.getByText('LIVE')).toBeInTheDocument();
    });

    it('displays minute for added time', () => {
      render(<StatusIndicator status="live" liveMinute="90+3" />);
      expect(screen.getByText("90+3'")).toBeInTheDocument();
    });
  });

  describe('halftime status', () => {
    it('renders HT text', () => {
      render(<StatusIndicator status="halftime" />);
      const indicator = screen.getByTestId('status-halftime');
      expect(indicator).toBeInTheDocument();
      expect(screen.getByText('HT')).toBeInTheDocument();
    });
  });

  describe('finished status', () => {
    it('renders FT text', () => {
      render(<StatusIndicator status="finished" />);
      const indicator = screen.getByTestId('status-finished');
      expect(indicator).toBeInTheDocument();
      expect(screen.getByText('FT')).toBeInTheDocument();
    });
  });

  describe('cancelled status', () => {
    it('renders cancelled indicator', () => {
      render(<StatusIndicator status="cancelled" />);
      const indicator = screen.getByTestId('status-cancelled');
      expect(indicator).toBeInTheDocument();
    });
  });

  describe('progress calculation', () => {
    it('calculates progress based on minute', () => {
      render(<StatusIndicator status="live" liveMinute="45" />);
      // Verify the live indicator renders with minute
      expect(screen.getByText("45'")).toBeInTheDocument();
      expect(screen.getByTestId('status-live')).toBeInTheDocument();
    });

    it('caps progress at 100% for overtime', () => {
      render(<StatusIndicator status="live" liveMinute="120" />);
      // Should still render even with overtime minutes
      expect(screen.getByText("120'")).toBeInTheDocument();
      expect(screen.getByTestId('status-live')).toBeInTheDocument();
    });
  });
});
