import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAppStore } from "@/store/useAppStore";

export type Role = "owner" | "finance" | "board";

interface AuthContextType {
  role: Role;
  setRole: (role: Role) => void;
  organization: string;
  isOnboarded: boolean;
  completeOnboarding: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("owner");
  const orgProfile = useAppStore((state) => state.orgProfile);
  const [isOnboarded, setIsOnboarded] = useState(() => {
    try {
      return localStorage.getItem("ledgerlink_isOnboarded") === "true";
    } catch {
      return false;
    }
  });

  // Persist isOnboarded whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("ledgerlink_isOnboarded", String(isOnboarded));
    } catch {
      // localStorage unavailable — silently ignore
    }
  }, [isOnboarded]);

  const completeOnboarding = () => setIsOnboarded(true);

  return (
    <AuthContext.Provider value={{ role, setRole, organization: orgProfile.name, isOnboarded, completeOnboarding }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

