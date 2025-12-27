import { describe, expect, it } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { Container } from '../Container';

describe('Container', () => {
  it('renders children correctly', () => {
    render(
      <Container>
        <span data-testid="child">Test Content</span>
      </Container>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders multiple children', () => {
    render(
      <Container>
        <span data-testid="child-1">First</span>
        <span data-testid="child-2">Second</span>
      </Container>
    );
    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
  });

  it('applies max-width styling', () => {
    const { container } = render(
      <Container>
        <span>Content</span>
      </Container>
    );
    const styledContainer = container.firstChild as HTMLElement;
    expect(styledContainer).toHaveStyle({ maxWidth: '1280px' });
  });

  it('centers content with auto margins', () => {
    const { container } = render(
      <Container>
        <span>Content</span>
      </Container>
    );
    const styledContainer = container.firstChild as HTMLElement;
    expect(styledContainer).toHaveStyle({ margin: '0px auto' });
  });
});
