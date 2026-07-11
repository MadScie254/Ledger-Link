import { render, screen } from '@testing-library/react';
import { Dashboard } from '../pages/Dashboard';

describe('Dashboard Component', () => {
  it('renders the dashboard header', () => {
    render(<Dashboard />);
    expect(screen.getByText('Dashboard')).toBeDefined();
    expect(screen.getByText(/Here is what's happening/i)).toBeDefined();
  });

  it('renders KPI summary cards', () => {
    render(<Dashboard />);
    expect(screen.getByText('Total Invoiced (MTD)')).toBeDefined();
    expect(screen.getByText('Outstanding Arrears')).toBeDefined();
    expect(screen.getByText('Payroll Due')).toBeDefined();
    expect(screen.getByText('Cash Position')).toBeDefined();
  });

  it('renders recent activity feed', () => {
    render(<Dashboard />);
    expect(screen.getByText('Recent Activity')).toBeDefined();
    expect(screen.getByText('Invoice Paid')).toBeDefined();
  });
});
