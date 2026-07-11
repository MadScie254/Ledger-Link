import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRightLeft, FileCheck, Landmark, Smartphone, FileSpreadsheet } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

export function Accounting() {
  const { mpesaTransactions, bankTransactions, updateMpesaTransaction, updateBankTransaction } = useAppStore();
  const [activeTab, setActiveTab] = useState<"mpesa" | "bank">("mpesa");

  const handleMatch = (type: "mpesa" | "bank", id: string) => {
    if (type === "mpesa") {
      updateMpesaTransaction(id, { status: "Matched" });
    } else {
      updateBankTransaction(id, { status: "Matched" });
    }
    toast.success("Transaction successfully matched and reconciled.");
  };

  const handleNotImplemented = (feature: string) => {
    toast.info(`${feature} is not implemented in this demo.`);
  };

  return (
    <div className="flex h-full flex-col space-y-6 overflow-hidden">
      <div className="flex items-end justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Accounting & Reconciliation
          </h2>
          <p className="text-sm text-muted-foreground">
            Reconcile payments with bank feeds and M-Pesa statements.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="text-foreground" onClick={() => handleNotImplemented("Export Reports")}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Export Reports
          </Button>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => handleNotImplemented("Run Auto-Match")}>
            <ArrowRightLeft className="mr-2 h-4 w-4" />
            Run Auto-Match
          </Button>
        </div>
      </div>
      
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => setActiveTab("mpesa")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === "mpesa"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          <Smartphone className="h-4 w-4" />
          M-Pesa Paybill/Till
        </button>
        <button
          onClick={() => setActiveTab("bank")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === "bank"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          <Landmark className="h-4 w-4" />
          Bank Feeds
        </button>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm flex-1 overflow-hidden flex flex-col">
        <div className="overflow-auto flex-1">
          {activeTab === "mpesa" && (
            <Table>
              <TableHeader className="bg-muted/50 sticky top-0 z-10 shadow-sm">
                <TableRow>
                  <TableHead>Receipt No</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Sender</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Match Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mpesaTransactions.map((tx) => (
                  <TableRow key={tx.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium text-primary">{tx.id}</TableCell>
                    <TableCell className="text-muted-foreground">{tx.date}</TableCell>
                    <TableCell className="font-medium text-card-foreground">{tx.sender}</TableCell>
                    <TableCell>KES {tx.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      {tx.status === "Matched" ? (
                        <Badge variant="default" className="bg-emerald-100 text-emerald-800 border-none dark:bg-emerald-900/30 dark:text-emerald-300">
                          Matched
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-none dark:bg-amber-900/30 dark:text-amber-300">
                          Unmatched
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {tx.status !== "Matched" && (
                        <Button size="sm" variant="outline" className="text-primary hover:text-primary hover:bg-primary/10" onClick={() => handleMatch("mpesa", tx.id)}>
                          <FileCheck className="h-4 w-4 mr-1" /> Match
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {mpesaTransactions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No M-Pesa transactions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}

          {activeTab === "bank" && (
            <Table>
              <TableHeader className="bg-muted/50 sticky top-0 z-10 shadow-sm">
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Match Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bankTransactions.map((tx) => (
                  <TableRow key={tx.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium text-primary">{tx.id}</TableCell>
                    <TableCell className="text-muted-foreground">{tx.date}</TableCell>
                    <TableCell className="font-medium text-card-foreground">{tx.sender}</TableCell>
                    <TableCell>KES {tx.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      {tx.status === "Matched" ? (
                        <Badge variant="default" className="bg-emerald-100 text-emerald-800 border-none dark:bg-emerald-900/30 dark:text-emerald-300">
                          Matched
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-none dark:bg-amber-900/30 dark:text-amber-300">
                          Unmatched
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {tx.status !== "Matched" && (
                        <Button size="sm" variant="outline" className="text-primary hover:text-primary hover:bg-primary/10" onClick={() => handleMatch("bank", tx.id)}>
                          <FileCheck className="h-4 w-4 mr-1" /> Match
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {bankTransactions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No bank transactions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}
