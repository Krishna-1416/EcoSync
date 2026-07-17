import { render, screen } from '@testing-library/react';
import NavigationPage from '../app/navigation/page';
import HubPage from '../app/hub/page';

describe('Frontend Pages', () => {
  describe('Navigation Page', () => {
    it('renders the header and map mock', () => {
      render(<NavigationPage />);
      expect(screen.getByRole('heading', { name: /Precision Navigation/i })).toBeInTheDocument();
      expect(screen.getByText(/Gate to Seat Routing/i)).toBeInTheDocument();
      expect(screen.getByText(/Section 104, Row G/i)).toBeInTheDocument();
    });
  });

  describe('Hub Page', () => {
    it('renders the hub dashboard layout correctly', () => {
      render(<HubPage />);
      expect(screen.getByRole('heading', { name: /Welcome to Stadium AI/i })).toBeInTheDocument();
      // Test for specific elements rendered by BentoCard in the hub
      expect(screen.getByText(/Find My Seat/i)).toBeInTheDocument();
      expect(screen.getByText(/^Transit$/i)).toBeInTheDocument();
    });
  });
});
