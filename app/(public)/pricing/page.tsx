import Link from "next/link";
import { ArrowRight, CheckCircle, Bot, Phone, Code2, Smartphone, Zap, MessageSquare } from "lucide-react";

const services = [
  {
    icon: Bot,
    name: "AI Automation",
    color: "violet",
    description:
      "Custom automation systems designed around your specific workflows — from lead nurturing to order management and beyond.",
    includes: [
      "Full discovery and scoping session",
      "Custom workflow design & architecture",
      "Integration with your existing tools",
      "Testing, launch, and documentation",
      "Post-launch support period",
    ],
    note: "Priced per project scope",
  },
  {
    icon: Phone,
    name: "AI Call Agents",
    color: "cyan",
    description:
      "Bespoke AI voice agents trained on your brand, products, and customer scenarios — built to handle real calls from day one.",
    includes: [
      "Voice agent design & script writing",
      "Custom voice and persona setup",
      "CRM and platform integration",
      "Call testing and quality assurance",
      "Handoff logic and escalation setup",
    ],
    note: "Priced per agent + scope",
  },
  {
    icon: Code2,
    name: "Web Development",
    color: "violet",
    description:
      "Full-stack websites and web platforms coded from scratch — React, Next.js, Node.js, and whatever your project needs.",
    includes: [
      "UI/UX design included",
      "Front-end and back-end development",
      "CMS, API, and third-party integrations",
      "Performance optimization & SEO setup",
      "Full code handoff + deployment",
    ],
    note: "Priced per project scope",
  },
  {
    icon: Smartphone,
    name: "App Development",
    color: "cyan",
    description:
      "Custom mobile and web apps built end-to-end — from concept and design through to a production-ready product.",
    includes: [
      "iOS, Android, or web app build",
      "UI/UX design and prototyping",
      "Backend, API, and database setup",
      "App store submission (where applicable)",
      "Post-launch support and maintenance",
    ],
    note: "Priced per project scope",
  },
];

const faqs = [
  {
    q: "Why don't you have fixed prices?",
    a: "Because every project is different. A basic landing page and a full SaaS product are not the same job. We scope each project individually so you only pay for exactly what you need — not a one-size-fits-all package.",
  },
  {
    q: "How does the pricing process work?",
    a: "We start with a free discovery call to understand your goals and requirements. Within 48 hours you get a clear written proposal — scope, timeline, and total cost. No hourly surprises.",
  },
  {
    q: "Do you charge monthly retainers?",
    a: "Not by default. Most projects are priced as a fixed-fee build. If you want ongoing support, optimization, or managed AI agents after launch, we offer optional retainer arrangements.",
  },
  {
    q: "How long does a typical project take?",
    a: "AI automations and call agents typically go live in 7–14 days. Web and app projects range from 2 weeks for landing pages to 8–12 weeks for full products. We give you an exact timeline in the proposal.",
  },
  {
    q: "What if my requirements change mid-project?",
    a: "We handle scope changes transparently. If you need something outside the original scope, we'll quote the addition separately before doing any extra work. No hidden billing.",
  },
  {
    q: "Is the discovery call really free?",
    a: "Yes — no catch. We use it to understand if we're a good fit and to give you honest advice about what will and won't work for your goals. You'll leave with value regardless.",
  },
];

export default function PricingPage() {
  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="relative py-24 text-center overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm mb-6">
            Pricing
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
            Every project is{" "}
            <span className="gradient-text">custom priced</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
            We don't sell subscriptions or off-the-shelf packages. Every solution we build is scoped and priced around your specific requirements — so you only pay for what your business actually needs.
          </p>
        </div>
      </section>

      {/* Service Pricing Cards */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {services.map(({ icon: Icon, name, color, description, includes, note }) => (
            <div
              key={name}
              className={`relative p-8 rounded-2xl flex flex-col border transition-all bg-[#111111] ${
                color === "violet"
                  ? "border-violet-500/20 hover:border-violet-500/40"
                  : "border-cyan-500/20 hover:border-cyan-500/40"
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${
                color === "violet" ? "bg-violet-500/10" : "bg-cyan-500/10"
              }`}>
                <Icon size={24} className={color === "violet" ? "text-violet-400" : "text-cyan-400"} />
              </div>

              <div className="mb-5">
                <h3 className="text-xl font-bold mb-1">{name}</h3>
                <div className={`text-sm font-semibold mb-3 ${color === "violet" ? "text-violet-400" : "text-cyan-400"}`}>
                  Custom Quote — {note}
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">{description}</p>
              </div>

              <div className="flex-1 space-y-2.5 mb-8">
                <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">Every project includes</div>
                {includes.map((f) => (
                  <div key={f} className="flex items-start gap-2.5">
                    <CheckCircle
                      size={15}
                      className={`mt-0.5 shrink-0 ${color === "violet" ? "text-violet-400" : "text-cyan-400"}`}
                    />
                    <span className="text-sm text-zinc-300">{f}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/contact"
                className={`flex items-center justify-center gap-2 py-3 rounded-full font-semibold text-sm transition-all ${
                  color === "violet"
                    ? "bg-violet-600 hover:bg-violet-500 text-white hover:shadow-lg hover:shadow-violet-500/25"
                    : "bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/20"
                }`}
              >
                Get a Quote <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* How We Quote */}
      <section className="py-16 bg-[#111111]/50 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm mb-4">
              <Zap size={14} fill="currentColor" />
              How it works
            </div>
            <h2 className="text-3xl font-bold tracking-tight mb-3">
              From conversation to{" "}
              <span className="gradient-text">clear proposal</span>
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              No vague estimates. No surprise invoices. Here's exactly how we scope and price every project.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Free Discovery Call",
                desc: "We spend 30 minutes understanding your goals, current setup, and what you actually need. No pitch — just honest conversation.",
              },
              {
                step: "02",
                title: "Scoped Proposal",
                desc: "Within 48 hours you receive a written proposal: exact scope, timeline, and fixed total cost. Everything agreed upfront.",
              },
              {
                step: "03",
                title: "We Build & Deliver",
                desc: "Once approved, we build. You get regular updates, a final review, and full documentation on handoff.",
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-violet-500/20 transition-all">
                <div className="text-4xl font-bold text-violet-500/20 mb-4">{step}</div>
                <div className="font-semibold mb-2">{title}</div>
                <div className="text-sm text-zinc-500 leading-relaxed">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24 max-w-3xl mx-auto px-6">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
          Pricing <span className="gradient-text">FAQs</span>
        </h2>
        <div className="space-y-4">
          {faqs.map(({ q, a }) => (
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
      <section className="pb-24 text-center max-w-3xl mx-auto px-6">
        <h2 className="text-4xl font-bold tracking-tight mb-4">
          Ready to get a{" "}
          <span className="gradient-text">custom quote?</span>
        </h2>
        <p className="text-zinc-400 mb-8">
          Book a free 30-minute discovery call. We'll scope your project and send you a clear proposal within 48 hours.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold text-lg transition-all hover:shadow-2xl hover:shadow-violet-500/30"
        >
          Book Free Discovery Call <ArrowRight size={20} />
        </Link>
        <p className="mt-4 text-sm text-zinc-600">No commitment. No credit card. Just a conversation.</p>
      </section>
    </div>
  );
}
