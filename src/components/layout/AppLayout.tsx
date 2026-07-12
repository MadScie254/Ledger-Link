import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Dashboard } from "@/pages/Dashboard";
import { Clients } from "@/pages/Clients";
import { Invoicing } from "@/pages/Invoicing";
import { Payroll } from "@/pages/Payroll";
import { Inventory } from "@/pages/Inventory";
import { Accounting } from "@/pages/Accounting";
import { Settings } from "@/pages/Settings";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export function AppLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full font-sans bg-slate-50 text-slate-900 overflow-hidden" style={{ backgroundColor: '#f8fafc' }}>
      <Sidebar isMobileOpen={isMobileSidebarOpen} setIsMobileOpen={setIsMobileSidebarOpen} />
      <div className="flex flex-1 flex-col min-w-0">
        <Header onMenuClick={() => setIsMobileSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-8 relative">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard/*" element={<Dashboard />} />
              <Route path="/clients/*" element={<Clients />} />
              <Route path="/invoicing/*" element={<Invoicing />} />
              <Route path="/payroll/*" element={<Payroll />} />
              <Route path="/inventory/*" element={<Inventory />} />
              <Route path="/accounting/*" element={<Accounting />} />
              <Route path="/settings/*" element={<Settings />} />
              <Route path="*" element={
                <div className="flex h-full items-center justify-center text-slate-500">
                  <p>Module is under construction.</p>
                </div>
              } />
            </Routes>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
