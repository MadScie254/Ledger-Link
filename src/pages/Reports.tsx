import { useAppStore } from "@/store/useAppStore";
import { useMemo, useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

function ReportsSkeleton() {
  return (
    <div className="flex h-full flex-col space-y-6 overflow-hidden">
      <div className="flex items-end justify-between shrink-0">
        <div>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 space-y-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card shadow-sm p-6">
          <Skeleton className="h-6 w-32 mb-4" />
          <Skeleton className="h-48 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function Reports() {
  const { invoices, bills, payrollHistory, accounts } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const { incomeGroups, expenseGroups, totalIncome, totalExpense, netIncome, chartData } = useMemo(() => {
    // 1. Calculate Income (Paid Invoices)
    const paidInvoices = invoices.filter(inv => inv.status === "Paid");
    const incomeAccs: Record<string, number> = {};
    let tIncome = 0;

    paidInvoices.forEach(inv => {
      // Find the account or use default based on org sector? 
      // We'll use the assigned accountId, or default to "Uncategorized Income"
      const accName = accounts.find(a => a.id === inv.accountId)?.name || "Uncategorized Income";
      incomeAccs[accName] = (incomeAccs[accName] || 0) + inv.rawAmount;
      tIncome += inv.rawAmount;
    });

    const incomeGroups = Object.entries(incomeAccs).map(([name, amount]) => ({ name, amount }));

    // 2. Calculate Expenses (Paid Bills + Payroll)
    const paidBills = bills.filter(b => b.status === "Paid");
    const expenseAccs: Record<string, number> = {};
    let tExpense = 0;

    paidBills.forEach(b => {
      const accName = accounts.find(a => a.id === b.accountId)?.name || "Uncategorized Expense";
      expenseAccs[accName] = (expenseAccs[accName] || 0) + b.amount;
      tExpense += b.amount;
    });

    // Add Payroll
    const latestPayroll = payrollHistory[payrollHistory.length - 1];
    if (latestPayroll) {
      const payrollAccName = accounts.find(a => a.name.includes("Payroll"))?.name || "Payroll Expense";
      expenseAccs[payrollAccName] = (expenseAccs[payrollAccName] || 0) + latestPayroll.totalNet;
      tExpense += latestPayroll.totalNet;
    }

    const expenseGroups = Object.entries(expenseAccs).map(([name, amount]) => ({ name, amount }));

    const nIncome = tIncome - tExpense;

    // Chart Data (Income vs Expense)
    const cData = [
      { name: "Income", value: tIncome, color: "#10b981" },
      { name: "Expenses", value: tExpense, color: "#f43f5e" }
    ];

    return { incomeGroups, expenseGroups, totalIncome: tIncome, totalExpense: tExpense, netIncome: nIncome, chartData: cData };
  }, [invoices, bills, payrollHistory, accounts]);

  if (isLoading) return <ReportsSkeleton />;

  return (
    <div className="flex h-full flex-col space-y-6 overflow-hidden">
      <div className="flex items-end justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Reports
          </h2>
          <p className="text-sm text-muted-foreground">
            Basic financial overview and Income Statement.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
        {/* Income Statement Table */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border bg-muted/20 shrink-0">
            <h3 className="font-semibold text-card-foreground">Income Statement</h3>
            <p className="text-xs text-muted-foreground">For the current period</p>
          </div>
          <div className="overflow-auto flex-1 p-0">
            <Table>
              <TableBody>
                {/* INCOME SECTION */}
                <TableRow className="bg-success/5 dark:bg-success/10 hover:bg-success/5 dark:hover:bg-success/10">
                  <TableCell colSpan={2} className="font-bold text-success py-3 uppercase text-xs tracking-wider">
                    Income
                  </TableCell>
                </TableRow>
                {incomeGroups.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-8">
                      <EmptyState 
                        icon={TrendingUp} 
                        message="No income data found." 
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  incomeGroups.map((g, i) => (
                    <TableRow key={i} className="hover:bg-muted/30">
                      <TableCell className="pl-6 font-medium">{g.name}</TableCell>
                      <TableCell className="text-right">KES {g.amount.toLocaleString()}</TableCell>
                    </TableRow>
                  ))
                )}
                <TableRow className="bg-muted/10 hover:bg-muted/10 border-b-2 border-border">
                  <TableCell className="font-bold pl-6">Total Income</TableCell>
                  <TableCell className="text-right font-bold text-success">KES {totalIncome.toLocaleString()}</TableCell>
                </TableRow>

                {/* EXPENSE SECTION */}
                <TableRow className="bg-rose-50/50 dark:bg-rose-950/20 hover:bg-rose-50/50 dark:hover:bg-rose-950/20">
                  <TableCell colSpan={2} className="font-bold text-rose-800 dark:text-rose-400 py-3 uppercase text-xs tracking-wider border-t border-border">
                    Expenses
                  </TableCell>
                </TableRow>
                {expenseGroups.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-8">
                      <EmptyState 
                        icon={TrendingDown} 
                        message="No expense data found." 
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  expenseGroups.map((g, i) => (
                    <TableRow key={i} className="hover:bg-muted/30">
                      <TableCell className="pl-6 font-medium">{g.name}</TableCell>
                      <TableCell className="text-right">KES {g.amount.toLocaleString()}</TableCell>
                    </TableRow>
                  ))
                )}
                <TableRow className="bg-muted/10 hover:bg-muted/10 border-b-2 border-border">
                  <TableCell className="font-bold pl-6">Total Expenses</TableCell>
                  <TableCell className="text-right font-bold text-rose-600 dark:text-rose-400">KES {totalExpense.toLocaleString()}</TableCell>
                </TableRow>

                {/* NET INCOME */}
                <TableRow className={netIncome >= 0 ? "bg-success/10 dark:bg-success/20 hover:bg-success/10 dark:hover:bg-success/20" : "bg-destructive/10 dark:bg-destructive/20 hover:bg-destructive/10 dark:hover:bg-destructive/20"}>
                  <TableCell className="font-bold py-4">Net Income (Loss)</TableCell>
                  <TableCell className={`text-right font-extrabold text-lg py-4 ${netIncome >= 0 ? 'text-success' : 'text-destructive'}`}>
                    KES {netIncome.toLocaleString()}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Visual Summary */}
        <div className="rounded-xl border border-border bg-card shadow-sm p-6 flex flex-col">
          <h3 className="font-semibold text-card-foreground mb-6">Income vs Expenses</h3>
          <div className="flex-1 min-h-[250px] relative">
            {(totalIncome > 0 || totalExpense > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value: number) => `KES ${value.toLocaleString()}`}
                    contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--card)', color: 'var(--card-foreground)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground italic">
                No data to display
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
