import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FiMenu, FiX, FiArrowRight } from "react-icons/fi";
import ThemeToggle from "../common/ThemeToggle";
import UniCareLogo from "../common/UniCareLogo";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenu, setMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileMenu(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <UniCareLogo size="md" subtitle="Health" />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7">
          <Link
            to="/"
            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Home
          </Link>
          <a
            href="#features"
            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Platform
          </a>
          <a
            href="#services"
            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Solutions
          </a>
        </nav>

        {/* Action Controls */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          {user ? (
            <>
              {user.role === "doctor" ? (
                <Link
                  to="/doctor-portal"
                  className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 px-3.5 py-1.5 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition"
                >
                  Doctor Station
                </Link>
              ) : user.role === "hospital" ? (
                <Link
                  to="/hospital-portal"
                  className="text-sm font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 px-3.5 py-1.5 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/40 transition"
                >
                  Hospital Desk
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3.5 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 px-3.5 py-2 rounded-lg hover:bg-rose-50/60 dark:hover:bg-rose-950/40 transition cursor-pointer"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login?role=doctor"
                className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 px-2.5 py-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition flex items-center gap-1.5"
              >
                <span>Doctor</span>
              </Link>
              <Link
                to="/login?role=hospital"
                className="text-sm font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition flex items-center gap-1.5"
              >
                <span>Hospital</span>
              </Link>
              <Link
                to="/login"
                className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition active:scale-[0.99]"
              >
                <span>Get started</span>
                <FiArrowRight className="w-3.5 h-3.5" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-1">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Toggle navigation menu"
          >
            {mobileMenu ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenu && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-2.5">
            <Link
              to="/"
              onClick={() => setMobileMenu(false)}
              className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white py-1.5"
            >
              Home
            </Link>
            <a
              href="#features"
              onClick={() => setMobileMenu(false)}
              className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white py-1.5"
            >
              Platform
            </a>
            <a
              href="#services"
              onClick={() => setMobileMenu(false)}
              className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white py-1.5"
            >
              Solutions
            </a>
          </nav>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  to={user.role === "doctor" ? "/doctor-portal" : user.role === "hospital" ? "/hospital-portal" : "/dashboard"}
                  onClick={() => setMobileMenu(false)}
                  className={`w-full text-center text-white py-2.5 rounded-lg text-sm font-medium ${
                    user.role === "hospital" ? "bg-rose-700" : user.role === "doctor" ? "bg-emerald-600" : "bg-slate-900 dark:bg-blue-600"
                  }`}
                >
                  {user.role === "doctor"
                    ? "Open Doctor Station"
                    : user.role === "hospital"
                    ? "Open Hospital Desk"
                    : "Go to Dashboard"}
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-center border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login?role=doctor"
                    onClick={() => setMobileMenu(false)}
                    className="text-center bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 py-2 rounded-lg text-xs font-semibold"
                  >
                    Doctor Portal
                  </Link>
                  <Link
                    to="/login?role=hospital"
                    onClick={() => setMobileMenu(false)}
                    className="text-center bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 py-2 rounded-lg text-xs font-semibold"
                  >
                    Hospital Desk
                  </Link>
                </div>
                <Link
                  to="/login"
                  onClick={() => setMobileMenu(false)}
                  className="w-full text-center border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenu(false)}
                  className="w-full text-center bg-slate-900 dark:bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;