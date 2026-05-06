"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

const services = [
  "AI Automation",
  "AI Call Agents",
  "Web Development",
  "App Development",
  "Multiple services",
  "Not sure yet",
];

const budgets = [
  "Under $1,000",
  "$1,000 – $5,000",
  "$5,000 – $15,000",
  "$15,000+",
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    website: "",
    service: "",
    budget: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm mb-6">
            Let's Talk
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
            Start your{" "}
            <span className="gradient-text">free strategy call</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Fill in the form below and we'll respond within 24 hours to schedule your free 30-minute strategy session.
          </p>
        </div>
      </section>

      <section className="pb-24 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold mb-6">Get in touch</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
                    <Mail size={18} className="text-violet-400" />
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 mb-0.5">Email</div>
                    <a href="mailto:vertexasolution@gmail.com" className="text-sm text-zinc-300 hover:text-violet-400 transition-colors">
                      vertexasolution@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
                    <Phone size={18} className="text-violet-400" />
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 mb-0.5">Phone</div>
                    <span className="text-sm text-zinc-300">+92 318 6148231</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
                    <Clock size={18} className="text-violet-400" />
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 mb-0.5">Response Time</div>
                    <span className="text-sm text-zinc-300">Within 24 hours</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
                    <MapPin size={18} className="text-violet-400" />
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 mb-0.5">Location</div>
                    <span className="text-sm text-zinc-300">Punjab, Pakistan</span>
                  </div>
                </div>
              </div>
            </div>

            {/* What to expect */}
            <div className="p-6 rounded-2xl bg-[#111111] border border-violet-500/20">
              <h3 className="font-semibold mb-4">What happens next?</h3>
              <div className="space-y-3">
                {[
                  "We review your submission within 24 hours",
                  "You get a calendar link to book your call",
                  "30-min strategy session — no pitch, just value",
                  "You receive a custom AI roadmap by email",
                ].map((item, i) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-violet-500/20 text-violet-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <span className="text-sm text-zinc-400">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 rounded-2xl bg-[#111111] border border-violet-500/20">
                <div className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center mb-6">
                  <CheckCircle size={32} className="text-violet-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Message received!</h3>
                <p className="text-zinc-400 max-w-md mb-8">
                  Thank you for reaching out. We'll review your details and get back to you within 24 hours with a calendar link to book your strategy call.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-all"
                >
                  Back to Home <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="p-8 rounded-2xl bg-[#111111] border border-white/5"
              >
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="John Smith"
                      className="w-full px-4 py-3 rounded-xl bg-[#0a0a0a] border border-white/10 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-violet-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="john@brand.com"
                      className="w-full px-4 py-3 rounded-xl bg-[#0a0a0a] border border-white/10 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-violet-500/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    Phone Number <span className="text-zinc-600">(optional — for our AI to follow up with you)</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+1 555 000 0000"
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0a0a] border border-white/10 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-violet-500/50 transition-colors"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                      Company / Brand Name *
                    </label>
                    <input
                      type="text"
                      name="company"
                      required
                      value={form.company}
                      onChange={handleChange}
                      placeholder="My Brand Co."
                      className="w-full px-4 py-3 rounded-xl bg-[#0a0a0a] border border-white/10 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-violet-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                      Website URL
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={form.website}
                      onChange={handleChange}
                      placeholder="https://mybrand.com"
                      className="w-full px-4 py-3 rounded-xl bg-[#0a0a0a] border border-white/10 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-violet-500/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                      Service Interested In
                    </label>
                    <select
                      name="service"
                      value={form.service}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-[#0a0a0a] border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
                    >
                      <option value="" className="bg-[#111111]">Select a service</option>
                      {services.map((s) => (
                        <option key={s} value={s} className="bg-[#111111]">{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                      Project Budget
                    </label>
                    <select
                      name="budget"
                      value={form.budget}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-[#0a0a0a] border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
                    >
                      <option value="" className="bg-[#111111]">Select budget</option>
                      {budgets.map((b) => (
                        <option key={b} value={b} className="bg-[#111111]">{b}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    Tell us about your project or what you're looking to build
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="e.g. We need an AI call agent for lead follow-ups, a custom Shopify storefront, or a mobile app for our customers..."
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0a0a] border border-white/10 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-violet-500/50 transition-colors resize-none"
                  />
                </div>

                {error && (
                  <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-violet-600 hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-base transition-all hover:shadow-xl hover:shadow-violet-500/25 active:scale-[0.99]"
                >
                  {loading ? 'Sending...' : 'Send Message & Book Call'}
                  {!loading && <Send size={16} />}
                </button>

                <p className="text-center text-xs text-zinc-600 mt-4">
                  By submitting, you agree to our Privacy Policy. We never spam or share your data.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
