import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Users,
  Package,
  LineChart,
  Settings,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "#", icon: LayoutDashboard, current: true },
  { name: "Invoicing", href: "#invoicing", icon: FileText, current: false },
  { name: "Payroll", href: "#payroll", icon: Users, current: false },
  { name: "Inventory", href: "#inventory", icon: Package, current: false },
  { name: "Accounting", href: "#accounting", icon: LineChart, current: false },
  { name: "Settings", href: "#settings", icon: Settings, current: false },
];

interface SidebarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
}

export function Sidebar({ currentRoute, onNavigate }: SidebarProps) {
  return (
    <aside className="flex h-full w-64 flex-col bg-indigo-950 text-white shrink-0">
      <div className="flex items-center gap-3 p-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 font-bold text-white">
          LL
        </div>
        <h1 className="text-xl font-bold tracking-tight">LedgerLink</h1>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto">
        <nav className="flex-1 space-y-1 px-4">
          <div className="px-2 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Menu
          </div>
          {navigation.map((item) => {
            const isCurrent = currentRoute === item.name.toLowerCase();
            return (
              <button
                key={item.name}
                onClick={() => onNavigate(item.name.toLowerCase())}
                className={cn(
                  isCurrent
                    ? "bg-indigo-900/50 border-l-2 border-emerald-500 font-medium text-white"
                    : "text-slate-300 hover:text-white transition-colors",
                  "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm"
                )}
              >
                <item.icon
                  className="h-5 w-5 shrink-0"
                  aria-hidden="true"
                />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>
      <div className="mt-auto border-t border-indigo-900/50 p-4">
        <div className="flex items-center gap-3 rounded-lg bg-indigo-900/30 p-2">
          <div className="h-8 w-8 shrink-0 rounded-full bg-slate-600"></div>
          <div className="flex-1 overflow-hidden text-left">
            <p className="truncate text-xs font-medium text-white">
              Acme Kenya Ltd
            </p>
            <p className="text-[10px] text-slate-400">Administrator</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
