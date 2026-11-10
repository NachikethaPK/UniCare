import { Link } from "react-router-dom";

/**
 * UniCare Bespoke Vector Emblem
 * Conceptual Elements:
 * 1. Unified Heart-Shield (Human & Family Outpatient Care)
 * 2. Precision Clinical Cross (Medical Architecture & Certified Practitioners)
 * 3. Emergency Vitality Spark (Blood Donor Network & Urgent Response)
 * 4. Ascending Companion Pods (Pet Healthcare & Veterinary Records)
 * 5. Baseline 'U' Foundation (UniCare Platform Unity)
 */
export function UniCareMark({ className = "w-6 h-6", glow = false }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        {/* Clinical Blue to Cyan Gradient */}
        <linearGradient id="uc-primary-grad" x1="8" y1="8" x2="40" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="50%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>

        {/* Emergency Life Pulse Gradient */}
        <linearGradient id="uc-vitality-grad" x1="20" y1="18" x2="28" y2="26" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F43F5E" />
          <stop offset="100%" stopColor="#FB7185" />
        </linearGradient>

        {/* Pet Healthcare Emerald Gradient */}
        <linearGradient id="uc-pet-grad" x1="32" y1="5" x2="44" y2="18" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#34D399" />
        </linearGradient>

        {/* Subtle Depth Shadow */}
        <filter id="uc-shadow" x="-10%" y="-10%" width="120%" height="120%" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1" floodColor="#0F172A" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Main Heart-Shield Body */}
      <path
        d="M 24 41 C 21 38 9 29 9 18 C 9 11.5 14 7.5 19.5 7.5 C 22.2 7.5 23.8 8.9 24 9.3 C 24.2 8.9 25.8 7.5 28.5 7.5 C 34 7.5 39 11.5 39 18 C 39 29 27 38 24 41 Z"
        fill="url(#uc-primary-grad)"
        filter="url(#uc-shadow)"
      />

      {/* Clinical Cross (Pure Crisp White) */}
      <path
        d="M 24 15.5 V 28.5 M 17.5 22 H 30.5"
        stroke="#FFFFFF"
        strokeWidth="3.2"
        strokeLinecap="round"
      />

      {/* Center Emergency Blood / Pulse Node */}
      <circle cx="24" cy="22" r="2.2" fill="url(#uc-vitality-grad)" />

      {/* Pet Healthcare & Dependents Satellite Pods (Paw signature on upper-right arc) */}
      <circle cx="34.8" cy="7.2" r="1.8" fill="url(#uc-pet-grad)" />
      <circle cx="39.2" cy="10.8" r="2.1" fill="url(#uc-pet-grad)" />
      <circle cx="41.5" cy="15.8" r="1.8" fill="url(#uc-pet-grad)" />
    </svg>
  );
}

/**
 * UniCare Logo Component
 * Combines the bespoke mark with refined typography.
 * Supports multiple size presets, optional subtitles, and links.
 */
function UniCareLogo({
  size = "md", // "sm" | "md" | "lg"
  subtitle = "Health", // "Health" | "Platform" | "Portal" | null
  asLink = true,
  to = "/",
  onClick,
  className = "",
  inverted = false, // When on dark backgrounds
}) {
  // Preset Dimensions
  const sizes = {
    sm: {
      badge: "w-7 h-7 rounded-lg",
      icon: "w-5 h-5",
      title: "text-base",
      sub: "text-[9px]",
    },
    md: {
      badge: "w-8 h-8 rounded-xl",
      icon: "w-6 h-6",
      title: "text-lg",
      sub: "text-[10px]",
    },
    lg: {
      badge: "w-10 h-10 rounded-2xl",
      icon: "w-7 h-7",
      title: "text-xl",
      sub: "text-xs",
    },
  };

  const currentSize = sizes[size] || sizes.md;

  const content = (
    <div className={`flex items-center gap-2.5 group ${className}`}>
      {/* Icon Badge Container */}
      <div
        className={`${currentSize.badge} bg-slate-900/95 dark:bg-slate-800/90 border border-slate-700/60 dark:border-slate-700 flex items-center justify-center shadow-sm transition-all duration-200 group-hover:scale-105 group-hover:border-blue-500/50 group-hover:shadow-blue-500/20`}
      >
        <UniCareMark className={currentSize.icon} />
      </div>

      {/* Brand Typography */}
      <div className="flex items-baseline gap-1.5 leading-none">
        <span
          className={`font-black ${currentSize.title} tracking-tight ${
            inverted
              ? "text-white"
              : "text-slate-900 dark:text-white"
          }`}
        >
          Uni<span className="text-blue-600 dark:text-blue-400">Care</span>
        </span>
        {subtitle && (
          <span
            className={`font-semibold uppercase tracking-wider ${currentSize.sub} ${
              inverted
                ? "text-slate-400"
                : "text-slate-400 dark:text-slate-400"
            }`}
          >
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );

  if (!asLink) {
    return <div onClick={onClick}>{content}</div>;
  }

  return (
    <Link to={to} onClick={onClick} className="inline-flex items-center">
      {content}
    </Link>
  );
}

export default UniCareLogo;
