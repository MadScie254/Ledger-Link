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
import { EmptyState } from "@/components/ui/empty-state";
import { Download, MoreHorizontal, ArrowUpDown, Smartphone, Plus, Eye, Bell, CheckCircle2, FileDown, Trash2, Clock, Mail, MessageSquare, FileText, Repeat } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useAppStore, type Invoice, type InvoiceLineItem } from "@/store/useAppStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { generateInvoicePdf } from "@/lib/generateInvoicePdf";

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

// ---------- New Invoice Form ----------

const emptyLineItem: InvoiceLineItem = { description: "", qty: 1, unitPrice: 0 };

function NewInvoiceDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { addInvoice, customers, addCustomer } = useAppStore();

  const [clientId, setClientId] = useState("");
  const [isNewClientMode, setIsNewClientMode] = useState(false);

  const [client, setClient] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState("");
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([{ ...emptyLineItem }]);
  const [taxRate, setTaxRate] = useState(16);
  const [notes, setNotes] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState<"Weekly" | "Monthly" | "Termly">("Monthly");
  const [recurringNextDate, setRecurringNextDate] = useState("");

  const subtotal = lineItems.reduce((sum, li) => sum + li.qty * li.unitPrice, 0);
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  const updateLine = (index: number, field: keyof InvoiceLineItem, value: string | number) => {
    setLineItems((prev) => prev.map((li, i) => (i === index ? { ...li, [field]: value } : li)));
  };

  const removeLine = (index: number) => {
    if (lineItems.length <= 1) return;
    setLineItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCustomerSelect = (id: string) => {
    if (id === "new_client") {
      setIsNewClientMode(true);
      setClientId("");
      setClient("");
      setClientEmail("");
      setClientPhone("");
      setClientAddress("");
    } else {
      setIsNewClientMode(false);
      setClientId(id);
      const cust = customers.find(c => c.id === id);
      if (cust) {
        setClient(cust.name);
        setClientEmail(cust.email);
        setClientPhone(cust.phone);
        setClientAddress(cust.address);
      }
    }
  };

  const handleSubmit = () => {
    if (isNewClientMode) {
      if (!client.trim()) { toast.error("Client name is required."); return; }
      
      const lastNum = customers.length;
      const nextId = `CUST-${String(lastNum + 1).padStart(3, '0')}`;
      
      addCustomer({
        name: client,
        email: clientEmail,
        phone: clientPhone,
        address: clientAddress,
        sector: "Other"
      });
      
      createInvoiceCall(nextId);
    } else {
      if (!clientId) { toast.error("Please select a client."); return; }
      if (!client.trim()) { toast.error("Client name snapshot is required."); return; }
      createInvoiceCall(clientId);
    }
  };

  const createInvoiceCall = (finalClientId: string) => {
    if (lineItems.some(li => !li.description.trim() || li.unitPrice <= 0)) { toast.error("Fill in all line items."); return; }
    if (!dueDate) { toast.error("Due date is required."); return; }

    const formatted = new Date(issueDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
    const formattedDue = new Date(dueDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });

    addInvoice({
      clientId: finalClientId,
      client,
      clientEmail,
      clientPhone,
      clientAddress,
      date: formatted,
      dueDate: formattedDue,
      lineItems,
      taxRate,
      notes,
      ...(isRecurring && recurringNextDate ? { recurring: { frequency: recurringFrequency, nextDate: recurringNextDate } } : {})
    });

    toast.success("Invoice created successfully.");
    onOpenChange(false);
    // Reset
    setIsNewClientMode(false);
    setClientId(""); setClient(""); setClientEmail(""); setClientPhone(""); setClientAddress("");
    setLineItems([{ ...emptyLineItem }]); setNotes(""); setDueDate("");
    setIsRecurring(false);
    setRecurringFrequency("Monthly");
    setRecurringNextDate("");
  };

  const inputCls = "w-full rounded-md border border-input bg-background py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>New Invoice</DialogTitle>
          <DialogDescription>Create a new invoice for a client.</DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-auto space-y-5 pr-1">
          {/* Client Selection */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Select Client *</label>
            <select className={inputCls} value={isNewClientMode ? "new_client" : clientId} onChange={(e) => handleCustomerSelect(e.target.value)}>
              <option value="" disabled>Select a client...</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              <option value="new_client" className="font-bold text-primary">+ New Client</option>
            </select>
          </div>

          {/* Client Details (Snapshot or New) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Client Name *</label>
              <input className={inputCls} value={client} onChange={(e) => setClient(e.target.value)} placeholder="e.g. Nairobi Academy" disabled={!isNewClientMode && !!clientId} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Email</label>
              <input className={inputCls} value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} placeholder="finance@client.co.ke" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Phone</label>
              <input className={inputCls} value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} placeholder="+254 7XX XXX XXX" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Address</label>
              <input className={inputCls} value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} placeholder="P.O. Box 12345, Nairobi" />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Issue Date *</label>
              <input className={inputCls} type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Due Date *</label>
              <input className={inputCls} type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
          </div>

          {/* Recurring */}
          <div className="border border-border rounded-md p-4 bg-muted/30">
            <label className="flex items-center gap-2 cursor-pointer mb-2">
              <input type="checkbox" checked={isRecurring} onChange={(e) => setIsRecurring(e.target.checked)} className="rounded border-input text-primary focus:ring-primary h-4 w-4" />
              <span className="text-sm font-medium text-foreground">Make this invoice recurring</span>
            </label>
            {isRecurring && (
              <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-border">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Frequency</label>
                  <select className={inputCls} value={recurringFrequency} onChange={(e) => setRecurringFrequency(e.target.value as any)}>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Termly">Termly</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Next Generation Date</label>
                  <input className={inputCls} type="date" value={recurringNextDate} onChange={(e) => setRecurringNextDate(e.target.value)} />
                </div>
              </div>
            )}
          </div>

          {/* Line Items */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">Line Items</label>
            <div className="space-y-2">
              {lineItems.map((li, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input className={`${inputCls} flex-1`} placeholder="Description" value={li.description} onChange={(e) => updateLine(i, "description", e.target.value)} />
                  <input className={`${inputCls} w-16 text-center`} type="number" min={1} value={li.qty} onChange={(e) => updateLine(i, "qty", parseInt(e.target.value) || 1)} />
                  <input className={`${inputCls} w-28`} type="number" min={0} placeholder="Unit Price" value={li.unitPrice || ""} onChange={(e) => updateLine(i, "unitPrice", parseFloat(e.target.value) || 0)} />
                  <span className="text-sm font-medium text-muted-foreground w-28 text-right">KES {(li.qty * li.unitPrice).toLocaleString()}</span>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive shrink-0" onClick={() => removeLine(i)} disabled={lineItems.length <= 1}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="mt-2" onClick={() => setLineItems([...lineItems, { ...emptyLineItem }])}>
              <Plus className="mr-1 h-3 w-3" /> Add Line
            </Button>
          </div>

          {/* Tax & Notes */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">VAT Rate (%)</label>
              <input className={`${inputCls} w-24`} type="number" min={0} max={100} value={taxRate} onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)} />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Notes / Terms</label>
            <textarea className={`${inputCls} min-h-[60px]`} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Payment terms or a thank-you note..." />
          </div>

          {/* Totals */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-1">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Subtotal</span><span>KES {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Tax ({taxRate}%)</span><span>KES {tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-foreground pt-1 border-t border-border">
              <span>Grand Total</span><span>KES {total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border shrink-0">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSubmit}>Create Invoice</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ---------- Invoice Detail View ----------

function InvoiceDetailDialog({ invoice, open, onOpenChange }: { invoice: Invoice | null; open: boolean; onOpenChange: (v: boolean) => void }) {
  const { orgProfile } = useAppStore();
  if (!invoice) return null;

  const subtotal = invoice.lineItems?.reduce((sum, li) => sum + li.qty * li.unitPrice, 0) || 0;
  const tax = subtotal * ((invoice.taxRate || 0) / 100);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Invoice {invoice.id}
            <Badge
              variant={invoice.status === "Paid" ? "default" : invoice.status === "Overdue" ? "destructive" : "secondary"}
              className={
                invoice.status === "Paid"
                  ? "bg-success/10 text-success border-none dark:bg-success/20 dark:text-success"
                  : invoice.status === "Pending"
                  ? "bg-warning/10 text-warning border-none dark:bg-warning/20 dark:text-warning"
                  : "bg-destructive/10 text-destructive border-none dark:bg-destructive/20 dark:text-destructive"
              }
            >
              {invoice.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>Professional invoice document view.</DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-auto space-y-5">
          {/* Letterhead */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-success">{orgProfile.name}</h3>
              <p className="text-xs text-muted-foreground">{orgProfile.sector}</p>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <p>Invoice #: <strong className="text-foreground">{invoice.id}</strong></p>
              <p>Issued: {invoice.date}</p>
              <p>Due: {invoice.dueDate}</p>
            </div>
          </div>

          {/* Bill To */}
          <div className="bg-muted/40 rounded-lg p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Bill To</p>
            <p className="font-medium text-foreground">{invoice.client}</p>
            {invoice.clientAddress && <p className="text-sm text-muted-foreground">{invoice.clientAddress}</p>}
            {invoice.clientEmail && <p className="text-sm text-muted-foreground">{invoice.clientEmail}</p>}
            {invoice.clientPhone && <p className="text-sm text-muted-foreground">{invoice.clientPhone}</p>}
          </div>

          {/* Line Items Table */}
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead className="text-center">Qty</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.lineItems?.map((li, i) => (
                <TableRow key={i}>
                  <TableCell>{li.description}</TableCell>
                  <TableCell className="text-center">{li.qty}</TableCell>
                  <TableCell className="text-right">KES {li.unitPrice.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-medium">KES {(li.qty * li.unitPrice).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-1">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span><span>KES {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Tax ({invoice.taxRate}%)</span><span>KES {tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-foreground pt-1 border-t border-border">
                <span>Total</span><span>KES {invoice.amount}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="border-t border-border pt-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Notes / Terms</p>
              <p className="text-sm text-muted-foreground">{invoice.notes}</p>
            </div>
          )}

          {/* Reminders Trail */}
          {invoice.reminders && invoice.reminders.length > 0 && (
            <div className="border-t border-border pt-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Reminder History</p>
              <div className="space-y-2">
                {invoice.reminders.map((r, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    {r.method === "Email" ? <Mail className="h-3.5 w-3.5" /> : <MessageSquare className="h-3.5 w-3.5" />}
                    <span>{r.method} reminder sent</span>
                    <span className="ml-auto text-xs">{new Date(r.sentAt).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border shrink-0">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <Button onClick={() => generateInvoicePdf(invoice, orgProfile)}>
            <FileDown className="mr-2 h-4 w-4" /> Download PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ---------- Main Component ----------

export function Invoicing() {
  const { invoices, addReminder, updateInvoiceStatus, addInvoice } = useAppStore();
  const [filter, setFilter] = useState("All");
  const [sortField, setSortField] = useState<SortField>("id");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [newInvoiceOpen, setNewInvoiceOpen] = useState(false);
  const [detailInvoice, setDetailInvoice] = useState<Invoice | null>(null);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all-invoices");
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
      await new Promise(r => setTimeout(r, 1000));
      toast.success(`M-Pesa payment request sent to ${phone}`);
    } catch (e) {
      toast.error("Failed to connect to M-Pesa API.");
    } finally {
      setIsProcessing(null);
    }
  };

  const handleExportCsv = () => {
    const headers = ["Invoice ID", "Client", "Amount (KES)", "Status", "Date", "Due Date"];
    const rows = filteredAndSortedInvoices.map((inv) =>
      [inv.id, inv.client, inv.rawAmount, inv.status, inv.date, inv.dueDate].join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoices-export-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Invoices exported to CSV.");
  };

  const handleSendReminder = (invoice: Invoice) => {
    addReminder(invoice.id, "Email");
    toast.success(`Reminder sent to ${invoice.clientEmail || invoice.client}.`);
  };

  const handleMarkAsPaid = (invoiceId: string) => {
    updateInvoiceStatus(invoiceId, "Paid");
    toast.success("Invoice marked as paid.");
  };

  const handleGenerateRecurring = (template: Invoice) => {
    if (!template.recurring) return;
    
    const today = new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
    const due = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }); // 14 days later
    
    // Create actual invoice
    const newInvoiceParams = {
      clientId: template.clientId,
      client: template.client,
      clientEmail: template.clientEmail,
      clientPhone: template.clientPhone,
      clientAddress: template.clientAddress,
      date: today,
      dueDate: due,
      lineItems: template.lineItems,
      taxRate: template.taxRate,
      notes: template.notes,
      // intentionally omit recurring here so the generated invoice is normal
    };
    
    addInvoice(newInvoiceParams);
    
    // Optional logic to advance template date could go here if we were persisting templates differently,
    // but in this demo, adding a new invoice is sufficient to prove the workflow.
    toast.success("Recurring invoice generated successfully.");
  };

  const standardInvoices = useMemo(() => invoices.filter(i => !i.recurring), [invoices]);
  const recurringTemplates = useMemo(() => invoices.filter(i => i.recurring), [invoices]);

  const filteredAndSortedInvoices = useMemo(() => {
    let result = [...standardInvoices];

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
  }, [standardInvoices, filter, sortField, sortOrder]);

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
          <Button variant="outline" className="text-foreground" onClick={handleExportCsv}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setNewInvoiceOpen(true)}>
            New Invoice
          </Button>
        </div>
      </div>

      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between shrink-0 mb-4">
          <TabsList>
            <TabsTrigger value="all-invoices">All Invoices</TabsTrigger>
            <TabsTrigger value="recurring">Recurring Templates</TabsTrigger>
          </TabsList>
          
          {activeTab === "all-invoices" && (
            <div className="flex items-center gap-2">
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
          )}
        </div>

        <TabsContent value="all-invoices" className="flex-1 flex flex-col min-h-0 m-0 data-[state=inactive]:hidden">
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
                  <TableCell className="font-medium text-primary cursor-pointer hover:underline" onClick={() => setDetailInvoice(invoice)}>
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
                          ? "bg-success/10 text-success hover:bg-success/20 border-none dark:bg-success/20 dark:text-success"
                          : invoice.status === "Pending"
                          ? "bg-warning/10 text-warning hover:bg-warning/20 border-none dark:bg-warning/20 dark:text-warning"
                          : "bg-destructive/10 text-destructive hover:bg-destructive/20 border-none dark:bg-destructive/20 dark:text-destructive"
                      }
                    >
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right flex items-center justify-end gap-2">
                    {invoice.status !== "Paid" && (
                      <Button 
                        variant="outline" 
                        className="text-success border-success/30 bg-success/10 hover:bg-success/20 dark:bg-success/20 dark:text-success dark:border-success/30 dark:hover:bg-success/30"
                        onClick={() => handleMpesaRequest(invoice.id, invoice.rawAmount)}
                        disabled={isProcessing === invoice.id}
                      >
                        <Smartphone className="mr-1 h-3 w-3" />
                        {isProcessing === invoice.id ? 'Sending...' : 'Request M-Pesa'}
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" side="bottom" sideOffset={4}>
                        <DropdownMenuItem onClick={() => setDetailInvoice(invoice)}>
                          <Eye className="mr-2 h-4 w-4" /> View Invoice
                        </DropdownMenuItem>
                        {(invoice.status === "Pending" || invoice.status === "Overdue") && (
                          <>
                            <DropdownMenuItem onClick={() => handleSendReminder(invoice)}>
                              <Bell className="mr-2 h-4 w-4" /> Send Reminder
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleMarkAsPaid(invoice.id)}>
                              <CheckCircle2 className="mr-2 h-4 w-4" /> Mark as Paid
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredAndSortedInvoices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <EmptyState 
                      icon={FileText} 
                      message="No invoices found." 
                      actionLabel="Create Invoice" 
                      onAction={() => setNewInvoiceOpen(true)} 
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      </TabsContent>

      <TabsContent value="recurring" className="flex-1 flex flex-col min-h-0 m-0 data-[state=inactive]:hidden">
        <div className="rounded-xl border border-border bg-card shadow-sm flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <Table>
              <TableHeader className="bg-muted/50 sticky top-0 z-10 shadow-sm">
                <TableRow>
                  <TableHead>Template ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Next Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recurringTemplates.map((template) => (
                  <TableRow key={template.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium text-primary cursor-pointer hover:underline" onClick={() => setDetailInvoice(template)}>
                      {template.id}
                    </TableCell>
                    <TableCell className="font-medium text-card-foreground">{template.client}</TableCell>
                    <TableCell>KES {template.amount}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-none">
                        <Repeat className="h-3 w-3 mr-1" />
                        {template.recurring?.frequency}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{template.recurring?.nextDate}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => handleGenerateRecurring(template)}>
                        Generate Now
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {recurringTemplates.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <EmptyState 
                        icon={Repeat} 
                        message="No recurring templates found." 
                        actionLabel="Create Template" 
                        onAction={() => { setActiveTab("all-invoices"); setNewInvoiceOpen(true); }} 
                      />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <NewInvoiceDialog open={newInvoiceOpen} onOpenChange={setNewInvoiceOpen} />
      <InvoiceDetailDialog invoice={detailInvoice} open={!!detailInvoice} onOpenChange={(v) => { if (!v) setDetailInvoice(null); }} />
    </div>
  );
}
