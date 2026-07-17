import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Navbar } from '../components/Navbar';
import { ChatInterface } from '../components/ChatInterface';

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('Frontend Components', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    sessionStorage.clear();
  });

  describe('Navbar Component', () => {
    it('renders all navigation links correctly', () => {
      render(<Navbar />);
      expect(screen.getByRole('link', { name: /Home/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Hub/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Navigate/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Transit/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Amenities/i })).toBeInTheDocument();
    });
  });

  describe('ChatInterface Component', () => {
    it('renders the chat input and initial message', () => {
      render(<ChatInterface />);
      expect(screen.getByPlaceholderText(/Ask about crowd conditions/i)).toBeInTheDocument();
      expect(screen.getByText(/Hello! I'm your Volunteer Co-Pilot/i)).toBeInTheDocument();
    });

    it('updates input value on change and disables send button when empty', () => {
      render(<ChatInterface />);
      const input = screen.getByPlaceholderText(/Ask about crowd conditions/i);
      const button = screen.getByRole('button', { name: /Send message/i });

      expect(button).toBeDisabled();

      fireEvent.change(input, { target: { value: 'Where is the medical tent?' } });
      expect(input).toHaveValue('Where is the medical tent?');
      expect(button).not.toBeDisabled();
    });

    it('handles network failure gracefully (Edge Case)', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));
      
      render(<ChatInterface />);
      const input = screen.getByPlaceholderText(/Ask about crowd conditions/i);
      const button = screen.getByRole('button', { name: /Send message/i });

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.click(button);

      // Should show the fallback message after 800ms
      await waitFor(() => {
        expect(screen.getByText(/I can help you find your seat/i)).toBeInTheDocument();
      }, { timeout: 1500 });
    });
    
    it('handles successful chat submission', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, data: { reply: 'API response' } }),
      });
      
      render(<ChatInterface />);
      const input = screen.getByPlaceholderText(/Ask about crowd conditions/i);
      const button = screen.getByRole('button', { name: /Send message/i });

      fireEvent.change(input, { target: { value: 'Real message' } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText(/API response/i)).toBeInTheDocument();
      });
    });
  });
});
