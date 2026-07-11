import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

const recentActivity = [
  { id: 1, type: "Invoice Paid", client: "Nairobi Academy", amount: "KES 450,000", time: "2 hours ago" },
  { id: 2, type: "Expense Logged", client: "Office Supplies", amount: "KES 12,500", time: "4 hours ago" },
  { id: 3, type: "Payroll Approved", client: "July 2026", amount: "KES 1,200,000", time: "1 day ago" },
  { id: 4, type: "Invoice Sent", client: "Tech Solutions Ltd", amount: "KES 85,000", time: "1 day ago" },
];

export function Dashboard() {
  return (
    <div className="flex h-full flex-col space-y-6 overflow-hidden">
      <div className="flex items-end justify-between shrink-0">
        <h2 className="text-2xl font-bold text-slate-800">
          Morning, Sarah
        </h2>
        <p className="text-sm text-slate-500">
          Wednesday, 12th June 2026
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 shrink-0 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Invoiced (MTD)
          </p>
          <div className="flex items-end gap-2">
            <p className="text-2xl font-bold text-slate-900">KES 2.4M</p>
            <span className="pb-1 text-xs font-medium text-emerald-500">
              +14% from last month
            </span>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Outstanding Arrears
          </p>
          <div className="flex items-end gap-2">
            <p className="text-2xl font-bold text-slate-900">KES 850K</p>
            <span className="pb-1 text-xs font-medium text-amber-500">
              3 invoices over 60 days
            </span>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Payroll Due
          </p>
          <div className="flex items-end gap-2">
            <p className="text-2xl font-bold text-slate-900">KES 1.2M</p>
            <span className="pb-1 text-xs font-medium text-slate-400">
              Due in 5 days
            </span>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Cash Position
          </p>
          <div className="flex items-end gap-2">
            <p className="text-2xl font-bold text-slate-900">KES 3.1M</p>
            <span className="pb-1 text-xs font-medium text-emerald-500">
              Healthy
            </span>
          </div>
        </div>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-6 min-h-0 lg:grid-cols-3">
        <div className="col-span-2 flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between shrink-0">
            <h3 className="font-bold text-slate-800">
              Revenue vs Expenses Trend
            </h3>
            <div className="flex gap-4 text-xs font-medium text-slate-900">
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-indigo-500"></div>
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
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 500 }}
                  labelStyle={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }} />
                <Line type="monotone" dataKey="expenses" stroke="#10b981" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm overflow-hidden">
          <h3 className="mb-4 font-bold text-slate-800 shrink-0">
            Recent Activity
          </h3>
          <div className="flex-1 space-y-4 overflow-y-auto">
            {recentActivity.map((activity, index) => {
              const isLast = index === recentActivity.length - 1;
              let initials = "LG";
              let colorClass = "bg-slate-50 text-slate-600";
              if (activity.type.includes("Invoice Paid")) {
                initials = "MP";
                colorClass = "bg-emerald-50 text-emerald-600";
              } else if (activity.type.includes("Expense")) {
                initials = "EX";
                colorClass = "bg-amber-50 text-amber-600";
              } else if (activity.type.includes("Payroll")) {
                initials = "PY";
                colorClass = "bg-indigo-50 text-indigo-600";
              } else if (activity.type.includes("Invoice Sent")) {
                initials = "IS";
                colorClass = "bg-blue-50 text-blue-600";
              }

              return (
                <div key={activity.id} className={`flex items-start gap-3 pb-4 ${!isLast ? 'border-b border-slate-100' : ''}`}>
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded font-bold text-xs uppercase ${colorClass}`}>
                    {initials}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900">
                      {activity.type}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {activity.client} &middot; {activity.amount}
                    </p>
                  </div>
                  <p className="ml-auto whitespace-nowrap text-[10px] text-slate-400">
                    {activity.time}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="bg-indigo-900 text-white rounded-xl p-4 flex items-center justify-between shrink-0 shadow-lg shadow-indigo-200/50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <p className="text-sm font-medium">Compliance Alert</p>
          </div>
          <div className="h-4 w-px bg-white/20"></div>
          <p className="text-sm text-indigo-100">PAYE and NSSF Filing Deadline in <span className="font-bold text-white uppercase">3 days</span> (15th July)</p>
        </div>
        <button className="px-4 py-1.5 bg-white text-indigo-900 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors">
          View Calendar
        </button>
      </div>
    </div>
  );
}
