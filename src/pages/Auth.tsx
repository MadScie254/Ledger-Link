import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { isOnboarded } = useAuth();
  
  // A simple toggle between login and signup mode for appearance
  const isLogin = new URLSearchParams(location.search).get("mode") === "login";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Fake loading sequence
    setLoadingText("Authenticating...");
    
    setTimeout(() => {
      setLoadingText(isLogin ? "Loading your workspace..." : "Preparing your account...");
      
      setTimeout(() => {
        // If they click signup, we can optionally clear their onboarded state so they see the flow
        if (!isLogin && isOnboarded) {
          localStorage.removeItem("ledgerlink_isOnboarded");
          window.location.href = "/app";
        } else {
          navigate("/app");
        }
      }, 1500);
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-sm font-medium text-slate-600 animate-pulse">{loadingText}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary font-bold text-primary-foreground shadow-sm">
            LL
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-950">
            {isLogin ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {isLogin ? "Enter your details to access your workspace." : "Get started with LedgerLink for free."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Email address</label>
            <input
              type="email"
              required
              defaultValue={isLogin ? "demo@ledgerlink.app" : ""}
              className="block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="you@organization.com"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              required
              defaultValue={isLogin ? "password123" : ""}
              className="block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" className="mt-2 h-11 w-full rounded-lg text-base">
            {isLogin ? "Sign in" : "Start for free"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          {isLogin ? (
            <p>
              Don't have an account?{" "}
              <a href="/auth?mode=signup" className="font-semibold text-primary hover:underline">
                Sign up
              </a>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <a href="/auth?mode=login" className="font-semibold text-primary hover:underline">
                Log in
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
