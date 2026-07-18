import { useAppStore } from "@/store/useAppStore";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import { Shield, User, Receipt, FileText, Package, Users, CheckCircle, Bell, ArrowRight } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

const iconMap: Record<string, React.ReactNode> = {
  "shield": <Shield className="h-5 w-5" />,
  "user": <User className="h-5 w-5" />,
  "receipt": <Receipt className="h-5 w-5" />,
  "file-text": <FileText className="h-5 w-5" />,
  "package": <Package className="h-5 w-5" />,
  "users": <Users className="h-5 w-5" />,
  "check-circle": <CheckCircle className="h-5 w-5" />,
  "bell": <Bell className="h-5 w-5" />
};

export function ActivityLog() {
  const { activityLog } = useAppStore();
  const [filterType, setFilterType] = useState<string>("All");

  const types = useMemo(() => {
    const uniqueTypes = new Set(activityLog.map(log => log.type));
    return ["All", ...Array.from(uniqueTypes)].sort();
  }, [activityLog]);

  const filteredLog = useMemo(() => {
    if (filterType === "All") return activityLog;
    return activityLog.filter(log => log.type === filterType);
  }, [activityLog, filterType]);

  return (
    <div className="flex h-full flex-col space-y-6 overflow-hidden">
      <div className="flex items-end justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Activity Log
          </h2>
          <p className="text-sm text-muted-foreground">
            A chronological trail of system and user actions.
          </p>
        </div>
        <select 
          className="rounded-md border border-input bg-background py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          {types.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm flex-1 overflow-y-auto p-4 md:p-6">
        {filteredLog.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <EmptyState 
              icon={FileText} 
              message="No activities found." 
            />
          </div>
        ) : (
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
            {filteredLog.map((event, i) => (
              <div key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-card bg-primary/10 text-primary shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10">
                  {iconMap[event.icon] || <ArrowRight className="h-5 w-5" />}
                </div>
                
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-border bg-background shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider bg-primary/5 px-2 py-1 rounded-md w-fit">
                      {event.type}
                    </span>
                    <time className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                      {format(new Date(event.timestamp), "MMM dd, yyyy · HH:mm")}
                    </time>
                  </div>
                  <h4 className="text-sm font-bold text-foreground mb-1">{event.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
