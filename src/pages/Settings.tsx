import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export function Settings() {
  const { role, setRole } = useAuth();

  return (
    <div className="flex h-full flex-col space-y-6 overflow-hidden">
      <div className="flex items-end justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">
            Settings
          </h2>
          <p className="text-sm text-slate-500">
            Manage your organization and account preferences.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-slate-800">Demo Role Switcher</h3>
        <p className="mb-4 text-sm text-slate-500">
          Switch roles to see different dashboard views based on RBAC.
        </p>
        <div className="flex gap-4">
          <Button 
            variant={role === "owner" ? "default" : "outline"}
            onClick={() => setRole("owner")}
            className={role === "owner" ? "bg-indigo-600 hover:bg-indigo-700" : ""}
          >
            Owner
          </Button>
          <Button 
            variant={role === "finance" ? "default" : "outline"}
            onClick={() => setRole("finance")}
            className={role === "finance" ? "bg-indigo-600 hover:bg-indigo-700" : ""}
          >
            Finance Staff
          </Button>
          <Button 
            variant={role === "board" ? "default" : "outline"}
            onClick={() => setRole("board")}
            className={role === "board" ? "bg-indigo-600 hover:bg-indigo-700" : ""}
          >
            Board Member
          </Button>
        </div>
      </div>
    </div>
  );
}
