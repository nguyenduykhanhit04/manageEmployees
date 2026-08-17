import { render } from '@testing-library/react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

describe('Layout Component Snapshots', () => {
  it('renders Header unchanged', () => {
    const { container } = render(<Header />);
    expect(container).toMatchSnapshot();
  });

  it('renders Footer unchanged', () => {
    const { container } = render(<Footer />);
    expect(container).toMatchSnapshot();
  });
});

