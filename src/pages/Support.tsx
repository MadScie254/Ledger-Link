import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { pageItem, pageStagger } from "@/lib/motion";
import { ArrowLeft, Clock3, Headphones, LifeBuoy, Mail, MessageSquare, PhoneCall, ShieldAlert, Sparkles, Ticket } from "lucide-react";
import { Link } from "react-router-dom";

const supportTickets = [
  { id: "SUP-2041", topic: "Payroll export not matching bank totals", priority: "High", status: "In progress", updated: "12 min ago" },
  { id: "SUP-2038", topic: "Board member access request", priority: "Medium", status: "Waiting on user", updated: "28 min ago" },
  { id: "SUP-2032", topic: "VAT report clarification", priority: "Low", status: "Resolved", updated: "Yesterday" },
  { id: "SUP-2027", topic: "Inventory import mapping", priority: "Medium", status: "Queued", updated: "2 hours ago" },
];

const faqs = [
  {
    question: "What can support help with?",
    answer: "Billing questions, onboarding, permission issues, reporting checks, reconciliation help, and guided troubleshooting.",
  },
  {
    question: "What should I include in a request?",
    answer: "Share the module, what you expected, what happened, and any reference numbers or screenshots.",
  },
  {
    question: "When is the team available?",
    answer: "Live coverage runs during business hours, with email and callback follow-up after hours.",
  },
  {
    question: "How fast is first response?",
    answer: "The current median first response is about 32 minutes for active tickets.",
  },
];

export function Support() {
  return (
    <motion.div className="flex h-full flex-col gap-6 overflow-y-auto" variants={pageStagger} initial="hidden" animate="show">
      <motion.div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between" variants={pageItem}>
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
            <LifeBuoy className="h-4 w-4" />
            Help & Support Center
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Keep help, support, and ticket data inside the app.</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
            This page centralizes support requests, quick contacts, and a live snapshot of the queue so users do not need to leave the authenticated workspace.
          </p>
        </div>
        <Button asChild variant="outline" className="w-fit">
          <Link to="/app/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </motion.div>

      <motion.div className="grid gap-4 lg:grid-cols-4" variants={pageStagger}>
        <motion.div className="rounded-xl border border-border bg-card p-6 shadow-sm" variants={pageItem}>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Open Tickets</p>
          <p className="mt-2 text-3xl font-bold text-card-foreground">18</p>
          <p className="mt-2 text-sm text-muted-foreground">Requests currently waiting on support or customer input.</p>
        </motion.div>
        <motion.div className="rounded-xl border border-border bg-card p-6 shadow-sm" variants={pageItem}>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Median First Response</p>
          <p className="mt-2 text-3xl font-bold text-card-foreground">32m</p>
          <p className="mt-2 text-sm text-muted-foreground">Current speed for active queue items.</p>
        </motion.div>
        <motion.div className="rounded-xl border border-border bg-card p-6 shadow-sm" variants={pageItem}>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Callback Queue</p>
          <p className="mt-2 text-3xl font-bold text-card-foreground">6</p>
          <p className="mt-2 text-sm text-muted-foreground">Planned callback requests waiting for follow-up.</p>
        </motion.div>
        <motion.div className="rounded-xl border border-border bg-card p-6 shadow-sm" variants={pageItem}>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Service Uptime</p>
          <p className="mt-2 text-3xl font-bold text-card-foreground">99.98%</p>
          <p className="mt-2 text-sm text-muted-foreground">System availability for the current support period.</p>
        </motion.div>
      </motion.div>

      <motion.div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]" variants={pageStagger}>
        <motion.div className="rounded-xl border border-border bg-card p-6 shadow-sm" variants={pageItem}>
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-card-foreground">Support Queue</h3>
              <p className="text-sm text-muted-foreground">A live snapshot of the current help desk queue.</p>
            </div>
            <Badge variant="secondary" className="rounded-full px-3 py-1">Updated live</Badge>
          </div>
          <div className="space-y-3">
            {supportTickets.map((ticket) => (
              <div key={ticket.id} className="rounded-lg border border-border bg-background p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{ticket.id}</p>
                    <p className="mt-1 font-semibold text-card-foreground">{ticket.topic}</p>
                    <p className="mt-1 text-sm text-muted-foreground">Last update {ticket.updated}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={ticket.priority === "High" ? "destructive" : ticket.priority === "Medium" ? "secondary" : "outline"}>{ticket.priority}</Badge>
                    <Badge variant="outline">{ticket.status}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div className="space-y-6" variants={pageStagger}>
          <motion.div className="rounded-xl border border-border bg-card p-6 shadow-sm" variants={pageItem}>
            <h3 className="mb-4 text-lg font-bold text-card-foreground">Contact Paths</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 rounded-lg border border-border bg-background p-4">
                <MessageSquare className="mt-1 h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold text-card-foreground">Live chat</p>
                  <p className="text-sm text-muted-foreground">Best for quick usage questions and guided walkthroughs.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-border bg-background p-4">
                <PhoneCall className="mt-1 h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold text-card-foreground">Callback requests</p>
                  <p className="text-sm text-muted-foreground">Use for payroll, reconciliation, or permission reviews.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-border bg-background p-4">
                <Mail className="mt-1 h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold text-card-foreground">Email support</p>
                  <p className="text-sm text-muted-foreground">Send detailed screenshots and supporting references.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div className="rounded-xl border border-border bg-card p-6 shadow-sm" variants={pageItem}>
            <div className="mb-4 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold text-card-foreground">Support Notes</h3>
            </div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3"><Clock3 className="mt-0.5 h-4 w-4 text-primary" />Business-hour coverage with after-hours follow-up.</li>
              <li className="flex gap-3"><Ticket className="mt-0.5 h-4 w-4 text-primary" />Track every request with a ticket ID for easy handoff.</li>
              <li className="flex gap-3"><Headphones className="mt-0.5 h-4 w-4 text-primary" />Use the support center for help, not the dashboard cards.</li>
              <li className="flex gap-3"><Sparkles className="mt-0.5 h-4 w-4 text-primary" />Most common issues are payments, permissions, and reports.</li>
            </ul>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div className="rounded-xl border border-border bg-card p-6 shadow-sm" variants={pageItem}>
        <h3 className="mb-4 text-lg font-bold text-card-foreground">Common Questions</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {faqs.map((faq) => (
            <Card key={faq.question} className="border-border shadow-none">
              <CardContent className="p-5">
                <p className="font-semibold text-card-foreground">{faq.question}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}