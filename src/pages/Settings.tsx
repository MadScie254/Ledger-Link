import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "sonner";
import React, { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

export function Settings() {
  const { role, setRole } = useAuth();
  const { orgProfile, setOrgProfile, accounts, addAccount } = useAppStore();
  
  const [name, setName] = useState(orgProfile.name);
  const [sector, setSector] = useState(orgProfile.sector);

  const [newAccountName, setNewAccountName] = useState("");
  const [newAccountType, setNewAccountType] = useState<"Income" | "Expense" | "Asset" | "Liability">("Expense");
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);

  const handleSaveProfile = () => {
    setOrgProfile({ name, sector });
    toast.success("Organization profile updated");
  };

  const handleToggleQB = () => {
    const newState = !orgProfile.qbConnected;
    setOrgProfile({ qbConnected: newState });
    toast.success(`QuickBooks ${newState ? 'Connected' : 'Disconnected'}`);
  };

  const handleAddAccount = () => {
    if (!newAccountName.trim()) { toast.error("Account name is required"); return; }
    addAccount({ name: newAccountName.trim(), type: newAccountType });
    toast.success("Account added successfully");
    setIsAddAccountOpen(false);
    setNewAccountName("");
    setNewAccountType("Expense");
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

        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col max-h-[600px]">
          <div className="p-6 border-b border-border flex items-center justify-between shrink-0">
            <div>
              <h3 className="text-lg font-semibold text-card-foreground">Chart of Accounts</h3>
              <p className="text-xs text-muted-foreground mt-1">Manage financial categories for reporting and billing.</p>
            </div>
            <Dialog open={isAddAccountOpen} onOpenChange={setIsAddAccountOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" /> Add Account
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Account</DialogTitle>
                  <DialogDescription>Create a new account for your ledger.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-1 block">Account Name *</label>
                    <input 
                      value={newAccountName} 
                      onChange={(e) => setNewAccountName(e.target.value)} 
                      className="w-full rounded-md border border-input bg-background py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" 
                      placeholder="e.g. Marketing Expense" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-1 block">Account Type *</label>
                    <select 
                      value={newAccountType} 
                      onChange={(e) => setNewAccountType(e.target.value as any)} 
                      className="w-full rounded-md border border-input bg-background py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    >
                      <option value="Income">Income</option>
                      <option value="Expense">Expense</option>
                      <option value="Asset">Asset</option>
                      <option value="Liability">Liability</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button onClick={handleAddAccount}>Save Account</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="overflow-auto flex-1">
            <Table>
              <TableHeader className="bg-muted/50 sticky top-0 shadow-sm z-10">
                <TableRow>
                  <TableHead className="w-[120px]">ID</TableHead>
                  <TableHead>Account Name</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {["Income", "Expense", "Asset", "Liability"].map((type) => {
                  const groupedAccounts = accounts.filter(a => a.type === type);
                  if (groupedAccounts.length === 0) return null;
                  return (
                    <React.Fragment key={type}>
                      <TableRow className="bg-muted/30">
                        <TableCell colSpan={3} className="font-semibold text-xs uppercase text-muted-foreground py-2">
                          {type} Accounts
                        </TableCell>
                      </TableRow>
                      {groupedAccounts.map(account => (
                        <TableRow key={account.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium text-xs text-muted-foreground">{account.id}</TableCell>
                          <TableCell className="font-medium text-card-foreground">{account.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-background">
                              {account.type}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </React.Fragment>
                  );
                })}
                {accounts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">No accounts found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
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
