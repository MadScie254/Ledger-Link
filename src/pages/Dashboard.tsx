import { useAuth } from "@/contexts/AuthContext";
import { DashboardOwner } from "./dashboards/DashboardOwner";
import { DashboardBoard } from "./dashboards/DashboardBoard";

export function Dashboard() {
  const { role } = useAuth();

  if (role === "board") {
    return <DashboardBoard />;
  }

  // Owner and Finance share a similar operational view, but Finance might have fewer destructive actions
  return <DashboardOwner />;
}
