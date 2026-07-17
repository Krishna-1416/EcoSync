import { render, screen } from '@testing-library/react';
import LandingPage from '../app/page';

describe('Landing Page', () => {
  it('renders the main hero heading correctly', () => {
    render(<LandingPage />);
    const heading = screen.getByRole('heading', { name: /Your Stadium. Perfectly Guided./i });
    expect(heading).toBeInTheDocument();
  });

  it('renders the Enter the Hub link', () => {
    render(<LandingPage />);
    const link = screen.getByRole('link', { name: /Enter the Hub/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/hub');
  });

  it('renders all feature bento sections', () => {
    render(<LandingPage />);
    expect(screen.getByText('GenAI Concierge')).toBeInTheDocument();
    expect(screen.getByText('Precision Navigation')).toBeInTheDocument();
    expect(screen.getByText('Smart Transit')).toBeInTheDocument();
  });
});
