import Link from "next/link";
import {
  ArrowRight,
  Phone,
  Search,
  Settings,
  Rocket,
  BarChart3,
  CheckCircle,
  MessageSquare,
  Zap,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Phone,
    title: "Discovery Call",
    subtitle: "Day 1",
    description:
      "We start with a deep-dive session to understand your business, goals, and current setup. We map requirements, identify the fastest path to value, and define a clear scope. No fluff — pure strategy.",
    deliverables: [
      "Business & tech stack audit",
      "ROI opportunity map",
      "Custom AI roadmap",
      "Clear scope & timeline",
    ],
    color: "violet",
  },
  {
    number: "02",
    icon: Search,
    title: "Strategy & Design",
    subtitle: "Days 2–4",
    description:
      "Our team designs your custom solution architecture — from AI agent scripts to automation workflows and application designs. Everything is built around your specific business and goals.",
    deliverables: [
      "AI agent script writing",
      "Workflow architecture design",
      "Integration mapping",
      "Testing plan",
    ],
    color: "violet",
  },
  {
    number: "03",
    icon: Settings,
    title: "Build & Integrate",
    subtitle: "Days 5–14",
    description:
      "We build and integrate your solution — AI agents, automation workflows, web platforms, or apps. Deep integration with your existing tools, APIs, and infrastructure.",
    deliverables: [
      "AI agents deployed & tested",
      "Workflow automations live",
      "Full CRM integration",
      "Dashboard ready",
    ],
    color: "cyan",
  },
  {
    number: "04",
    icon: Rocket,
    title: "Launch",
    subtitle: "Day 14–15",
    description:
      "We go live together with full monitoring active. A controlled launch, a team training session, and full documentation — so you're confident from day one.",
    deliverables: [
      "Controlled launch",
      "Team training session",
      "Full documentation",
      "24/7 monitoring active",
    ],
    color: "cyan",
  },
  {
    number: "05",
    icon: BarChart3,
    title: "Optimize & Scale",
    subtitle: "Ongoing",
    description:
      "After launch, we review performance, refine flows, and continuously optimise for speed, conversion, and ROI. Every system we build gets better over time.",
    deliverables: [
      "Weekly performance reviews",
      "Continuous A/B testing",
      "New automation rollouts",
      "Dedicated account manager",
    ],
    color: "violet",
  },
];

const integrations = [
  "HubSpot", "Salesforce", "Stripe", "Twilio", "Zapier", "Make",
  "Slack", "Notion", "Airtable", "PostgreSQL", "MongoDB", "AWS",
  "Shopify", "WooCommerce", "WhatsApp", "Google APIs",
];

export default function HowItWorksPage() {
  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="relative py-24 text-center overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm mb-6">
            The Process
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
            From brief to{" "}
            <span className="gradient-text">live in 14 days</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            A transparent, proven process that gets your project scoped, built, and shipped fast — without the typical agency chaos.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 max-w-5xl mx-auto px-6">
        <div className="space-y-6">
          {steps.map(({ number, icon: Icon, title, subtitle, description, deliverables, color }, index) => (
            <div
              key={number}
              className={`relative p-8 rounded-2xl bg-[#111111] border ${
                color === "violet" ? "border-violet-500/20" : "border-cyan-500/20"
              } flex flex-col lg:flex-row gap-8 group hover:bg-[#151515] transition-all`}
            >
              {/* Step number */}
              <div className="flex-shrink-0">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                    color === "violet" ? "bg-violet-500/10" : "bg-cyan-500/10"
                  }`}
                >
                  <Icon size={28} className={color === "violet" ? "text-violet-400" : "text-cyan-400"} />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-4xl font-bold ${color === "violet" ? "text-violet-500/30" : "text-cyan-500/30"}`}>{number}</span>
                  <div>
                    <h3 className="text-xl font-bold">{title}</h3>
                    <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">{subtitle}</span>
                  </div>
                </div>
                <p className="text-zinc-400 leading-relaxed mb-4">{description}</p>
                <ul className="grid grid-cols-2 gap-2">
                  {deliverables.map((d) => (
                    <li key={d} className="flex items-center gap-2 text-sm text-zinc-400">
                      <CheckCircle
                        size={14}
                        className={color === "violet" ? "text-violet-400 shrink-0" : "text-cyan-400 shrink-0"}
                      />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Connector */}
              {index < steps.length - 1 && (
                <div className="hidden lg:flex absolute -bottom-4 left-12 w-0.5 h-8 bg-gradient-to-b from-violet-500/30 to-transparent" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Integrations */}
      <section className="py-24 bg-[#111111]/50 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Integrates with your{" "}
            <span className="gradient-text">existing stack</span>
          </h2>
          <p className="text-zinc-400 mb-10">
            No ripping out what works. We build around your tools.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {integrations.map((name) => (
              <span
                key={name}
                className="px-4 py-2 rounded-full bg-[#0a0a0a] border border-white/10 text-sm text-zinc-400 hover:border-violet-500/30 hover:text-violet-400 transition-all cursor-default"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ quick */}
      <section className="py-24 max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
          Common <span className="gradient-text">questions</span>
        </h2>
        <div className="space-y-4">
          {[
            {
              q: "How quickly can we go live?",
              a: "Most AI and automation projects are live within 7–14 days. Web and app builds range from 2 weeks to 8–12 weeks depending on scope. You get an exact timeline in your proposal.",
            },
            {
              q: "Do we need technical knowledge?",
              a: "No. We handle all the technical work. You get a clean handoff with documentation and a training session — no coding required on your end.",
            },
            {
              q: "What happens if the AI makes a mistake on a call?",
              a: "Every call agent has a built-in escalation trigger. If confidence drops below a threshold, calls are instantly handed off to a human agent.",
            },
            {
              q: "Do you work with businesses outside of tech?",
              a: "Absolutely. We've worked with businesses in services, retail, SaaS, hospitality, and more. If you need it built, we can build it.",
            },
          ].map(({ q, a }) => (
            <div key={q} className="p-6 rounded-xl bg-[#111111] border border-white/5 hover:border-violet-500/20 transition-all">
              <div className="flex items-start gap-3">
                <MessageSquare size={16} className="text-violet-400 mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-sm mb-2">{q}</div>
                  <div className="text-sm text-zinc-400 leading-relaxed">{a}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center max-w-3xl mx-auto px-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm mb-6">
          <Zap size={14} fill="currentColor" />
          Ready to start?
        </div>
        <h2 className="text-4xl font-bold tracking-tight mb-4">
          Start your <span className="gradient-text">project today</span>
        </h2>
        <p className="text-zinc-400 mb-8">
          Book a free discovery call and we'll scope your project, agree a timeline, and get building.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold text-lg transition-all hover:shadow-2xl hover:shadow-violet-500/30"
        >
          Book Discovery Call <ArrowRight size={20} />
        </Link>
      </section>
    </div>
  );
}
