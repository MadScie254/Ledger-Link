import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicFooter, PublicHeader } from "@/components/layout/PublicSiteLayout";

export function Terms() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <PublicHeader />

      <main className="mx-auto w-full max-w-4xl px-6 py-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <FileText className="h-10 w-10 text-primary" />
          <h1 className="mt-6 text-4xl font-black tracking-tight">Terms of Service</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            These terms outline the demo site expectations for LedgerLink. Replace this page with your final legal terms before production use.
          </p>

          <div className="mt-8 space-y-6 text-sm leading-7 text-slate-600">
            <p>You may use LedgerLink for lawful business activities only.</p>
            <p>You are responsible for protecting your account credentials and restricting access to authorized users.</p>
            <p>We may update features, pricing, or availability as the product evolves.</p>
            <p>For enterprise use, add your support, SLA, and billing commitments here.</p>
          </div>

          <div className="mt-8 flex gap-3">
            <Link to="/pricing">
              <Button className="rounded-full px-5">View pricing</Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="rounded-full border-slate-300 px-5">Contact us</Button>
            </Link>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}