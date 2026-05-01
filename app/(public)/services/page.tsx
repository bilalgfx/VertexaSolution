import Link from "next/link";
import {
  Bot,
  Phone,
  ArrowRight,
  CheckCircle,
  Workflow,
  Mail,
  BarChart3,
  ShoppingCart,
  Mic,
  PhoneCall,
  Target,
  RefreshCw,
  Code2,
  Smartphone,
  Globe,
  Server,
  Layout,
  Layers,
  MonitorSmartphone,
  Cpu,
} from "lucide-react";

const automationFeatures = [
  {
    icon: Workflow,
    title: "Workflow Automation",
    desc: "End-to-end business workflows automated with zero human touch — from lead intake and onboarding to internal ops and reporting.",
  },
  {
    icon: Mail,
    title: "Email & SMS Sequences",
    desc: "AI-crafted, personalised email and SMS flows triggered by user actions — sign-ups, inactivity, purchases, and more.",
  },
  {
    icon: BarChart3,
    title: "Data & Reporting",
    desc: "Automated data pipelines, scheduled reports, and real-time dashboards that give you visibility without the manual work.",
  },
  {
    icon: ShoppingCart,
    title: "Lead & CRM Automation",
    desc: "Automated lead capture, scoring, follow-up sequences, and CRM updates — so no opportunity slips through the cracks.",
  },
];

const callAgentFeatures = [
  {
    icon: PhoneCall,
    title: "Inbound Support Agents",
    desc: "Handle hundreds of simultaneous inbound calls — product questions, support queries, bookings — all resolved instantly by AI.",
  },
  {
    icon: Mic,
    title: "Outbound Sales Calls",
    desc: "Proactive AI agents that follow up on leads, re-engage prospects, and drive conversations that convert.",
  },
  {
    icon: Target,
    title: "Lead Qualification",
    desc: "AI agents qualify inbound leads 24/7, score them by intent, and book meetings directly into your calendar.",
  },
  {
    icon: RefreshCw,
    title: "Customer Follow-Up",
    desc: "Automated post-interaction calls to collect feedback, offer next steps, and keep your pipeline moving.",
  },
];

const webDevFeatures = [
  {
    icon: Layout,
    title: "SaaS Product Websites",
    desc: "Full marketing and product sites for SaaS businesses — high-converting, fast, and built to scale with your growth.",
  },
  {
    icon: Globe,
    title: "Online Stores & Platforms",
    desc: "Custom-coded online stores on Shopify, WooCommerce, or fully bespoke — designed to convert and scale.",
  },
  {
    icon: Server,
    title: "Backend & APIs",
    desc: "Node.js, Express, and REST/GraphQL APIs built to power your product — secure, documented, and scalable.",
  },
  {
    icon: Layers,
    title: "Landing Pages",
    desc: "High-performance landing pages optimized for conversion — React-based, fast-loading, and fully custom.",
  },
];

const appDevFeatures = [
  {
    icon: MonitorSmartphone,
    title: "iOS & Android Apps",
    desc: "Native and cross-platform mobile apps built with React Native — one codebase, two platforms, full polish.",
  },
  {
    icon: Code2,
    title: "Web Applications",
    desc: "Complex web apps with rich UIs, real-time features, and solid architecture using React and Next.js.",
  },
  {
    icon: Cpu,
    title: "API & Integrations",
    desc: "Backend systems and third-party integrations that connect your app to the tools and services your business runs on.",
  },
  {
    icon: Smartphone,
    title: "UI/UX Design",
    desc: "Design is included — every app we build comes with polished, user-tested interfaces built for real people.",
  },
];

const process = [
  { step: "01", title: "Discovery Call", desc: "We learn your goals, current stack, and requirements — no fluff, just the information we need to scope your project accurately." },
  { step: "02", title: "Custom Build", desc: "Our team designs and builds your solution from scratch, tailored to your exact business needs and tech environment." },
  { step: "03", title: "Integration", desc: "We connect seamlessly with your existing tools — Shopify, WooCommerce, CRMs, APIs, and more." },
  { step: "04", title: "Launch & Support", desc: "We go live together. Post-launch support, documentation, and handoff training all included." },
];

export default function ServicesPage() {
  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="relative py-24 text-center overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm mb-6">
            Our Services
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
            Four services.{" "}
            <span className="gradient-text">All custom-built.</span>
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl mx-auto">
            AI automation, voice agents, web development, and app development — all scoped and built specifically for your business. No templates, no packages, no fluff.
          </p>
        </div>
      </section>

      {/* AI Automation */}
      <section id="automation" className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-6">
              <Bot size={28} className="text-violet-400" />
            </div>
            <h2 className="text-4xl font-bold tracking-tight mb-4">
              AI <span className="text-violet-400">Automation</span>
            </h2>
            <p className="text-zinc-400 leading-relaxed mb-6">
              Replace repetitive manual work with intelligent AI workflows built around your specific processes. From lead management to internal operations — fully automated, fully custom, running around the clock.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Integrates with your existing tools and platforms",
                "Custom workflow design from scratch",
                "Real-time performance dashboard",
                "Tested and optimised before go-live",
                "GDPR-compliant data handling",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-zinc-300">
                  <CheckCircle size={16} className="text-violet-400 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-all hover:shadow-lg hover:shadow-violet-500/25"
            >
              Get AI Automation <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {automationFeatures.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-5 rounded-xl bg-[#111111] border border-white/5 hover:border-violet-500/20 transition-all">
                <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center mb-3">
                  <Icon size={18} className="text-violet-400" />
                </div>
                <div className="font-semibold text-sm mb-1">{title}</div>
                <div className="text-xs text-zinc-500 leading-relaxed">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-white/5" />

      {/* AI Call Agents */}
      <section id="call-agents" className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="order-2 lg:order-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {callAgentFeatures.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-5 rounded-xl bg-[#111111] border border-white/5 hover:border-cyan-500/20 transition-all">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-3">
                  <Icon size={18} className="text-cyan-400" />
                </div>
                <div className="font-semibold text-sm mb-1">{title}</div>
                <div className="text-xs text-zinc-500 leading-relaxed">{desc}</div>
              </div>
            ))}
          </div>
          <div className="order-1 lg:order-2">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6">
              <Phone size={28} className="text-cyan-400" />
            </div>
            <h2 className="text-4xl font-bold tracking-tight mb-4">
              AI <span className="text-cyan-400">Call Agents</span>
            </h2>
            <p className="text-zinc-400 leading-relaxed mb-6">
              Deploy AI voice agents that sound human, think fast, and handle your call operations at unlimited scale — trained on your business, your products, and your customers.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Supports 100+ simultaneous calls",
                "Natural, human-like conversations",
                "Full CRM integration & call logging",
                "Custom voice and script per brand",
                "Handoff to human agents when needed",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-zinc-300">
                  <CheckCircle size={16} className="text-cyan-400 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 font-semibold border border-cyan-500/20 transition-all"
            >
              Get AI Call Agents <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-white/5" />

      {/* Web Development */}
      <section id="web-dev" className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-6">
              <Code2 size={28} className="text-violet-400" />
            </div>
            <h2 className="text-4xl font-bold tracking-tight mb-4">
              Web <span className="text-violet-400">Development</span>
            </h2>
            <p className="text-zinc-400 leading-relaxed mb-6">
              We build fully custom websites and web platforms from the ground up — no templates, no page builders. Whether you need a SaaS product site, an online store, or a complex web application, we write the code that makes it work.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "React, Next.js, TypeScript front-ends",
                "Node.js, Express, and REST/GraphQL backends",
                "Shopify and WooCommerce custom development",
                "SaaS product and marketing websites",
                "Performance-optimized and SEO-ready",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-zinc-300">
                  <CheckCircle size={16} className="text-violet-400 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-all hover:shadow-lg hover:shadow-violet-500/25"
            >
              Start a Web Project <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {webDevFeatures.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-5 rounded-xl bg-[#111111] border border-white/5 hover:border-violet-500/20 transition-all">
                <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center mb-3">
                  <Icon size={18} className="text-violet-400" />
                </div>
                <div className="font-semibold text-sm mb-1">{title}</div>
                <div className="text-xs text-zinc-500 leading-relaxed">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-white/5" />

      {/* App Development */}
      <section id="app-dev" className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="order-2 lg:order-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {appDevFeatures.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-5 rounded-xl bg-[#111111] border border-white/5 hover:border-cyan-500/20 transition-all">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-3">
                  <Icon size={18} className="text-cyan-400" />
                </div>
                <div className="font-semibold text-sm mb-1">{title}</div>
                <div className="text-xs text-zinc-500 leading-relaxed">{desc}</div>
              </div>
            ))}
          </div>
          <div className="order-1 lg:order-2">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6">
              <Smartphone size={28} className="text-cyan-400" />
            </div>
            <h2 className="text-4xl font-bold tracking-tight mb-4">
              App <span className="text-cyan-400">Development</span>
            </h2>
            <p className="text-zinc-400 leading-relaxed mb-6">
              Custom mobile and web applications built end-to-end — from concept and UX design through to a production-ready product. We handle the full stack so you can focus on your business, not the build.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "iOS and Android apps (React Native)",
                "Web apps with real-time features",
                "Full backend and API development",
                "UI/UX design included in every project",
                "Post-launch support and maintenance",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-zinc-300">
                  <CheckCircle size={16} className="text-cyan-400 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 font-semibold border border-cyan-500/20 transition-all"
            >
              Start an App Project <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 bg-[#111111]/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4">
              From brief to{" "}
              <span className="gradient-text">live in days</span>
            </h2>
            <p className="text-zinc-400 max-w-lg mx-auto">
              Our delivery process gets your project scoped, built, and shipped fast — without the agency runaround.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map(({ step, title, desc }) => (
              <div key={step} className="relative p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                <div className="text-4xl font-bold text-violet-500/20 mb-4">{step}</div>
                <div className="font-semibold mb-2">{title}</div>
                <div className="text-sm text-zinc-500 leading-relaxed">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center max-w-4xl mx-auto px-6">
        <h2 className="text-4xl font-bold tracking-tight mb-4">
          Which service is right{" "}
          <span className="gradient-text">for you?</span>
        </h2>
        <p className="text-zinc-400 mb-8">
          Book a free 30-minute call and we'll map out exactly which service will drive the most value for your business.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold text-lg transition-all hover:shadow-2xl hover:shadow-violet-500/30"
        >
          Book Free Strategy Call <ArrowRight size={20} />
        </Link>
      </section>
    </div>
  );
}
