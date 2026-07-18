import { Link } from "react-router-dom";
import { CheckCircle2, HelpCircle, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PublicFooter, PublicHeader } from "@/components/layout/PublicSiteLayout";

export function Pricing() {
  const tiers = [
    {
      name: "Starter",
      price: "KES 2,500",
      description: "Perfect for single organizations needing basic financial tracking.",
      features: ["Core invoicing", "Basic payroll management", "Up to 50 clients", "Email support"],
      cta: "Get started",
      highlighted: false,
    },
    {
      name: "Growth",
      price: "KES 6,000",
      description: "Ideal for growing organizations that need full visibility across finance and operations.",
      features: ["Everything in Starter", "Inventory alerts", "Advanced reports", "QuickBooks sync", "Priority support"],
      cta: "Get started",
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For multi-branch organizations with complex requirements and onboarding needs.",
      features: ["Everything in Growth", "Multi-branch support", "Custom feature development", "Dedicated account manager", "SLA support"],
      cta: "Contact us",
      highlighted: false,
    },
  ];

  const comparisonRows = [
    ["Invoicing and cash flow", "Basic", "Advanced", "Advanced + custom"],
    ["Payroll compliance", "Core payroll", "Full payroll", "Full payroll + custom rules"],
    ["Inventory alerts", "No", "Yes", "Yes"],
    ["AI assistant", "Limited", "Full access", "Full access"],
    ["Multi-branch support", "No", "No", "Yes"],
    ["Dedicated support", "Email", "Priority", "Account manager"],
  ];

  const faqItems = [
    {
      question: "Do I need a credit card to start?",
      answer: "The goal is to make the first step easy. If you need a trial or a guided setup, the contact page is the quickest way to reach us.",
    },
    {
      question: "What is the difference between Starter and Growth?",
      answer: "Growth adds more reporting depth, inventory alerts, and better operational visibility for teams that are past the basics.",
    },
    {
      question: "When should I choose Enterprise?",
      answer: "Choose Enterprise if you need multi-branch support, custom onboarding, custom workflows, or a dedicated account manager.",
    },
    {
      question: "Can I talk to someone before I buy?",
      answer: "Yes. The contact page is the right place for demos, procurement questions, and custom implementation requests.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <PublicHeader />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 py-16 lg:py-20">
        <section className="mx-auto max-w-3xl text-center">
          <p className="inline-flex rounded-full border border-primary/15 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
            Pricing
          </p>
          <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Choose the plan that fits your organization and move forward with a clearer path to setup.
          </p>
          <p className="mt-3 text-sm font-medium text-slate-500">
            No long-term lock-in. Contact us for demos, onboarding help, or enterprise scoping.
          </p>
        </section>

        <section className="mt-14 grid gap-6 lg:grid-cols-3">
          {tiers.map((tier) => (
            <Card
              key={tier.name}
              className={`relative flex h-full flex-col border-slate-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                tier.highlighted ? "border-primary bg-white shadow-xl ring-1 ring-primary/15" : "bg-white"
              }`}
            >
              {tier.highlighted && (
                <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-primary-foreground">
                    Most popular
                  </span>
                </div>
              )}

              <CardContent className="flex h-full flex-col p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-slate-950">{tier.name}</h2>
                  <p className="mt-2 text-sm leading-7 text-slate-500">{tier.description}</p>
                </div>

                <div className="mb-8">
                  <span className="text-4xl font-black tracking-tight text-slate-950">{tier.price}</span>
                  {tier.price !== "Custom" && <span className="text-sm font-medium text-slate-500">/mo</span>}
                </div>

                <ul className="mb-8 space-y-4 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle2 className={`mt-0.5 h-5 w-5 shrink-0 ${tier.highlighted ? "text-primary" : "text-success"}`} />
                      <span className="text-sm leading-6 text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to={tier.cta === "Contact us" ? "/contact" : "/app"} className="mt-auto">
                  <Button size="lg" className="h-12 w-full rounded-full text-base" variant={tier.highlighted ? "default" : "outline"}>
                    {tier.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="mt-16 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="p-8">
              <div className="flex items-center gap-3">
                <HelpCircle className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold tracking-tight text-slate-950">What is included by tier</h2>
              </div>

              <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
                <div className="grid grid-cols-[1.4fr_0.9fr_0.9fr_1fr] bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  <div>Feature</div>
                  <div>Starter</div>
                  <div>Growth</div>
                  <div>Enterprise</div>
                </div>
                <div className="divide-y divide-slate-200">
                  {comparisonRows.map(([feature, starter, growth, enterprise]) => (
                    <div key={feature} className="grid grid-cols-[1.4fr_0.9fr_0.9fr_1fr] px-4 py-4 text-sm">
                      <div className="font-medium text-slate-900">{feature}</div>
                      <div className="text-slate-600">{starter}</div>
                      <div className="text-slate-600">{growth}</div>
                      <div className="text-slate-600">{enterprise}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-slate-200 bg-slate-900 text-white shadow-sm">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 text-primary">
                  <PhoneCall className="h-5 w-5" />
                  <h2 className="text-xl font-bold tracking-tight text-white">Need something custom?</h2>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  Enterprise buyers should use the contact page for demos, procurement questions, or custom support requirements.
                </p>
                <Link to="/contact" className="mt-6 inline-flex">
                  <Button className="rounded-full px-5">Contact us</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white shadow-sm">
              <CardContent className="p-8">
                <h2 className="text-xl font-bold tracking-tight text-slate-950">Quick answers</h2>
                <div className="mt-5 space-y-4">
                  {faqItems.map((faq) => (
                    <details key={faq.question} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <summary className="cursor-pointer list-none text-sm font-semibold text-slate-950 marker:hidden">{faq.question}</summary>
                      <p className="mt-3 text-sm leading-7 text-slate-600">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}