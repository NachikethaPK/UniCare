import { useTheme } from "../../context/ThemeContext";
import { FiSun, FiMoon } from "react-icons/fi";

export default function ThemeToggle({ className = "", showLabel = false }) {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={`group relative inline-flex items-center gap-2 p-1 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 select-none ${
        isDark
          ? "bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 shadow-inner"
          : "bg-slate-200/80 hover:bg-slate-200 border border-slate-300/80 shadow-inner"
      } ${className}`}
    >
      {/* Sliding Toggle Track & Knob */}
      <div className="relative w-12 h-6 flex items-center">
        {/* Track Icons in Background */}
        <div className="w-full flex justify-between px-1.5 text-[11px] pointer-events-none transition-opacity duration-200">
          <FiSun
            className={`transition-all duration-300 ${
              isDark ? "opacity-30 text-slate-400 scale-90" : "opacity-0 text-amber-500"
            }`}
          />
          <FiMoon
            className={`transition-all duration-300 ${
              isDark ? "opacity-0 text-indigo-300" : "opacity-30 text-slate-500 scale-90"
            }`}
          />
        </div>

        {/* Sliding Thumb */}
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 transform shadow-md group-hover:scale-105 group-active:scale-95 ${
            isDark
              ? "translate-x-6 bg-slate-950 text-indigo-300 border border-indigo-500/30 shadow-indigo-950/50"
              : "translate-x-0 bg-white text-amber-500 border border-amber-200/50 shadow-slate-400/30"
          }`}
        >
          {isDark ? (
            <FiMoon className="w-3 h-3 transform rotate-0 transition-transform duration-300" />
          ) : (
            <FiSun className="w-3 h-3 transform rotate-0 transition-transform duration-300 text-amber-500" />
          )}
        </span>
      </div>

      {showLabel && (
        <span className="text-xs font-semibold pr-2 text-slate-600 dark:text-slate-300">
          {isDark ? "Dark" : "Light"}
        </span>
      )}
    </button>
  );
}
