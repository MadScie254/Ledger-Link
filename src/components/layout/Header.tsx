import React from "react";
import { Bell, Search, Moon, Sun, User, ChevronRight, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useAppStore } from "@/store/useAppStore";
import { useTheme } from "@/components/theme-provider";
import { useLocation, Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { organization, role } = useAuth();
  const qbConnected = useAppStore((state) => state.orgProfile.qbConnected);
  const customers = useAppStore((state) => state.customers);
  const invoices = useAppStore((state) => state.invoices);
  const bills = useAppStore((state) => state.bills);
  const accounts = useAppStore((state) => state.accounts);
  const inventory = useAppStore((state) => state.inventory);
  const staff = useAppStore((state) => state.staff);
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  // Create a simple breadcrumb from the pathname
  const path = location.pathname.split('/').filter(Boolean)[0] || "dashboard";
  const title = path.charAt(0).toUpperCase() + path.slice(1);

  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    const results = [];
    
    customers.forEach(c => {
      if (c.name.toLowerCase().includes(query) || c.id.toLowerCase().includes(query)) {
        results.push({ type: "Client", id: c.id, title: c.name, subtitle: c.sector, link: `/app/clients?highlight=${c.id}` });
      }
    });
    
    invoices.forEach(i => {
      if (i.client.toLowerCase().includes(query) || i.id.toLowerCase().includes(query)) {
        results.push({ type: "Invoice", id: i.id, title: `${i.id} - ${i.client}`, subtitle: `KES ${i.amount}`, link: `/app/invoicing?highlight=${i.id}` });
      }
    });

    bills.forEach(b => {
      if (b.vendor.toLowerCase().includes(query) || b.id.toLowerCase().includes(query)) {
        results.push({ type: "Bill", id: b.id, title: `${b.id} - ${b.vendor}`, subtitle: `KES ${b.amount.toLocaleString()}`, link: `/app/accounting?tab=bills&highlight=${b.id}` });
      }
    });

    accounts.forEach(a => {
      if (a.name.toLowerCase().includes(query)) {
        results.push({ type: "Account", id: a.id, title: a.name, subtitle: a.type, link: `/app/settings?highlight=${a.id}` });
      }
    });

    return results.slice(0, 8);
  }, [searchQuery, customers, invoices, bills, accounts]);

  const notifications = React.useMemo(() => {
    const items: { id: string; label: string; detail: string; link: string }[] = [];
    const now = new Date();

    // Overdue invoices (status "Overdue" or Pending past dueDate)
    invoices.forEach(inv => {
      if (inv.status === "Overdue") {
        items.push({ id: `inv-od-${inv.id}`, label: `Invoice ${inv.id} overdue`, detail: `${inv.client} · KES ${inv.amount}`, link: `/app/invoicing?highlight=${inv.id}` });
      } else if (inv.status === "Pending") {
        const due = new Date(inv.dueDate);
        if (!isNaN(due.getTime()) && due < now) {
          items.push({ id: `inv-pd-${inv.id}`, label: `Invoice ${inv.id} past due`, detail: `${inv.client} · KES ${inv.amount}`, link: `/app/invoicing?highlight=${inv.id}` });
        }
      }
    });

    // Low-stock inventory (qty <= minQty)
    inventory.forEach(item => {
      if (item.qty <= item.minQty) {
        items.push({ id: `inv-ls-${item.id}`, label: `${item.name} low stock`, detail: `${item.qty} / ${item.minQty} ${item.unit} remaining`, link: `/app/inventory?highlight=${item.id}` });
      }
    });

    // Overdue unpaid bills
    bills.forEach(bill => {
      if (bill.status === "Unpaid") {
        const due = new Date(bill.dueDate);
        if (!isNaN(due.getTime()) && due < now) {
          items.push({ id: `bill-od-${bill.id}`, label: `Bill ${bill.id} overdue`, detail: `${bill.vendor} · KES ${bill.amount.toLocaleString()}`, link: `/app/accounting?tab=bills&highlight=${bill.id}` });
        }
      }
    });

    // Payroll due within 5 days (active staff exist and no recent disbursement)
    const activeStaffCount = staff.filter(s => s.status === "Active").length;
    if (activeStaffCount > 0) {
      const dayOfMonth = now.getDate();
      // Payroll is typically due at end of month; alert if within last 5 days
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      if (dayOfMonth >= daysInMonth - 5) {
        const totalGross = staff.filter(s => s.status === "Active").reduce((sum, s) => sum + s.gross, 0);
        items.push({ id: "payroll-due", label: "Payroll due soon", detail: `${activeStaffCount} staff · KES ${totalGross.toLocaleString()}`, link: "/app/payroll?highlight=payroll-due" });
      }
    }

    return items;
  }, [invoices, inventory, bills, staff]);

  const handleNotImplemented = (action: string) => {
    toast.info(`${action} is not implemented in this demo.`);
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-background px-4 md:px-8">
      <div className="flex flex-1 items-center gap-4 md:gap-6">
        {/* Hamburger button — mobile only */}
        <button
          onClick={onMenuClick}
          className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors md:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open navigation</span>
        </button>

        <div className="flex items-center text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">LedgerLink</Link>
          <ChevronRight className="h-4 w-4 mx-1 opacity-50" />
          <span className="font-medium text-foreground">{title}</span>
        </div>

        <div className="relative w-96 max-w-md hidden md:block">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder="Search everything..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-input bg-background py-1.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
          />
          {searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-1 rounded-md border border-border bg-card shadow-lg z-50 overflow-hidden">
              {searchResults.length > 0 ? (
                <div className="flex flex-col">
                  {searchResults.map(res => (
                    <Link 
                      key={res.id} 
                      to={res.link}
                      onClick={() => setSearchQuery("")}
                      className="flex flex-col px-3 py-2 hover:bg-muted transition-colors border-b border-border last:border-0"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-foreground">{res.title}</span>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{res.type}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{res.subtitle}</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-3 text-sm text-muted-foreground text-center">
                  No results found for "{searchQuery}".
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className={`flex items-center gap-2 rounded-full border px-3 py-1 ${qbConnected ? 'border-success/30 bg-success/10 text-success dark:bg-success/20 dark:border-success/30' : 'border-slate-200 bg-slate-50 text-slate-500 dark:bg-slate-800 dark:border-slate-700'}`}>
          <div className={`h-1.5 w-1.5 rounded-full ${qbConnected ? 'bg-success' : 'bg-slate-400'}`}></div>
          <span className="text-[11px] font-semibold uppercase tracking-wider">
            {qbConnected ? 'QB Synced' : 'QB Disconnected'}
          </span>
        </div>

        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          <span className="sr-only">Toggle theme</span>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="relative flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus:outline-none cursor-pointer">
            {notifications.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">{notifications.length > 9 ? '9+' : notifications.length}</span>
            )}
            <span className="sr-only">View notifications</span>
            <Bell className="h-4 w-4" aria-hidden="true" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Notifications{notifications.length > 0 && ` (${notifications.length})`}</DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            {notifications.length > 0 ? (
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <Link key={n.id} to={n.link} className="block">
                    <DropdownMenuItem className="flex flex-col items-start gap-0.5 cursor-pointer">
                      <span className="text-sm font-medium text-foreground">{n.label}</span>
                      <span className="text-xs text-muted-foreground">{n.detail}</span>
                    </DropdownMenuItem>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-4 text-sm text-center text-muted-foreground">
                No new notifications.
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 focus:outline-none cursor-pointer p-1 rounded-full hover:bg-muted transition-colors">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs border border-primary/20">
              {role.charAt(0).toUpperCase()}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{organization}</p>
                  <p className="text-xs leading-none text-muted-foreground capitalize">
                    {role}
                  </p>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleNotImplemented("Switch Organization")}>Switch Organization</DropdownMenuItem>
            <Link to="/settings"><DropdownMenuItem>Organization Settings</DropdownMenuItem></Link>
            <DropdownMenuItem onClick={() => handleNotImplemented("Billing")}>Billing</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleNotImplemented("Log out")}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

