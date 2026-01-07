"use client";

import Link from "next/link";
import { 
  ArrowRight, 
  Package, 
  Wrench, 
  FileText,
  CheckCircle,
  Shield,
  Zap
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-zinc-900 selection:text-white">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100">
        <div className="w-full px-6 md:px-12 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center">
              <Package size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">APMS</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-zinc-600 transition-colors">
              Log in
            </Link>
            <Link href="/login" className="px-4 py-2 bg-zinc-900 text-white text-sm font-medium rounded-full hover:bg-zinc-800 transition-all">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full px-6 md:px-12 pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-xs font-medium text-zinc-600 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            v2.0 Now Available
          </div>
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter leading-[1.1] mb-8 text-black">
            Asset management, <br />
            <span className="text-zinc-400">reimagined.</span>
          </h1>
          <p className="text-xl text-zinc-500 max-w-xl leading-relaxed mb-10">
            A production-grade system for tracking, assigning, and maintaining your organization's physical assets with uncompromising precision.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/login" className="px-8 py-4 bg-zinc-900 text-white font-medium rounded-full hover:bg-black transition-all flex items-center gap-2">
              Start Managing <ArrowRight size={18} />
            </Link>
            <a href="#features" className="px-8 py-4 bg-zinc-50 text-zinc-900 font-medium rounded-full hover:bg-zinc-100 transition-all border border-zinc-200">
              View Features
            </a>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="w-full px-6 md:px-12 py-24 bg-zinc-50/50 border-t border-zinc-100">
        <div className="mb-16 max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight mb-4">Everything needed for control.</h2>
          <p className="text-lg text-zinc-500">
            Powerful features designed for modern teams, stripping away complexity while maintaining robust capability.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: Package, title: "Asset Tracking", desc: "Real-time visibility into your entire inventory with detailed status and location tracking." },
            { icon: Wrench, title: "Maintenance", desc: "Schedule and record maintenance activities to ensure operational excellence and longevity." },
            { icon: FileText, title: "Reports", desc: "Generate data-driven insights with comprehensive utilization and depreciation reports." },
            { icon: CheckCircle, title: "Assignments", desc: "Streamline the check-in/check-out process with full accountability and digital signatures." },
            { icon: Shield, title: "Security", desc: "Enterprise-grade role-based access control protecting your sensitive asset data." },
            { icon: Zap, title: "Performance", desc: "Built on a modern stack ensuring lightning-fast interactions and reliability." },
          ].map((feature, i) => (
            <div key={i} className="group p-8 bg-white border border-zinc-200 hover:border-zinc-300 transition-all rounded-2xl">
              <div className="w-12 h-12 bg-zinc-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-zinc-100 transition-colors">
                <feature.icon size={24} className="text-zinc-900" />
              </div>
              <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
              <p className="text-zinc-500 leading-relaxed text-sm">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full px-6 md:px-12 py-32">
        <div className="w-full bg-zinc-900 text-white rounded-3xl p-12 md:p-24 overflow-hidden relative">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Ready to modernize your workflow?
            </h2>
            <p className="text-xl text-zinc-400 mb-10 leading-relaxed">
              Join forward-thinking organizations using APMS to take control of their physical infrastructure.
            </p>
            <Link href="/login" className="inline-flex px-8 py-4 bg-white text-black font-medium rounded-full hover:bg-zinc-200 transition-all items-center gap-2">
              Create Account <ArrowRight size={18} />
            </Link>
          </div>
          
          {/* Abstract Pattern */}
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-white">
              <circle cx="100" cy="0" r="50" stroke="currentColor" strokeWidth="2" />
              <circle cx="100" cy="0" r="30" stroke="currentColor" strokeWidth="2" />
              <circle cx="100" cy="0" r="70" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full px-6 md:px-12 py-12 border-t border-zinc-100">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-zinc-900 flex items-center justify-center">
              <Package size={12} className="text-white" />
            </div>
            <span className="text-sm font-bold tracking-tight">APMS</span>
          </div>
          <p className="text-sm text-zinc-500">
            © 2026 Asset & Property Management System. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-sm text-zinc-500 hover:text-zinc-900">Privacy</Link>
            <Link href="#" className="text-sm text-zinc-500 hover:text-zinc-900">Terms</Link>
            <Link href="#" className="text-sm text-zinc-500 hover:text-zinc-900">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
