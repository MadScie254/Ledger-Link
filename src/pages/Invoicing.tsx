import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Download, MoreHorizontal } from "lucide-react";

const invoices = [
  {
    id: "INV-2026-001",
    client: "Nairobi Academy",
    amount: "KES 450,000",
    status: "Paid",
    date: "Jul 01, 2026",
    dueDate: "Jul 15, 2026",
  },
  {
    id: "INV-2026-002",
    client: "Tech Solutions Ltd",
    amount: "KES 85,000",
    status: "Pending",
    date: "Jul 10, 2026",
    dueDate: "Jul 24, 2026",
  },
  {
    id: "INV-2026-003",
    client: "St. John's Hospital",
    amount: "KES 1,250,000",
    status: "Overdue",
    date: "Jun 01, 2026",
    dueDate: "Jun 15, 2026",
  },
  {
    id: "INV-2026-004",
    client: "Emmanuel Church",
    amount: "KES 120,000",
    status: "Paid",
    date: "Jul 05, 2026",
    dueDate: "Jul 19, 2026",
  },
  {
    id: "INV-2026-005",
    client: "Legal Associates",
    amount: "KES 350,000",
    status: "Pending",
    date: "Jul 11, 2026",
    dueDate: "Jul 25, 2026",
  },
];

export function Invoicing() {
  return (
    <div className="flex h-full flex-col space-y-6 overflow-hidden">
      <div className="flex items-end justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">
            Invoices
          </h2>
          <p className="text-sm text-slate-500">
            Manage your invoices, track payments, and send reminders.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="text-slate-700">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button className="bg-indigo-600 text-white hover:bg-indigo-700">
            <Plus className="mr-2 h-4 w-4" />
            New Invoice
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <Table>
            <TableHeader className="bg-slate-50/50 sticky top-0">
            <TableRow>
              <TableHead>Invoice ID</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium text-indigo-600">
                  {invoice.id}
                </TableCell>
                <TableCell>{invoice.client}</TableCell>
                <TableCell>{invoice.amount}</TableCell>
                <TableCell className="text-slate-500">{invoice.date}</TableCell>
                <TableCell className="text-slate-500">{invoice.dueDate}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      invoice.status === "Paid"
                        ? "default"
                        : invoice.status === "Overdue"
                        ? "destructive"
                        : "secondary"
                    }
                    className={
                      invoice.status === "Paid"
                        ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none"
                        : invoice.status === "Pending"
                        ? "bg-amber-100 text-amber-800 hover:bg-amber-100 border-none"
                        : "bg-slate-100 text-slate-800 hover:bg-slate-100 border-none"
                    }
                  >
                    {invoice.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
      </div>
    </div>
  );
}
