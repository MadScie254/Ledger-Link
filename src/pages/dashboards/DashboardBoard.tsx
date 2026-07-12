import { useState, useEffect } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";

function BoardSkeleton() {
  return (
    <div className="flex h-full flex-col space-y-6 overflow-hidden">
      <div className="shrink-0">
        <Skeleton className="h-8 w-52 mb-2" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="grid grid-cols-1 gap-6 shrink-0 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-3">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-8 w-32" />
          </div>
        ))}
      </div>
      <div className="flex-1 rounded-xl border border-border bg-card p-8 shadow-sm">
        <Skeleton className="h-6 w-64 mb-8" />
        <Skeleton className="h-48 w-full" />
      </div>
    </div>
  );
}

export function DashboardBoard() {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  if (isLoading) return <BoardSkeleton />;

  return (
    <div className="flex h-full flex-col space-y-6 overflow-hidden">
      <div className="flex items-end justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Morning, Board Member
          </h2>
          <p className="text-sm text-muted-foreground">
            High-level financial summary and key performance indicators.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 shrink-0 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Net Income (YTD)
          </p>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold text-card-foreground">KES 8.4M</p>
            <span className="pb-1 text-sm font-medium text-emerald-500 dark:text-emerald-400">
              +5% YoY
            </span>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Current Assets
          </p>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold text-card-foreground">KES 12.1M</p>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Current Liabilities
          </p>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold text-card-foreground">KES 4.2M</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col rounded-xl border border-border bg-card p-8 shadow-sm">
        <div className="mb-8 flex items-center justify-between shrink-0">
          <h3 className="text-lg font-bold text-card-foreground">
            Revenue vs Expenses Trend (Trailing 7 Months)
          </h3>
          <div className="flex gap-6 text-sm font-medium text-foreground">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary"></div>
              Revenue
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
              Expenses
            </div>
          </div>
        </div>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 500 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 500 }} dx={-10} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--card-foreground))' }}
                itemStyle={{ fontSize: '14px', fontWeight: 500 }}
                labelStyle={{ fontSize: '14px', color: 'hsl(var(--muted-foreground))', marginBottom: '4px' }}
              />
              <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: 'hsl(var(--primary))', stroke: 'hsl(var(--background))', strokeWidth: 2 }} />
              <Line type="monotone" dataKey="expenses" stroke="#10b981" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#10b981', stroke: 'hsl(var(--background))', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

