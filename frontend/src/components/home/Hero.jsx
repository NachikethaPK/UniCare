import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiShield,
  FiCheckCircle,
} from "react-icons/fi";
import { UniCareMark } from "../common/UniCareLogo";

function Hero() {
  return (
    <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden bg-slate-50 dark:bg-slate-950 border-b border-slate-200/60 dark:border-slate-800 transition-colors">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 dark:opacity-20 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10 text-center space-y-6">
        {/* Minimalist Platform Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-semibold tracking-wide shadow-xs">
          <UniCareMark className="w-4 h-4" />
          <span>Unified Clinical Architecture · HIPAA Compliant</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.12] max-w-4xl mx-auto">
          The intelligent health platform for{" "}
          <span className="text-blue-600 dark:text-blue-400">families & pets</span>.
        </h1>

        {/* Description */}
        <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
          Consolidate outpatient consultations, encrypted health records, urgent blood donor
          coordination, and veterinary timelines into one streamlined, precision-engineered system.
        </p>

        {/* Primary Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3.5">
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-medium text-sm px-6 py-3 rounded-lg shadow-sm hover:shadow transition active:scale-[0.99]"
          >
            <span>Get started free</span>
            <FiArrowRight className="w-4 h-4" />
          </Link>

          <a
            href="#features"
            className="inline-flex items-center gap-2 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-medium text-sm px-6 py-3 rounded-lg shadow-sm transition"
          >
            <span>Explore platform</span>
          </a>
        </div>

        {/* Trust Metrics Bar */}
        <div className="pt-8 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <div className="flex items-center gap-1.5">
            <FiCheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
            <span>256-Bit Encrypted Records</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FiCheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
            <span>Board-Certified Specialists</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FiCheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
            <span>Instant Emergency Dispatch</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;