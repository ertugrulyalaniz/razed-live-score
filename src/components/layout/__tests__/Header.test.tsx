import { describe, expect, it } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { Header } from '../Header';

describe('Header', () => {
  it('renders title correctly', () => {
    render(<Header title="Test Title" />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Test Title');
  });

  it('renders subtitle when provided', () => {
    render(<Header title="Test Title" subtitle="Test Subtitle" />);
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
  });

  it('does not render subtitle when not provided', () => {
    render(<Header title="Test Title" />);
    expect(screen.queryByText('Test Subtitle')).not.toBeInTheDocument();
  });

  it('renders header element', () => {
    render(<Header title="Test Title" />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('renders different titles', () => {
    const { rerender } = render(<Header title="First Title" />);
    expect(screen.getByRole('heading')).toHaveTextContent('First Title');

    rerender(<Header title="Second Title" />);
    expect(screen.getByRole('heading')).toHaveTextContent('Second Title');
  });
});
