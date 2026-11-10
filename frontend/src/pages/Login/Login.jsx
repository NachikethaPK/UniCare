import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FiMail,
  FiLock,
  FiAlertCircle,
  FiActivity,
  FiArrowRight,
  FiUser,
  FiPlusSquare,
  FiShield,
} from "react-icons/fi";
import ThemeToggle from "../../components/common/ThemeToggle";

function Login() {
  const [roleTab, setRoleTab] = useState("patient"); // "patient" or "hospital"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectFrom = location.state?.from;
  const noticeMessage = location.state?.message;

  useEffect(() => {
    if (user) {
      const destination = redirectFrom || (user.role === "hospital" ? "/blood" : "/dashboard");
      navigate(destination, { replace: true });
    }
  }, [user, redirectFrom, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      const destination = redirectFrom || (result.user?.role === "hospital" ? "/blood" : "/dashboard");
      navigate(destination, { replace: true });
    } else {
      setError(result.message);
    }
  };

  const handleDemoHospitalLogin = async (demoEmail) => {
    setError("");
    setLoading(true);
    setEmail(demoEmail);
    setPassword("password123");
    const result = await login(demoEmail, "password123");
    setLoading(false);
    if (result.success) {
      const destination = redirectFrom || "/blood";
      navigate(destination, { replace: true });
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-6 py-12 transition-colors relative">
      {/* Top Controls */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2">
        <ThemeToggle />
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 w-full max-w-md transition-colors">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2.5 text-slate-900 dark:text-white group mb-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <FiActivity className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">UniCare</span>
          </Link>

          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {roleTab === "hospital" ? "Hospital & Blood Bank Portal" : "Sign in to your account"}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            {roleTab === "hospital"
              ? "Publish emergency blood requests & manage donor matches"
              : "Access your clinical records, blood radar & appointments"}
          </p>
        </div>

        {/* Security Notice from Protected Route or Learn More redirection */}
        {noticeMessage && !error && (
          <div className="mb-5 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900/60 text-blue-700 dark:text-blue-300 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2.5">
            <FiShield className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>{noticeMessage}</span>
          </div>
        )}

        {/* Role Toggle Switcher */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => {
              setRoleTab("patient");
              setError("");
              setEmail("");
              setPassword("");
            }}
            className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition ${
              roleTab === "patient"
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <FiUser className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Patient / Donor</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setRoleTab("hospital");
              setError("");
              setEmail("");
              setPassword("");
            }}
            className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition ${
              roleTab === "hospital"
                ? "bg-white dark:bg-slate-700 text-rose-700 dark:text-rose-400 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <FiPlusSquare className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            <span>Hospital Sign In</span>
          </button>
        </div>

        {/* Hospital Quick Demo Helpers */}
        {roleTab === "hospital" && (
          <div className="mb-5 p-3.5 bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/50 rounded-xl">
            <p className="text-[11px] font-bold uppercase tracking-wider text-rose-800 dark:text-rose-300 mb-2 flex items-center gap-1.5">
              <span>⚡ One-Click Hospital Demo Login</span>
            </p>
            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => handleDemoHospitalLogin("apollo@hospital.unicare")}
                className="w-full text-left px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-900/50 hover:border-rose-400 dark:hover:border-rose-600 text-slate-800 dark:text-slate-200 font-medium flex items-center justify-between transition hover:shadow-xs"
              >
                <span>Apollo Hospital (Bannerghatta)</span>
                <span className="text-[10px] text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded">Sign in</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoHospitalLogin("manipal@hospital.unicare")}
                className="w-full text-left px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-900/50 hover:border-rose-400 dark:hover:border-rose-600 text-slate-800 dark:text-slate-200 font-medium flex items-center justify-between transition hover:shadow-xs"
              >
                <span>Manipal Hospital (Old Airport Rd)</span>
                <span className="text-[10px] text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded">Sign in</span>
              </button>
            </div>
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="mb-6 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2.5">
            <FiAlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              {roleTab === "hospital" ? "Official Hospital Email" : "Email Address"}
            </label>
            <div className="relative">
              <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
              <input
                type="email"
                placeholder={roleTab === "hospital" ? "desk@apollo.unicare" : "name@example.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-blue-500 bg-slate-50/50 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 transition"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Password
              </label>
            </div>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-blue-500 bg-slate-50/50 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 transition"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-medium py-2.5 rounded-lg transition shadow-xs flex items-center justify-center gap-2 text-xs sm:text-sm mt-6 active:scale-[0.99] ${
              roleTab === "hospital"
                ? "bg-rose-700 hover:bg-rose-800 dark:bg-rose-700 dark:hover:bg-rose-600"
                : "bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500"
            }`}
          >
            <span>
              {loading
                ? "Authenticating..."
                : roleTab === "hospital"
                ? "Sign into Hospital Desk"
                : "Sign in"}
            </span>
            {!loading && <FiArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center pt-6 border-t border-slate-100 dark:border-slate-800 space-y-2">
          {roleTab === "hospital" ? (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              New Hospital / Medical Institution?{" "}
              <Link
                to="/signup?role=hospital"
                state={location.state}
                className="font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700"
              >
                Register your hospital
              </Link>
            </p>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Don't have an account?{" "}
              <Link
                to="/signup"
                state={location.state}
                className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700"
              >
                Create account
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
