import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FiCpu,
  FiDroplet,
  FiHeart,
  FiFileText,
  FiCalendar,
  FiShield,
  FiArrowRight,
  FiLock,
} from "react-icons/fi";

function Features() {
  const { user } = useAuth();

  const features = [
    {
      icon: <FiCpu className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      iconBg: "bg-blue-50 dark:bg-blue-950/60 border-blue-100 dark:border-blue-900/50",
      title: "AI Clinical Triage & Assistant",
      tag: "Neural Intelligence",
      description:
        "Structured preliminary symptom evaluation, interactive health guidance, and automated triage powered by clinical NLP models.",
      link: "/ai",
    },
    {
      icon: <FiDroplet className="w-5 h-5 text-rose-600 dark:text-rose-400" />,
      iconBg: "bg-rose-50 dark:bg-rose-950/60 border-rose-100 dark:border-rose-900/50",
      title: "Emergency Blood Donor Network",
      tag: "Real-Time Matching",
      description:
        "Geospatial blood donor routing, automated compatibility verification, and immediate high-priority emergency broadcasts.",
      link: "/blood",
    },
    {
      icon: <FiHeart className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      iconBg: "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-100 dark:border-emerald-900/50",
      title: "Comprehensive Pet Healthcare",
      tag: "Veterinary Records",
      description:
        "Dedicated veterinary profiles, automated vaccination reminders, dietary tracking, and certified veterinarian booking.",
      link: "/pets",
    },
    {
      icon: <FiFileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      iconBg: "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-100 dark:border-indigo-900/50",
      title: "Encrypted Health Vault",
      tag: "Zero-Knowledge Sync",
      description:
        "Store, organize, and securely share clinical laboratory reports, prescriptions, and historical records with granular permissions.",
      link: "/records",
    },
    {
      icon: <FiCalendar className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />,
      iconBg: "bg-cyan-50 dark:bg-cyan-950/60 border-cyan-100 dark:border-cyan-900/50",
      title: "Precision Appointment Scheduling",
      tag: "Multi-Specialty",
      description:
        "Direct calendar synchronization with verified physicians, automated SMS/email reminders, and instant rescheduling.",
      link: "/appointments",
    },
    {
      icon: <FiShield className="w-5 h-5 text-slate-700 dark:text-slate-300" />,
      iconBg: "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700",
      title: "Family Multi-Profile Sharing",
      tag: "Delegated Access",
      description:
        "Manage healthcare records for children, elderly parents, and dependents under a single unified dashboard with shared oversight.",
      link: "/profile",
    },
  ];

  return (
    <section id="features" className="py-20 md:py-28 bg-white dark:bg-slate-900 border-b border-slate-200/60 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-16 text-left">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
            Core Capabilities
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Engineered for clinical precision and everyday peace of mind.
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300 text-base leading-relaxed">
            Every module is designed to eliminate friction between patients, certified practitioners, and urgent emergency responders.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl p-7 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div
                    className={`w-11 h-11 rounded-xl border flex items-center justify-center ${feature.iconBg}`}
                  >
                    {feature.icon}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-0.5 rounded-md">
                    {feature.tag}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight mb-2">
                  {feature.title}
                </h3>

                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                  {feature.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                <Link
                  to={user ? feature.link : "/login"}
                  state={
                    !user
                      ? {
                          from: feature.link,
                          message: `Please sign in to access ${feature.title}.`,
                        }
                      : undefined
                  }
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors"
                >
                  <span>Learn more</span>
                  {user ? (
                    <FiArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  ) : (
                    <FiLock className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors" />
                  )}
                </Link>

                {!user && (
                  <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                    Sign in required
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Features;
