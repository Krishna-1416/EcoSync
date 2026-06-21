import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../app/page';
import TrackerPage from '../app/tracker/page';

describe('EcoSync Multi-Page Test Suites', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
    // Prevent un-mocked fetch from leaking to the network during non-Suite-C tests
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ co2_kg: 0, relatable_comparison: 'none', micro_nudge: 'none' }),
    } as Response);
  });

  // Suite A: Render test confirming the main UI loads without crashing.
  test('A) Render test: Main landing page loads title and key copy', () => {
    render(<Home />);

    // Assert main heading loads
    const heading = screen.getByRole('heading', { name: /Decarbonize your infrastructure/i });
    expect(heading).toBeInTheDocument();

    // Assert call to actions load
    const startLink = screen.getByRole('link', { name: /Access carbon footprint analyzer/i });
    expect(startLink).toBeInTheDocument();
  });

  // Suite B: State change test verifying UI updates upon high-emission inputs.
  test('B) State change test: Adding a high-emission preset item updates the tracker cart and emissions value', () => {
    render(<TrackerPage />);

    // Select the "Private Jet Flight (1hr)" preset button
    const privateJetBtn = screen.getByRole('button', { name: /Add preset action: Private Jet Flight \(1hr\)/i });
    expect(privateJetBtn).toBeInTheDocument(); // Cart.tsx PRESETS name updated to 'Private Jet Flight (1hr)'

    // Click to add
    fireEvent.click(privateJetBtn);

    // Verify cart header updates
    const cartHeader = screen.getByText(/Telemetry Array/i);
    expect(cartHeader).toBeInTheDocument();

    // Both aggregate header and per-item subtotal both show 2500.000 — assert both exist
    const co2Values = screen.getAllByText(/2500\.000/i);
    expect(co2Values.length).toBeGreaterThanOrEqual(2);

    // Verify item is listed in the cart (one assertion is sufficient)
    const itemTitle = screen.getByRole('heading', { name: /Private Jet Flight \(1hr\)/i });
    expect(itemTitle).toBeInTheDocument();
  });

  // Suite C: API error test confirming fallback UI renders when fetch fails.
  test('C) API error test: Mocks fetch failure and verifies error alert rendering', async () => {
    // Backup original fetch if it exists
    const originalFetch = global.fetch;
    
    // Assign mock fetch
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'LLM Server overloaded' }),
      } as unknown as Response)
    );

    render(<TrackerPage />);

    // Add a preset action so the analyze button appears
    const trainBtn = screen.getByRole('button', { name: /Add preset action: Electric Train/i });
    fireEvent.click(trainBtn);

    // Click Analyze button
    const analyzeBtn = screen.getByRole('button', { name: /Analyze carbon footprint with AI/i });
    fireEvent.click(analyzeBtn);

    // Assert that the loading state triggers
    expect(screen.getByText(/Processing Telemetry.../i)).toBeInTheDocument();

    // Wait for mock API response and assert error fallback UI + message render together
    await waitFor(() => {
      expect(screen.getByRole('alert', { name: /Carbon analysis error alert/i })).toBeInTheDocument();
      expect(screen.getByText(/LLM Server overloaded/i)).toBeInTheDocument();
    });

    // Restore original fetch
    global.fetch = originalFetch;
  });
});
