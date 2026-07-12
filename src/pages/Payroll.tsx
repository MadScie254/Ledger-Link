import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileDown, Users, Calculator, CheckCircle2, Search } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

function PayrollSkeleton() {
  return (
    <div className="flex h-full flex-col space-y-6 overflow-hidden">
      <div className="flex items-end justify-between shrink-0">
        <div>
          <Skeleton className="h-8 w-28 mb-2" />
          <Skeleton className="h-4 w-60" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-9 w-28 rounded-md" />
          <Skeleton className="h-9 w-28 rounded-md" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 shrink-0">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-3">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-7 w-28" />
          </div>
        ))}
      </div>
      <div className="flex-1 rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="p-4 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-32 flex-1" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Payroll() {
  const { staff } = useAppStore();
  const [activeTab, setActiveTab] = useState<"directory" | "run">("directory");
  const [payrollRun, setPayrollRun] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const calculateDeductions = (gross: number) => {
    const paye = gross * 0.25; // Simplified calculation
    const nssf = 1080;
    const sha = gross * 0.0275; 
    const net = gross - paye - nssf - sha;
    return { paye, nssf, sha, net };
  };

  const filteredStaff = useMemo(() => {
    return staff.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [staff, searchQuery]);

  const handleApproveDisburse = () => {
    toast.success("Payroll approved and disbursements initiated (Mocked).");
  };

  const handleNotImplemented = (feature: string) => {
    toast.info(`${feature} is not implemented in this demo.`);
  };

  if (isLoading) return <PayrollSkeleton />;

  return (
    <div className="flex h-full flex-col space-y-6 overflow-hidden">
      <div className="flex items-end justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Payroll
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage staff records, run payroll, and generate payslips.
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={() => setActiveTab("directory")}
            variant={activeTab === "directory" ? "default" : "outline"}
            className={activeTab === "directory" ? "bg-primary text-primary-foreground hover:bg-primary/90 border-none" : "text-foreground"}
          >
            <Users className="mr-2 h-4 w-4" />
            Directory
          </Button>
          <Button 
            onClick={() => setActiveTab("run")}
            variant={activeTab === "run" ? "default" : "outline"}
            className={activeTab === "run" ? "bg-primary text-primary-foreground hover:bg-primary/90 border-none" : "text-foreground"}
          >
            <Calculator className="mr-2 h-4 w-4" />
            Payroll Run
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden space-y-6 flex flex-col">
        {activeTab === "directory" && (
          <>
            <div className="flex items-center gap-4 shrink-0">
              <div className="relative max-w-sm w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search staff..."
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
                      <TableHead>Employee ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Gross Salary</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStaff.map(s => (
                      <TableRow key={s.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium text-primary">{s.id}</TableCell>
                        <TableCell className="font-medium text-card-foreground">{s.name}</TableCell>
                        <TableCell>{s.role}</TableCell>
                        <TableCell>KES {s.gross.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={s.status === "Active" ? "default" : "secondary"} className={s.status === "Active" ? "bg-emerald-100 text-emerald-800 border-none hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300" : "bg-muted text-muted-foreground border-none"}>
                            {s.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary" onClick={() => handleNotImplemented("Edit Profile")}>
                            Edit Profile
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredStaff.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No staff found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </>
        )}

        {activeTab === "run" && (
          <div className="space-y-6 h-full flex flex-col pb-6">
            {!payrollRun ? (
              <div className="rounded-xl border border-border bg-card shadow-sm p-8 text-center flex flex-col items-center justify-center flex-1">
                <Calculator className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-bold text-card-foreground mb-2">Generate July 2026 Payroll</h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-md">
                  This will calculate PAYE, NSSF, SHA, and net pay for all active employees based on their current gross salary.
                </p>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8" onClick={() => setPayrollRun(true)}>
                  Run Calculations
                </Button>
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col flex-1">
                <div className="p-6 border-b border-border flex items-center justify-between bg-emerald-50/50 dark:bg-emerald-900/10 shrink-0">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-card-foreground">July 2026 Payroll Generated</h3>
                        <Badge variant="outline" className="text-[10px] uppercase border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800">
                          Estimate Only
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">All standard deductions applied (simplified tax math).</p>
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className="bg-emerald-600 text-white hover:bg-emerald-700">
                        Approve & Disburse
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Approve Payroll?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will finalize the July 2026 payroll run and schedule disbursements. This action cannot be easily undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleApproveDisburse}>Approve</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <div className="overflow-auto flex-1">
                  <Table>
                    <TableHeader className="bg-muted/50 sticky top-0 z-10 shadow-sm">
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Gross</TableHead>
                        <TableHead>PAYE</TableHead>
                        <TableHead>NSSF</TableHead>
                        <TableHead>SHA</TableHead>
                        <TableHead className="font-bold text-foreground">Net Pay</TableHead>
                        <TableHead className="text-right">Payslip</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {staff.filter(s => s.status === 'Active').map(s => {
                        const d = calculateDeductions(s.gross);
                        return (
                          <TableRow key={s.id} className="hover:bg-muted/50">
                            <TableCell className="font-medium text-card-foreground">{s.name}</TableCell>
                            <TableCell>KES {s.gross.toLocaleString()}</TableCell>
                            <TableCell className="text-destructive">-{(d.paye).toLocaleString()}</TableCell>
                            <TableCell className="text-destructive">-{(d.nssf).toLocaleString()}</TableCell>
                            <TableCell className="text-destructive">-{(d.sha).toLocaleString()}</TableCell>
                            <TableCell className="font-bold text-emerald-600 dark:text-emerald-400">KES {d.net.toLocaleString()}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-primary/10" onClick={() => handleNotImplemented("Download PDF")}>
                                <FileDown className="h-4 w-4 mr-1" /> PDF
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
