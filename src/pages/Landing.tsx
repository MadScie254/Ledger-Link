import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  BrainCircuit,
  Building2,
  ChartColumn,
  CircleDollarSign,
  ClipboardList,
  Clock3,
  GraduationCap,
  HeartHandshake,
  Layers3,
  Scale,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PublicFooter, PublicHeader } from "@/components/layout/PublicSiteLayout";

const rotatingWords = ["books", "payroll", "cash flow", "compliance"];

function RotatingWord() {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setWordIndex((current) => (current + 1) % rotatingWords.length);
    }, 2800);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <span key={rotatingWords[wordIndex]} className="hero-word inline-flex min-w-[11ch] justify-center text-primary">
      {rotatingWords[wordIndex]}
    </span>
  );
}

export function Landing() {
  const revenueBars = [
    { className: "h-[38%]" },
    { className: "h-[48%]" },
    { className: "h-[30%]" },
    { className: "h-[64%]" },
    { className: "h-[54%]" },
    { className: "h-[72%]" },
  ];

  const featureCards = [
    {
      icon: CircleDollarSign,
      title: "Invoicing and cash flow",
      description: "Create professional invoices, track collections, and keep every payment tied to the right client.",
    },
    {
      icon: ChartColumn,
      title: "Reports that leaders can use",
      description: "See revenue, expenses, balances, and trends without digging through spreadsheets.",
    },
    {
      icon: ClipboardList,
      title: "Payroll with local compliance",
      description: "Handle PAYE, NSSF, SHIF, and AHL with cleaner payroll flows for Kenyan teams.",
    },
    {
      icon: Layers3,
      title: "Inventory with alerts",
      description: "Watch stock levels, catch low items early, and avoid surprise shortages.",
    },
    {
      icon: BrainCircuit,
      title: "AI Financial Assistant",
      description: "Ask for quick summaries, explain numbers, and surface what needs attention now.",
    },
    {
      icon: BadgeCheck,
      title: "M-Pesa and bank reconciliation",
      description: "Match payments faster so finance teams spend less time chasing transactions.",
    },
  ];

  const howItWorks = [
    "Sign up and create your organization.",
    "Pick your sector so the workflows fit your team.",
    "Import data or start fresh with a clean setup.",
    "Send invoices, pay staff, track stock, and review reports.",
  ];

  const testimonials = [
    {
      quote: "We finally have one place for fees, payments, and reporting. The weekly close is much calmer now.",
      name: "School bursar",
      sector: "School finance team",
    },
    {
      quote: "The payroll flow feels built for our church structure instead of forcing us into generic accounting software.",
      name: "Church treasurer",
      sector: "Congregation admin",
    },
    {
      quote: "Client billing, trust tracking, and reports are easier to explain to partners when the numbers are in one place.",
      name: "Law firm partner",
      sector: "Professional services",
    },
    {
      quote: "We can see invoices, stock, and collections together, which makes every day less reactive.",
      name: "Clinic admin",
      sector: "Healthcare operations",
    },
  ];

  const faqItems = [
    {
      question: "Is there a trial?",
      answer: "Yes. Start with the app flow, then use the contact page if you want help choosing the right plan or onboarding approach.",
    },
    {
      question: "Can I switch sectors later?",
      answer: "Yes. The platform is designed to adapt as your organization changes, so you can move between workflows without rebuilding everything.",
    },
    {
      question: "Do I own my data?",
      answer: "Your organization data belongs to you. The app should be treated as a system of record, not a locked-in spreadsheet replacement.",
    },
    {
      question: "Does LedgerLink support multi-branch operations?",
      answer: "Enterprise is the right fit for multi-branch teams that need custom support, dedicated onboarding, and broader control.",
    },
    {
      question: "What if I need a demo or custom setup?",
      answer: "Use the contact page. That is the fastest path for enterprise questions, demos, and custom workflow requests.",
    },
  ];

  const sectors = [
    {
      title: "Schools",
      desc: "Manage fees, balances, and staff payroll with one dashboard.",
      icon: GraduationCap,
      color: "bg-blue-50 text-blue-700 border-blue-100",
    },
    {
      title: "Churches",
      desc: "Track tithes, manage stipends, and keep funds separated with clarity.",
      icon: HeartHandshake,
      color: "bg-purple-50 text-purple-700 border-purple-100",
    },
    {
      title: "Law Firms",
      desc: "Handle client billing, retainers, and reporting without messy spreadsheets.",
      icon: Scale,
      color: "bg-slate-100 text-slate-700 border-slate-200",
    },
    {
      title: "Hospitals and clinics",
      desc: "Track patient billing, inventory, and operational cash flow together.",
      icon: Stethoscope,
      color: "bg-rose-50 text-rose-700 border-rose-100",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <PublicHeader />

      <main>
        <section className="relative overflow-hidden px-6 pb-20 pt-20 sm:pt-20 lg:pt-24">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.16),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.14),_transparent_30%),linear-gradient(to_bottom,_#f8fafc,_#ffffff_54%,_#f8fafc)]" />
          <div className="mx-auto flex max-w-7xl flex-col items-center text-center">
            <Badge className="mb-6 rounded-full border border-primary/15 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
              Built for Kenyan organizations
            </Badge>

            <h1 className="max-w-5xl text-5xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              LedgerLink keeps your <RotatingWord /> in order.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
              A focused finance platform for invoicing, payroll, inventory, reporting, and AI support. It is designed to help teams move faster without losing control of the numbers.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link to="/app">
                <Button size="lg" className="h-14 rounded-full px-8 text-lg shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl">
                  Start for free <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button size="lg" variant="outline" className="h-14 rounded-full border-slate-300 px-8 text-lg bg-white">
                  View pricing
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
                <ShieldCheck className="h-4 w-4 text-success" /> Kenyan compliance ready
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
                <BrainCircuit className="h-4 w-4 text-primary" /> AI financial assistant included
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
                <BadgeCheck className="h-4 w-4 text-success" /> M-Pesa and bank reconciliation
              </span>
            </div>
          </div>
        </section>

        <section className="px-6 pb-24">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-200/60 ring-1 ring-slate-900/5">
              <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/90 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-rose-400" />
                  <div className="h-3 w-3 rounded-full bg-amber-400" />
                  <div className="h-3 w-3 rounded-full bg-emerald-400" />
                </div>
                <div className="mx-auto flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-1 text-xs text-slate-400 shadow-sm">
                  <span className="h-2.5 w-2.5 rounded-full bg-success" />
                  ledgerlink.app
                </div>
              </div>

              <div className="grid min-h-[420px] gap-0 overflow-hidden lg:grid-cols-[260px_1fr]">
                <div className="hidden border-r border-slate-200 bg-white p-5 lg:block">
                  <div className="mb-8 h-8 w-36 rounded bg-slate-100" />
                  <div className="space-y-3">
                    <div className="flex h-11 items-center rounded-xl bg-primary/10 px-3">
                      <Building2 className="mr-3 h-4 w-4 text-primary" />
                      <div className="h-4 w-24 rounded bg-primary/20" />
                    </div>
                    <div className="flex h-11 items-center rounded-xl px-3">
                      <ClipboardList className="mr-3 h-4 w-4 text-slate-400" />
                      <div className="h-4 w-24 rounded bg-slate-100" />
                    </div>
                    <div className="flex h-11 items-center rounded-xl px-3">
                      <ChartColumn className="mr-3 h-4 w-4 text-slate-400" />
                      <div className="h-4 w-24 rounded bg-slate-100" />
                    </div>
                    <div className="flex h-11 items-center rounded-xl px-3">
                      <BrainCircuit className="mr-3 h-4 w-4 text-slate-400" />
                      <div className="h-4 w-24 rounded bg-slate-100" />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 lg:p-8">
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card className="border-slate-200 bg-white shadow-sm">
                      <CardContent className="p-5">
                        <p className="text-sm text-slate-500">Outstanding balance</p>
                        <div className="mt-2 text-3xl font-black tracking-tight text-slate-950">KES 1.24M</div>
                        <p className="mt-2 text-sm text-success">12 percent collected this week</p>
                      </CardContent>
                    </Card>
                    <Card className="border-slate-200 bg-white shadow-sm">
                      <CardContent className="p-5">
                        <p className="text-sm text-slate-500">Payroll ready</p>
                        <div className="mt-2 text-3xl font-black tracking-tight text-slate-950">48 staff</div>
                        <p className="mt-2 text-sm text-warning">PAYE, NSSF, SHIF, and AHL tracked</p>
                      </CardContent>
                    </Card>
                    <Card className="border-slate-200 bg-white shadow-sm">
                      <CardContent className="p-5">
                        <p className="text-sm text-slate-500">Low stock alerts</p>
                        <div className="mt-2 text-3xl font-black tracking-tight text-slate-950">6 items</div>
                        <p className="mt-2 text-sm text-primary">Reorder before shortages hit</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                    <Card className="border-slate-200 bg-white shadow-sm">
                      <CardContent className="p-5">
                        <div className="mb-4 flex items-center justify-between">
                          <div>
                            <p className="text-sm text-slate-500">Revenue trend</p>
                            <h2 className="text-xl font-bold tracking-tight">Cash flow overview</h2>
                          </div>
                          <Clock3 className="h-5 w-5 text-slate-400" />
                        </div>
                        <div className="grid grid-cols-6 gap-3">
                          {revenueBars.map((bar, index) => (
                            <div key={index} className="flex h-36 items-end rounded-2xl bg-slate-50 p-2">
                              <div className={`w-full rounded-xl bg-gradient-to-t from-primary to-emerald-500 ${bar.className}`} />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="border-slate-200 bg-white shadow-sm">
                      <CardContent className="space-y-4 p-5">
                        <div>
                          <p className="text-sm text-slate-500">Today</p>
                          <h2 className="text-xl font-bold tracking-tight">AI assistant highlights</h2>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                          Ask for invoice summaries, payroll checks, overdue balances, and sector-specific guidance without leaving the dashboard.
                        </div>
                        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4">
                          <Sparkles className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm font-semibold text-slate-900">Fast decisions</p>
                            <p className="text-sm text-slate-500">See what needs attention right now.</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="scroll-mt-24 px-6 py-24 bg-white border-y border-slate-200">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <Badge className="rounded-full border border-primary/15 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">Features</Badge>
              <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Everything important is visible, not buried.</h2>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                LedgerLink packages the core financial workflows into one place so your team can move from one task to the next without losing context.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {featureCards.map((feature) => (
                <Card key={feature.title} className="group border-slate-200 bg-slate-50/70 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <CardContent className="p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm transition-transform group-hover:scale-110">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mt-5 text-xl font-bold text-slate-950">{feature.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-24 px-6 py-24 bg-slate-50">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <Badge className="rounded-full border border-primary/15 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">How it works</Badge>
              <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Up and running in four steps.</h2>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                No complex setup. No consultants. Create your organization, pick your sector, and start working with clean books from day one.
              </p>
            </div>

            <div className="grid gap-4">
              {howItWorks.map((step, index) => (
                <div key={step} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-base font-semibold text-slate-950">{step}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Quick and focused — most teams are operational within the first session.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="trust" className="scroll-mt-24 px-6 py-24 bg-white border-y border-slate-200">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
            <div>
              <Badge className="rounded-full border border-primary/15 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">Trust and security</Badge>
              <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Built for Kenyan compliance, backed by clear audit trails.</h2>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                Every action is logged, roles keep sensitive data protected, and the entire system follows Kenyan tax and payroll regulations out of the box.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                "Role-based access for sensitive finance tasks.",
                "Audit-friendly records for every key action.",
                "Backup-minded product design and operational clarity.",
                "Sector-aware workflows for Kenyan teams.",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                  <ShieldCheck className="h-5 w-5 text-success" />
                  <p className="mt-3 text-sm leading-7 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="sectors" className="scroll-mt-24 px-6 py-24 bg-slate-50">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl text-center mx-auto">
              <Badge className="rounded-full border border-primary/15 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">Sectors</Badge>
              <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Purpose-built for the organizations you run.</h2>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                Every sector has different financial rhythms. LedgerLink adapts its workflows — fees, tithes, retainers, or patient billing — so your books match how you actually operate.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {sectors.map((sector) => (
                <Card key={sector.title} className="group border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <CardContent className="p-6">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${sector.color}`}>
                      <sector.icon className="h-7 w-7" />
                    </div>
                    <h3 className="mt-5 text-xl font-bold text-slate-950">{sector.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{sector.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="testimonials" className="scroll-mt-24 px-6 py-24 bg-white border-y border-slate-200">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <Badge className="rounded-full border border-primary/15 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">Trusted by teams like yours</Badge>
              <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Hear from teams already using LedgerLink.</h2>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.name} className="border-slate-200 bg-white shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex gap-1 text-amber-400">
                      {[...Array(5)].map((_, index) => (
                        <Sparkles key={index} className="h-4 w-4" />
                      ))}
                    </div>
                    <p className="mt-4 text-sm leading-7 text-slate-600">{testimonial.quote}</p>
                    <div className="mt-6 border-t border-slate-100 pt-4">
                      <p className="text-sm font-semibold text-slate-950">{testimonial.name}</p>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{testimonial.sector}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="scroll-mt-24 px-6 py-24 bg-slate-50">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <Badge className="rounded-full border border-primary/15 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">FAQ</Badge>
              <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Common questions, answered.</h2>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                Everything you need to know before getting started with LedgerLink.
              </p>
            </div>

            <div className="space-y-4">
              {faqItems.map((faq) => (
                <details key={faq.question} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm open:bg-white">
                  <summary className="cursor-pointer list-none text-base font-semibold text-slate-950 marker:hidden">
                    {faq.question}
                  </summary>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 pb-20">
          <div className="mx-auto max-w-7xl rounded-[2rem] border border-slate-200 bg-slate-950 px-8 py-10 text-white shadow-2xl shadow-slate-300/40 sm:px-10 lg:flex lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Ready to get organized?</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Start free today, or talk to us about a setup that fits.</h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                Jump straight into the demo with sample data, or reach out for a guided onboarding tailored to your organization's needs.
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:mt-0">
              <Link to="/app">
                <Button className="h-12 rounded-full px-6">Start for free</Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="h-12 rounded-full border-white/20 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white">
                  Contact us
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}