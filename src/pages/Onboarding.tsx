import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "sonner";

export function Onboarding() {
  const { completeOnboarding } = useAuth();
  const { orgProfile, setOrgProfile } = useAppStore();
  const [step, setStep] = useState(1);
  const [tempName, setTempName] = useState(orgProfile.name);
  const [tempSector, setTempSector] = useState(orgProfile.sector);

  const handleNextStep1 = () => {
    if (!tempName.trim()) {
      toast.error("Organization name is required");
      return;
    }
    setOrgProfile({ name: tempName, sector: tempSector });
    setStep(2);
  };

  const handleConnectQBO = () => {
    setOrgProfile({ qbConnected: true });
    toast.success("Successfully connected to QuickBooks Online (Mocked)");
    setStep(3);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-border bg-card p-8 shadow-sm">
        <div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-card-foreground">
            Welcome to LedgerLink
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Let's get your organization set up.
          </p>
        </div>
        
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-card-foreground">Step 1: Organization Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Organization Name</label>
                <input 
                  type="text" 
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" 
                  placeholder="Acme Kenya Ltd" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Sector</label>
                <select 
                  value={tempSector}
                  onChange={(e) => setTempSector(e.target.value)}
                  className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option>School</option>
                  <option>Church</option>
                  <option>Law Firm</option>
                  <option>Hospital / Clinic</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            <Button className="w-full" onClick={handleNextStep1}>Continue</Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-card-foreground">Step 2: Connect QuickBooks</h3>
            <p className="text-sm text-muted-foreground">
              LedgerLink syncs your data seamlessly with QuickBooks Online.
            </p>
            <div className="rounded-md border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 p-4 text-sm text-amber-800 dark:text-amber-300">
              <p className="font-semibold">Action Required</p>
              <p>Configure your QBO credentials in Settings later, or connect now using OAuth.</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" className="flex-1 min-w-0" onClick={() => setStep(1)}>Back</Button>
              <Button variant="outline" className="flex-1 min-w-0" onClick={() => setStep(3)}>Skip</Button>
              <Button className="flex-1 min-w-0 bg-emerald-600 text-white hover:bg-emerald-700" onClick={handleConnectQBO}>Connect QBO</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-card-foreground">Step 3: Import Initial Data</h3>
            <p className="text-sm text-muted-foreground">
              Import your existing staff, inventory, or invoices to hit the ground running.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-md border border-border p-3">
                <input type="checkbox" className="h-4 w-4 rounded border-input text-primary focus:ring-primary" defaultChecked />
                <span className="text-sm font-medium text-card-foreground">Import Chart of Accounts</span>
              </div>
              <div className="flex items-center gap-3 rounded-md border border-border p-3">
                <input type="checkbox" className="h-4 w-4 rounded border-input text-primary focus:ring-primary" />
                <span className="text-sm font-medium text-card-foreground">Import Staff (CSV)</span>
              </div>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" className="w-1/3" onClick={() => setStep(2)}>Back</Button>
              <Button className="w-2/3" onClick={completeOnboarding}>Complete Setup</Button>
            </div>
          </div>
        )}

        <div className="flex justify-center gap-2 pt-4">
          <div className={`h-1.5 w-8 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
          <div className={`h-1.5 w-8 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
          <div className={`h-1.5 w-8 rounded-full ${step >= 3 ? 'bg-primary' : 'bg-muted'}`} />
        </div>
      </div>
    </div>
  );
}
