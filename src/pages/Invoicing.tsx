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
import { useState, useEffect, useMemo } from "react";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

type SortField = "id" | "client" | "rawAmount" | "status" | "date" | "dueDate";
type SortOrder = "asc" | "desc";

function InvoicingSkeleton() {
  return (
    <div className="flex h-full flex-col space-y-6 overflow-hidden">
      <div className="flex items-end justify-between shrink-0">
        <div>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-28 rounded-md" />
        </div>
      </div>
      <div className="flex gap-2 shrink-0">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-full" />
        ))}
      </div>
      <div className="flex-1 rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="p-4 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-36 flex-1" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Invoicing() {
  const { invoices } = useAppStore();
  const [filter, setFilter] = useState("All");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleMpesaRequest = async (invoiceId: string, amount: number) => {
    const phone = window.prompt(`Enter phone number to request KES ${amount} for ${invoiceId}:`, "254700000000");
    if (!phone) return;

    try {
      setIsProcessing(invoiceId);
      // Mock delay
      await new Promise(r => setTimeout(r, 1000));
      toast.success(`M-Pesa payment request sent to ${phone}`);
    } catch (e) {
      toast.error("Failed to connect to M-Pesa API.");
    } finally {
      setIsProcessing(null);
    }
  };

  const handleNotImplemented = (feature: string) => {
    toast.info(`${feature} is not implemented in this demo.`);
  };

  const filteredAndSortedInvoices = useMemo(() => {
    let result = [...invoices];

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
  }, [invoices, filter, sortField, sortOrder]);

  if (isLoading) return <InvoicingSkeleton />;

  return (
    <div className="flex h-full flex-col space-y-6 overflow-hidden">
      <div className="flex items-end justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Invoices
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage your invoices, track payments, and send reminders.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="text-foreground" onClick={() => handleNotImplemented("Export")}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => handleNotImplemented("Create Invoice")}>
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
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <Table>
            <TableHeader className="bg-muted/50 sticky top-0 z-10 shadow-sm">
              <TableRow>
                <TableHead className="cursor-pointer hover:bg-muted transition-colors" onClick={() => handleSort("id")}>
                  <div className="flex items-center gap-1">Invoice ID <ArrowUpDown className="h-3 w-3" /></div>
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-muted transition-colors" onClick={() => handleSort("client")}>
                  <div className="flex items-center gap-1">Client <ArrowUpDown className="h-3 w-3" /></div>
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-muted transition-colors" onClick={() => handleSort("rawAmount")}>
                  <div className="flex items-center gap-1">Amount <ArrowUpDown className="h-3 w-3" /></div>
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-muted transition-colors" onClick={() => handleSort("date")}>
                  <div className="flex items-center gap-1">Date <ArrowUpDown className="h-3 w-3" /></div>
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-muted transition-colors" onClick={() => handleSort("dueDate")}>
                  <div className="flex items-center gap-1">Due Date <ArrowUpDown className="h-3 w-3" /></div>
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-muted transition-colors" onClick={() => handleSort("status")}>
                  <div className="flex items-center gap-1">Status <ArrowUpDown className="h-3 w-3" /></div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedInvoices.map((invoice) => (
                <TableRow key={invoice.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium text-primary">
                    {invoice.id}
                  </TableCell>
                  <TableCell className="font-medium text-card-foreground">{invoice.client}</TableCell>
                  <TableCell>KES {invoice.amount}</TableCell>
                  <TableCell className="text-muted-foreground">{invoice.date}</TableCell>
                  <TableCell className="text-muted-foreground">{invoice.dueDate}</TableCell>
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
                          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none dark:bg-emerald-900/30 dark:text-emerald-300"
                          : invoice.status === "Pending"
                          ? "bg-amber-100 text-amber-800 hover:bg-amber-100 border-none dark:bg-amber-900/30 dark:text-amber-300"
                          : "bg-destructive/10 text-destructive hover:bg-destructive/10 border-none"
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
                        className="text-emerald-700 border-emerald-200 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800 dark:hover:bg-emerald-900/40"
                        onClick={() => handleMpesaRequest(invoice.id, invoice.rawAmount)}
                        disabled={isProcessing === invoice.id}
                      >
                        <Smartphone className="mr-1 h-3 w-3" />
                        {isProcessing === invoice.id ? 'Sending...' : 'Request M-Pesa'}
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" onClick={() => handleNotImplemented("More Options")}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredAndSortedInvoices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
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
