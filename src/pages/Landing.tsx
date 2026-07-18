import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, LayoutDashboard, FileText, PieChart, Users } from "lucide-react";

export function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="px-6 py-4 flex items-center justify-between bg-white border-b border-border sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground shadow-sm">
            LL
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">LedgerLink</span>
        </div>
        <nav className="hidden md:flex gap-6 items-center">
          <Link to="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground">Pricing</Link>
          <Link to="/app">
            <Button>Login / Get Started</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="px-6 py-24 md:py-32 flex flex-col items-center text-center max-w-4xl mx-auto">
          <Badge className="mb-6 bg-primary/10 text-primary border border-primary/20 px-4 py-1.5 text-sm">
            The New Standard in Organizational Finance
          </Badge>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-tight mb-8">
            Clean books for schools, churches, law firms and hospitals
            <span className="block text-muted-foreground font-normal mt-2">— without hiring a full finance team.</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl">
            LedgerLink simplifies invoicing, payroll, and bookkeeping into one intuitive platform built for organizations that need transparency and compliance over complex accounting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/app">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg rounded-full">
                Start for free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg rounded-full bg-white">
                View Pricing
              </Button>
            </Link>
          </div>
        </section>

        {/* Dashboard Mockup Section */}
        <section className="px-6 pb-24 max-w-6xl mx-auto w-full">
          <div className="rounded-2xl border border-slate-200/50 bg-white shadow-2xl p-2 pb-0 overflow-hidden relative">
            {/* Browser Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 bg-slate-50/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
              </div>
              <div className="mx-auto rounded-md bg-white border border-slate-200 px-32 py-1 text-xs text-slate-400 shadow-sm">
                ledgerlink.app
              </div>
            </div>
            {/* Mock Dashboard Content */}
            <div className="flex bg-slate-50 min-h-[400px]">
              {/* Sidebar */}
              <div className="w-64 border-r border-slate-200 bg-white p-4 hidden md:block">
                <div className="h-8 w-32 bg-slate-100 rounded mb-8"></div>
                <div className="space-y-3">
                  <div className="h-10 bg-primary/10 rounded flex items-center px-3">
                    <LayoutDashboard className="h-4 w-4 text-primary mr-3" />
                    <div className="h-4 w-20 bg-primary/20 rounded"></div>
                  </div>
                  {[FileText, Users, PieChart].map((Icon, i) => (
                    <div key={i} className="h-10 rounded flex items-center px-3">
                      <Icon className="h-4 w-4 text-slate-400 mr-3" />
                      <div className="h-4 w-20 bg-slate-100 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Main Area */}
              <div className="flex-1 p-8">
                <div className="h-8 w-48 bg-slate-200 rounded mb-6"></div>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="h-28 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                    <div className="h-3 w-24 bg-slate-100 rounded mb-4"></div>
                    <div className="h-8 w-32 bg-slate-200 rounded"></div>
                  </div>
                  <div className="h-28 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                    <div className="h-3 w-24 bg-slate-100 rounded mb-4"></div>
                    <div className="h-8 w-32 bg-slate-200 rounded mb-2"></div>
                    <div className="h-3 w-16 bg-warning/30 rounded"></div>
                  </div>
                  <div className="h-28 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                    <div className="h-3 w-24 bg-slate-100 rounded mb-4"></div>
                    <div className="h-8 w-32 bg-slate-200 rounded mb-2"></div>
                    <div className="h-3 w-16 bg-success/20 rounded"></div>
                  </div>
                </div>
                <div className="h-64 bg-white border border-slate-200 rounded-xl shadow-sm"></div>
              </div>
            </div>
            {/* Fade Out Overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent"></div>
          </div>
        </section>

        {/* Sectors Section */}
        <section className="px-6 py-24 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">Built for organizations that serve</h2>
              <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">Configured out-of-the-box for your sector's specific needs, vocabulary, and compliance requirements.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { title: "Schools", desc: "Manage fees, track fee balances, and run teacher payroll.", icon: "🏫", color: "bg-blue-50 text-blue-700 border-blue-200" },
                { title: "Churches", desc: "Track tithes, segregate funds, and manage staff stipends.", icon: "⛪", color: "bg-purple-50 text-purple-700 border-purple-200" },
                { title: "Law Firms", desc: "Manage client trust accounts and billable hours efficiently.", icon: "⚖️", color: "bg-slate-50 text-slate-700 border-slate-200" },
                { title: "Hospitals", desc: "Handle patient billing, NHIF tracking, and inventory.", icon: "🏥", color: "bg-rose-50 text-rose-700 border-rose-200" }
              ].map((sector) => (
                <div key={sector.title} className="p-6 rounded-2xl border border-slate-200 bg-slate-50 hover:shadow-md transition-shadow">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${sector.color} border text-2xl`}>
                    {sector.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{sector.title}</h3>
                  <p className="text-slate-600">{sector.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary font-bold text-xs text-primary-foreground">LL</div>
            <span className="text-lg font-bold tracking-tight text-white">LedgerLink</span>
          </div>
          <p className="text-slate-400 text-sm">© 2026 LedgerLink. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function Badge({ className, children }: { className?: string, children: React.ReactNode }) {
  return <span className={`inline-flex items-center rounded-full font-medium ${className}`}>{children}</span>;
}
