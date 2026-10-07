import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FiMail,
  FiLock,
  FiAlertCircle,
  FiActivity,
  FiArrowRight,
  FiUser,
  FiPlusSquare,
  FiCheckCircle,
} from "react-icons/fi";

function Login() {
  const [roleTab, setRoleTab] = useState("patient"); // "patient" or "hospital"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      if (result.user?.role === "hospital") {
        navigate("/blood");
      } else {
        navigate("/dashboard");
      }
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
      navigate("/blood");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6 py-12">
      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-slate-200/80 w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2.5 text-slate-900 group mb-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <FiActivity className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900">UniCare</span>
          </Link>

          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {roleTab === "hospital" ? "Hospital & Blood Bank Portal" : "Sign in to your account"}
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            {roleTab === "hospital"
              ? "Publish emergency blood requests & manage donor matches"
              : "Access your clinical records, blood radar & appointments"}
          </p>
        </div>

        {/* Role Toggle Switcher */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-6">
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
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <FiUser className="w-3.5 h-3.5 text-blue-600" />
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
                ? "bg-white text-rose-700 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <FiPlusSquare className="w-3.5 h-3.5 text-rose-600" />
            <span>Hospital Sign In</span>
          </button>
        </div>

        {/* Hospital Quick Demo Helpers */}
        {roleTab === "hospital" && (
          <div className="mb-5 p-3.5 bg-rose-50/70 border border-rose-200/80 rounded-xl">
            <p className="text-[11px] font-bold uppercase tracking-wider text-rose-800 mb-2 flex items-center gap-1.5">
              <span>⚡ One-Click Hospital Demo Login</span>
            </p>
            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => handleDemoHospitalLogin("apollo@hospital.unicare")}
                className="w-full text-left px-3 py-1.5 text-xs rounded-lg bg-white border border-rose-200 hover:border-rose-400 text-slate-800 font-medium flex items-center justify-between transition hover:shadow-xs"
              >
                <span>Apollo Hospital (Bannerghatta)</span>
                <span className="text-[10px] text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded">Sign in</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoHospitalLogin("manipal@hospital.unicare")}
                className="w-full text-left px-3 py-1.5 text-xs rounded-lg bg-white border border-rose-200 hover:border-rose-400 text-slate-800 font-medium flex items-center justify-between transition hover:shadow-xs"
              >
                <span>Manipal Hospital (Old Airport Rd)</span>
                <span className="text-[10px] text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded">Sign in</span>
              </button>
            </div>
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2.5">
            <FiAlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              {roleTab === "hospital" ? "Official Hospital Email" : "Email Address"}
            </label>
            <div className="relative">
              <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="email"
                placeholder={roleTab === "hospital" ? "desk@apollo.unicare" : "name@example.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-blue-500 bg-slate-50/50 focus:bg-white transition"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Password
              </label>
            </div>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-blue-500 bg-slate-50/50 focus:bg-white transition"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-medium py-2.5 rounded-lg transition shadow-xs flex items-center justify-center gap-2 text-xs sm:text-sm mt-6 active:scale-[0.99] ${
              roleTab === "hospital"
                ? "bg-rose-700 hover:bg-rose-800"
                : "bg-slate-900 hover:bg-slate-800"
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
        <div className="mt-6 text-center pt-6 border-t border-slate-100 space-y-2">
          {roleTab === "hospital" ? (
            <p className="text-xs text-slate-500">
              New Hospital / Medical Institution?{" "}
              <Link to="/signup?role=hospital" className="font-semibold text-rose-600 hover:text-rose-700">
                Register your hospital
              </Link>
            </p>
          ) : (
            <p className="text-xs text-slate-500">
              Don't have an account?{" "}
              <Link to="/signup" className="font-semibold text-blue-600 hover:text-blue-700">
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