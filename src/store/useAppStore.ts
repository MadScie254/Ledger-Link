import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  initialInvoices, 
  initialStaffData, 
  initialInventory, 
  initialMpesaTransactions, 
  initialBankTransactions,
  initialCustomers,
  initialAccounts,
  initialBills,
  initialActivityLog,
  initialPayrollHistory
} from '@/lib/mockData';

export interface OrgProfile {
  name: string;
  sector: string;
  qbConnected: boolean;
  primaryColor?: string;
}

export interface MovementLogEntry {
  id: string;
  itemId: string;
  itemName: string;
  delta: number;
  reason: string;
  timestamp: string;
}

export interface ActivityEvent {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  icon?: string;
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

export interface Account {
  id: string;
  name: string;
  type: "Income" | "Expense" | "Asset" | "Liability";
}

export interface Bill {
  id: string;
  vendor: string;
  accountId: string;
  amount: number;
  date: string;
  dueDate: string;
  status: "Unpaid" | "Paid";
  notes: string;
}

export interface Invoice {
  id: string;
  clientId: string;
  accountId?: string;
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
  recurring?: { frequency: "Weekly" | "Monthly" | "Termly", nextDate: string };
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

  accounts: Account[];
  addAccount: (account: Omit<Account, "id">) => void;
  editAccount: (id: string, account: Partial<Account>) => void;

  bills: Bill[];
  addBill: (bill: Omit<Bill, "id">) => void;
  markBillPaid: (id: string) => void;

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

  activityLog: ActivityEvent[];
  addActivity: (event: Omit<ActivityEvent, 'id' | 'timestamp'>) => void;
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

      activityLog: initialActivityLog,
      addActivity: (event) => 
        set((state) => ({
          activityLog: [
            {
              ...event,
              id: Math.random().toString(36).substring(2, 9),
              timestamp: new Date().toISOString(),
            },
            ...state.activityLog,
          ].slice(0, 100)
        })),

      customers: initialCustomers as Customer[],
      addCustomer: (customer) =>
        set((state) => {
          const lastNum = state.customers.length;
          const nextId = `CUST-${String(lastNum + 1).padStart(3, '0')}`;
          const newCustomer = { ...customer, id: nextId };
          const act = {
            id: Math.random().toString(36).substring(2, 9),
            type: "Client Added",
            title: newCustomer.name,
            description: "New client profile created",
            timestamp: new Date().toISOString(),
            icon: "user",
          };
          return { 
            customers: [...state.customers, newCustomer],
            activityLog: [act, ...state.activityLog].slice(0, 100)
          };
        }),

      accounts: initialAccounts as Account[],
      addAccount: (account) =>
        set((state) => {
          const lastNum = state.accounts.length;
          const nextId = `ACC-${String(lastNum + 1).padStart(3, '0')}`;
          return { accounts: [...state.accounts, { ...account, id: nextId } as Account] };
        }),
      editAccount: (id, updates) =>
        set((state) => ({
          accounts: state.accounts.map((acc) =>
            acc.id === id ? { ...acc, ...updates } : acc
          )
        })),

      bills: initialBills as Bill[],
      addBill: (bill) =>
        set((state) => {
          const lastNum = state.bills.length;
          const nextId = `BILL-2026-${String(lastNum + 1).padStart(3, '0')}`;
          const act = {
            id: Math.random().toString(36).substring(2, 9),
            type: "Bill Created",
            title: nextId,
            description: `New bill logged for ${bill.vendor} (KES ${bill.amount.toLocaleString()})`,
            timestamp: new Date().toISOString(),
            icon: "receipt",
          };
          return { 
            bills: [...state.bills, { ...bill, id: nextId } as Bill],
            activityLog: [act, ...state.activityLog].slice(0, 100)
          };
        }),
      markBillPaid: (id) =>
        set((state) => {
          const bill = state.bills.find((b) => b.id === id);
          if (!bill) return {};
          const act = {
            id: Math.random().toString(36).substring(2, 9),
            type: "Bill Paid",
            title: bill.id,
            description: `Bill from ${bill.vendor} marked as paid`,
            timestamp: new Date().toISOString(),
            icon: "receipt",
          };
          return {
            bills: state.bills.map((b) =>
              b.id === id ? { ...b, status: "Paid" } : b
            ),
            activityLog: [act, ...state.activityLog].slice(0, 100)
          };
        }),

      invoices: initialInvoices as Invoice[],
      setInvoices: (invoices) => set({ invoices }),
      updateInvoiceStatus: (id, status) => 
        set((state) => {
          const inv = state.invoices.find(i => i.id === id);
          const newState = {
            invoices: state.invoices.map((inv) => 
              inv.id === id ? { ...inv, status } : inv
            )
          };
          if (inv && status === "Paid") {
            const act = {
              id: Math.random().toString(36).substring(2, 9),
              type: "Invoice Paid",
              title: inv.id,
              description: `Invoice from ${inv.client} marked as paid`,
              timestamp: new Date().toISOString(),
              icon: "file-text",
            };
            return { ...newState, activityLog: [act, ...state.activityLog].slice(0, 100) };
          }
          return newState;
        }),
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
          
          const act = {
            id: Math.random().toString(36).substring(2, 9),
            type: "Invoice Created",
            title: newInvoice.id,
            description: `Invoice generated for ${newInvoice.client}`,
            timestamp: new Date().toISOString(),
            icon: "file-text",
          };
          
          return { 
            invoices: [...state.invoices, newInvoice],
            activityLog: [act, ...state.activityLog].slice(0, 100)
          };
        }),
      addReminder: (id, method) =>
        set((state) => {
          const act = {
            id: Math.random().toString(36).substring(2, 9),
            type: "Reminder Sent",
            title: id,
            description: `Payment reminder sent via ${method}`,
            timestamp: new Date().toISOString(),
            icon: "bell",
          };
          return {
            invoices: state.invoices.map((inv) => 
              inv.id === id ? { 
                ...inv, 
                reminders: [...inv.reminders, { sentAt: new Date().toISOString(), method }] 
              } : inv
            ),
            activityLog: [act, ...state.activityLog].slice(0, 100)
          };
        }),

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
        set((state) => {
          const act = {
            id: Math.random().toString(36).substring(2, 9),
            type: "Inventory Movement",
            title: movement.itemName,
            description: `${movement.delta > 0 ? 'Added' : 'Removed'} ${Math.abs(movement.delta)} units`,
            timestamp: new Date().toISOString(),
            icon: "package",
          };
          return {
            movements: [
              {
                ...movement,
                id: Math.random().toString(36).substring(2, 9),
                timestamp: new Date().toISOString(),
              },
              ...state.movements,
            ],
            activityLog: [act, ...state.activityLog].slice(0, 100)
          };
        }),

      payrollHistory: initialPayrollHistory,
      disbursePayroll: (entry) => 
        set((state) => {
          const act = {
            id: Math.random().toString(36).substring(2, 9),
            type: "Payroll Disbursed",
            title: entry.period,
            description: `Payroll run for ${entry.employeeCount} employees (Net: KES ${entry.totalNet.toLocaleString()})`,
            timestamp: new Date().toISOString(),
            icon: "users",
          };
          return {
            payrollHistory: [
              {
                ...entry,
                id: Math.random().toString(36).substring(2, 9),
                disbursedAt: new Date().toISOString(),
              },
              ...state.payrollHistory,
            ],
            activityLog: [act, ...state.activityLog].slice(0, 100)
          };
        }),

      mpesaTransactions: initialMpesaTransactions,
      updateMpesaTransaction: (id, updates) => 
        set((state) => {
          const newState = {
            mpesaTransactions: state.mpesaTransactions.map((tx) =>
              tx.id === id ? { ...tx, ...updates } : tx
            )
          };
          if (updates.status === "Matched") {
            const tx = state.mpesaTransactions.find((t) => t.id === id);
            if (tx) {
              const act = {
                id: Math.random().toString(36).substring(2, 9),
                type: "Transaction Matched",
                title: tx.id,
                description: `M-Pesa transaction matched (KES ${tx.amount})`,
                timestamp: new Date().toISOString(),
                icon: "check-circle",
              };
              return { ...newState, activityLog: [act, ...state.activityLog].slice(0, 100) };
            }
          }
          return newState;
        }),

      bankTransactions: initialBankTransactions,
      updateBankTransaction: (id, updates) => 
        set((state) => {
          const newState = {
            bankTransactions: state.bankTransactions.map((tx) =>
              tx.id === id ? { ...tx, ...updates } : tx
            )
          };
          if (updates.status === "Matched") {
            const tx = state.bankTransactions.find((t) => t.id === id);
            if (tx) {
              const act = {
                id: Math.random().toString(36).substring(2, 9),
                type: "Transaction Matched",
                title: tx.id,
                description: `Bank transaction matched (KES ${tx.amount})`,
                timestamp: new Date().toISOString(),
                icon: "check-circle",
              };
              return { ...newState, activityLog: [act, ...state.activityLog].slice(0, 100) };
            }
          }
          return newState;
        }),
    }),
    {
      name: 'ledgerlink-app-store',
      partialize: (state) => ({
        orgProfile: state.orgProfile,
        invoices: state.invoices,
        customers: state.customers,
        accounts: state.accounts,
        bills: state.bills,
        staff: state.staff,
        inventory: state.inventory,
        movements: state.movements,
        payrollHistory: state.payrollHistory,
        mpesaTransactions: state.mpesaTransactions,
        bankTransactions: state.bankTransactions,
        activityLog: state.activityLog,
      }),
    }
  )
);

