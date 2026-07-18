import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRightLeft, FileCheck, Landmark, Smartphone, FileSpreadsheet, Receipt, Plus, CreditCard } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useSearchParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";

export function Accounting() {
  const { role } = useAuth();
  const { mpesaTransactions, bankTransactions, updateMpesaTransaction, updateBankTransaction, bills, addBill, updateBillStatus, accounts, invoices, updateInvoiceStatus } = useAppStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<"mpesa" | "bank" | "bills">("mpesa");
  const [highlightedRow, setHighlightedRow] = useState<string | null>(null);

  const [isAddBillOpen, setIsAddBillOpen] = useState(false);
  const [newBillVendor, setNewBillVendor] = useState("");
  const [newBillAccount, setNewBillAccount] = useState("");
  const [newBillAmount, setNewBillAmount] = useState<number | "">("");
  const [newBillDate, setNewBillDate] = useState(new Date().toISOString().split("T")[0]);
  const [newBillDueDate, setNewBillDueDate] = useState("");
  const [newBillCategory, setNewBillCategory] = useState("Office Supplies");
  const [newBillNotes, setNewBillNotes] = useState("");
  const [newBillReceipt, setNewBillReceipt] = useState<File | null>(null);
  const isReadOnly = role === "board";
  const unmatchedMpesa = mpesaTransactions.filter((tx) => tx.status !== "Matched").length;
  const unmatchedBank = bankTransactions.filter((tx) => tx.status !== "Matched").length;

  const handleAddBill = () => {
    if (isReadOnly) {
      toast.error("Board members have read-only access.");
      return;
    }
    if (!newBillVendor.trim() || !newBillAccount || !newBillAmount || !newBillDueDate) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const formattedDate = new Date(newBillDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
    const formattedDue = new Date(newBillDueDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
    
    addBill({
      vendor: newBillVendor,
      accountId: newBillAccount,
      amount: Number(newBillAmount),
      date: formattedDate,
      dueDate: formattedDue,
      status: "Unpaid",
      category: newBillCategory,
      notes: newBillNotes,
      receiptUrl: newBillReceipt ? URL.createObjectURL(newBillReceipt) : undefined
    });
    toast.success("Bill created successfully");
    setIsAddBillOpen(false);
    setNewBillVendor("");
    setNewBillAccount("");
    setNewBillAmount("");
    setNewBillDueDate("");
    setNewBillNotes("");
    setNewBillReceipt(null);
  };

  const handleMatch = (type: "mpesa" | "bank", id: string) => {
    if (isReadOnly) {
      toast.error("Board members have read-only access.");
      return;
    }
    if (type === "mpesa") {
      updateMpesaTransaction(id, { status: "Matched" });
    } else {
      updateBankTransaction(id, { status: "Matched" });
    }
    toast.success("Transaction successfully matched and reconciled.");
  };

  const handleExport = () => {
    let csvData = "";
    if (activeTab === "mpesa") {
      csvData = "ID,Sender,Amount,Date,Status\n" + mpesaTransactions.map(t => `${t.id},"${t.sender}",${t.amount},${t.date},${t.status}`).join("\n");
    } else if (activeTab === "bank") {
      csvData = "ID,Description,Amount,Date,Status\n" + bankTransactions.map(t => `${t.id},"${t.sender}",${t.amount},${t.date},${t.status}`).join("\n");
    } else {
      csvData = "ID,Vendor,Amount,Date,Status\n" + bills.map(b => `${b.id},"${b.vendor}",${b.amount},${b.date},${b.status}`).join("\n");
    }
    
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${activeTab}_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Report exported to CSV.");
  };

  const handleAutoMatch = () => {
    if (isReadOnly) {
      toast.error("Board members have read-only access.");
      return;
    }
    let matchCount = 0;

    mpesaTransactions.forEach(t => {
      if (t.status !== "Matched") {
        const matchingInv = invoices.find(inv => 
          (inv.status === "Pending" || inv.status === "Overdue") && 
          inv.rawAmount === t.amount
        );
        if (matchingInv) {
          updateInvoiceStatus(matchingInv.id, "Paid");
          updateMpesaTransaction(t.id, { status: "Matched" });
          matchCount++;
        }
      }
    });

    bankTransactions.forEach(t => {
      if (t.status !== "Matched") {
        const matchingInv = invoices.find(inv => 
          (inv.status === "Pending" || inv.status === "Overdue") && 
          inv.rawAmount === t.amount
        );
        if (matchingInv) {
          updateInvoiceStatus(matchingInv.id, "Paid");
          updateBankTransaction(t.id, { status: "Matched" });
          matchCount++;
          return;
        }

        const matchingBill = bills.find(b => 
          b.status === "Unpaid" && 
          b.amount === t.amount
        );
        if (matchingBill) {
          updateBillStatus(matchingBill.id, "Paid");
          updateBankTransaction(t.id, { status: "Matched" });
          matchCount++;
        }
      }
    });

    if (matchCount > 0) {
      toast.success(`Auto-Match complete. ${matchCount} transactions matched automatically!`);
    } else {
      toast.info("Auto-Match complete. No new matches found.");
    }
  };

  useEffect(() => {
    const tabParam = searchParams.get("tab") as "mpesa" | "bank" | "bills" | null;
    const highlightId = searchParams.get("highlight");

    if (tabParam && ["mpesa", "bank", "bills"].includes(tabParam)) {
      setActiveTab(tabParam);
    }

    if (highlightId) {
      setHighlightedRow(highlightId);
      setTimeout(() => {
        const el = document.getElementById(`accounting-row-${highlightId}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);

      const timer = setTimeout(() => {
        setHighlightedRow(null);
        const newParams = new URLSearchParams(searchParams);
        newParams.delete("highlight");
        newParams.delete("tab");
        setSearchParams(newParams, { replace: true });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, setSearchParams]);

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
        {isReadOnly && (
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/30 px-3 py-1 text-xs font-medium text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            Board role is read-only
          </div>
        )}
        <div className="flex gap-3">
          {activeTab === "bills" && !isReadOnly && (
            <Dialog open={isAddBillOpen} onOpenChange={setIsAddBillOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus className="mr-2 h-4 w-4" />
                  New Bill
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Bill</DialogTitle>
                  <DialogDescription>Record a new expense or vendor bill.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-1 block">Vendor Name *</label>
                    <input value={newBillVendor} onChange={(e) => setNewBillVendor(e.target.value)} className="w-full rounded-md border border-input bg-background py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-1 block">Account *</label>
                    <select value={newBillAccount} onChange={(e) => setNewBillAccount(e.target.value)} className="w-full rounded-md border border-input bg-background py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
                      <option value="" disabled>Select Expense Account...</option>
                      {accounts.filter(a => a.type === "Expense").map(acc => (
                        <option key={acc.id} value={acc.id}>{acc.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-1 block">Expense Category *</label>
                    <select value={newBillCategory} onChange={(e) => setNewBillCategory(e.target.value)} className="w-full rounded-md border border-input bg-background py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
                      <option value="Office Supplies">Office Supplies</option>
                      <option value="Utilities">Utilities</option>
                      <option value="Software & Subscriptions">Software & Subscriptions</option>
                      <option value="Rent">Rent</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-1 block">Amount *</label>
                    <input type="number" value={newBillAmount} onChange={(e) => setNewBillAmount(e.target.value ? Number(e.target.value) : "")} className="w-full rounded-md border border-input bg-background py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-1 block">Bill Date *</label>
                      <input type="date" value={newBillDate} onChange={(e) => setNewBillDate(e.target.value)} className="w-full rounded-md border border-input bg-background py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-1 block">Due Date *</label>
                      <input type="date" value={newBillDueDate} onChange={(e) => setNewBillDueDate(e.target.value)} className="w-full rounded-md border border-input bg-background py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-1 block">Notes</label>
                    <textarea value={newBillNotes} onChange={(e) => setNewBillNotes(e.target.value)} className="w-full rounded-md border border-input bg-background py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-1 block">Attach Receipt</label>
                    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:bg-muted/50 transition-colors">
                      <input 
                        type="file" 
                        accept="image/*,.pdf" 
                        id="receipt-upload" 
                        className="hidden" 
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setNewBillReceipt(e.target.files[0]);
                          }
                        }}
                      />
                      <label htmlFor="receipt-upload" className="cursor-pointer flex flex-col items-center justify-center space-y-2">
                        <Receipt className="h-6 w-6 text-muted-foreground" />
                        <span className="text-sm text-primary font-medium">
                          {newBillReceipt ? newBillReceipt.name : "Click to upload receipt"}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button onClick={handleAddBill}>Save Bill</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
          {activeTab !== "bills" && (
            <Button variant="outline" className="text-foreground" onClick={handleExport}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Export Reports
            </Button>
          )}
          {activeTab !== "bills" && !isReadOnly && (
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleAutoMatch}>
              <ArrowRightLeft className="mr-2 h-4 w-4" />
              Run Auto-Match
            </Button>
          )}
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
        <button
          onClick={() => setActiveTab("bills")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === "bills"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          <Receipt className="h-4 w-4" />
          Bills / Expenses
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
                <TableRow className="bg-muted/30">
                  <TableCell colSpan={6} className="py-3 text-sm text-muted-foreground">
                    {mpesaTransactions.length - unmatchedMpesa} matched, {unmatchedMpesa} unmatched
                  </TableCell>
                </TableRow>
                {mpesaTransactions.map((tx) => (
                  <TableRow key={tx.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium text-primary">{tx.id}</TableCell>
                    <TableCell className="text-muted-foreground">{tx.date}</TableCell>
                    <TableCell className="font-medium text-card-foreground">{tx.sender}</TableCell>
                    <TableCell>KES {tx.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      {tx.status === "Matched" ? (
                        <Badge variant="default" className="bg-success/10 text-success border-none dark:bg-success/20 dark:text-success">
                          Matched
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-warning/10 text-warning border-none dark:bg-warning/20 dark:text-warning">
                          Unmatched
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {tx.status !== "Matched" && !isReadOnly && (
                        <Button size="sm" variant="outline" className="text-primary hover:text-primary hover:bg-primary/10" onClick={() => handleMatch("mpesa", tx.id)}>
                          <FileCheck className="h-4 w-4 mr-1" /> Match
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {mpesaTransactions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <EmptyState 
                        icon={Smartphone} 
                        message="No M-Pesa transactions found." 
                      />
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
                <TableRow className="bg-muted/30">
                  <TableCell colSpan={6} className="py-3 text-sm text-muted-foreground">
                    {bankTransactions.length - unmatchedBank} matched, {unmatchedBank} unmatched
                  </TableCell>
                </TableRow>
                {bankTransactions.map((tx) => (
                  <TableRow key={tx.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium text-primary">{tx.id}</TableCell>
                    <TableCell className="text-muted-foreground">{tx.date}</TableCell>
                    <TableCell className="font-medium text-card-foreground">{tx.sender}</TableCell>
                    <TableCell>KES {tx.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      {tx.status === "Matched" ? (
                        <Badge variant="default" className="bg-success/10 text-success border-none dark:bg-success/20 dark:text-success">
                          Matched
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-warning/10 text-warning border-none dark:bg-warning/20 dark:text-warning">
                          Unmatched
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {tx.status !== "Matched" && !isReadOnly && (
                        <Button size="sm" variant="outline" className="text-primary hover:text-primary hover:bg-primary/10" onClick={() => handleMatch("bank", tx.id)}>
                          <FileCheck className="h-4 w-4 mr-1" /> Match
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {bankTransactions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <EmptyState 
                        icon={CreditCard} 
                        message="No Bank transactions found." 
                      />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}

          {activeTab === "bills" && (
            <Table>
              <TableHeader className="bg-muted/50 sticky top-0 z-10 shadow-sm">
                <TableRow>
                  <TableHead>Bill ID</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bills.map((bill) => {
                  const accName = accounts.find(a => a.id === bill.accountId)?.name || "Unknown";
                  const isHighlighted = highlightedRow === bill.id;
                  return (
                    <TableRow 
                      key={bill.id} 
                      id={`accounting-row-${bill.id}`}
                      className={`hover:bg-muted/50 transition-colors duration-500 ${isHighlighted ? 'bg-primary/20 dark:bg-primary/30 ring-2 ring-primary ring-inset' : ''}`}
                    >
                      <TableCell className="font-medium text-primary text-xs">{bill.id}</TableCell>
                      <TableCell className="font-medium text-card-foreground">{bill.vendor}</TableCell>
                      <TableCell className="text-muted-foreground">
                        <div className="flex items-center gap-2">
                          {bill.category}
                          {bill.receiptUrl && <Receipt className="h-3 w-3 text-primary" />}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{bill.date}</TableCell>
                      <TableCell className="text-muted-foreground">{bill.dueDate}</TableCell>
                      <TableCell className="font-bold">KES {bill.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        {bill.status === "Paid" ? (
                          <Badge variant="default" className="bg-success/10 text-success border-none dark:bg-success/20 dark:text-success">
                            Paid
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-warning/10 text-warning border-none dark:bg-warning/20 dark:text-warning">
                            Unpaid
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {bill.status === "Unpaid" && !isReadOnly && (
                          <Button size="sm" variant="outline" className="text-primary hover:text-primary hover:bg-primary/10" onClick={() => updateBillStatus(bill.id, "Paid")}>
                            <FileCheck className="h-4 w-4 mr-1" /> Mark Paid
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {bills.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <EmptyState 
                        icon={Receipt} 
                        message="No bills found." 
                      />
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
