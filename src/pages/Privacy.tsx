import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicFooter, PublicHeader } from "@/components/layout/PublicSiteLayout";

export function Privacy() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <PublicHeader />

      <main className="mx-auto w-full max-w-4xl px-6 py-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <ShieldCheck className="h-10 w-10 text-primary" />
          <h1 className="mt-6 text-4xl font-black tracking-tight">Privacy Policy</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            LedgerLink is designed to keep business information organized and accessible to authorized users. This page summarizes the privacy posture for the demo site.
          </p>

          <div className="mt-8 space-y-6 text-sm leading-7 text-slate-600">
            <p>We only collect information you submit through forms, such as contact details and messages.</p>
            <p>We use submitted information to respond to inquiries, provide demos, and improve the product experience.</p>
            <p>Access to customer data should remain limited to authorized account users and support staff.</p>
            <p>For production deployments, add your formal retention, backup, and data processing policies here.</p>
          </div>

          <div className="mt-8 flex gap-3">
            <Link to="/contact">
              <Button className="rounded-full px-5">Contact us</Button>
            </Link>
            <Link to="/terms">
              <Button variant="outline" className="rounded-full border-slate-300 px-5">View terms</Button>
            </Link>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}