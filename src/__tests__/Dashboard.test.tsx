import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { Dashboard } from '../pages/Dashboard';

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <MemoryRouter>
      <AuthProvider>{ui}</AuthProvider>
    </MemoryRouter>
  );
}

describe('Dashboard Component', () => {
  it('renders the owner greeting header', async () => {
    renderWithProviders(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText(/Morning/i)).toBeDefined();
      expect(screen.getByText(/Owner/i)).toBeDefined();
    });
  });

  it('renders KPI summary cards', async () => {
    renderWithProviders(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText('Cash Position')).toBeDefined();
      expect(screen.getByText('Payroll Due')).toBeDefined();
    });
  });

  it('renders recent activity feed', async () => {
    renderWithProviders(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText('Recent Activity')).toBeDefined();
    });
  });
});
