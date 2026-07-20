import { create } from 'zustand';
import { supabase } from '@/lib/supabaseClient';
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
  category: string;
  receiptUrl?: string;
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

interface StaffMember {
  id: string;
  name: string;
  role: string;
  gross: number;
  status: string;
}

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  qty: number;
  minQty: number;
  unit: string;
  unitCost: number;
  lastUpdated: string;
}

interface MpesaTransaction {
  id: string;
  amount: number;
  sender: string;
  date: string;
  status: string;
  matchScore?: string;
  invoice?: string;
}

interface BankTransaction {
  id: string;
  amount: number;
  sender: string;
  date: string;
  status: string;
}

interface AppState {
  orgProfile: OrgProfile;
  setOrgProfile: (profile: Partial<OrgProfile>) => void;

  invoices: Invoice[];
  setInvoices: (invoices: Invoice[]) => void;
  updateInvoiceStatus: (id: string, status: string) => void;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  addInvoice: (invoice: Omit<Invoice, "id" | "amount" | "rawAmount" | "status" | "reminders">) => void;
  addReminder: (id: string, method: "Email" | "SMS") => void;

  customers: Customer[];
  addCustomer: (customer: Omit<Customer, "id">) => void;

  accounts: Account[];
  addAccount: (account: Omit<Account, "id">) => void;
  editAccount: (id: string, account: Partial<Account>) => void;

  bills: Bill[];
  addBill: (bill: Omit<Bill, "id">) => void;
  updateBillStatus: (id: string, status: "Unpaid" | "Paid") => void;

  staff: StaffMember[];
  setStaff: (staff: StaffMember[]) => void;

  inventory: InventoryItem[];
  setInventory: (inventory: InventoryItem[]) => void;
  updateInventoryQty: (id: string, delta: number) => void;

  movements: MovementLogEntry[];
  addMovement: (movement: Omit<MovementLogEntry, 'id' | 'timestamp'>) => void;

  payrollHistory: PayrollHistoryEntry[];
  disbursePayroll: (entry: Omit<PayrollHistoryEntry, 'id' | 'disbursedAt'>) => void;

  mpesaTransactions: MpesaTransaction[];
  updateMpesaTransaction: (id: string, updates: Partial<MpesaTransaction>) => void;

  bankTransactions: BankTransaction[];
  updateBankTransaction: (id: string, updates: Partial<BankTransaction>) => void;

  activityLog: ActivityEvent[];
  addActivity: (event: Omit<ActivityEvent, 'id' | 'timestamp'>) => void;

  isLoading: boolean;
  loadAll: () => Promise<void>;
}

function mapInvoice(row: any): Invoice {
  return {
    id: row.id,
    clientId: row.client_id,
    accountId: row.account_id ?? undefined,
    client: row.client,
    clientEmail: row.client_email ?? '',
    clientPhone: row.client_phone ?? '',
    clientAddress: row.client_address ?? '',
    amount: row.amount ?? '',
    rawAmount: Number(row.raw_amount) || 0,
    status: row.status,
    date: row.date ?? '',
    dueDate: row.due_date ?? '',
    lineItems: row.line_items ?? [],
    taxRate: Number(row.tax_rate) || 0,
    notes: row.notes ?? '',
    reminders: row.reminders ?? [],
    recurring: row.recurring ?? undefined,
  };
}

function mapBill(row: any): Bill {
  return {
    id: row.id,
    vendor: row.vendor,
    accountId: row.account_id,
    amount: Number(row.amount) || 0,
    date: row.date,
    dueDate: row.due_date,
    status: row.status,
    category: row.category,
    receiptUrl: row.receipt_url ?? undefined,
    notes: row.notes ?? '',
  };
}

function mapCustomer(row: any): Customer {
  return { id: row.id, name: row.name, email: row.email, phone: row.phone, address: row.address, sector: row.sector };
}

function mapAccount(row: any): Account {
  return { id: row.id, name: row.name, type: row.type };
}

function mapStaff(row: any): StaffMember {
  return { id: row.id, name: row.name, role: row.role, gross: Number(row.gross) || 0, status: row.status };
}

function mapInventory(row: any): InventoryItem {
  return {
    id: row.id, name: row.name, category: row.category,
    qty: row.qty, minQty: row.min_qty, unit: row.unit,
    unitCost: Number(row.unit_cost) || 0, lastUpdated: row.last_updated,
  };
}

function mapMovement(row: any): MovementLogEntry {
  return {
    id: row.id, itemId: row.item_id, itemName: row.item_name,
    delta: row.delta, reason: row.reason, timestamp: row.timestamp,
  };
}

function mapPayroll(row: any): PayrollHistoryEntry {
  return {
    id: row.id, period: row.period,
    totalGross: Number(row.total_gross) || 0,
    totalNet: Number(row.total_net) || 0,
    employeeCount: row.employee_count, disbursedAt: row.disbursed_at,
  };
}

function mapMpesa(row: any): MpesaTransaction {
  return {
    id: row.id, amount: Number(row.amount) || 0, sender: row.sender,
    date: row.date, status: row.status, matchScore: row.match_score ?? undefined,
    invoice: row.invoice ?? undefined,
  };
}

function mapBank(row: any): BankTransaction {
  return { id: row.id, amount: Number(row.amount) || 0, sender: row.sender, date: row.date, status: row.status };
}

function mapActivity(row: any): ActivityEvent {
  return {
    id: row.id, type: row.type, title: row.title,
    description: row.description, icon: row.icon ?? undefined, timestamp: row.timestamp,
  };
}

async function insertActivity(event: Omit<ActivityEvent, 'id' | 'timestamp'>) {
  const id = Math.random().toString(36).substring(2, 9);
  const timestamp = new Date().toISOString();
  await supabase.from('activity_log').insert({
    id, type: event.type, title: event.title,
    description: event.description, icon: event.icon ?? null, timestamp,
  });
  return { id, ...event, timestamp };
}

export const useAppStore = create<AppState>()((set, get) => ({
  orgProfile: {
    name: "Acme Kenya Ltd",
    sector: "School",
    qbConnected: false,
  },
  setOrgProfile: (profile) => {
    set((state) => ({ orgProfile: { ...state.orgProfile, ...profile } }));
    const updated = { ...get().orgProfile };
    supabase.from('org_profile').upsert({
      id: 1, name: updated.name, sector: updated.sector,
      qb_connected: updated.qbConnected, primary_color: updated.primaryColor ?? null,
    }).then();
  },

  activityLog: initialActivityLog as ActivityEvent[],
  addActivity: (event) => {
    insertActivity(event).then((act) => {
      set((state) => ({ activityLog: [act, ...state.activityLog].slice(0, 100) }));
    });
  },

  customers: initialCustomers as Customer[],
  addCustomer: (customer) => {
    const lastNum = get().customers.length;
    const nextId = `CUST-${String(lastNum + 1).padStart(3, '0')}`;
    const newCustomer = { ...customer, id: nextId };
    supabase.from('customers').insert({
      id: nextId, name: customer.name, email: customer.email,
      phone: customer.phone, address: customer.address, sector: customer.sector,
    }).then();
    insertActivity({
      type: "Client Added", title: newCustomer.name,
      description: "New client profile created", icon: "user",
    }).then((act) => {
      set((state) => ({
        customers: [...state.customers, newCustomer],
        activityLog: [act, ...state.activityLog].slice(0, 100),
      }));
    });
  },

  accounts: initialAccounts as Account[],
  addAccount: (account) => {
    const lastNum = get().accounts.length;
    const nextId = `ACC-${String(lastNum + 1).padStart(3, '0')}`;
    supabase.from('accounts').insert({ id: nextId, name: account.name, type: account.type }).then();
    set((state) => ({ accounts: [...state.accounts, { ...account, id: nextId }] }));
  },
  editAccount: (id, updates) => {
    supabase.from('accounts').update({
      name: updates.name, type: updates.type,
    }).eq('id', id).then();
    set((state) => ({
      accounts: state.accounts.map((acc) => acc.id === id ? { ...acc, ...updates } : acc),
    }));
  },

  bills: initialBills as Bill[],
  addBill: (bill) => {
    const lastNum = get().bills.length;
    const nextId = `BILL-2026-${String(lastNum + 1).padStart(3, '0')}`;
    supabase.from('bills').insert({
      id: nextId, vendor: bill.vendor, account_id: bill.accountId,
      amount: bill.amount, date: bill.date, due_date: bill.dueDate,
      status: bill.status, category: bill.category, notes: bill.notes,
      receipt_url: bill.receiptUrl ?? null,
    }).then();
    insertActivity({
      type: "Bill Created", title: nextId,
      description: `New bill logged for ${bill.vendor} (KES ${bill.amount.toLocaleString()})`,
      icon: "receipt",
    }).then((act) => {
      set((state) => ({
        bills: [...state.bills, { ...bill, id: nextId }],
        activityLog: [act, ...state.activityLog].slice(0, 100),
      }));
    });
  },
  updateBillStatus: (id, status) => {
    supabase.from('bills').update({ status }).eq('id', id).then();
    const bill = get().bills.find((b) => b.id === id);
    set((state) => ({
      bills: state.bills.map((b) => b.id === id ? { ...b, status } : b),
    }));
    if (bill) {
      insertActivity({
        type: `Bill ${status}`, title: bill.id,
        description: `Bill from ${bill.vendor} marked as ${status.toLowerCase()}`,
        icon: "receipt",
      }).then((act) => {
        set((state) => ({ activityLog: [act, ...state.activityLog].slice(0, 100) }));
      });
    }
  },

  invoices: initialInvoices as Invoice[],
  setInvoices: (invoices) => set({ invoices }),
  updateInvoiceStatus: (id, status) => {
    supabase.from('invoices').update({ status }).eq('id', id).then();
    const inv = get().invoices.find((i) => i.id === id);
    set((state) => ({
      invoices: state.invoices.map((inv) => inv.id === id ? { ...inv, status } : inv),
    }));
    if (inv && status === "Paid") {
      insertActivity({
        type: "Invoice Paid", title: inv.id,
        description: `Invoice from ${inv.client} marked as paid`, icon: "file-text",
      }).then((act) => {
        set((state) => ({ activityLog: [act, ...state.activityLog].slice(0, 100) }));
      });
    }
  },
  updateInvoice: (id, updates) => {
    const dbUpdates: Record<string, any> = {};
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.recurring !== undefined) dbUpdates.recurring = updates.recurring;
    if (updates.reminders !== undefined) dbUpdates.reminders = updates.reminders;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
    if (Object.keys(dbUpdates).length > 0) {
      supabase.from('invoices').update(dbUpdates).eq('id', id).then();
    }
    set((state) => ({
      invoices: state.invoices.map((inv) => inv.id === id ? { ...inv, ...updates } : inv),
    }));
  },
  addInvoice: (invoice) => {
    const lastNum = get().invoices.length;
    const nextId = `INV-2026-${String(lastNum + 1).padStart(3, '0')}`;
    const subtotal = invoice.lineItems.reduce((sum, item) => sum + (item.qty * item.unitPrice), 0);
    const tax = subtotal * (invoice.taxRate / 100);
    const rawAmount = subtotal + tax;
    const newInvoice: Invoice = {
      ...invoice, id: nextId, rawAmount,
      amount: rawAmount.toLocaleString(), status: "Pending", reminders: [],
    };
    supabase.from('invoices').insert({
      id: nextId, client_id: invoice.clientId, account_id: invoice.accountId ?? null,
      client: invoice.client, client_email: invoice.clientEmail,
      client_phone: invoice.clientPhone, client_address: invoice.clientAddress,
      amount: newInvoice.amount, raw_amount: rawAmount, status: "Pending",
      date: invoice.date, due_date: invoice.dueDate,
      line_items: invoice.lineItems, tax_rate: invoice.taxRate,
      notes: invoice.notes, reminders: [], recurring: null,
    }).then();
    insertActivity({
      type: "Invoice Created", title: nextId,
      description: `Invoice generated for ${newInvoice.client}`, icon: "file-text",
    }).then((act) => {
      set((state) => ({
        invoices: [...state.invoices, newInvoice],
        activityLog: [act, ...state.activityLog].slice(0, 100),
      }));
    });
  },
  addReminder: (id, method) => {
    const reminder = { sentAt: new Date().toISOString(), method };
    supabase.from('invoices').update({
      reminders: [...(get().invoices.find((i) => i.id === id)?.reminders ?? []), reminder],
    }).eq('id', id).then();
    insertActivity({
      type: "Reminder Sent", title: id,
      description: `Payment reminder sent via ${method}`, icon: "bell",
    }).then((act) => {
      set((state) => ({
        invoices: state.invoices.map((inv) =>
          inv.id === id ? { ...inv, reminders: [...inv.reminders, reminder] } : inv
        ),
        activityLog: [act, ...state.activityLog].slice(0, 100),
      }));
    });
  },

  staff: initialStaffData as unknown as StaffMember[],
  setStaff: (staff) => set({ staff }),

  inventory: initialInventory as unknown as InventoryItem[],
  setInventory: (inventory) => set({ inventory }),
  updateInventoryQty: (id, delta) => {
    const item = get().inventory.find((i) => i.id === id);
    if (item) {
      const newQty = Math.max(0, item.qty + delta);
      supabase.from('inventory').update({ qty: newQty }).eq('id', id).then();
    }
    set((state) => ({
      inventory: state.inventory.map((item) =>
        item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item
      ),
    }));
  },

  movements: [],
  addMovement: (movement) => {
    const id = crypto.randomUUID();
    const timestamp = new Date().toISOString();
    supabase.from('movements').insert({
      id, item_id: movement.itemId, item_name: movement.itemName,
      delta: movement.delta, reason: movement.reason, timestamp,
    }).then();
    insertActivity({
      type: "Inventory Movement", title: movement.itemName,
      description: `${movement.delta > 0 ? 'Added' : 'Removed'} ${Math.abs(movement.delta)} units`,
      icon: "package",
    }).then((act) => {
      set((state) => ({
        movements: [{ ...movement, id, timestamp }, ...state.movements],
        activityLog: [act, ...state.activityLog].slice(0, 100),
      }));
    });
  },

  payrollHistory: initialPayrollHistory,
  disbursePayroll: (entry) => {
    const id = `PR-${Math.random().toString(36).substring(2, 9)}`;
    const disbursedAt = new Date().toISOString();
    supabase.from('payroll_history').insert({
      id, period: entry.period, total_gross: entry.totalGross,
      total_net: entry.totalNet, employee_count: entry.employeeCount, disbursed_at: disbursedAt,
    }).then();
    insertActivity({
      type: "Payroll Disbursed", title: entry.period,
      description: `Payroll run for ${entry.employeeCount} employees (Net: KES ${entry.totalNet.toLocaleString()})`,
      icon: "users",
    }).then((act) => {
      set((state) => ({
        payrollHistory: [{ ...entry, id, disbursedAt }, ...state.payrollHistory],
        activityLog: [act, ...state.activityLog].slice(0, 100),
      }));
    });
  },

  mpesaTransactions: initialMpesaTransactions as unknown as MpesaTransaction[],
  updateMpesaTransaction: (id, updates) => {
    const dbUpdates: Record<string, any> = {};
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.invoice !== undefined) dbUpdates.invoice = updates.invoice;
    if (updates.matchScore !== undefined) dbUpdates.match_score = updates.matchScore;
    if (Object.keys(dbUpdates).length > 0) {
      supabase.from('mpesa_transactions').update(dbUpdates).eq('id', id).then();
    }
    const tx = get().mpesaTransactions.find((t) => t.id === id);
    set((state) => ({
      mpesaTransactions: state.mpesaTransactions.map((tx) =>
        tx.id === id ? { ...tx, ...updates } : tx
      ),
    }));
    if (updates.status === "Matched" && tx) {
      insertActivity({
        type: "Transaction Matched", title: tx.id,
        description: `M-Pesa transaction matched (KES ${tx.amount})`, icon: "check-circle",
      }).then((act) => {
        set((state) => ({ activityLog: [act, ...state.activityLog].slice(0, 100) }));
      });
    }
  },

  bankTransactions: initialBankTransactions as unknown as BankTransaction[],
  updateBankTransaction: (id, updates) => {
    const dbUpdates: Record<string, any> = {};
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (Object.keys(dbUpdates).length > 0) {
      supabase.from('bank_transactions').update(dbUpdates).eq('id', id).then();
    }
    const tx = get().bankTransactions.find((t) => t.id === id);
    set((state) => ({
      bankTransactions: state.bankTransactions.map((tx) =>
        tx.id === id ? { ...tx, ...updates } : tx
      ),
    }));
    if (updates.status === "Matched" && tx) {
      insertActivity({
        type: "Transaction Matched", title: tx.id,
        description: `Bank transaction matched (KES ${tx.amount})`, icon: "check-circle",
      }).then((act) => {
        set((state) => ({ activityLog: [act, ...state.activityLog].slice(0, 100) }));
      });
    }
  },

  isLoading: true,
  loadAll: async () => {
    try {
      const [
        org, customers, accounts, bills, invoices,
        staff, inventory, movements, payroll,
        mpesa, bank, activity,
      ] = await Promise.all([
        supabase.from('org_profile').select('*').maybeSingle(),
        supabase.from('customers').select('*'),
        supabase.from('accounts').select('*'),
        supabase.from('bills').select('*'),
        supabase.from('invoices').select('*'),
        supabase.from('staff').select('*'),
        supabase.from('inventory').select('*'),
        supabase.from('movements').select('*').order('timestamp', { ascending: false }),
        supabase.from('payroll_history').select('*').order('disbursed_at', { ascending: false }),
        supabase.from('mpesa_transactions').select('*'),
        supabase.from('bank_transactions').select('*'),
        supabase.from('activity_log').select('*').order('timestamp', { ascending: false }).limit(100),
      ]);

      set({
        orgProfile: org.data ? {
          name: org.data.name, sector: org.data.sector,
          qbConnected: org.data.qb_connected, primaryColor: org.data.primary_color ?? undefined,
        } : get().orgProfile,
        customers: (customers.data ?? []).map(mapCustomer),
        accounts: (accounts.data ?? []).map(mapAccount),
        bills: (bills.data ?? []).map(mapBill),
        invoices: (invoices.data ?? []).map(mapInvoice),
        staff: (staff.data ?? []).map(mapStaff),
        inventory: (inventory.data ?? []).map(mapInventory),
        movements: (movements.data ?? []).map(mapMovement),
        payrollHistory: (payroll.data ?? []).map(mapPayroll),
        mpesaTransactions: (mpesa.data ?? []).map(mapMpesa),
        bankTransactions: (bank.data ?? []).map(mapBank),
        activityLog: (activity.data ?? []).map(mapActivity),
        isLoading: false,
      });
    } catch (e) {
      set({ isLoading: false });
    }
  },
}));
