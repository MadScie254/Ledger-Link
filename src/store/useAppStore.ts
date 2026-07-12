import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  initialInvoices, 
  initialStaffData, 
  initialInventory, 
  initialMpesaTransactions, 
  initialBankTransactions,
  initialCustomers
} from '@/lib/mockData';

export interface OrgProfile {
  name: string;
  sector: string;
  qbConnected: boolean;
}

export interface MovementLogEntry {
  id: string;
  itemId: string;
  itemName: string;
  delta: number;
  reason: string;
  timestamp: string;
}

export interface PayrollHistoryEntry {
  id: string;
  period: string;
  totalGross: number;
  totalNet: number;
  employeeCount: number;
  disbursedAt: string;
}

export interface InvoiceLineItem {
  description: string;
  qty: number;
  unitPrice: number;
}

export interface InvoiceReminder {
  sentAt: string;
  method: "Email" | "SMS";
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  sector: string;
}

export interface Invoice {
  id: string;
  clientId: string;
  client: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  amount: string;
  rawAmount: number;
  status: string;
  date: string;
  dueDate: string;
  lineItems: InvoiceLineItem[];
  taxRate: number;
  notes: string;
  reminders: InvoiceReminder[];
}

interface AppState {
  orgProfile: OrgProfile;
  setOrgProfile: (profile: Partial<OrgProfile>) => void;
  
  invoices: Invoice[];
  setInvoices: (invoices: Invoice[]) => void;
  updateInvoiceStatus: (id: string, status: string) => void;
  addInvoice: (invoice: Omit<Invoice, "id" | "amount" | "rawAmount" | "status" | "reminders">) => void;
  addReminder: (id: string, method: "Email" | "SMS") => void;

  customers: Customer[];
  addCustomer: (customer: Omit<Customer, "id">) => void;

  staff: typeof initialStaffData;
  setStaff: (staff: typeof initialStaffData) => void;

  inventory: typeof initialInventory;
  setInventory: (inventory: typeof initialInventory) => void;
  updateInventoryQty: (id: string, delta: number) => void;
  
  movements: MovementLogEntry[];
  addMovement: (movement: Omit<MovementLogEntry, 'id' | 'timestamp'>) => void;

  payrollHistory: PayrollHistoryEntry[];
  disbursePayroll: (entry: Omit<PayrollHistoryEntry, 'id' | 'disbursedAt'>) => void;

  mpesaTransactions: typeof initialMpesaTransactions;
  updateMpesaTransaction: (id: string, updates: Partial<typeof initialMpesaTransactions[0]>) => void;

  bankTransactions: typeof initialBankTransactions;
  updateBankTransaction: (id: string, updates: Partial<typeof initialBankTransactions[0]>) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      orgProfile: {
        name: "Acme Kenya Ltd",
        sector: "School",
        qbConnected: false,
      },
      setOrgProfile: (profile) => 
        set((state) => ({ orgProfile: { ...state.orgProfile, ...profile } })),

      customers: initialCustomers as Customer[],
      addCustomer: (customer) =>
        set((state) => {
          const lastNum = state.customers.length;
          const nextId = `CUST-${String(lastNum + 1).padStart(3, '0')}`;
          return { customers: [...state.customers, { ...customer, id: nextId }] };
        }),

      invoices: initialInvoices as Invoice[],
      setInvoices: (invoices) => set({ invoices }),
      updateInvoiceStatus: (id, status) => 
        set((state) => ({
          invoices: state.invoices.map((inv) => 
            inv.id === id ? { ...inv, status } : inv
          )
        })),
      addInvoice: (invoice) => 
        set((state) => {
          const lastNum = state.invoices.length;
          const nextId = `INV-2026-${String(lastNum + 1).padStart(3, '0')}`;
          
          const subtotal = invoice.lineItems.reduce((sum, item) => sum + (item.qty * item.unitPrice), 0);
          const tax = subtotal * (invoice.taxRate / 100);
          const rawAmount = subtotal + tax;

          const newInvoice: Invoice = {
            ...invoice,
            id: nextId,
            rawAmount,
            amount: rawAmount.toLocaleString(),
            status: "Pending",
            reminders: [],
          };
          return { invoices: [...state.invoices, newInvoice] };
        }),
      addReminder: (id, method) =>
        set((state) => ({
          invoices: state.invoices.map((inv) => 
            inv.id === id ? { 
              ...inv, 
              reminders: [...inv.reminders, { sentAt: new Date().toISOString(), method }] 
            } : inv
          )
        })),

      staff: initialStaffData,
      setStaff: (staff) => set({ staff }),

      inventory: initialInventory,
      setInventory: (inventory) => set({ inventory }),
      updateInventoryQty: (id, delta) => 
        set((state) => ({
          inventory: state.inventory.map((item) => 
            item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item
          )
        })),

      movements: [],
      addMovement: (movement) => 
        set((state) => ({
          movements: [
            {
              ...movement,
              id: Math.random().toString(36).substring(2, 9),
              timestamp: new Date().toISOString(),
            },
            ...state.movements,
          ]
        })),

      payrollHistory: [],
      disbursePayroll: (entry) => 
        set((state) => ({
          payrollHistory: [
            {
              ...entry,
              id: Math.random().toString(36).substring(2, 9),
              disbursedAt: new Date().toISOString(),
            },
            ...state.payrollHistory,
          ]
        })),

      mpesaTransactions: initialMpesaTransactions,
      updateMpesaTransaction: (id, updates) => 
        set((state) => ({
          mpesaTransactions: state.mpesaTransactions.map((tx) =>
            tx.id === id ? { ...tx, ...updates } : tx
          )
        })),

      bankTransactions: initialBankTransactions,
      updateBankTransaction: (id, updates) => 
        set((state) => ({
          bankTransactions: state.bankTransactions.map((tx) =>
            tx.id === id ? { ...tx, ...updates } : tx
          )
        })),
    }),
    {
      name: 'ledgerlink-app-store',
      partialize: (state) => ({ orgProfile: state.orgProfile }),
    }
  )
);

