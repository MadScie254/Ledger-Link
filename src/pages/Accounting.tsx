import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Check, AlertCircle } from "lucide-react";

const mpesaTransactions = [
  { id: "MP-A1B2C3", amount: 450000, sender: "John Doe", date: "Jul 10, 2026", status: "Unmatched", matchScore: "High" },
  { id: "MP-X9Y8Z7", amount: 120000, sender: "Jane Smith", date: "Jul 05, 2026", status: "Matched", invoice: "INV-2026-004" }
];

const bankTransactions = [
  { id: "TRX-9988", amount: 1250000, sender: "St. John's Hosp", date: "Jul 11, 2026", status: "Unmatched" },
  { id: "TRX-9989", amount: 85000, sender: "Tech Solutions", date: "Jul 12, 2026", status: "Unmatched" }
];

const syncLogs = [
  { id: 1, time: "Today, 09:00 AM", status: "Success", details: "12 invoices, 4 payments synced to QBO" },
  { id: 2, time: "Yesterday, 05:30 PM", status: "Warning", details: "Failed to sync staff records (API Rate Limit)" },
];

export function Accounting() {
  const [activeTab, setActiveTab] = useState<"reconciliation" | "qbo">("reconciliation");
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  return (
    <div className="flex h-full flex-col space-y-6 overflow-hidden">
      <div className="flex items-end justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">
            Accounting & Reconciliation
          </h2>
          <p className="text-sm text-slate-500">
            Reconcile bank and M-Pesa transactions, and sync with QuickBooks.
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={() => setActiveTab("reconciliation")}
            variant={activeTab === "reconciliation" ? "default" : "outline"}
            className={activeTab === "reconciliation" ? "bg-indigo-600 text-white hover:bg-indigo-700 border-none" : "text-slate-700"}
          >
            Reconciliation
          </Button>
          <Button 
            onClick={() => setActiveTab("qbo")}
            variant={activeTab === "qbo" ? "default" : "outline"}
            className={activeTab === "qbo" ? "bg-indigo-600 text-white hover:bg-indigo-700 border-none" : "text-slate-700"}
          >
            QBO Integration
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-6">
        {activeTab === "reconciliation" && (
          <>
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">M-Pesa Transactions</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="border-b border-slate-200 bg-slate-50 font-medium text-slate-700">
                    <tr>
                      <th className="p-3">Receipt No.</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Sender</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {mpesaTransactions.map(tx => (
                      <tr key={tx.id} className="hover:bg-slate-50/50">
                        <td className="p-3 font-medium text-slate-900">{tx.id}</td>
                        <td className="p-3">{tx.date}</td>
                        <td className="p-3">{tx.sender}</td>
                        <td className="p-3 font-medium">KES {tx.amount.toLocaleString()}</td>
                        <td className="p-3">
                          <Badge variant="secondary" className={tx.status === "Matched" ? "bg-emerald-100 text-emerald-800 border-none" : "bg-amber-100 text-amber-800 border-none"}>
                            {tx.status}
                          </Badge>
                        </td>
                        <td className="p-3 text-right">
                          {tx.status === "Unmatched" ? (
                            <Button variant="outline" size="sm" className="text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                              Match
                            </Button>
                          ) : (
                            <span className="text-xs text-slate-400">{tx.invoice}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Bank Feed (KCB Bank)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="border-b border-slate-200 bg-slate-50 font-medium text-slate-700">
                    <tr>
                      <th className="p-3">Reference</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Description</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bankTransactions.map(tx => (
                      <tr key={tx.id} className="hover:bg-slate-50/50">
                        <td className="p-3 font-medium text-slate-900">{tx.id}</td>
                        <td className="p-3">{tx.date}</td>
                        <td className="p-3">{tx.sender}</td>
                        <td className="p-3 font-medium">KES {tx.amount.toLocaleString()}</td>
                        <td className="p-3">
                          <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-none">
                            {tx.status}
                          </Badge>
                        </td>
                        <td className="p-3 text-right">
                          <Button variant="outline" size="sm" className="text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                            Match
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === "qbo" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-800">QuickBooks Online</h3>
                <p className="text-sm text-slate-500">Connected as Acme Kenya Ltd.</p>
              </div>
              <Button 
                onClick={handleSync}
                disabled={isSyncing}
                className="bg-emerald-600 text-white hover:bg-emerald-700 border-none"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
                {isSyncing ? "Syncing..." : "Sync Now"}
              </Button>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6">
              <h3 className="font-bold text-slate-800 mb-4">Recent Sync Logs</h3>
              <div className="space-y-4">
                {syncLogs.map(log => (
                  <div key={log.id} className="flex gap-4 p-4 border border-slate-100 rounded-lg bg-slate-50">
                    <div className="mt-0.5">
                      {log.status === "Success" ? (
                        <Check className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-amber-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{log.status}</p>
                      <p className="text-xs text-slate-500">{log.details}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{log.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
