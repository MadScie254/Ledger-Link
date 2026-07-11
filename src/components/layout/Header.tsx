import { Bell, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";

export function Header() {
  const { organization } = useAuth();
  
  return (
    <header
      className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-8"
      style={{ borderBottom: "1px solid #e2e8f0" }}
    >
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-96">
          <Search
            className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder="Search everything..."
            className="w-full rounded-md border-none bg-slate-100 py-1.5 pl-10 pr-4 text-sm focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-emerald-700">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
          <span className="text-[11px] font-semibold uppercase tracking-wider">
            QB Synced
          </span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="relative flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 focus:outline-none cursor-pointer">
            <span className="absolute right-0 top-0 h-2 w-2 rounded-full border border-white bg-amber-500"></span>
            <span className="sr-only">View notifications</span>
            <Bell className="h-4 w-4" aria-hidden="true" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{organization}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Switch Organization</DropdownMenuItem>
            <DropdownMenuItem>Organization Settings</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
