import { FiActivity, FiHeart, FiAlertCircle, FiCheck } from "react-icons/fi";

function Services() {
  const services = [
    {
      icon: <FiActivity className="w-6 h-6 text-blue-600" />,
      title: "Human Healthcare",
      subtitle: "Outpatient & Telehealth Ecosystem",
      points: [
        "Direct specialist appointment scheduling",
        "Encrypted digital health record management",
        "Automated prescription reminders and refills",
        "Continuous vital sign telemetry tracking",
      ],
    },
    {
      icon: <FiHeart className="w-6 h-6 text-emerald-600" />,
      title: "Pet Healthcare",
      subtitle: "Veterinary Medicine & Wellness",
      points: [
        "Rabies, DHPP, and core vaccine schedules",
        "Veterinary history & diagnostic imaging",
        "Breed-specific dietary recommendations",
        "Emergency pet clinic locator and routing",
      ],
    },
    {
      icon: <FiAlertCircle className="w-6 h-6 text-rose-600" />,
      title: "Emergency Services",
      subtitle: "Urgent Care & Rapid Dispatch",
      points: [
        "Geospatial blood donation matching",
        "High-priority donor broadcast alerts",
        "24/7 verified emergency hospital routing",
        "Instant family SOS notifications",
      ],
    },
  ];

  return (
    <section id="services" className="py-20 md:py-28 bg-slate-50 border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-16 text-left">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-2">
            Integrated Solutions
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Comprehensive care paths, unified in one platform.
          </h2>
          <p className="mt-3 text-slate-600 text-base leading-relaxed">
            Eliminating fragmented patient portals with an interconnected standard for clinical and veterinary excellence.
          </p>
        </div>

        {/* Services 3-Card Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white border border-slate-200/90 rounded-2xl p-8 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center mb-6">
                  {service.icon}
                </div>

                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  {service.title}
                </h3>

                <p className="text-xs font-medium text-slate-500 mt-1 mb-6">
                  {service.subtitle}
                </p>

                <div className="h-px bg-slate-100 mb-6" />

                <ul className="space-y-3.5 text-sm text-slate-600">
                  {service.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-4 h-4 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center mt-0.5 shrink-0">
                        <FiCheck className="w-2.5 h-2.5 text-blue-600 stroke-[3]" />
                      </div>
                      <span className="leading-snug">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>Enterprise SLA</span>
                <span className="text-emerald-600 font-semibold">Active</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Services;