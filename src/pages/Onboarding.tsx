import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export function Onboarding() {
  const { completeOnboarding } = useAuth();
  const [step, setStep] = useState(1);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900">
            Welcome to LedgerLink
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Let's get your organization set up.
          </p>
        </div>
        
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-slate-900">Step 1: Organization Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Organization Name</label>
                <input type="text" className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Acme Kenya Ltd" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Sector</label>
                <select className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                  <option>School</option>
                  <option>Church</option>
                  <option>Law Firm</option>
                  <option>Hospital / Clinic</option>
                </select>
              </div>
            </div>
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={() => setStep(2)}>Continue</Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-slate-900">Step 2: Connect QuickBooks</h3>
            <p className="text-sm text-slate-500">
              LedgerLink syncs your data seamlessly with QuickBooks Online.
            </p>
            <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              <p className="font-semibold">Action Required</p>
              <p>Configure your QBO credentials in Settings later, or connect now using OAuth.</p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" className="w-full" onClick={() => setStep(3)}>Skip for now</Button>
              <Button className="w-full bg-emerald-600 text-white hover:bg-emerald-700" onClick={() => setStep(3)}>Connect QBO</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-slate-900">Step 3: Import Initial Data</h3>
            <p className="text-sm text-slate-500">
              Import your existing staff, inventory, or invoices to hit the ground running.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-md border border-slate-200 p-3">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" defaultChecked />
                <span className="text-sm font-medium text-slate-700">Import Chart of Accounts</span>
              </div>
              <div className="flex items-center gap-3 rounded-md border border-slate-200 p-3">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                <span className="text-sm font-medium text-slate-700">Import Staff (CSV)</span>
              </div>
            </div>
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={completeOnboarding}>Complete Setup</Button>
          </div>
        )}

        <div className="flex justify-center gap-2 pt-4">
          <div className={`h-1.5 w-8 rounded-full ${step >= 1 ? 'bg-indigo-600' : 'bg-slate-200'}`} />
          <div className={`h-1.5 w-8 rounded-full ${step >= 2 ? 'bg-indigo-600' : 'bg-slate-200'}`} />
          <div className={`h-1.5 w-8 rounded-full ${step >= 3 ? 'bg-indigo-600' : 'bg-slate-200'}`} />
        </div>
      </div>
    </div>
  );
}
