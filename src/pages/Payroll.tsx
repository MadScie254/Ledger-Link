import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileDown, Users, Calculator, CheckCircle2 } from "lucide-react";

const staffData = [
  { id: "EMP-001", name: "Sarah Kimani", role: "Administrator", gross: 120000, status: "Active" },
  { id: "EMP-002", name: "Dr. Kevin Mburu", role: "Lead Physician", gross: 250000, status: "Active" },
  { id: "EMP-003", name: "Alice Wanjiku", role: "Nurse", gross: 80000, status: "Active" },
  { id: "EMP-004", name: "John Ochieng", role: "Lab Technician", gross: 90000, status: "On Leave" },
];

export function Payroll() {
  const [activeTab, setActiveTab] = useState<"directory" | "run">("directory");
  const [payrollRun, setPayrollRun] = useState(false);

  const calculateDeductions = (gross: number) => {
    const paye = gross * 0.25; // Simplified calculation
    const nssf = 1080;
    const sha = gross * 0.0275; 
    const net = gross - paye - nssf - sha;
    return { paye, nssf, sha, net };
  };

  return (
    <div className="flex h-full flex-col space-y-6 overflow-hidden">
      <div className="flex items-end justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">
            Payroll
          </h2>
          <p className="text-sm text-slate-500">
            Manage staff records, run payroll, and generate payslips.
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={() => setActiveTab("directory")}
            variant={activeTab === "directory" ? "default" : "outline"}
            className={activeTab === "directory" ? "bg-indigo-600 text-white hover:bg-indigo-700 border-none" : "text-slate-700"}
          >
            <Users className="mr-2 h-4 w-4" />
            Directory
          </Button>
          <Button 
            onClick={() => setActiveTab("run")}
            variant={activeTab === "run" ? "default" : "outline"}
            className={activeTab === "run" ? "bg-indigo-600 text-white hover:bg-indigo-700 border-none" : "text-slate-700"}
          >
            <Calculator className="mr-2 h-4 w-4" />
            Payroll Run
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-6">
        {activeTab === "directory" && (
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm flex-1 overflow-hidden flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="border-b border-slate-200 bg-slate-50/50 font-medium text-slate-700 sticky top-0">
                  <tr>
                    <th className="p-4">Employee ID</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Gross Salary</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {staffData.map(staff => (
                    <tr key={staff.id} className="hover:bg-slate-50/50">
                      <td className="p-4 font-medium text-indigo-600">{staff.id}</td>
                      <td className="p-4 font-medium text-slate-900">{staff.name}</td>
                      <td className="p-4">{staff.role}</td>
                      <td className="p-4">KES {staff.gross.toLocaleString()}</td>
                      <td className="p-4">
                        <Badge variant={staff.status === "Active" ? "default" : "secondary"} className={staff.status === "Active" ? "bg-emerald-100 text-emerald-800 border-none hover:bg-emerald-100" : "bg-slate-100 text-slate-800 border-none hover:bg-slate-100"}>
                          {staff.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <Button variant="ghost" size="sm" className="text-slate-500 hover:text-indigo-600">
                          Edit Profile
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "run" && (
          <div className="space-y-6 h-full pb-6">
            {!payrollRun ? (
              <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
                <Calculator className="h-12 w-12 text-slate-300 mb-4" />
                <h3 className="text-lg font-bold text-slate-800 mb-2">Generate July 2026 Payroll</h3>
                <p className="text-sm text-slate-500 mb-6 max-w-md">
                  This will calculate PAYE, NSSF, SHA, and net pay for all active employees based on their current gross salary.
                </p>
                <Button className="bg-indigo-600 text-white hover:bg-indigo-700 px-8" onClick={() => setPayrollRun(true)}>
                  Run Calculations
                </Button>
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-emerald-50/50">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                    <div>
                      <h3 className="font-bold text-slate-800">July 2026 Payroll Generated</h3>
                      <p className="text-xs text-slate-500">All standard deductions applied successfully.</p>
                    </div>
                  </div>
                  <Button className="bg-emerald-600 text-white hover:bg-emerald-700">
                    Approve & Disburse
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="border-b border-slate-200 bg-slate-50/50 font-medium text-slate-700">
                      <tr>
                        <th className="p-4">Name</th>
                        <th className="p-4">Gross</th>
                        <th className="p-4">PAYE</th>
                        <th className="p-4">NSSF</th>
                        <th className="p-4">SHA</th>
                        <th className="p-4 font-bold text-slate-900">Net Pay</th>
                        <th className="p-4 text-right">Payslip</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {staffData.filter(s => s.status === 'Active').map(staff => {
                        const d = calculateDeductions(staff.gross);
                        return (
                          <tr key={staff.id} className="hover:bg-slate-50/50">
                            <td className="p-4 font-medium text-slate-900">{staff.name}</td>
                            <td className="p-4">KES {staff.gross.toLocaleString()}</td>
                            <td className="p-4 text-rose-600">-{(d.paye).toLocaleString()}</td>
                            <td className="p-4 text-rose-600">-{(d.nssf).toLocaleString()}</td>
                            <td className="p-4 text-rose-600">-{(d.sha).toLocaleString()}</td>
                            <td className="p-4 font-bold text-emerald-600">KES {d.net.toLocaleString()}</td>
                            <td className="p-4 text-right">
                              <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50">
                                <FileDown className="h-4 w-4 mr-1" /> PDF
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
