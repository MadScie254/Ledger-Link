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
import { Download, MoreHorizontal, ArrowUpDown, Smartphone } from "lucide-react";
import { useState, useMemo } from "react";

const initialInvoices = [
  {
    id: "INV-2026-001",
    client: "Nairobi Academy",
    amount: "450,000",
    rawAmount: 450000,
    status: "Paid",
    date: "Jul 01, 2026",
    dueDate: "Jul 15, 2026",
  },
  {
    id: "INV-2026-002",
    client: "Tech Solutions Ltd",
    amount: "85,000",
    rawAmount: 85000,
    status: "Pending",
    date: "Jul 10, 2026",
    dueDate: "Jul 24, 2026",
  },
  {
    id: "INV-2026-003",
    client: "St. John's Hospital",
    amount: "1,250,000",
    rawAmount: 1250000,
    status: "Overdue",
    date: "Jun 01, 2026",
    dueDate: "Jun 15, 2026",
  },
  {
    id: "INV-2026-004",
    client: "Emmanuel Church",
    amount: "120,000",
    rawAmount: 120000,
    status: "Paid",
    date: "Jul 05, 2026",
    dueDate: "Jul 19, 2026",
  },
  {
    id: "INV-2026-005",
    client: "Legal Associates",
    amount: "350,000",
    rawAmount: 350000,
    status: "Pending",
    date: "Jul 11, 2026",
    dueDate: "Jul 25, 2026",
  },
];

type SortField = "id" | "client" | "rawAmount" | "status" | "date" | "dueDate";
type SortOrder = "asc" | "desc";

export function Invoicing() {
  const [filter, setFilter] = useState("All");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleMpesaRequest = async (invoiceId: string, amount: number) => {
    try {
      setIsProcessing(invoiceId);
      const res = await fetch("/api/mpesa/stkpush", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amount,
          phone: "254700000000", // placeholder
          invoiceId: invoiceId
        })
      });
      const data = await res.json();
      if (res.ok) {
        alert("M-Pesa payment request sent to client's phone.");
      } else {
        alert("Error: " + data.error);
      }
    } catch (e) {
      alert("Failed to connect to M-Pesa API.");
    } finally {
      setIsProcessing(null);
    }
  };

  const filteredAndSortedInvoices = useMemo(() => {
    let result = [...initialInvoices];

    if (filter !== "All") {
      result = result.filter((inv) => inv.status === filter);
    }

    result.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [filter, sortField, sortOrder]);

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
          <Button className="bg-indigo-600 text-white hover:bg-indigo-700 border-none">
            New Invoice
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {["All", "Paid", "Pending", "Overdue"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
              filter === status
                ? "bg-indigo-100 text-indigo-700"
                : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <Table>
            <TableHeader className="bg-slate-50/50 sticky top-0 z-10 shadow-sm">
              <TableRow>
                <TableHead className="cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort("id")}>
                  <div className="flex items-center gap-1">Invoice ID <ArrowUpDown className="h-3 w-3" /></div>
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort("client")}>
                  <div className="flex items-center gap-1">Client <ArrowUpDown className="h-3 w-3" /></div>
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort("rawAmount")}>
                  <div className="flex items-center gap-1">Amount <ArrowUpDown className="h-3 w-3" /></div>
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort("date")}>
                  <div className="flex items-center gap-1">Date <ArrowUpDown className="h-3 w-3" /></div>
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort("dueDate")}>
                  <div className="flex items-center gap-1">Due Date <ArrowUpDown className="h-3 w-3" /></div>
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort("status")}>
                  <div className="flex items-center gap-1">Status <ArrowUpDown className="h-3 w-3" /></div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedInvoices.map((invoice) => (
                <TableRow key={invoice.id} className="hover:bg-slate-50/50">
                  <TableCell className="font-medium text-indigo-600">
                    {invoice.id}
                  </TableCell>
                  <TableCell className="font-medium text-slate-800">{invoice.client}</TableCell>
                  <TableCell>KES {invoice.amount}</TableCell>
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
                          : "bg-rose-100 text-rose-800 hover:bg-rose-100 border-none"
                      }
                    >
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right flex items-center justify-end gap-2">
                    {invoice.status !== "Paid" && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-emerald-700 border-emerald-200 bg-emerald-50 hover:bg-emerald-100"
                        onClick={() => handleMpesaRequest(invoice.id, invoice.rawAmount)}
                        disabled={isProcessing === invoice.id}
                      >
                        <Smartphone className="mr-1 h-3 w-3" />
                        {isProcessing === invoice.id ? 'Sending...' : 'Request M-Pesa'}
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredAndSortedInvoices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                    No invoices found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
