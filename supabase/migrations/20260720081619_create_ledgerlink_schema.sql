/*
# Create LedgerLink Schema (single-tenant, no auth)

## Overview
Creates the full database schema for the LedgerLink accounting app. This is a
single-tenant application with no sign-in screen, so all tables use
`TO anon, authenticated` RLS policies — the anon-key frontend can read and
write its own data. No `user_id` columns or `auth.uid()` checks are used.

## New Tables

1. **org_profile** — singleton row holding the organization's name, sector,
   QuickBooks connection flag, and optional primary color.
   - `id` (int, primary key, always 1)
   - `name` (text, not null)
   - `sector` (text, not null)
   - `qb_connected` (boolean, default false)
   - `primary_color` (text, nullable)

2. **customers** — client/customer records.
   - `id` (text, primary key — e.g. "CUST-001")
   - `name`, `email`, `phone`, `address`, `sector` (text)

3. **accounts** — chart-of-accounts entries.
   - `id` (text, primary key — e.g. "ACC-001")
   - `name` (text)
   - `type` (text — "Income" | "Expense" | "Asset" | "Liability")

4. **bills** — vendor bills / accounts payable.
   - `id` (text, primary key)
   - `vendor`, `account_id`, `category`, `notes`, `receipt_url` (text)
   - `amount` (numeric)
   - `date`, `due_date` (text — formatted display strings)
   - `status` (text — "Unpaid" | "Paid")

5. **invoices** — sales invoices / accounts receivable.
   - `id` (text, primary key)
   - `client_id`, `account_id`, `client`, `client_email`, `client_phone`,
     `client_address`, `notes` (text)
   - `amount` (text — formatted display string)
   - `raw_amount` (numeric — unformatted number for calculations)
   - `status` (text — "Pending" | "Paid" | "Overdue")
   - `date`, `due_date` (text — formatted display strings)
   - `line_items` (jsonb — array of {description, qty, unitPrice})
   - `tax_rate` (numeric)
   - `reminders` (jsonb — array of {sentAt, method})
   - `recurring` (jsonb, nullable — {frequency, nextDate})

6. **staff** — employees for payroll.
   - `id` (text, primary key)
   - `name`, `role`, `status` (text)
   - `gross` (numeric)

7. **inventory** — stock items.
   - `id` (text, primary key)
   - `name`, `category`, `unit`, `last_updated` (text)
   - `qty`, `min_qty` (integer)
   - `unit_cost` (numeric)

8. **movements** — inventory movement log entries.
   - `id` (uuid, primary key, default gen_random_uuid)
   - `item_id`, `item_name`, `reason` (text)
   - `delta` (integer)
   - `timestamp` (timestamptz, default now)

9. **payroll_history** — disbursed payroll records.
   - `id` (text, primary key)
   - `period` (text)
   - `total_gross`, `total_net` (numeric)
   - `employee_count` (integer)
   - `disbursed_at` (timestamptz)

10. **mpesa_transactions** — M-Pesa payment transactions.
    - `id` (text, primary key)
    - `amount` (numeric)
    - `sender`, `date` (text)
    - `status` (text — "Matched" | "Unmatched")
    - `match_score` (text, nullable)
    - `invoice` (text, nullable — matched invoice ID)

11. **bank_transactions** — bank payment transactions.
    - `id` (text, primary key)
    - `amount` (numeric)
    - `sender`, `date` (text)
    - `status` (text — "Matched" | "Unmatched")

12. **activity_log** — audit/activity feed entries.
    - `id` (text, primary key)
    - `type`, `title`, `description`, `icon` (text)
    - `timestamp` (timestamptz, default now)

## Security
- RLS enabled on every table.
- All policies use `TO anon, authenticated` with `USING (true)` / `WITH CHECK (true)`
  because this is a single-tenant app with no sign-in — the data is intentionally
  shared and the anon-key client must be able to read and write.

## Important Notes
1. Display dates are stored as text (e.g. "Mar 01, 2026") to match the existing
   frontend formatting. `timestamp` columns use `timestamptz` for proper sorting.
2. JSONB columns (`line_items`, `reminders`, `recurring`) preserve the nested
   structures the frontend expects without requiring join tables.
3. Numeric amounts use `numeric` type to avoid floating-point rounding errors
   with KES currency values.
*/

-- org_profile (singleton)
CREATE TABLE IF NOT EXISTS org_profile (
  id int PRIMARY KEY DEFAULT 1,
  name text NOT NULL,
  sector text NOT NULL,
  qb_connected boolean NOT NULL DEFAULT false,
  primary_color text
);
ALTER TABLE org_profile ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_org_profile" ON org_profile;
CREATE POLICY "anon_select_org_profile" ON org_profile FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_org_profile" ON org_profile;
CREATE POLICY "anon_insert_org_profile" ON org_profile FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_org_profile" ON org_profile;
CREATE POLICY "anon_update_org_profile" ON org_profile FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_org_profile" ON org_profile;
CREATE POLICY "anon_delete_org_profile" ON org_profile FOR DELETE TO anon, authenticated USING (true);

-- customers
CREATE TABLE IF NOT EXISTS customers (
  id text PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  sector text NOT NULL DEFAULT ''
);
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_customers" ON customers;
CREATE POLICY "anon_select_customers" ON customers FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_customers" ON customers;
CREATE POLICY "anon_insert_customers" ON customers FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_customers" ON customers;
CREATE POLICY "anon_update_customers" ON customers FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_customers" ON customers;
CREATE POLICY "anon_delete_customers" ON customers FOR DELETE TO anon, authenticated USING (true);

-- accounts
CREATE TABLE IF NOT EXISTS accounts (
  id text PRIMARY KEY,
  name text NOT NULL,
  type text NOT NULL
);
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_accounts" ON accounts;
CREATE POLICY "anon_select_accounts" ON accounts FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_accounts" ON accounts;
CREATE POLICY "anon_insert_accounts" ON accounts FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_accounts" ON accounts;
CREATE POLICY "anon_update_accounts" ON accounts FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_accounts" ON accounts;
CREATE POLICY "anon_delete_accounts" ON accounts FOR DELETE TO anon, authenticated USING (true);

-- bills
CREATE TABLE IF NOT EXISTS bills (
  id text PRIMARY KEY,
  vendor text NOT NULL,
  account_id text NOT NULL DEFAULT '',
  amount numeric NOT NULL DEFAULT 0,
  date text NOT NULL DEFAULT '',
  due_date text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'Unpaid',
  category text NOT NULL DEFAULT '',
  receipt_url text,
  notes text NOT NULL DEFAULT ''
);
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_bills" ON bills;
CREATE POLICY "anon_select_bills" ON bills FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_bills" ON bills;
CREATE POLICY "anon_insert_bills" ON bills FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_bills" ON bills;
CREATE POLICY "anon_update_bills" ON bills FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_bills" ON bills;
CREATE POLICY "anon_delete_bills" ON bills FOR DELETE TO anon, authenticated USING (true);

-- invoices
CREATE TABLE IF NOT EXISTS invoices (
  id text PRIMARY KEY,
  client_id text NOT NULL DEFAULT '',
  account_id text,
  client text NOT NULL,
  client_email text NOT NULL DEFAULT '',
  client_phone text NOT NULL DEFAULT '',
  client_address text NOT NULL DEFAULT '',
  amount text NOT NULL DEFAULT '',
  raw_amount numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'Pending',
  date text NOT NULL DEFAULT '',
  due_date text NOT NULL DEFAULT '',
  line_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  tax_rate numeric NOT NULL DEFAULT 0,
  notes text NOT NULL DEFAULT '',
  reminders jsonb NOT NULL DEFAULT '[]'::jsonb,
  recurring jsonb
);
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_invoices" ON invoices;
CREATE POLICY "anon_select_invoices" ON invoices FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_invoices" ON invoices;
CREATE POLICY "anon_insert_invoices" ON invoices FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_invoices" ON invoices;
CREATE POLICY "anon_update_invoices" ON invoices FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_invoices" ON invoices;
CREATE POLICY "anon_delete_invoices" ON invoices FOR DELETE TO anon, authenticated USING (true);

-- staff
CREATE TABLE IF NOT EXISTS staff (
  id text PRIMARY KEY,
  name text NOT NULL,
  role text NOT NULL,
  gross numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'Active'
);
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_staff" ON staff;
CREATE POLICY "anon_select_staff" ON staff FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_staff" ON staff;
CREATE POLICY "anon_insert_staff" ON staff FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_staff" ON staff;
CREATE POLICY "anon_update_staff" ON staff FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_staff" ON staff;
CREATE POLICY "anon_delete_staff" ON staff FOR DELETE TO anon, authenticated USING (true);

-- inventory
CREATE TABLE IF NOT EXISTS inventory (
  id text PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL DEFAULT '',
  qty integer NOT NULL DEFAULT 0,
  min_qty integer NOT NULL DEFAULT 0,
  unit text NOT NULL DEFAULT '',
  unit_cost numeric NOT NULL DEFAULT 0,
  last_updated text NOT NULL DEFAULT ''
);
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_inventory" ON inventory;
CREATE POLICY "anon_select_inventory" ON inventory FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_inventory" ON inventory;
CREATE POLICY "anon_insert_inventory" ON inventory FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_inventory" ON inventory;
CREATE POLICY "anon_update_inventory" ON inventory FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_inventory" ON inventory;
CREATE POLICY "anon_delete_inventory" ON inventory FOR DELETE TO anon, authenticated USING (true);

-- movements
CREATE TABLE IF NOT EXISTS movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id text NOT NULL DEFAULT '',
  item_name text NOT NULL DEFAULT '',
  delta integer NOT NULL DEFAULT 0,
  reason text NOT NULL DEFAULT '',
  timestamp timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE movements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_movements" ON movements;
CREATE POLICY "anon_select_movements" ON movements FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_movements" ON movements;
CREATE POLICY "anon_insert_movements" ON movements FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_movements" ON movements;
CREATE POLICY "anon_update_movements" ON movements FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_movements" ON movements;
CREATE POLICY "anon_delete_movements" ON movements FOR DELETE TO anon, authenticated USING (true);

-- payroll_history
CREATE TABLE IF NOT EXISTS payroll_history (
  id text PRIMARY KEY,
  period text NOT NULL,
  total_gross numeric NOT NULL DEFAULT 0,
  total_net numeric NOT NULL DEFAULT 0,
  employee_count integer NOT NULL DEFAULT 0,
  disbursed_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE payroll_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_payroll_history" ON payroll_history;
CREATE POLICY "anon_select_payroll_history" ON payroll_history FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_payroll_history" ON payroll_history;
CREATE POLICY "anon_insert_payroll_history" ON payroll_history FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_payroll_history" ON payroll_history;
CREATE POLICY "anon_update_payroll_history" ON payroll_history FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_payroll_history" ON payroll_history;
CREATE POLICY "anon_delete_payroll_history" ON payroll_history FOR DELETE TO anon, authenticated USING (true);

-- mpesa_transactions
CREATE TABLE IF NOT EXISTS mpesa_transactions (
  id text PRIMARY KEY,
  amount numeric NOT NULL DEFAULT 0,
  sender text NOT NULL DEFAULT '',
  date text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'Unmatched',
  match_score text,
  invoice text
);
ALTER TABLE mpesa_transactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_mpesa_transactions" ON mpesa_transactions;
CREATE POLICY "anon_select_mpesa_transactions" ON mpesa_transactions FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_mpesa_transactions" ON mpesa_transactions;
CREATE POLICY "anon_insert_mpesa_transactions" ON mpesa_transactions FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_mpesa_transactions" ON mpesa_transactions;
CREATE POLICY "anon_update_mpesa_transactions" ON mpesa_transactions FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_mpesa_transactions" ON mpesa_transactions;
CREATE POLICY "anon_delete_mpesa_transactions" ON mpesa_transactions FOR DELETE TO anon, authenticated USING (true);

-- bank_transactions
CREATE TABLE IF NOT EXISTS bank_transactions (
  id text PRIMARY KEY,
  amount numeric NOT NULL DEFAULT 0,
  sender text NOT NULL DEFAULT '',
  date text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'Unmatched'
);
ALTER TABLE bank_transactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_bank_transactions" ON bank_transactions;
CREATE POLICY "anon_select_bank_transactions" ON bank_transactions FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_bank_transactions" ON bank_transactions;
CREATE POLICY "anon_insert_bank_transactions" ON bank_transactions FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_bank_transactions" ON bank_transactions;
CREATE POLICY "anon_update_bank_transactions" ON bank_transactions FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_bank_transactions" ON bank_transactions;
CREATE POLICY "anon_delete_bank_transactions" ON bank_transactions FOR DELETE TO anon, authenticated USING (true);

-- activity_log
CREATE TABLE IF NOT EXISTS activity_log (
  id text PRIMARY KEY,
  type text NOT NULL DEFAULT '',
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  icon text,
  timestamp timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_activity_log" ON activity_log;
CREATE POLICY "anon_select_activity_log" ON activity_log FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_activity_log" ON activity_log;
CREATE POLICY "anon_insert_activity_log" ON activity_log FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_activity_log" ON activity_log;
CREATE POLICY "anon_update_activity_log" ON activity_log FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_activity_log" ON activity_log;
CREATE POLICY "anon_delete_activity_log" ON activity_log FOR DELETE TO anon, authenticated USING (true);

-- Indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_bills_status ON bills(status);
CREATE INDEX IF NOT EXISTS idx_movements_item_id ON movements(item_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_timestamp ON activity_log(timestamp DESC);
