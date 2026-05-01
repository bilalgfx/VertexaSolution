import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Phone,
  TrendingUp,
  Zap,
  Star,
  CheckCircle,
  ChevronRight,
  BarChart3,
  Clock,
  Users,
  Code2,
  Smartphone,
  Lightbulb,
  Rocket,
} from "lucide-react";

const stats = [
  { value: "50+", label: "Projects delivered" },
  { value: "24/7", label: "AI agents running" },
  { value: "14 days", label: "Average go-live time" },
  { value: "98%", label: "Client satisfaction" },
];

const services = [
  {
    icon: Bot,
    title: "AI Automation",
    description:
      "Custom automation systems built around your workflows — eliminating manual work and letting your team focus on what actually matters.",
    features: ["Custom workflow design", "CRM & tool integration", "Email & SMS automation", "Performance dashboards"],
    color: "violet",
  },
  {
    icon: Phone,
    title: "AI Call Agents",
    description:
      "Bespoke AI voice agents trained on your business — handling inbound and outbound calls at scale, around the clock, without a team.",
    features: ["Custom voice & scripts", "Lead qualification", "24/7 call handling", "Human handoff logic"],
    color: "cyan",
  },
  {
    icon: Code2,
    title: "Web Development",
    description:
      "Full-stack websites and SaaS product builds coded from scratch — landing pages, product sites, and custom platforms built to perform.",
    features: ["React / Next.js builds", "Node.js backends", "SaaS product development", "Custom web platforms"],
    color: "violet",
  },
  {
    icon: Smartphone,
    title: "App Development",
    description:
      "Custom mobile and web applications built end-to-end — from concept and design through to a live product on iOS, Android, or web.",
    features: ["iOS & Android apps", "Web applications", "API development", "UI/UX design included"],
    color: "cyan",
  },
];

const results = [
  {
    metric: "10x",
    label: "Faster response with AI agents",
    icon: Clock,
  },
  {
    metric: "68%",
    label: "Reduction in operational costs",
    icon: BarChart3,
  },
  {
    metric: "4x",
    label: "Increase in lead conversion",
    icon: TrendingUp,
  },
  {
    metric: "3x",
    label: "Team output without new hires",
    icon: Users,
  },
];

const testimonials = [
  {
    quote:
      "Vertexa built our entire web platform in under 3 weeks. Clean code, fast delivery, and they actually understood what we were trying to build.",
    name: "Sarah Chen",
    role: "Founder, NovaBrand",
    rating: 5,
  },
  {
    quote:
      "The AI automation they built replaced 3 manual processes overnight. Our team now focuses on growth, not repetitive tasks.",
    name: "Marcus Webb",
    role: "Operations Director, GearVault",
    rating: 5,
  },
  {
    quote:
      "We launched our app in 6 weeks. Vertexa handled everything — design, development, and deployment. Couldn't have asked for more.",
    name: "Priya Nair",
    role: "Founder, LuxeHome Co.",
    rating: 5,
  },
];

const clientTypes = [
  {
    icon: Rocket,
    label: "Startups",
    desc: "You're building something new and need a technical partner who can move fast and build right.",
  },
  {
    icon: Lightbulb,
    label: "New Brands",
    desc: "You have the vision and the product — you need the website, app, or automation to back it up.",
  },
  {
    icon: TrendingUp,
    label: "Growing Businesses",
    desc: "You're scaling and need systems — AI, automation, or software — to keep up without burning out your team.",
  },
  {
    icon: Users,
    label: "Any Industry",
    desc: "We don't specialise in one sector. If you need it built, we can build it — whatever your business does.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-pulse-glow pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl animate-pulse-glow pointer-events-none" style={{ animationDelay: "1.5s" }} />

        <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium mb-8">
            <Zap size={14} fill="currentColor" />
            AI &amp; Web Development Agency
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-6">
            We Build the Tools{" "}
            <span className="gradient-text">That Scale</span>
            <br />
            <span className="gradient-text">Your Business</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-zinc-400 leading-relaxed mb-10">
            Vertexa Solution is a custom solutions agency. We build AI automation, voice agents, websites, and apps — for startups and businesses that want to operate smarter and grow faster.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="group flex items-center gap-2 px-7 py-3.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold text-base transition-all hover:shadow-xl hover:shadow-violet-500/30 active:scale-95"
            >
              Book a Free Call
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/work"
              className="flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white font-semibold text-base transition-all hover:bg-white/5"
            >
              See Our Work
              <ChevronRight size={18} />
            </Link>
          </div>

          <div className="mt-10 flex items-center justify-center gap-6 text-sm text-zinc-500">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
              ))}
              <span className="ml-2">5.0 rated</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-zinc-700" />
            <span>50+ projects delivered</span>
            <span className="w-1 h-1 rounded-full bg-zinc-700" />
            <span>Fixed-price projects</span>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/5 bg-[#111111]/50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold gradient-text mb-1">{value}</div>
                <div className="text-sm text-zinc-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 max-w-7xl mx-auto px-6 w-full">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-sm mb-4">
            What We Build
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Four services.{" "}
            <span className="gradient-text">All custom-built.</span>
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            We don't sell off-the-shelf packages. Every solution is designed and built specifically for your business.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {services.map(({ icon: Icon, title, description, features, color }) => (
            <div
              key={title}
              className={`relative p-8 rounded-2xl bg-[#111111] border ${
                color === "violet" ? "border-violet-500/20 hover:border-violet-500/40" : "border-cyan-500/20 hover:border-cyan-500/40"
              } transition-all group hover:bg-[#151515]`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${
                  color === "violet" ? "bg-violet-500/10" : "bg-cyan-500/10"
                }`}
              >
                <Icon size={24} className={color === "violet" ? "text-violet-400" : "text-cyan-400"} />
              </div>
              <h3 className="text-2xl font-bold mb-3">{title}</h3>
              <p className="text-zinc-400 mb-6 leading-relaxed">{description}</p>
              <ul className="space-y-2 mb-8">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-zinc-400">
                    <CheckCircle size={14} className={color === "violet" ? "text-violet-400" : "text-cyan-400"} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/services"
                className={`inline-flex items-center gap-1 text-sm font-semibold ${
                  color === "violet" ? "text-violet-400 hover:text-violet-300" : "text-cyan-400 hover:text-cyan-300"
                } transition-colors`}
              >
                Learn more <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Results */}
      <section className="py-24 bg-[#111111]/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Real results for{" "}
              <span className="gradient-text">real businesses</span>
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              Numbers from our actual client projects — not estimates or industry averages.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {results.map(({ metric, label, icon: Icon }) => (
              <div
                key={label}
                className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-violet-500/20 transition-all text-center group"
              >
                <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-violet-500/20 transition-colors">
                  <Icon size={20} className="text-violet-400" />
                </div>
                <div className="text-3xl font-bold gradient-text mb-1">{metric}</div>
                <div className="text-sm text-zinc-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Work With */}
      <section className="py-24 max-w-7xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-sm mb-6">
              Who We Work With
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
              We build for{" "}
              <span className="gradient-text">anyone</span>
              <br />
              with a vision
            </h2>
            <p className="text-zinc-400 leading-relaxed mb-6">
              We don't have a niche. If you need AI automation, a call agent system, a website, or an app — and you want it built properly — we're the team for it.
            </p>
            <p className="text-zinc-400 leading-relaxed mb-8">
              Whether you're launching your first product or scaling an existing business, we scope each project to your exact needs and deliver a solution that fits.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 font-semibold transition-colors"
            >
              Let's talk about your project <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {clientTypes.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="p-5 rounded-xl bg-[#111111] border border-white/5 hover:border-violet-500/20 transition-all">
                <Icon size={20} className="text-violet-400 mb-3" />
                <div className="font-semibold text-sm mb-1">{label}</div>
                <div className="text-xs text-zinc-500 leading-relaxed">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-[#111111]/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              What our clients{" "}
              <span className="gradient-text">say</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(({ quote, name, role, rating }) => (
              <div key={name} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-violet-500/20 transition-all flex flex-col">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed flex-1 mb-6">"{quote}"</p>
                <div>
                  <div className="font-semibold text-sm">{name}</div>
                  <div className="text-xs text-zinc-500">{role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 max-w-7xl mx-auto px-6 w-full">
        <div className="relative rounded-3xl bg-gradient-to-br from-violet-600/20 to-cyan-500/10 border border-violet-500/20 p-12 text-center overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-30" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-violet-600/30 rounded-full blur-3xl pointer-events-none" />
          <div className="relative">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Ready to build{" "}
              <span className="gradient-text">something great?</span>
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto mb-8">
              Book a free discovery call. No pressure, no jargon — just an honest conversation about what you need and how we can build it.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold text-lg transition-all hover:shadow-2xl hover:shadow-violet-500/30 active:scale-95"
            >
              Book Your Free Discovery Call
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
