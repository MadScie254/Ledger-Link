import { useState, useEffect, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useAppStore } from "@/store/useAppStore";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, ChevronLeft, ChevronRight, Plus, X, User, Receipt, FileText, CheckCircle, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

// ---------- Calendar Types ----------

interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  type: "invoice-due" | "payroll" | "compliance" | "custom";
  color: string;
}

function CalendarDialog({ open, onOpenChange, events }: { open: boolean; onOpenChange: (v: boolean) => void; events: CalendarEvent[] }) {
  const [viewDate, setViewDate] = useState(new Date(2026, 6, 1)); // July 2026
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [customEvents, setCustomEvents] = useState<CalendarEvent[]>([]);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");

  const allEvents = [...events, ...customEvents];

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const getDateKey = (day: number) => `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const eventsForDate = (day: number) => allEvents.filter(e => e.date === getDateKey(day));
  const selectedEvents = selectedDate ? allEvents.filter(e => e.date === selectedDate) : [];

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const handleAddEvent = () => {
    if (!newEventTitle.trim() || !selectedDate) return;
    setCustomEvents(prev => [...prev, {
      id: Math.random().toString(36).substring(2, 9),
      title: newEventTitle.trim(),
      date: selectedDate,
      type: "custom",
      color: "bg-violet-500"
    }]);
    setNewEventTitle("");
    setShowAddEvent(false);
    toast.success("Event added.");
  };

  const removeCustomEvent = (id: string) => {
    setCustomEvents(prev => prev.filter(e => e.id !== id));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Calendar</DialogTitle>
          <DialogDescription>Track invoice due dates, payroll runs, and compliance deadlines.</DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="icon" onClick={prevMonth}><ChevronLeft className="h-4 w-4" /></Button>
            <h3 className="text-lg font-bold text-foreground">{monthName}</h3>
            <Button variant="ghost" size="icon" onClick={nextMonth}><ChevronRight className="h-4 w-4" /></Button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-px mb-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
              <div key={d} className="text-center text-xs font-semibold text-muted-foreground py-1">{d}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-px border border-border rounded-lg overflow-hidden">
            {days.map((day, i) => {
              if (day === null) return <div key={`empty-${i}`} className="h-20 bg-muted/30" />;
              const dateKey = getDateKey(day);
              const dayEvents = eventsForDate(day);
              const isToday = dateKey === todayKey;
              const isSelected = dateKey === selectedDate;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(dateKey)}
                  className={`h-20 p-1 text-left bg-card hover:bg-muted/50 transition-colors relative flex flex-col ${
                    isSelected ? "ring-2 ring-primary ring-inset" : ""
                  }`}
                >
                  <span className={`text-xs font-medium inline-flex items-center justify-center w-5 h-5 rounded-full ${
                    isToday ? "bg-primary text-primary-foreground" : "text-foreground"
                  }`}>{day}</span>
                  <div className="flex flex-wrap gap-0.5 mt-0.5">
                    {dayEvents.slice(0, 3).map(e => (
                      <span key={e.id} className={`w-full text-[9px] leading-tight truncate px-1 py-0.5 rounded ${e.color} text-white`}>{e.title}</span>
                    ))}
                    {dayEvents.length > 3 && <span className="text-[9px] text-muted-foreground">+{dayEvents.length - 3}</span>}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected date detail */}
          {selectedDate && (
            <div className="mt-4 border-t border-border pt-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-foreground">
                  Events for {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                </h4>
                <Button variant="outline" size="sm" onClick={() => setShowAddEvent(true)}>
                  <Plus className="mr-1 h-3 w-3" /> Add Event
                </Button>
              </div>

              {showAddEvent && (
                <div className="flex items-center gap-2 mb-3">
                  <input
                    className="flex-1 rounded-md border border-input bg-background py-1.5 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Event title..."
                    value={newEventTitle}
                    onChange={e => setNewEventTitle(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleAddEvent()}
                  />
                  <Button size="sm" onClick={handleAddEvent}>Add</Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowAddEvent(false)}><X className="h-3 w-3" /></Button>
                </div>
              )}

              {selectedEvents.length > 0 ? (
                <div className="space-y-2">
                  {selectedEvents.map(e => (
                    <div key={e.id} className="flex items-center gap-2 text-sm">
                      <span className={`w-2.5 h-2.5 rounded-full ${e.color} shrink-0`} />
                      <span className="flex-1">{e.title}</span>
                      <span className="text-xs text-muted-foreground capitalize">{e.type.replace("-", " ")}</span>
                      {e.type === "custom" && (
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => removeCustomEvent(e.id)}>
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No events on this day.</p>
              )}
            </div>
          )}

          {/* Legend */}
          <div className="flex gap-4 mt-4 pt-3 border-t border-border">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Invoice Due</div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Payroll</div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Compliance</div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="w-2.5 h-2.5 rounded-full bg-violet-500" /> Custom</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ---------- helpers ----------

function formatKES(value: number): string {
  if (value >= 1_000_000) return `KES ${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `KES ${(value / 1_000).toFixed(0)}K`;
  return `KES ${value.toLocaleString()}`;
}

interface SectorConfig {
  invoicedLabel: string;
  arrearsLabel: string;
  complianceText: string;
  extraCards: { label: string; value: string; highlight?: boolean }[];
}

function getSectorConfig(sector: string): SectorConfig {
  switch (sector) {
    case "School":
      return {
        invoicedLabel: "Total Invoiced (MTD)",
        arrearsLabel: "Unpaid School Fees",
        complianceText: "Term fee collection deadline in 3 days — follow up with parents who have outstanding balances",
        extraCards: [],
      };
    case "Church":
      return {
        invoicedLabel: "Offerings & Pledges (MTD)",
        arrearsLabel: "Outstanding Pledges",
        complianceText: "Annual financial statement filing deadline approaching — ensure all offerings are reconciled",
        extraCards: [
          { label: "Trust/Building Fund Balance", value: "KES 1.8M" },
        ],
      };
    case "Law Firm":
      return {
        invoicedLabel: "Total Billed (MTD)",
        arrearsLabel: "Outstanding Arrears",
        complianceText: "LSK annual practising certificate renewal due — ensure compliance filings are current",
        extraCards: [
          { label: "Client Trust Account", value: "KES 5.2M", highlight: true },
        ],
      };
    case "Hospital / Clinic":
      return {
        invoicedLabel: "Patient Billing (MTD)",
        arrearsLabel: "Outstanding Arrears",
        complianceText: "NHIF remittance deadline in 3 days — ensure all claims are submitted",
        extraCards: [],
      };
    default:
      return {
        invoicedLabel: "Total Invoiced (MTD)",
        arrearsLabel: "Outstanding Arrears",
        complianceText: "PAYE and NSSF Filing Deadline in 3 days (15th July)",
        extraCards: [],
      };
  }
}

// ---------- skeleton ----------

function DashboardSkeleton() {
  return (
    <div className="flex h-full flex-col space-y-6 overflow-hidden">
      <div className="shrink-0">
        <Skeleton className="h-8 w-60 mb-2" />
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="grid grid-cols-1 gap-6 shrink-0 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-3">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-3 w-28" />
          </div>
        ))}
      </div>
      <div className="grid flex-1 grid-cols-1 gap-6 min-h-0 lg:grid-cols-3">
        <div className="col-span-2 rounded-xl border border-border bg-card p-6 shadow-sm">
          <Skeleton className="h-5 w-48 mb-6" />
          <Skeleton className="h-48 w-full" />
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
          <Skeleton className="h-5 w-32 mb-2" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3 pb-4 border-b border-border last:border-0">
              <Skeleton className="h-8 w-8 rounded shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-36" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <Skeleton className="h-14 w-full rounded-xl shrink-0" />
    </div>
  );
}

// ---------- component ----------

export function DashboardOwner() {
  const { role } = useAuth();
  const isFinance = role === "finance";

  const invoices = useAppStore((s) => s.invoices);
  const staff = useAppStore((s) => s.staff);
  const inventory = useAppStore((s) => s.inventory);
  const sector = useAppStore((s) => s.orgProfile.sector);
  const payrollHistory = useAppStore((s) => s.payrollHistory);
  const mpesaTransactions = useAppStore((s) => s.mpesaTransactions);
  const bankTransactions = useAppStore((s) => s.bankTransactions);
  const bills = useAppStore((s) => s.bills);
  const activityLog = useAppStore((s) => s.activityLog);

  const [isLoading, setIsLoading] = useState(true);
  const [calendarOpen, setCalendarOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  // ---------- calendar events ----------

  const calendarEvents: CalendarEvent[] = useMemo(() => {
    const events: CalendarEvent[] = [];

    // Invoice due dates
    invoices.forEach(inv => {
      const parsed = new Date(inv.dueDate);
      if (!isNaN(parsed.getTime())) {
        const key = `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}-${String(parsed.getDate()).padStart(2, "0")}`;
        events.push({
          id: `inv-${inv.id}`,
          title: `${inv.id} due (${inv.client})`,
          date: key,
          type: "invoice-due",
          color: inv.status === "Overdue" ? "bg-red-500" : "bg-amber-500"
        });
      }
    });

    // Payroll disbursement dates
    payrollHistory.forEach(ph => {
      const parsed = new Date(ph.disbursedAt);
      if (!isNaN(parsed.getTime())) {
        const key = `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}-${String(parsed.getDate()).padStart(2, "0")}`;
        events.push({ id: `pay-${ph.id}`, title: `Payroll: ${ph.period}`, date: key, type: "payroll", color: "bg-emerald-500" });
      }
    });

    // Compliance: PAYE / NSSF / SHA on the 9th and 15th of each month
    events.push({ id: "comp-paye-jul", title: "PAYE Filing Deadline", date: "2026-07-09", type: "compliance", color: "bg-red-500" });
    events.push({ id: "comp-nssf-jul", title: "NSSF/SHA Remittance", date: "2026-07-15", type: "compliance", color: "bg-red-500" });
    events.push({ id: "comp-vat-jul", title: "VAT Return Due", date: "2026-07-20", type: "compliance", color: "bg-red-500" });

    return events;
  }, [invoices, payrollHistory]);

  // ---------- derived KPIs ----------

  const totalInvoicedMTD = useMemo(() => {
    const now = new Date();
    return invoices
      .filter((inv) => {
        const d = new Date(inv.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .reduce((sum, inv) => sum + inv.rawAmount, 0);
  }, [invoices]);

  const outstandingArrears = useMemo(() => {
    return invoices
      .filter((inv) => inv.status === "Overdue" || inv.status === "Pending")
      .reduce((sum, inv) => sum + inv.rawAmount, 0);
  }, [invoices]);

  const overdueCount = useMemo(
    () => invoices.filter((inv) => inv.status === "Overdue").length,
    [invoices]
  );

  const totalPayrollDue = useMemo(
    () => staff.filter((s) => s.status === "Active").reduce((sum, s) => sum + s.gross, 0),
    [staff]
  );

  const lowStockCount = useMemo(
    () => inventory.filter((item) => item.qty < item.minQty).length,
    [inventory]
  );

  const cashPosition = useMemo(() => {
    let cash = 2000000;
    mpesaTransactions.filter(t => t.status === "Matched").forEach(t => cash += t.amount);
    bankTransactions.filter(t => t.status === "Matched").forEach(t => cash += t.amount);
    bills.filter(b => b.status === "Paid").forEach(b => cash -= b.amount);
    payrollHistory.forEach(p => cash -= p.totalNet);
    return cash;
  }, [mpesaTransactions, bankTransactions, bills, payrollHistory]);

  const dynamicChartData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const data = months.map(m => ({ name: m, revenue: 0, expenses: 0 }));

    invoices.filter(i => i.status === "Paid").forEach(inv => {
      const d = new Date(inv.date);
      if (d.getFullYear() === 2026) data[d.getMonth()].revenue += inv.rawAmount;
    });

    bills.filter(b => b.status === "Paid").forEach(b => {
      const d = new Date(b.date);
      if (d.getFullYear() === 2026) data[d.getMonth()].expenses += b.amount;
    });

    payrollHistory.forEach(ph => {
      const d = new Date(ph.disbursedAt);
      if (d.getFullYear() === 2026) data[d.getMonth()].expenses += ph.totalNet;
    });

    return data.slice(0, 7);
  }, [invoices, bills, payrollHistory]);

  // ---------- sector config ----------

  const cfg = useMemo(() => getSectorConfig(sector), [sector]);

  const handleNotImplemented = (feature: string) => {
    toast.info(`${feature} is not implemented in this demo.`);
  };

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="flex h-full flex-col space-y-6 overflow-hidden">
      <div className="flex items-end justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Morning, {isFinance ? "Finance Manager" : "Owner"}
          </h2>
          <p className="text-sm text-muted-foreground">
            Wednesday, 12th June 2026
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 shrink-0 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {cfg.invoicedLabel}
          </p>
          <div className="flex items-end gap-2">
            <p className="text-2xl font-bold text-card-foreground">{formatKES(totalInvoicedMTD)}</p>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {cfg.arrearsLabel}
          </p>
          <div className="flex items-end gap-2">
            <p className="text-2xl font-bold text-card-foreground">{formatKES(outstandingArrears)}</p>
            {overdueCount > 0 && (
              <span className="pb-1 text-xs font-medium text-amber-500 dark:text-amber-400">
                {overdueCount} invoice{overdueCount > 1 ? "s" : ""} overdue
              </span>
            )}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Cash Position
          </p>
          <div className="flex items-end gap-2">
            <p className="text-2xl font-bold text-card-foreground">{formatKES(cashPosition)}</p>
            <span className="pb-1 text-xs font-medium text-emerald-500 dark:text-emerald-400">
              Live
            </span>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Bookkeeping Health
          </p>
          <div className="flex items-end gap-3 mt-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 shrink-0">
              <div className="h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
            </div>
            <div>
              <p className="text-lg font-bold text-card-foreground leading-none">Excellent</p>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                Reconciled &middot; 0 uncategorized
              </span>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Payroll Due
          </p>
          <div className="flex items-end gap-2">
            <p className="text-2xl font-bold text-card-foreground">{formatKES(totalPayrollDue)}</p>
            <span className="pb-1 text-xs font-medium text-muted-foreground">
              {staff.filter((s) => s.status === "Active").length} active staff
            </span>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Inventory Alerts
          </p>
          <div className="flex items-end gap-2">
            <p className="text-2xl font-bold text-card-foreground">{lowStockCount}</p>
            <span className={`pb-1 text-xs font-medium ${lowStockCount > 0 ? 'text-amber-500 dark:text-amber-400' : 'text-emerald-500 dark:text-emerald-400'}`}>
              {lowStockCount > 0 ? 'items below min stock' : 'All stocked'}
            </span>
          </div>
        </div>

        {/* Sector-specific extra cards */}
        {cfg.extraCards.map((card) => (
          <div
            key={card.label}
            className={`rounded-xl border bg-card p-5 shadow-sm ${
              card.highlight
                ? 'border-amber-400 dark:border-amber-600 ring-1 ring-amber-400/30'
                : 'border-border'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              {card.highlight && (
                <Shield className="h-4 w-4 text-amber-500 shrink-0" />
              )}
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {card.label}
              </p>
            </div>
            <div className="flex items-end gap-2">
              <p className="text-2xl font-bold text-card-foreground">{card.value}</p>
              {card.highlight && (
                <span className="pb-1 text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Segregated
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid flex-1 grid-cols-1 gap-6 min-h-0 lg:grid-cols-3">
        <div className="col-span-2 flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between shrink-0">
            <h3 className="font-bold text-card-foreground">
              Revenue vs Expenses Trend
            </h3>
            <div className="flex gap-4 text-xs font-medium text-foreground">
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-primary"></div>
                Revenue
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                Expenses
              </div>
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dynamicChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 500 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 500 }} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--card-foreground))' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 500 }}
                  labelStyle={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', marginBottom: '4px' }}
                />
                <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: 'hsl(var(--primary))', stroke: 'hsl(var(--background))', strokeWidth: 2 }} />
                <Line type="monotone" dataKey="expenses" stroke="#10b981" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#10b981', stroke: 'hsl(var(--background))', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm overflow-hidden">
          <h3 className="mb-4 font-bold text-card-foreground shrink-0">
            Recent Activity
          </h3>
          <div className="flex-1 space-y-4 overflow-y-auto">
            {activityLog.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No recent activity.</p>
            )}
            {activityLog.slice(0, 5).map((act, index) => {
              const isLast = index === Math.min(activityLog.length, 5) - 1;
              let Icon = Activity;
              if (act.icon === "shield") Icon = Shield;
              if (act.icon === "user") Icon = User;
              if (act.icon === "receipt") Icon = Receipt;
              if (act.icon === "file-text") Icon = FileText;
              if (act.icon === "check-circle") Icon = CheckCircle;

              return (
                <div key={act.id} className={`flex items-start gap-3 pb-4 ${!isLast ? 'border-b border-border' : ''}`}>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-card-foreground">
                      {act.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {act.description}
                    </p>
                  </div>
                  <p className="ml-auto whitespace-nowrap text-[10px] text-muted-foreground">
                    {new Date(act.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="bg-primary text-primary-foreground rounded-xl p-4 flex items-center justify-between shrink-0 shadow-lg shadow-primary/20">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-primary-foreground/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <p className="text-sm font-medium">Compliance Alert</p>
          </div>
          <div className="h-4 w-px bg-primary-foreground/20"></div>
          <p className="text-sm text-primary-foreground/90">{cfg.complianceText}</p>
        </div>
        <button onClick={() => setCalendarOpen(true)} className="px-4 py-1.5 bg-background text-primary rounded-lg text-xs font-bold hover:bg-muted transition-colors">
          View Calendar
        </button>
      </div>

      {/* Calendar Dialog */}
      <CalendarDialog open={calendarOpen} onOpenChange={setCalendarOpen} events={calendarEvents} />
    </div>
  );
}
