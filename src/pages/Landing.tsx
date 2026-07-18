import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, LayoutDashboard, FileText, PieChart, Users, GraduationCap, HeartHandshake, Scale, Stethoscope } from "lucide-react";

export function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="px-6 py-4 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground shadow-sm">
            LL
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">LedgerLink</span>
        </div>
        <nav className="hidden md:flex gap-6 items-center">
          <Link to="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
          <Link to="/app">
            <Button className="shadow-sm hover:shadow-md transition-all">Login / Get Started</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="relative px-6 py-24 md:py-32 flex flex-col items-center text-center max-w-5xl mx-auto overflow-hidden">
          <div className="absolute inset-0 -z-10 h-full w-full bg-slate-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
          
          <Badge className="mb-8 bg-primary/10 text-primary border border-primary/20 px-4 py-1.5 text-sm font-semibold tracking-wide">
            Built for Kenyan Organizations
          </Badge>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-8">
            Clean books for your organization
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-600 mt-2">— without the finance team.</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl leading-relaxed">
            LedgerLink simplifies invoicing, KRA-compliant payroll, and bookkeeping into one intuitive platform. Say goodbye to messy spreadsheets and disconnected tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link to="/app" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                Start for free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/pricing" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg rounded-full bg-white hover:bg-slate-50 transition-all">
                View Pricing
              </Button>
            </Link>
          </div>
        </section>

        {/* Dashboard Mockup Section */}
        <section className="px-6 pb-24 max-w-6xl mx-auto w-full relative z-10">
          <div className="rounded-2xl border border-slate-200/60 bg-white shadow-2xl p-2 pb-0 overflow-hidden relative ring-1 ring-slate-900/5">
            {/* Browser Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 bg-slate-50/80">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
              </div>
              <div className="mx-auto rounded-md bg-white border border-slate-200 px-32 py-1 text-xs text-slate-400 shadow-sm flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-success/20 animate-pulse flex items-center justify-center"><span className="w-1.5 h-1.5 rounded-full bg-success"></span></span>
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
        <section className="px-6 py-24 bg-white border-t border-slate-200">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">Tailored for your sector</h2>
              <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">Configured out-of-the-box with the right vocabulary, metrics, and compliance tools for your specific organizational needs.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { title: "Schools", desc: "Manage fees, track fee balances, and run teacher payroll.", icon: GraduationCap, color: "bg-blue-50 text-blue-600 border-blue-100 ring-blue-500/20" },
                { title: "Churches", desc: "Track tithes, segregate funds, and manage staff stipends.", icon: HeartHandshake, color: "bg-purple-50 text-purple-600 border-purple-100 ring-purple-500/20" },
                { title: "Law Firms", desc: "Manage client trust accounts and billable hours efficiently.", icon: Scale, color: "bg-slate-100 text-slate-700 border-slate-200 ring-slate-500/20" },
                { title: "Hospitals", desc: "Handle patient billing, NHIF tracking, and inventory.", icon: Stethoscope, color: "bg-rose-50 text-rose-600 border-rose-100 ring-rose-500/20" }
              ].map((sector) => (
                <div key={sector.title} className="p-8 rounded-2xl border border-slate-200 bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${sector.color} border ring-1 transition-transform group-hover:scale-110`}>
                    <sector.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{sector.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{sector.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 py-12 px-6">
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
