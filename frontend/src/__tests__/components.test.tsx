import { render, screen, fireEvent } from '@testing-library/react';
import { Navbar } from '../components/Navbar';
import { ChatInterface } from '../components/ChatInterface';

// Mock fetch for the ChatInterface
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true, data: { reply: 'Mocked reply' } }),
  })
) as jest.Mock;

describe('Frontend Components', () => {
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
      expect(screen.getByPlaceholderText(/Ask about navigation, food, or transit/i)).toBeInTheDocument();
      expect(screen.getByText(/Hello! I'm your Stadium AI Concierge/i)).toBeInTheDocument();
    });

    it('updates input value on change and disables send button when empty', () => {
      render(<ChatInterface />);
      const input = screen.getByPlaceholderText(/Ask about navigation, food, or transit/i);
      const button = screen.getByRole('button', { name: /Send message/i });

      expect(button).toBeDisabled();

      fireEvent.change(input, { target: { value: 'Where is my seat?' } });
      expect(input).toHaveValue('Where is my seat?');
      expect(button).not.toBeDisabled();
    });
  });
});
