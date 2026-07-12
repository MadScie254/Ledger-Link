import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Users,
  Package,
  LineChart,
  Settings,
  X,
  PieChart,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["owner", "finance", "board"] },
  { name: "Clients", href: "/clients", icon: Users, roles: ["owner", "finance"] },
  { name: "Invoicing", href: "/invoicing", icon: FileText, roles: ["owner", "finance"] },
  { name: "Payroll", href: "/payroll", icon: Users, roles: ["owner", "finance"] },
  { name: "Inventory", href: "/inventory", icon: Package, roles: ["owner", "finance", "board"] },
  { name: "Accounting", href: "/accounting", icon: LineChart, roles: ["owner", "finance", "board"] },
  { name: "Reports", href: "/reports", icon: PieChart, roles: ["owner", "finance", "board"] },
  { name: "Settings", href: "/settings", icon: Settings, roles: ["owner"] },
];

interface SidebarProps {
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
}

export function Sidebar({ isMobileOpen = false, setIsMobileOpen }: SidebarProps) {
  const { role, organization } = useAuth();
  const location = useLocation();

  // Auto-close mobile drawer on route change
  useEffect(() => {
    if (isMobileOpen && setIsMobileOpen) {
      setIsMobileOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between gap-3 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground shadow-sm">
            LL
          </div>
          <h1 className="text-xl font-bold tracking-tight">LedgerLink</h1>
        </div>
        {/* Close button for mobile only */}
        {setIsMobileOpen && (
          <button
            onClick={() => setIsMobileOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors md:hidden"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close sidebar</span>
          </button>
        )}
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto">
        <nav className="flex-1 space-y-1 px-4">
          <div className="px-2 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Menu
          </div>
          {navigation
            .filter((item) => item.roles.includes(role))
            .map((item) => {
              const isCurrent = location.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    isCurrent
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors",
                    "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 shrink-0",
                      isCurrent ? "text-primary" : "text-muted-foreground"
                    )}
                    aria-hidden="true"
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
        </nav>
      </div>
      <div className="mt-auto border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent/50 p-2">
          <div className="h-8 w-8 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs border border-primary/20">
            {role.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 overflow-hidden text-left">
            <p className="truncate text-xs font-medium text-sidebar-foreground">
              {organization}
            </p>
            <p className="text-[10px] text-muted-foreground capitalize">{role}</p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar — static, unchanged */}
      <aside className="hidden md:flex h-full w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar — overlay drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 transition-opacity"
            onClick={() => setIsMobileOpen?.(false)}
          />
          {/* Drawer panel */}
          <aside className="relative flex h-full w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border shadow-xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
