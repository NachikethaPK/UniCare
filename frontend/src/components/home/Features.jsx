import { Link } from "react-router-dom";
import {
  FiCpu,
  FiDroplet,
  FiHeart,
  FiFileText,
  FiCalendar,
  FiShield,
  FiArrowRight,
} from "react-icons/fi";

function Features() {
  const features = [
    {
      icon: <FiCpu className="w-5 h-5 text-blue-600" />,
      iconBg: "bg-blue-50 border-blue-100",
      title: "AI Clinical Triage & Assistant",
      tag: "Neural Intelligence",
      description:
        "Structured preliminary symptom evaluation, interactive health guidance, and automated triage powered by clinical NLP models.",
      link: "/ai-assistant",
    },
    {
      icon: <FiDroplet className="w-5 h-5 text-rose-600" />,
      iconBg: "bg-rose-50 border-rose-100",
      title: "Emergency Blood Donor Network",
      tag: "Real-Time Matching",
      description:
        "Geospatial blood donor routing, automated compatibility verification, and immediate high-priority emergency broadcasts.",
      link: "/blood-donation",
    },
    {
      icon: <FiHeart className="w-5 h-5 text-emerald-600" />,
      iconBg: "bg-emerald-50 border-emerald-100",
      title: "Comprehensive Pet Healthcare",
      tag: "Veterinary Records",
      description:
        "Dedicated veterinary profiles, automated vaccination reminders, dietary tracking, and certified veterinarian booking.",
      link: "/pet-dashboard",
    },
    {
      icon: <FiFileText className="w-5 h-5 text-indigo-600" />,
      iconBg: "bg-indigo-50 border-indigo-100",
      title: "Encrypted Health Vault",
      tag: "Zero-Knowledge Sync",
      description:
        "Store, organize, and securely share clinical laboratory reports, prescriptions, and historical records with granular permissions.",
      link: "/records",
    },
    {
      icon: <FiCalendar className="w-5 h-5 text-cyan-600" />,
      iconBg: "bg-cyan-50 border-cyan-100",
      title: "Precision Appointment Scheduling",
      tag: "Multi-Specialty",
      description:
        "Direct calendar synchronization with verified physicians, automated SMS/email reminders, and instant rescheduling.",
      link: "/appointments",
    },
    {
      icon: <FiShield className="w-5 h-5 text-slate-700" />,
      iconBg: "bg-slate-100 border-slate-200",
      title: "Family Multi-Profile Sharing",
      tag: "Delegated Access",
      description:
        "Manage healthcare records for children, elderly parents, and dependents under a single unified dashboard with shared oversight.",
      link: "/profile",
    },
  ];

  return (
    <section id="features" className="py-20 md:py-28 bg-white border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-16 text-left">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-2">
            Core Capabilities
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Engineered for clinical precision and everyday peace of mind.
          </h2>
          <p className="mt-3 text-slate-600 text-base leading-relaxed">
            Every module is designed to eliminate friction between patients, certified practitioners, and urgent emergency responders.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-7 hover:bg-white hover:border-slate-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div
                    className={`w-11 h-11 rounded-xl border flex items-center justify-center ${feature.iconBg}`}
                  >
                    {feature.icon}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 bg-white border border-slate-200 px-2.5 py-0.5 rounded-md">
                    {feature.tag}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-2">
                  {feature.title}
                </h3>

                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  {feature.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between">
                <Link
                  to={feature.link}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 group-hover:text-blue-700 transition-colors"
                >
                  <span>Learn more</span>
                  <FiArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Features;