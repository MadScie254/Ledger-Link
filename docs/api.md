# LedgerLink API Documentation (Planned)

## Core Endpoints

### 1. Invoicing & Payments
- `GET /api/invoices`: List all invoices with pagination and filters (status, client).
- `POST /api/invoices`: Create a new invoice.
- `GET /api/invoices/:id`: Retrieve details of a specific invoice.
- `POST /api/invoices/:id/send`: Trigger email/SMS delivery of the invoice.
- `POST /api/payments/match`: Match an incoming M-Pesa transaction to an invoice.

### 2. Payroll
- `GET /api/payroll/staff`: List all staff members for the current tenant.
- `POST /api/payroll/run`: Generate a monthly payroll run calculating PAYE, NSSF, SHA.
- `GET /api/payroll/payslips/:id`: Download PDF payslip.

### 3. Inventory
- `GET /api/inventory`: List stock items with current quantities.
- `POST /api/inventory/movement`: Log a stock addition or deduction.
- `GET /api/inventory/alerts`: Fetch low-stock warnings.

### 4. QuickBooks Sync
- `POST /api/qbo/sync`: Trigger a manual two-way sync with QuickBooks Online.
- `GET /api/qbo/status`: Check the health and last sync timestamp.

### 5. Multi-Tenant Administration
- `GET /api/auth/me`: Get current user profile and role.
- `GET /api/tenants`: (Admin only) List all active client organizations.

## Authentication
All API endpoints (except public webhooks) will require a valid JWT Bearer token in the `Authorization` header. Requests are scoped automatically to the user's `tenant_id`.

## Third-Party Integrations
- **M-Pesa Daraja**: Webhook endpoint will be configured at `/api/webhooks/mpesa` to receive C2B payment confirmations.
- **QuickBooks Online**: OAuth 2.0 flow initiated via `/api/qbo/connect`.
