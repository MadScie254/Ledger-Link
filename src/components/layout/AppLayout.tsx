import { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Dashboard } from "@/pages/Dashboard";
import { Clients } from "@/pages/Clients";
import { Invoicing } from "@/pages/Invoicing";
import { Payroll } from "@/pages/Payroll";
import { Inventory } from "@/pages/Inventory";
import { Accounting } from "@/pages/Accounting";
import { Reports } from "@/pages/Reports";
import { Settings } from "@/pages/Settings";
import { ActivityLog } from "@/pages/ActivityLog";
import { Support } from "@/pages/Support";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AIAssistant } from "@/components/AIAssistant";
import { AnimatePresence, motion } from "framer-motion";

export function AppLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen w-full font-sans bg-background text-foreground overflow-hidden">
      <Sidebar isMobileOpen={isMobileSidebarOpen} setIsMobileOpen={setIsMobileSidebarOpen} />
      <div className="flex flex-1 flex-col min-w-0">
        <Header onMenuClick={() => setIsMobileSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-8 relative">
          <ErrorBoundary>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="h-full"
              >
                <Routes location={location} key={location.pathname}>
                  <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
                  <Route path="/dashboard/*" element={<Dashboard />} />
                  <Route path="/clients/*" element={<Clients />} />
                  <Route path="/invoicing/*" element={<Invoicing />} />
                  <Route path="/payroll/*" element={<Payroll />} />
                  <Route path="/inventory/*" element={<Inventory />} />
                  <Route path="/accounting/*" element={<Accounting />} />
                  <Route path="/reports/*" element={<Reports />} />
                  <Route path="/settings/*" element={<Settings />} />
                  <Route path="/activity/*" element={<ActivityLog />} />
                  <Route path="/support/*" element={<Support />} />
                  <Route path="*" element={
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      <p>Module is under construction.</p>
                    </div>
                  } />
                </Routes>
              </motion.div>
            </AnimatePresence>
          </ErrorBoundary>
        </main>
      </div>
      <AIAssistant />
    </div>
  );
}
