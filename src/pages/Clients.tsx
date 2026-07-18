import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Building2, Search, FileText, Users } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";

function ClientsSkeleton() {
  return (
    <div className="flex h-full flex-col space-y-6 overflow-hidden">
      <div className="flex items-end justify-between shrink-0">
        <div>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      <div className="flex-1 rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="p-4 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-40 flex-1" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Clients() {
  const { customers, invoices } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const clientsWithStats = useMemo(() => {
    return customers.map((customer) => {
      const clientInvoices = invoices.filter((inv) => inv.clientId === customer.id);
      
      const totalInvoiced = clientInvoices.reduce((sum, inv) => sum + inv.rawAmount, 0);
      const outstandingBalance = clientInvoices
        .filter((inv) => inv.status !== "Paid")
        .reduce((sum, inv) => sum + inv.rawAmount, 0);

      return {
        ...customer,
        totalInvoiced,
        outstandingBalance,
        invoiceCount: clientInvoices.length,
      };
    }).filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [customers, invoices, searchQuery]);

  if (isLoading) return <ClientsSkeleton />;

  return (
    <div className="flex h-full flex-col space-y-6 overflow-hidden">
      <div className="flex items-end justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Clients
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage your customer directory and view their balances.
          </p>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden space-y-6 flex flex-col">
        <div className="flex items-center gap-4 shrink-0">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-input bg-background py-1.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card shadow-sm flex-1 overflow-hidden flex flex-col">
          <div className="overflow-auto flex-1">
            <Table>
              <TableHeader className="bg-muted/50 sticky top-0 z-10 shadow-sm">
                <TableRow>
                  <TableHead>Client ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead className="text-right">Total Invoiced</TableHead>
                  <TableHead className="text-right">Outstanding</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientsWithStats.map(c => (
                  <TableRow key={c.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium text-muted-foreground text-xs">{c.id}</TableCell>
                    <TableCell>
                      <div className="font-medium text-card-foreground">{c.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                        <FileText className="h-3 w-3" /> {c.invoiceCount} invoices
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{c.email}</div>
                      <div className="text-xs text-muted-foreground">{c.phone}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-muted text-muted-foreground border-none">
                        {c.sector}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      KES {c.totalInvoiced.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {c.outstandingBalance > 0 ? (
                        <span className="font-bold text-warning">
                          KES {c.outstandingBalance.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-muted-foreground font-medium">KES 0</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {clientsWithStats.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <EmptyState 
                        icon={Users} 
                        message="No clients found." 
                      />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
