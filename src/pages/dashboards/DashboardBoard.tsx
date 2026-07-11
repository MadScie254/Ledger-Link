import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", revenue: 4000, expenses: 2400 },
  { name: "Feb", revenue: 3000, expenses: 1398 },
  { name: "Mar", revenue: 2000, expenses: 9800 },
  { name: "Apr", revenue: 2780, expenses: 3908 },
  { name: "May", revenue: 1890, expenses: 4800 },
  { name: "Jun", revenue: 2390, expenses: 3800 },
  { name: "Jul", revenue: 3490, expenses: 4300 },
];

export function DashboardBoard() {
  return (
    <div className="flex h-full flex-col space-y-6 overflow-hidden">
      <div className="flex items-end justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Morning, Board Member
          </h2>
          <p className="text-sm text-slate-500">
            High-level financial summary and key performance indicators.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 shrink-0 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Net Income (YTD)
          </p>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold text-slate-900">KES 8.4M</p>
            <span className="pb-1 text-sm font-medium text-emerald-500">
              +5% YoY
            </span>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Current Assets
          </p>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold text-slate-900">KES 12.1M</p>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Current Liabilities
          </p>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold text-slate-900">KES 4.2M</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8 flex items-center justify-between shrink-0">
          <h3 className="text-lg font-bold text-slate-800">
            Revenue vs Expenses Trend (Trailing 7 Months)
          </h3>
          <div className="flex gap-6 text-sm font-medium text-slate-900">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-indigo-500"></div>
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
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} dx={-10} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ fontSize: '14px', fontWeight: 500 }}
                labelStyle={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}
              />
              <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }} />
              <Line type="monotone" dataKey="expenses" stroke="#10b981" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
