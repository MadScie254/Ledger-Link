import { Link } from "react-router-dom";
import { ArrowRight, House, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicFooter, PublicHeader } from "@/components/layout/PublicSiteLayout";

export function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <PublicHeader />

      <main className="mx-auto flex min-h-[70vh] w-full max-w-5xl flex-col items-center justify-center px-6 py-16 text-center">
        <p className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-semibold text-slate-600 shadow-sm">404</p>
        <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">This page does not exist.</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
          The link may be broken or the address may have been typed incorrectly. Use the buttons below to get back to the public site.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/">
            <Button className="rounded-full px-5">
              <House className="mr-2 h-4 w-4" /> Home
            </Button>
          </Link>
          <Link to="/pricing">
            <Button variant="outline" className="rounded-full border-slate-300 px-5">
              Pricing <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="secondary" className="rounded-full px-5">
              <PhoneCall className="mr-2 h-4 w-4" /> Contact us
            </Button>
          </Link>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}