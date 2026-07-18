import { Link } from "react-router-dom";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/contact" },
];

const footerColumns = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "How it works", href: "/#how-it-works" },
      { label: "Pricing", href: "/#pricing" },
      { label: "Sectors", href: "/#sectors" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/#trust" },
      { label: "Contact", href: "/contact" },
      { label: "Support", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Security", href: "/#trust" },
    ],
  },
];

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary font-bold text-primary-foreground shadow-sm">
            LL
          </div>
          <div>
            <div className="text-lg font-bold tracking-tight text-slate-900">LedgerLink</div>
            <div className="text-xs text-slate-500">Books, payroll, and cash flow for Kenyan teams</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => 
            link.href.startsWith("/#") ? (
              <a key={link.label} href={link.href} className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900">
                {link.label}
              </a>
            ) : (
              <Link key={link.label} to={link.href} className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900">
                {link.label}
              </Link>
            )
          )}
          <Link to="/auth?mode=login">
            <Button size="sm" className="rounded-full px-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
              Login / Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </nav>

        <Link to="/auth?mode=signup" className="lg:hidden">
          <Button size="sm" className="rounded-full px-4">Get started</Button>
        </Link>
      </div>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 px-6 py-16 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary font-bold text-primary-foreground shadow-sm">
              LL
            </div>
            <div>
              <div className="text-lg font-bold tracking-tight text-white">LedgerLink</div>
              <div className="text-sm text-slate-400">Built for Kenyan organizations that want cleaner operations.</div>
            </div>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-100">{column.title}</h3>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      {link.href.startsWith("/#") ? (
                        <a href={link.href} className="text-sm text-slate-400 transition-colors hover:text-white">
                          {link.label}
                        </a>
                      ) : (
                        <Link to={link.href} className="text-sm text-slate-400 transition-colors hover:text-white">
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20">
          <h3 className="text-xl font-semibold text-white">Contact details</h3>
          <p className="mt-3 text-sm leading-6 text-slate-400">Talk to the LedgerLink team for demos, onboarding, and enterprise support.</p>

          <div className="mt-6 space-y-4 text-sm">
            <a href="mailto:hello@ledgerlink.app" className="flex items-center gap-3 text-slate-300 transition-colors hover:text-white">
              <Mail className="h-4 w-4 text-primary" /> hello@ledgerlink.app
            </a>
            <a href="tel:+254700123456" className="flex items-center gap-3 text-slate-300 transition-colors hover:text-white">
              <Phone className="h-4 w-4 text-primary" /> +254 700 123 456
            </a>
            <div className="flex items-center gap-3 text-slate-300">
              <MapPin className="h-4 w-4 text-primary" /> Nairobi, Kenya
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/contact">
              <Button className="rounded-full px-5">Contact us</Button>
            </Link>
            <a href="/#pricing" className="inline-flex">
              <Button variant="outline" className="rounded-full border-white/20 bg-transparent px-5 text-white hover:bg-white/10 hover:text-white">
                View pricing
              </Button>
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-7xl flex-col gap-3 border-t border-white/10 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 LedgerLink. All rights reserved.</p>
        <p>Invoicing, payroll, inventory, reporting, and AI support in one system.</p>
      </div>
    </footer>
  );
}