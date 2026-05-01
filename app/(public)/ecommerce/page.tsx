import Link from "next/link";
import {
  ArrowRight,
  ShoppingCart,
  TrendingUp,
  Users,
  RefreshCw,
  Package,
  Headphones,
  Star,
  BarChart3,
  Globe,
  Zap,
} from "lucide-react";

const painPoints = [
  {
    icon: ShoppingCart,
    title: "Cart Abandonment",
    stat: "70% of carts abandoned",
    desc: "The #1 revenue leak in ecommerce. Our AI call agents and automated sequences recover 3x more abandoned carts than email alone.",
  },
  {
    icon: Headphones,
    title: "Support Overload",
    stat: "Avg 800+ tickets/month",
    desc: "Support teams are buried in repetitive order questions. Our AI agents resolve 80%+ of tickets automatically — no human needed.",
  },
  {
    icon: Users,
    title: "Lead Leakage",
    stat: "60% of leads go cold",
    desc: "Ecommerce leads who don't buy immediately rarely come back without a follow-up. Our AI follows up within seconds, 24/7.",
  },
  {
    icon: RefreshCw,
    title: "High Return Rates",
    stat: "30% avg return rate",
    desc: "AI post-purchase calls proactively address buyer's remorse and offer exchanges before a return is filed.",
  },
];

const useCases = [
  {
    title: "Fashion & Apparel",
    desc: "Size query handling, style recommendations, return flow automation, seasonal campaign follow-ups.",
    icon: "👗",
  },
  {
    title: "Health & Beauty",
    desc: "Product consultation calls, subscription renewal outreach, review collection automation.",
    icon: "💄",
  },
  {
    title: "Electronics",
    desc: "Technical support call deflection, warranty follow-up, upsell accessories automation.",
    icon: "💻",
  },
  {
    title: "Home & Furniture",
    desc: "Delivery tracking calls, assembly support, post-purchase satisfaction follow-ups.",
    icon: "🏠",
  },
  {
    title: "Food & Supplements",
    desc: "Subscription retention calls, reorder reminders, loyalty program outreach.",
    icon: "🌿",
  },
  {
    title: "Sports & Outdoors",
    desc: "Product expertise calls, gear recommendation flows, event-based campaign automation.",
    icon: "⚽",
  },
];

const metrics = [
  { label: "Cart Recovery Rate", before: "8%", after: "27%", icon: ShoppingCart },
  { label: "Support Resolution", before: "24h avg", after: "< 2 min", icon: Headphones },
  { label: "Lead Conversion", before: "2.1%", after: "8.9%", icon: TrendingUp },
  { label: "Return Rate", before: "28%", after: "11%", icon: RefreshCw },
  { label: "Customer LTV", before: "$180", after: "$450", icon: BarChart3 },
  { label: "AOV Increase", before: "$65", after: "$94", icon: Package },
];

export default function EcommercePage() {
  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute right-0 top-0 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm mb-6">
              Why Ecommerce
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
              We speak fluent{" "}
              <span className="gradient-text">ecommerce</span>
            </h1>
            <p className="text-zinc-400 text-lg leading-relaxed mb-8 max-w-2xl">
              We didn't build a generic AI agency and try to sell it to ecommerce. We built Vertexa Solution from the ground up for this industry — because ecommerce has unique problems that require specific solutions.
            </p>
            <div className="flex flex-wrap gap-3">
              {["Shopify Experts", "D2C Focused", "Ecommerce KPIs", "Industry Veterans"].map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-zinc-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-24 bg-[#111111]/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4">
              The exact problems{" "}
              <span className="gradient-text">we solve</span>
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              Every ecommerce brand faces these. Most accept them as normal. We eliminate them.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {painPoints.map(({ icon: Icon, title, stat, desc }) => (
              <div
                key={title}
                className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-violet-500/20 transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center mb-4">
                  <Icon size={20} className="text-violet-400" />
                </div>
                <div className="font-semibold mb-1">{title}</div>
                <div className="text-xs font-medium text-violet-400 mb-3">{stat}</div>
                <div className="text-sm text-zinc-500 leading-relaxed">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before / After Metrics */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight mb-4">
            Before vs. after{" "}
            <span className="gradient-text">Vertexa</span>
          </h2>
          <p className="text-zinc-400 max-w-lg mx-auto">
            Real numbers from ecommerce clients within 90 days of deployment.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.map(({ label, before, after, icon: Icon }) => (
            <div key={label} className="p-6 rounded-2xl bg-[#111111] border border-white/5 hover:border-violet-500/20 transition-all">
              <div className="flex items-center gap-2 mb-4">
                <Icon size={16} className="text-violet-400" />
                <span className="text-sm font-medium text-zinc-300">{label}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1 text-center p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                  <div className="text-sm text-zinc-500 mb-1">Before</div>
                  <div className="font-bold text-zinc-400">{before}</div>
                </div>
                <ArrowRight size={16} className="text-violet-400 shrink-0" />
                <div className="flex-1 text-center p-3 rounded-lg bg-violet-500/10 border border-violet-500/20">
                  <div className="text-sm text-violet-400 mb-1">After</div>
                  <div className="font-bold text-white">{after}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Use Cases by Vertical */}
      <section className="py-24 bg-[#111111]/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4">
              Works across every{" "}
              <span className="gradient-text">ecommerce vertical</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map(({ title, desc, icon }) => (
              <div
                key={title}
                className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-violet-500/20 transition-all group"
              >
                <div className="text-3xl mb-4">{icon}</div>
                <div className="font-semibold mb-2 group-hover:text-violet-400 transition-colors">{title}</div>
                <div className="text-sm text-zinc-500 leading-relaxed">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Expertise Block */}
      <section className="py-24 max-w-5xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold tracking-tight mb-6">
              Deep expertise,{" "}
              <span className="gradient-text">not just tech</span>
            </h2>
            <p className="text-zinc-400 leading-relaxed mb-4">
              Our team has operated, consulted, and built for ecommerce businesses. We've felt the pressure of Q4 spikes. We know what a 1% conversion rate lift means in dollars. We understand the difference between a DTC brand and a marketplace seller.
            </p>
            <p className="text-zinc-400 leading-relaxed mb-8">
              This depth means our AI solutions aren't just technically correct — they're commercially smart. Every automation we deploy is designed to move the metrics that matter to your P&L.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Globe, label: "Global ecommerce experience" },
                { icon: BarChart3, label: "P&L-focused thinking" },
                { icon: Zap, label: "Speed to deployment" },
                { icon: Star, label: "Long-term partnership" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-sm text-zinc-400">
                  <Icon size={14} className="text-violet-400 shrink-0" />
                  {label}
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            {[
              { q: "Can you work with our existing Shopify setup?", a: "Yes — we integrate directly with your Shopify store, no migration required. We also support WooCommerce, BigCommerce, and custom platforms." },
              { q: "How do you handle ecommerce seasonality?", a: "Our AI systems auto-scale. During Black Friday or holiday spikes, call agents handle unlimited concurrent calls and automations scale with your traffic." },
              { q: "What if we're a small store?", a: "We work with brands from $200k to $50M+ ARR. Our entry-level plans are designed for growing stores that want to scale intelligently." },
            ].map(({ q, a }) => (
              <div key={q} className="p-5 rounded-xl bg-[#111111] border border-white/5 hover:border-violet-500/20 transition-all">
                <div className="font-semibold text-sm mb-2 text-white">{q}</div>
                <div className="text-sm text-zinc-500 leading-relaxed">{a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center max-w-3xl mx-auto px-6 pb-24">
        <h2 className="text-4xl font-bold tracking-tight mb-4">
          Your ecommerce brand deserves{" "}
          <span className="gradient-text">better AI</span>
        </h2>
        <p className="text-zinc-400 mb-8">
          Stop using generic tools. Start using AI built for ecommerce. Book a free call to see what's possible.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold text-lg transition-all hover:shadow-2xl hover:shadow-violet-500/30"
        >
          Start Your AI Journey <ArrowRight size={20} />
        </Link>
      </section>
    </div>
  );
}
