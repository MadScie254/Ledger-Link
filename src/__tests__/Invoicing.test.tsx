import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { Invoicing } from '../pages/Invoicing';

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <MemoryRouter>
      <AuthProvider>{ui}</AuthProvider>
    </MemoryRouter>
  );
}

describe('Invoicing Component', () => {
  it('renders the invoicing header', async () => {
    renderWithProviders(<Invoicing />);
    await waitFor(() => {
      expect(screen.getByText('Invoices')).toBeDefined();
      expect(screen.getByText(/Manage your invoices/i)).toBeDefined();
    });
  });

  it('renders the New Invoice button', async () => {
    renderWithProviders(<Invoicing />);
    await waitFor(() => {
      expect(screen.getByText('New Invoice')).toBeDefined();
    });
  });

  it('renders the invoices table with columns', async () => {
    renderWithProviders(<Invoicing />);
    await waitFor(() => {
      expect(screen.getByText('Invoice ID')).toBeDefined();
      expect(screen.getByText('Client')).toBeDefined();
      expect(screen.getByText('Amount')).toBeDefined();
      expect(screen.getByText('Status')).toBeDefined();
    });
  });
});
