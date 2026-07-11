import { createContext, useContext, useState, ReactNode } from "react";
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
  const [isOnboarded, setIsOnboarded] = useState(false); // set to false to test onboarding

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
