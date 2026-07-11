import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "sonner";
import { useState } from "react";

export function Settings() {
  const { role, setRole } = useAuth();
  const { orgProfile, setOrgProfile } = useAppStore();
  
  const [name, setName] = useState(orgProfile.name);
  const [sector, setSector] = useState(orgProfile.sector);

  const handleSaveProfile = () => {
    setOrgProfile({ name, sector });
    toast.success("Organization profile updated");
  };

  const handleToggleQB = () => {
    const newState = !orgProfile.qbConnected;
    setOrgProfile({ qbConnected: newState });
    toast.success(`QuickBooks ${newState ? 'Connected' : 'Disconnected'}`);
  };

  return (
    <div className="flex h-full flex-col space-y-6 overflow-hidden max-w-4xl">
      <div className="flex items-end justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Settings
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage your organization and account preferences.
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-card-foreground border-b border-border pb-2">Organization Profile</h3>
          
          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Organization Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Sector</label>
              <select 
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option>School</option>
                <option>Church</option>
                <option>Law Firm</option>
                <option>Hospital / Clinic</option>
                <option>Other</option>
              </select>
            </div>
            <Button onClick={handleSaveProfile} className="mt-2">Save Profile</Button>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-card-foreground border-b border-border pb-2">Integrations</h3>
          <div className="flex items-center justify-between max-w-md p-4 border border-border rounded-lg bg-background">
            <div>
              <p className="font-semibold text-sm">QuickBooks Online</p>
              <p className="text-xs text-muted-foreground">
                {orgProfile.qbConnected ? 'Connected and syncing' : 'Not connected'}
              </p>
            </div>
            <Button 
              variant={orgProfile.qbConnected ? "outline" : "default"} 
              onClick={handleToggleQB}
              className={orgProfile.qbConnected ? "text-destructive hover:bg-destructive/10" : "bg-emerald-600 hover:bg-emerald-700"}
            >
              {orgProfile.qbConnected ? 'Disconnect' : 'Connect'}
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-card-foreground border-b border-border pb-2">Demo Role Switcher</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Switch roles to see different dashboard views based on RBAC.
          </p>
          <div className="flex gap-4">
            <Button 
              variant={role === "owner" ? "default" : "outline"}
              onClick={() => { setRole("owner"); toast.info("Switched to Owner role"); }}
            >
              Owner
            </Button>
            <Button 
              variant={role === "finance" ? "default" : "outline"}
              onClick={() => { setRole("finance"); toast.info("Switched to Finance Staff role"); }}
            >
              Finance Staff
            </Button>
            <Button 
              variant={role === "board" ? "default" : "outline"}
              onClick={() => { setRole("board"); toast.info("Switched to Board Member role"); }}
            >
              Board Member
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
