import { describe, expect, it } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { Spinner } from '../Spinner';

describe('Spinner', () => {
  it('renders without crashing', () => {
    render(<Spinner />);
    // The spinner should render with the wrapper and circle
    const wrapper = document.querySelector('div');
    expect(wrapper).toBeInTheDocument();
  });

  it('has centered content', () => {
    const { container } = render(<Spinner />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveStyle({
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    });
  });
});
