import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Target,
  Heart,
  Zap,
  Shield,
  Globe,
} from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Results First",
    desc: "We measure our success by your outcomes — not by deliverables, hours, or activity. If it doesn't move your metrics, we don't build it.",
  },
  {
    icon: Heart,
    title: "Genuinely Custom",
    desc: "We don't have a template library. Every solution we build starts from scratch, designed around your specific business, goals, and constraints.",
  },
  {
    icon: Zap,
    title: "Speed Without Sacrifice",
    desc: "We move fast because your business can't wait. But we never cut corners — every solution we ship is tested, stable, and ready for scale.",
  },
  {
    icon: Shield,
    title: "Transparent Always",
    desc: "No black boxes. You get clear proposals, regular updates, and full visibility into what we're building and how it's performing.",
  },
];

const milestones = [
  { year: "2022", title: "Founded", desc: "Vertexa Solution was founded with a simple mission: build custom AI and software solutions that actually work — for any business, any industry." },
  { year: "2023", title: "First 10 Clients", desc: "Delivered AI call agents, automation systems, and web builds for our first 10 clients. Average project satisfaction: 5 stars." },
  { year: "2024", title: "Expanded Services", desc: "Launched web development and app development alongside our AI services. Crossed 50 active projects and expanded the team." },
  { year: "2025", title: "Growing Fast", desc: "Now working with startups, growing businesses, and new brands across multiple industries — globally remote, always custom." },
];

const founder = {
  name: "Muhammad Bilal",
  role: "Founder & CEO",
  bio: "Entrepreneur and AI strategist with a background in growth and operations. Built Vertexa to give startups and businesses access to custom-built AI and software without the enterprise price tag. Muhammad is passionate about helping businesses leverage technology to solve real problems and drive growth.",
  image: "/Founder.jpg",
};

const team = [
  {
    name: "Shameer Basharat",
    role: "Marketing & Operations Manager",
    bio: "Marketing strategist and operations guru. Keeps our projects running smoothly and makes sure the world knows about the custom solutions we build.",
    image: "/team-shameer.jpg",
  },
  {
    name: "Shahbaz Ali",
    role: "Lead Generation & Outreach Specialist",
    bio: "Lead gen expert and outreach specialist. Connects us with startups and businesses that can benefit from our custom AI and software solutions.",
    image: "/team-shahbaz.jpg",
  },
];

export default function AboutPage() {
  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute left-0 top-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm mb-6">
              About Us
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
              We're not a product company.{" "}
              <span className="gradient-text">We're your build partner.</span>
            </h1>
            <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl">
              Vertexa Solution was built on a simple belief: every business deserves custom-built AI and software — not a template or a SaaS subscription that almost fits. We scope, build, and deliver solutions designed specifically for you.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-[#111111]/50 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <Globe size={32} className="text-violet-400 mx-auto mb-6" />
          <blockquote className="text-2xl sm:text-3xl font-semibold text-white leading-relaxed max-w-3xl mx-auto">
            "Our mission is to give every startup and business — regardless of size or industry — access to the same custom AI and software that used to be reserved for enterprises with big budgets."
          </blockquote>
          <div className="mt-6 text-zinc-500 text-sm">— Muhammad Bilal, Founder & CEO</div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight mb-4">
            What we{" "}
            <span className="gradient-text">believe in</span>
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-6 rounded-2xl bg-[#111111] border border-white/5 hover:border-violet-500/20 transition-all">
              <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center mb-4">
                <Icon size={20} className="text-violet-400" />
              </div>
              <div className="font-semibold mb-2">{title}</div>
              <div className="text-sm text-zinc-500 leading-relaxed">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-[#111111]/50 border-y border-white/5">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4">
              Our <span className="gradient-text">story</span>
            </h2>
          </div>
          <div className="space-y-6">
            {milestones.map(({ year, title, desc }) => (
              <div key={year} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-violet-400">{year}</span>
                  </div>
                  <div className="w-0.5 h-full bg-violet-500/10 mt-2" />
                </div>
                <div className="pb-6 flex-1">
                  <div className="font-bold text-lg mb-1">{title}</div>
                  <div className="text-sm text-zinc-400 leading-relaxed">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight mb-4">
            The team behind{" "}
            <span className="gradient-text">Vertexa</span>
          </h2>
          <p className="text-zinc-400 max-w-lg mx-auto">
            Builders, engineers, and strategists — people who've shipped real products and understand what it takes to deliver properly.
          </p>
        </div>

        {/* Founder — centered */}
        <div className="flex justify-center mb-8">
          <div className="p-6 rounded-2xl bg-[#111111] border border-violet-500/20 hover:border-violet-500/40 transition-all text-center w-full max-w-xs">
            <div className="w-24 h-24 rounded-full bg-violet-500/10 border-2 border-violet-500/30 overflow-hidden flex items-center justify-center mx-auto mb-4">
              <Image
                src={founder.image}
                alt={founder.name}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="font-bold mb-0.5">{founder.name}</div>
            <div className="text-xs text-violet-400 font-medium mb-3">{founder.role}</div>
            <div className="text-sm text-zinc-500 leading-relaxed">{founder.bio}</div>
          </div>
        </div>

        {/* Rest of team */}
        <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
  {team.map(({ name, role, bio, image }) => (
    <div key={name} className="p-6 rounded-2xl bg-[#111111] border border-white/5 hover:border-violet-500/20 transition-all text-center">
      <div className="w-16 h-16 rounded-full border border-violet-500/20 mx-auto mb-4 overflow-hidden">
  <Image
    src={image}
    alt={name}
    width={64}
    height={64}
    className="w-full h-full object-cover object-top"
  />
</div>
      <div className="font-bold mb-0.5">{name}</div>
      <div className="text-xs text-violet-400 font-medium mb-3">{role}</div>
      <div className="text-sm text-zinc-500 leading-relaxed">{bio}</div>
    </div>
  ))}
</div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-[#111111]/50 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { v: "50+", l: "Projects delivered" },
              { v: "4", l: "Core services" },
              { v: "14 days", l: "Average go-live time" },
              { v: "98%", l: "Client satisfaction rate" },
            ].map(({ v, l }) => (
              <div key={l}>
                <div className="text-3xl font-bold gradient-text mb-1">{v}</div>
                <div className="text-sm text-zinc-500">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center max-w-3xl mx-auto px-6">
        <h2 className="text-4xl font-bold tracking-tight mb-4">
          Ready to work{" "}
          <span className="gradient-text">with us?</span>
        </h2>
        <p className="text-zinc-400 mb-8">
          We'd love to learn about your business and figure out what we can build together. Start with a free discovery call.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold text-lg transition-all hover:shadow-2xl hover:shadow-violet-500/30"
        >
          Book a Free Call <ArrowRight size={20} />
        </Link>
      </section>
    </div>
  );
}
