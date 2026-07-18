import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "sonner";
import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, LifeBuoy, Mail, ShieldCheck } from "lucide-react";

type TeamRole = "Owner" | "Finance" | "Board";

type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  status: "Invited" | "Active";
};

export function Settings() {
  const { role, setRole } = useAuth();
  const { orgProfile, setOrgProfile, accounts, addAccount } = useAppStore();
  
  const [name, setName] = useState(orgProfile.name);
  const [sector, setSector] = useState(orgProfile.sector);

  const [newAccountName, setNewAccountName] = useState("");
  const [newAccountType, setNewAccountType] = useState<"Income" | "Expense" | "Asset" | "Liability">("Expense");
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [highlightedRow, setHighlightedRow] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: "TEAM-001", name: "Amina Njeri", email: "amina@ledgerlink.demo", role: "Owner", status: "Active" },
    { id: "TEAM-002", name: "Brian Otieno", email: "brian@ledgerlink.demo", role: "Finance", status: "Active" },
    { id: "TEAM-003", name: "Grace Wanjiru", email: "grace@ledgerlink.demo", role: "Board", status: "Invited" },
  ]);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<TeamRole>("Finance");

  useEffect(() => {
    const highlightId = searchParams.get("highlight");
    if (highlightId) {
      setHighlightedRow(highlightId);
      setTimeout(() => {
        const el = document.getElementById(`settings-account-${highlightId}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);

      const timer = setTimeout(() => {
        setHighlightedRow(null);
        const newParams = new URLSearchParams(searchParams);
        newParams.delete("highlight");
        setSearchParams(newParams, { replace: true });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, setSearchParams]);

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

  const handleInviteMember = () => {
    if (role === "board") {
      toast.error("Board members have read-only access.");
      return;
    }

    if (!inviteEmail.trim()) {
      toast.error("Invite email is required");
      return;
    }

    const nextMember: TeamMember = {
      id: `TEAM-${String(teamMembers.length + 1).padStart(3, "0")}`,
      name: inviteEmail.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
      email: inviteEmail.trim(),
      role: inviteRole,
      status: "Invited",
    };

    setTeamMembers((prev) => [nextMember, ...prev]);
    setInviteEmail("");
    setInviteRole("Finance");
    setIsInviteOpen(false);
    toast.success(`Invitation sent to ${nextMember.email}`);
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col gap-4 flex-1 min-h-0">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto space-y-6">
          <TabsContent value="profile" className="m-0 space-y-6 data-[state=inactive]:hidden">
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
              <h3 className="mb-4 text-lg font-semibold text-card-foreground border-b border-border pb-2">Help & Support</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Need assistance with your account or have a question about LedgerLink?
              </p>
              <Link to="/contact">
                <Button variant="outline">
                  <LifeBuoy className="mr-2 h-4 w-4" />
                  Contact Support
                </Button>
              </Link>
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
                      {groupedAccounts.map(account => {
                        const isHighlighted = highlightedRow === account.id;
                        return (
                          <TableRow 
                            key={account.id} 
                            id={`settings-account-${account.id}`}
                            className={`hover:bg-muted/50 transition-colors duration-500 ${isHighlighted ? 'bg-primary/20 dark:bg-primary/30 ring-2 ring-primary ring-inset' : ''}`}
                          >
                            <TableCell className="font-medium text-xs text-muted-foreground">{account.id}</TableCell>
                            <TableCell className="font-medium text-card-foreground">{account.name}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-background">
                                {account.type}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
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

            <div className="rounded-xl border border-destructive/30 bg-card p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-card-foreground border-b border-border pb-2">Reset Demo Data</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Clear all saved state and restore the original mock data. This is useful for resetting between client demos.
              </p>
              <Button 
                variant="outline" 
                className="text-destructive hover:bg-destructive/10 border-destructive/30"
                onClick={() => {
                  localStorage.removeItem('ledgerlink-app-store');
                  toast.success("Demo data reset. Reloading...");
                  setTimeout(() => window.location.reload(), 500);
                }}
              >
                Reset Demo Data
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="team" className="m-0 space-y-6 data-[state=inactive]:hidden">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4 border-b border-border pb-2 mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-card-foreground">Team</h3>
                  <p className="text-xs text-muted-foreground mt-1">Invite members and assign access by role.</p>
                </div>
                <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                  <DialogTrigger asChild>
                    <Button disabled={role === "board"}>
                      <Plus className="mr-2 h-4 w-4" /> Invite Member
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Invite Team Member</DialogTitle>
                      <DialogDescription>Send an invitation with a defined role.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground mb-1 block">Email Address</label>
                        <input value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} className="w-full rounded-md border border-input bg-background py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" placeholder="name@company.co.ke" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground mb-1 block">Role</label>
                        <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value as TeamRole)} className="w-full rounded-md border border-input bg-background py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
                          <option value="Owner">Owner</option>
                          <option value="Finance">Finance</option>
                          <option value="Board">Board</option>
                        </select>
                      </div>
                      <div className="rounded-lg border border-border bg-muted/20 p-3 text-xs text-muted-foreground flex items-start gap-2">
                        <ShieldCheck className="h-4 w-4 mt-0.5 text-primary" />
                        Board role is automatically read-only in the app.
                      </div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button onClick={handleInviteMember}>Send Invite</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="grid gap-3">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between rounded-lg border border-border bg-background p-4">
                    <div>
                      <p className="font-medium text-card-foreground">{member.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-2 mt-1"><Mail className="h-3 w-3" /> {member.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{member.role}</Badge>
                      <Badge className={member.status === "Active" ? "bg-emerald-600" : "bg-amber-600"}>{member.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
