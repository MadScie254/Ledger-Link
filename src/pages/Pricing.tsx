import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export function Pricing() {
  const tiers = [
    {
      name: "Starter",
      price: "KES 2,500",
      description: "Perfect for single organizations needing basic financial tracking.",
      features: [
        "Core Invoicing",
        "Basic Payroll Management",
        "Up to 50 Clients",
        "Email Support",
      ],
      cta: "Get Started",
      highlighted: false,
    },
    {
      name: "Growth",
      price: "KES 6,000",
      description: "Ideal for growing organizations requiring full visibility.",
      features: [
        "Everything in Starter",
        "Inventory Alerts",
        "Advanced Reports",
        "QuickBooks Sync",
        "Priority Support",
      ],
      cta: "Get Started",
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For multi-branch organizations with complex requirements.",
      features: [
        "Everything in Growth",
        "Multi-branch Support",
        "Custom Feature Development",
        "Dedicated Account Manager",
        "SLA Guarantee",
      ],
      cta: "Contact Us",
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="px-6 py-4 flex items-center justify-between bg-white border-b border-border sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground shadow-sm">
            LL
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">LedgerLink</span>
        </Link>
        <nav className="hidden md:flex gap-6 items-center">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground">Home</Link>
          <Link to="/app">
            <Button>Login / Get Started</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col px-6 py-24">
        <div className="max-w-6xl mx-auto w-full text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Choose the plan that fits your organization's needs. Upgrade or downgrade at any time.
          </p>
        </div>

        <div className="max-w-6xl mx-auto w-full grid md:grid-cols-3 gap-8 items-center">
          {tiers.map((tier) => (
            <div 
              key={tier.name}
              className={`rounded-2xl p-8 flex flex-col h-full ${
                tier.highlighted 
                  ? 'bg-white border-2 border-primary shadow-xl scale-105 z-10 relative' 
                  : 'bg-white border border-slate-200 shadow-sm'
              }`}
            >
              {tier.highlighted && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{tier.name}</h3>
                <p className="text-slate-500 text-sm h-10">{tier.description}</p>
              </div>
              <div className="mb-8">
                <span className="text-4xl font-extrabold text-slate-900">{tier.price}</span>
                {tier.price !== "Custom" && <span className="text-slate-500 font-medium">/mo</span>}
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className={`h-5 w-5 shrink-0 ${tier.highlighted ? 'text-primary' : 'text-success'}`} />
                    <span className="text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link to="/app" className="mt-auto">
                <Button 
                  size="lg" 
                  className="w-full h-12 text-base"
                  variant={tier.highlighted ? "default" : "outline"}
                >
                  {tier.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
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
