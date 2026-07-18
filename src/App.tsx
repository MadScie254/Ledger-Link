/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppLayout } from "@/components/layout/AppLayout";
import { Contact } from "@/pages/Contact";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Onboarding } from "@/pages/Onboarding";
import { Landing } from "@/pages/Landing";
import { Pricing } from "@/pages/Pricing";
import { Auth } from "@/pages/Auth";
import { Privacy } from "@/pages/Privacy";
import { Terms } from "@/pages/Terms";
import { NotFound } from "@/pages/NotFound";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { Routes, Route } from "react-router-dom";

function MainApp() {
  const { isOnboarded } = useAuth();
  if (!isOnboarded) return <Onboarding />;
  return <AppLayout />;
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <ErrorBoundary>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/app/*" element={<MainApp />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster richColors position="top-right" />
        </AuthProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

