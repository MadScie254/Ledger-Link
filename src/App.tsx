/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppLayout } from "@/components/layout/AppLayout";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Onboarding } from "@/pages/Onboarding";
import { ErrorBoundary } from "@/components/ErrorBoundary";

function MainApp() {
  const { isOnboarded } = useAuth();
  if (!isOnboarded) return <Onboarding />;
  return <AppLayout />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ErrorBoundary>
  );
}

