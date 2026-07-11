import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Dashboard } from "@/pages/Dashboard";
import { Invoicing } from "@/pages/Invoicing";
import { Payroll } from "@/pages/Payroll";
import { Inventory } from "@/pages/Inventory";
import { Accounting } from "@/pages/Accounting";
import { Settings } from "@/pages/Settings";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export function AppLayout() {
  const [currentRoute, setCurrentRoute] = useState("dashboard");

  const renderContent = () => {
    switch (currentRoute) {
      case "dashboard":
        return <Dashboard />;
      case "invoicing":
        return <Invoicing />;
      case "payroll":
        return <Payroll />;
      case "inventory":
        return <Inventory />;
      case "accounting":
        return <Accounting />;
      case "settings":
        return <Settings />;
      default:
        return (
          <div className="flex h-full items-center justify-center text-slate-500">
            <p>Module '{currentRoute}' is under construction.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen w-full font-sans bg-slate-50 text-slate-900 overflow-hidden" style={{ backgroundColor: '#f8fafc' }}>
      <Sidebar currentRoute={currentRoute} onNavigate={setCurrentRoute} />
      <div className="flex flex-1 flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto p-8 relative">
          <ErrorBoundary>
            {renderContent()}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
