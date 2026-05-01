import Link from "next/link";
import {
  ArrowRight,
  TrendingUp,
  ShoppingCart,
  Headphones,
  Phone,
  BarChart3,
  ExternalLink,
} from "lucide-react";

const caseStudies = [
  {
    client: "NovaBrand",
    industry: "Startup / SaaS",
    service: "Web Development",
    challenge:
      "NovaBrand needed a full product website and marketing platform built from scratch before their funding announcement. Timeline: 3 weeks.",
    solution:
      "Built a complete Next.js marketing site, pricing pages, and onboarding flow integrated with their backend API — delivered on time and under budget.",
    results: [
      { metric: "3 weeks", label: "Full site delivered" },
      { metric: "98", label: "Lighthouse performance score" },
      { metric: "2x", label: "Conversion vs. previous site" },
    ],
    icon: ShoppingCart,
    color: "violet",
    tag: "Case Study",
  },
  {
    client: "GearVault",
    industry: "Services Business",
    service: "AI Automation",
    challenge:
      "GearVault's support team was handling 1,200+ tickets per month manually, with a 48-hour average response time and declining customer satisfaction.",
    solution:
      "Built a full support automation system — AI agents handling common queries, routing, and auto-responses. Human agents only handle complex escalations.",
    results: [
      { metric: "83%", label: "Queries resolved automatically" },
      { metric: "< 90s", label: "Average response time" },
      { metric: "3x", label: "Team capacity freed up" },
    ],
    icon: Headphones,
    color: "cyan",
    tag: "Case Study",
  },
  {
    client: "LuxeHome Co.",
    industry: "Growing Business",
    service: "AI Call Agents",
    challenge:
      "LuxeHome's sales team was manually following up on every enquiry. Only 12% of leads were converting due to slow response times.",
    solution:
      "Deployed AI call agents that followed up on new leads within 5 minutes of enquiry, qualifying them and booking discovery calls automatically.",
    results: [
      { metric: "11%→38%", label: "Lead-to-sale conversion" },
      { metric: "5 min", label: "Average follow-up time" },
      { metric: "3.2x", label: "Sales team capacity" },
    ],
    icon: TrendingUp,
    color: "violet",
    tag: "Case Study",
  },
];

const metrics = [
  { value: "50+", label: "Projects delivered" },
  { value: "$2.4M", label: "Revenue recovered for clients" },
  { value: "98%", label: "Client satisfaction rate" },
  { value: "14 days", label: "Average go-live time" },
];

const demoFeatures = [
  {
    title: "Live AI Call Demo",
    desc: "Hear an actual AI call agent handle a live lead follow-up scenario — natural conversation, real-time objection handling, and booking a call.",
    icon: Phone,
    cta: "Book Demo Call",
  },
  {
    title: "Automation Walkthrough",
    desc: "See a live screen-share of our automation dashboard — workflows, trigger logic, performance metrics, and A/B test results.",
    icon: BarChart3,
    cta: "Request Walkthrough",
  },
];

export default function WorkPage() {
  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="relative py-24 text-center overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm mb-6">
            Our Work
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
            Proof in the{" "}
            <span className="gradient-text">numbers</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Real case studies from startups and businesses that worked with Vertexa — with documented, measurable results.
          </p>
        </div>
      </section>

      {/* Agency Metrics */}
      <section className="border-y border-white/5 bg-[#111111]/50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {metrics.map(({ value, label }) => (
              <div key={label}>
                <div className="text-3xl sm:text-4xl font-bold gradient-text mb-1">{value}</div>
                <div className="text-sm text-zinc-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="space-y-8">
          {caseStudies.map(({ client, industry, service, challenge, solution, results, icon: Icon, color, tag }) => (
            <div
              key={client}
              className={`rounded-2xl bg-[#111111] border ${
                color === "violet" ? "border-violet-500/20" : "border-cyan-500/20"
              } overflow-hidden hover:bg-[#151515] transition-all`}
            >
              {/* Header */}
              <div className={`px-8 pt-8 pb-6 border-b ${color === "violet" ? "border-violet-500/10" : "border-cyan-500/10"}`}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color === "violet" ? "bg-violet-500/10" : "bg-cyan-500/10"}`}>
                      <Icon size={22} className={color === "violet" ? "text-violet-400" : "text-cyan-400"} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{client}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-zinc-500">{industry}</span>
                        <span className="w-1 h-1 rounded-full bg-zinc-700" />
                        <span className={`text-xs font-medium ${color === "violet" ? "text-violet-400" : "text-cyan-400"}`}>{service}</span>
                      </div>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-white/5 text-xs text-zinc-500 font-medium border border-white/10">
                    {tag}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-8 grid lg:grid-cols-3 gap-8">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">The Challenge</div>
                  <p className="text-sm text-zinc-400 leading-relaxed">{challenge}</p>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">Our Solution</div>
                  <p className="text-sm text-zinc-400 leading-relaxed">{solution}</p>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">Results</div>
                  <div className="space-y-3">
                    {results.map(({ metric, label }) => (
                      <div key={label} className="flex items-center justify-between">
                        <span className="text-sm text-zinc-500">{label}</span>
                        <span className={`text-sm font-bold ${color === "violet" ? "text-violet-400" : "text-cyan-400"}`}>{metric}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-24 bg-[#111111]/50 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4">
              See it{" "}
              <span className="gradient-text">live</span>
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              Don't just read about it. Experience our AI in action with a personalized demo.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {demoFeatures.map(({ title, desc, icon: Icon, cta }) => (
              <div
                key={title}
                className="p-8 rounded-2xl bg-[#0a0a0a] border border-violet-500/20 hover:border-violet-500/40 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-6">
                  <Icon size={24} className="text-violet-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">{title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6">{desc}</p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-violet-400 hover:text-violet-300 transition-colors"
                >
                  {cta} <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center max-w-3xl mx-auto px-6">
        <h2 className="text-4xl font-bold tracking-tight mb-4">
          Want results like{" "}
          <span className="gradient-text">these?</span>
        </h2>
        <p className="text-zinc-400 mb-8">
          Every client on this page started with one free discovery call. Yours could be next.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold text-lg transition-all hover:shadow-2xl hover:shadow-violet-500/30"
        >
          Book Your Free Call <ArrowRight size={20} />
        </Link>
      </section>
    </div>
  );
}
