import { type FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PublicFooter, PublicHeader } from "@/components/layout/PublicSiteLayout";

type ContactForm = {
  name: string;
  organization: string;
  email: string;
  message: string;
};

const initialForm: ContactForm = {
  name: "",
  organization: "",
  email: "",
  message: "",
};

export function Contact() {
  const [form, setForm] = useState<ContactForm>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || "Could not submit contact request.");
      }

      toast.success("Message sent. We will get back to you soon.");
      setForm(initialForm);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not submit contact request.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900">
      <PublicHeader />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-10 px-6 py-16 lg:py-20">
        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="space-y-6">
            <p className="inline-flex rounded-full border border-primary/15 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
              Contact LedgerLink
            </p>
            <h1 className="max-w-2xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Tell us what your team needs and we will help you set it up.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Use this form for demos, enterprise onboarding, sector-specific questions, or support. We respond with the fastest path to a working setup.
            </p>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <p className="mt-3 text-sm font-semibold text-slate-900">Fast response</p>
                <p className="mt-1 text-sm text-slate-500">We reply as soon as we can.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <p className="mt-3 text-sm font-semibold text-slate-900">Sector aware</p>
                <p className="mt-1 text-sm text-slate-500">Schools, churches, firms, and clinics.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <p className="mt-3 text-sm font-semibold text-slate-900">Demo ready</p>
                <p className="mt-1 text-sm text-slate-500">We can walk you through the platform.</p>
              </div>
            </div>
          </div>

          <Card className="border-slate-200 shadow-xl shadow-slate-200/60">
            <CardContent className="p-6 sm:p-8">
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-700">Name</span>
                    <input
                      required
                      value={form.name}
                      onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                      placeholder="Your name"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-700">Organization</span>
                    <input
                      value={form.organization}
                      onChange={(event) => setForm((current) => ({ ...current, organization: event.target.value }))}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                      placeholder="Company or institution"
                    />
                  </label>
                </div>

                <label className="space-y-2 block">
                  <span className="text-sm font-medium text-slate-700">Email</span>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                    placeholder="you@company.com"
                  />
                </label>

                <label className="space-y-2 block">
                  <span className="text-sm font-medium text-slate-700">Message</span>
                  <textarea
                    required
                    rows={6}
                    value={form.message}
                    onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                    placeholder="Tell us about your team, sector, and what you want to improve."
                  />
                </label>

                <Button type="submit" disabled={isSubmitting} className="h-12 w-full rounded-full text-base sm:w-auto">
                  {isSubmitting ? "Sending..." : "Send message"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="p-5">
              <Mail className="h-5 w-5 text-primary" />
              <p className="mt-3 text-sm font-semibold text-slate-900">Email</p>
              <a href="mailto:hello@ledgerlink.app" className="mt-1 block text-sm text-slate-600 hover:text-slate-900">hello@ledgerlink.app</a>
            </CardContent>
          </Card>
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="p-5">
              <Phone className="h-5 w-5 text-primary" />
              <p className="mt-3 text-sm font-semibold text-slate-900">Phone</p>
              <a href="tel:+254700123456" className="mt-1 block text-sm text-slate-600 hover:text-slate-900">+254 700 123 456</a>
            </CardContent>
          </Card>
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="p-5">
              <MapPin className="h-5 w-5 text-primary" />
              <p className="mt-3 text-sm font-semibold text-slate-900">Location</p>
              <p className="mt-1 text-sm text-slate-600">Nairobi, Kenya</p>
            </CardContent>
          </Card>
        </section>

        <div className="rounded-3xl border border-slate-200 bg-slate-900 px-6 py-8 text-white shadow-xl shadow-slate-300/40 sm:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Need help choosing a plan?</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight">Enterprise questions usually belong on the contact page.</h2>
            </div>
            <Link to="/pricing">
              <Button variant="secondary" className="rounded-full px-5">View pricing</Button>
            </Link>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}