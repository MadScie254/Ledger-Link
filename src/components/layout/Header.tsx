import React from "react";
import { Bell, Search, Moon, Sun, User, ChevronRight, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
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
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  // Create a simple breadcrumb from the pathname
  const path = location.pathname.split('/').filter(Boolean)[0] || "dashboard";
  const title = path.charAt(0).toUpperCase() + path.slice(1);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast.info(`Search for "${searchQuery}" not implemented in this demo.`);
    }
  };

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

        <form onSubmit={handleSearch} className="relative w-96 max-w-md hidden md:block">
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
        </form>
      </div>

      <div className="flex items-center gap-4">
        <div className={`flex items-center gap-2 rounded-full border px-3 py-1 ${qbConnected ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-800' : 'border-slate-200 bg-slate-50 text-slate-500 dark:bg-slate-800 dark:border-slate-700'}`}>
          <div className={`h-1.5 w-1.5 rounded-full ${qbConnected ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
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
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full border border-background bg-amber-500"></span>
            <span className="sr-only">View notifications</span>
            <Bell className="h-4 w-4" aria-hidden="true" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="p-4 text-sm text-center text-muted-foreground">
              No new notifications.
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 focus:outline-none cursor-pointer p-1 rounded-full hover:bg-muted transition-colors">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs border border-primary/20">
              {role.charAt(0).toUpperCase()}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{organization}</p>
                <p className="text-xs leading-none text-muted-foreground capitalize">
                  {role}
                </p>
              </div>
            </DropdownMenuLabel>
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

