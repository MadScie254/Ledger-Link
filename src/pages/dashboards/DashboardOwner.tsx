import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { chartData } from "@/lib/mockData";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const recentActivity = [
  { id: 1, type: "Invoice Paid", client: "Nairobi Academy", amount: "KES 450,000", time: "2 hours ago" },
  { id: 2, type: "Expense Logged", client: "Office Supplies", amount: "KES 12,500", time: "4 hours ago" },
  { id: 3, type: "Payroll Approved", client: "July 2026", amount: "KES 1,200,000", time: "1 day ago" },
  { id: 4, type: "Invoice Sent", client: "Tech Solutions Ltd", amount: "KES 85,000", time: "1 day ago" },
];

export function DashboardOwner() {
  const { role } = useAuth();
  const isFinance = role === "finance";

  const handleNotImplemented = (feature: string) => {
    toast.info(`${feature} is not implemented in this demo.`);
  };

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
            Total Invoiced (MTD)
          </p>
          <div className="flex items-end gap-2">
            <p className="text-2xl font-bold text-card-foreground">KES 2.4M</p>
            <span className="pb-1 text-xs font-medium text-emerald-500 dark:text-emerald-400">
              +14% from last month
            </span>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Outstanding Arrears
          </p>
          <div className="flex items-end gap-2">
            <p className="text-2xl font-bold text-card-foreground">KES 850K</p>
            <span className="pb-1 text-xs font-medium text-amber-500 dark:text-amber-400">
              3 invoices over 60 days
            </span>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Cash Position
          </p>
          <div className="flex items-end gap-2">
            <p className="text-2xl font-bold text-card-foreground">KES 3.1M</p>
            <span className="pb-1 text-xs font-medium text-emerald-500 dark:text-emerald-400">
              Healthy
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
            Profit Margin (YTD)
          </p>
          <div className="flex items-end gap-2">
            <p className="text-2xl font-bold text-card-foreground">28.4%</p>
            <span className="pb-1 text-xs font-medium text-emerald-500 dark:text-emerald-400">
              +2.1% YoY
            </span>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Payroll Due
          </p>
          <div className="flex items-end gap-2">
            <p className="text-2xl font-bold text-card-foreground">KES 1.2M</p>
            <span className="pb-1 text-xs font-medium text-muted-foreground">
              Due in 5 days
            </span>
          </div>
        </div>
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
              <LineChart data={chartData}>
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
            {recentActivity.map((activity, index) => {
              const isLast = index === recentActivity.length - 1;
              let initials = "LG";
              let colorClass = "bg-muted text-muted-foreground";
              if (activity.type.includes("Invoice Paid")) {
                initials = "MP";
                colorClass = "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
              } else if (activity.type.includes("Expense")) {
                initials = "EX";
                colorClass = "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
              } else if (activity.type.includes("Payroll")) {
                initials = "PY";
                colorClass = "bg-primary/20 text-primary";
              } else if (activity.type.includes("Invoice Sent")) {
                initials = "IS";
                colorClass = "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
              }

              return (
                <div key={activity.id} className={`flex items-start gap-3 pb-4 ${!isLast ? 'border-b border-border' : ''}`}>
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded font-bold text-xs uppercase ${colorClass}`}>
                    {initials}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-card-foreground">
                      {activity.type}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {activity.client} &middot; {activity.amount}
                    </p>
                  </div>
                  <p className="ml-auto whitespace-nowrap text-[10px] text-muted-foreground">
                    {activity.time}
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
          <p className="text-sm text-primary-foreground/90">PAYE and NSSF Filing Deadline in <span className="font-bold text-primary-foreground uppercase">3 days</span> (15th July)</p>
        </div>
        <button onClick={() => handleNotImplemented("View Calendar")} className="px-4 py-1.5 bg-background text-primary rounded-lg text-xs font-bold hover:bg-muted transition-colors">
          View Calendar
        </button>
      </div>
    </div>
  );
}
