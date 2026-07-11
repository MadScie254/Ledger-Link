/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppLayout } from "@/components/layout/AppLayout";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Onboarding } from "@/pages/Onboarding";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

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
          <MainApp />
          <Toaster richColors position="top-right" />
        </AuthProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

