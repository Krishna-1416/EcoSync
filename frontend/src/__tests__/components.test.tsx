import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Navbar } from '../components/Navbar';
import { ChatInterface } from '../components/ChatInterface';

/**
 * Frontend Component Tests
 * Tests the key UI components of the Stadium Volunteer Co-Pilot for FIFA World Cup 2026.
 */

// Mock fetch globally so tests are fast & deterministic
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('Frontend Components', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    sessionStorage.clear();
  });

  // --- Navbar ---
  describe('Navbar Component', () => {
    it('renders all primary navigation links', () => {
      render(<Navbar />);
      expect(screen.getByRole('link', { name: /Home/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Hub/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Navigate/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Transit/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Amenities/i })).toBeInTheDocument();
    });

    it('all nav links have valid href attributes', () => {
      render(<Navbar />);
      const links = screen.getAllByRole('link');
      links.forEach((link) => {
        expect(link).toHaveAttribute('href');
        expect(link.getAttribute('href')).not.toBe('');
      });
    });
  });

  // --- ChatInterface ---
  describe('ChatInterface Component', () => {
    it('renders the welcome message and input field on mount', () => {
      render(<ChatInterface />);
      expect(screen.getByPlaceholderText(/Ask about crowd conditions/i)).toBeInTheDocument();
      expect(screen.getByText(/Hello! I'm your Volunteer Co-Pilot/i)).toBeInTheDocument();
    });

    it('send button is disabled when input is empty', () => {
      render(<ChatInterface />);
      const button = screen.getByRole('button', { name: /Send message/i });
      expect(button).toBeDisabled();
    });

    it('send button becomes enabled when user types a message', () => {
      render(<ChatInterface />);
      const input = screen.getByPlaceholderText(/Ask about crowd conditions/i);
      const button = screen.getByRole('button', { name: /Send message/i });
      fireEvent.change(input, { target: { value: 'Where is medical?' } });
      expect(button).not.toBeDisabled();
    });

    it('input value updates correctly on user typing', () => {
      render(<ChatInterface />);
      const input = screen.getByPlaceholderText(/Ask about crowd conditions/i);
      fireEvent.change(input, { target: { value: 'Where is the medical tent?' } });
      expect(input).toHaveValue('Where is the medical tent?');
    });

    it('handles network failure gracefully — shows offline fallback (Edge Case)', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));
      render(<ChatInterface />);
      const input = screen.getByPlaceholderText(/Ask about crowd conditions/i);
      const button = screen.getByRole('button', { name: /Send message/i });

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText(/I can help you find your seat/i)).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it('displays the API reply on successful submission', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, data: { reply: 'Go to Gate C — it is clear.' } }),
      });
      render(<ChatInterface />);
      const input = screen.getByPlaceholderText(/Ask about crowd conditions/i);
      const button = screen.getByRole('button', { name: /Send message/i });

      fireEvent.change(input, { target: { value: 'Best exit?' } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText(/Go to Gate C — it is clear./i)).toBeInTheDocument();
      });
    });

    it('shows offline fallback when backend returns non-ok response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 503,
      });
      render(<ChatInterface />);
      const input = screen.getByPlaceholderText(/Ask about crowd conditions/i);
      fireEvent.change(input, { target: { value: 'transit info' } });
      fireEvent.click(screen.getByRole('button', { name: /Send message/i }));

      await waitFor(() => {
        // Offline fallback for 'transit' contains metro/south
        expect(screen.getByText(/Metro is running normally|I can help you find your seat/i)).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it('uses sessionStorage cache on repeated queries (no extra fetch)', async () => {
      // Pre-seed the cache
      sessionStorage.setItem('chat_cache_cached query', 'Cached: go to Gate A');
      render(<ChatInterface />);

      const input = screen.getByPlaceholderText(/Ask about crowd conditions/i);
      fireEvent.change(input, { target: { value: 'cached query' } });
      fireEvent.click(screen.getByRole('button', { name: /Send message/i }));

      await waitFor(() => {
        expect(screen.getByText(/Cached: go to Gate A/i)).toBeInTheDocument();
      });
      // fetch should NOT have been called — cache was hit
      expect(mockFetch).not.toHaveBeenCalled();
    });

    // --- Accessibility ---
    it('chat input has an accessible aria-label', () => {
      render(<ChatInterface />);
      const input = screen.getByLabelText(/Chat message input/i);
      expect(input).toBeInTheDocument();
    });

    it('send button has an accessible aria-label', () => {
      render(<ChatInterface />);
      const button = screen.getByRole('button', { name: /Send message/i });
      expect(button).toBeInTheDocument();
    });
  });
});
