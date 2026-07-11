import { render, screen } from '@testing-library/react';
import { Invoicing } from '../pages/Invoicing';

describe('Invoicing Component', () => {
  it('renders the invoicing header', () => {
    render(<Invoicing />);
    expect(screen.getByText('Invoices')).toBeDefined();
    expect(screen.getByText(/Manage your invoices/i)).toBeDefined();
  });

  it('renders the New Invoice button', () => {
    render(<Invoicing />);
    expect(screen.getByText('New Invoice')).toBeDefined();
  });

  it('renders a table with mock invoices', () => {
    render(<Invoicing />);
    expect(screen.getByText('Nairobi Academy')).toBeDefined();
    expect(screen.getByText('INV-2026-001')).toBeDefined();
    expect(screen.getByText('KES 450,000')).toBeDefined();
  });
});
