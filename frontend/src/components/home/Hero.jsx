import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiShield,
  FiActivity,
  FiUserCheck,
  FiDroplet,
  FiCalendar,
  FiCheckCircle,
} from "react-icons/fi";

function Hero() {
  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-slate-50 border-b border-slate-200/60">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column - Copy & CTA */}
          <div className="lg:col-span-7 text-left space-y-6">
            
            {/* Minimalist Platform Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold tracking-wide">
              <FiShield className="w-3.5 h-3.5 text-blue-600" />
              <span>Unified Clinical Architecture · HIPAA Compliant</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
              The intelligent health platform for{" "}
              <span className="text-blue-600">families & pets</span>.
            </h1>

            {/* Description */}
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
              Consolidate outpatient consultations, encrypted health records, urgent blood donor
              coordination, and veterinary timelines into one streamlined, precision-engineered system.
            </p>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-5 py-3 rounded-lg shadow-sm hover:shadow transition active:scale-[0.99]"
              >
                <span>Get started free</span>
                <FiArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="#features"
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-medium text-sm px-5 py-3 rounded-lg shadow-sm transition"
              >
                <span>Explore platform</span>
              </a>
            </div>

            {/* Trust Metrics Bar */}
            <div className="pt-6 border-t border-slate-200/80 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <FiCheckCircle className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                <span>256-Bit Encrypted Records</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FiCheckCircle className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                <span>Board-Certified Specialists</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FiCheckCircle className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                <span>Instant Emergency Dispatch</span>
              </div>
            </div>

          </div>

          {/* Right Column - Streamlined UI Artifact Mockup */}
          <div className="lg:col-span-5 relative">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6 space-y-4">
              
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Live Clinical Feed
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                  REAL-TIME SYNC
                </span>
              </div>

              {/* Consultation Card */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-base font-semibold">
                    <FiUserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Dr. Sarah Chen, MD</h4>
                    <p className="text-[11px] text-slate-500">Cardiology Specialist · Confirmed</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                    Tomorrow, 10:30 AM
                  </span>
                </div>
              </div>

              {/* Blood Donor Match Status */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                    <FiDroplet className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Blood Donor Network</h4>
                    <p className="text-[11px] text-slate-500">O-Negative Match Active</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                  3 Donors Nearby
                </span>
              </div>

              {/* Pet Healthcare Record */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <FiActivity className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Veterinary Schedule · Bruno</h4>
                    <p className="text-[11px] text-slate-500">Core Rabies & DHPP Booster</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                  Up-to-Date
                </span>
              </div>

              {/* Bottom Quick Metric Bar */}
              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 font-medium px-1">
                <span>System Status: 100% Operational</span>
                <span className="text-slate-400">UniCare OS v2.4</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;