import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FiUser,
  FiMail,
  FiLock,
  FiAlertCircle,
  FiActivity,
  FiArrowRight,
  FiPlusSquare,
  FiMapPin,
  FiPhone,
  FiShield,
  FiNavigation,
  FiCheckCircle,
  FiLoader,
} from "react-icons/fi";
import ThemeToggle from "../../components/common/ThemeToggle";
import { quickValidateEmail, verifyEmailLegitimacy } from "../../utils/emailValidator";

function Signup() {
  const [searchParams] = useSearchParams();
  const [roleTab, setRoleTab] = useState(searchParams.get("role") === "hospital" ? "hospital" : "patient");

  // Patient Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Hospital Specific Fields
  const [hospitalName, setHospitalName] = useState("");
  const [licenseNo, setLicenseNo] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Bangalore");
  const [phone, setPhone] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [lat, setLat] = useState(12.9716);
  const [lng, setLng] = useState(77.5946);
  const [gpsStatus, setGpsStatus] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailStatus, setEmailStatus] = useState({ checking: false, valid: null, message: "" });
  const { user, register } = useAuth();
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

  useEffect(() => {
    if (searchParams.get("role") === "hospital") {
      setRoleTab("hospital");
    }
  }, [searchParams]);

  const validateCurrentEmail = async (val) => {
    const targetEmail = (val !== undefined ? val : email).trim();
    if (!targetEmail) {
      setEmailStatus({ checking: false, valid: null, message: "" });
      return null;
    }

    const quick = quickValidateEmail(targetEmail);
    if (!quick.valid) {
      setEmailStatus({ checking: false, valid: false, message: quick.reason });
      return quick;
    }

    setEmailStatus({ checking: true, valid: null, message: "Verifying email domain & MX records..." });
    const result = await verifyEmailLegitimacy(targetEmail);

    if (result.valid) {
      setEmailStatus({
        checking: false,
        valid: true,
        message: result.isDemo ? "Demo domain verified." : "Email domain verified with active mail servers.",
      });
    } else {
      setEmailStatus({
        checking: false,
        valid: false,
        message: result.reason || "Invalid email or unverified mail server.",
      });
    }
    return result;
  };

  const detectLocation = () => {
    if (navigator.geolocation) {
      setGpsStatus("Detecting coordinates...");
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(parseFloat(pos.coords.latitude.toFixed(4)));
          setLng(parseFloat(pos.coords.longitude.toFixed(4)));
          setGpsStatus("GPS Coordinates verified!");
          setTimeout(() => setGpsStatus(""), 3000);
        },
        () => {
          setGpsStatus("Could not detect GPS. Using default city coordinates.");
          setTimeout(() => setGpsStatus(""), 3000);
        }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate email before submitting
    const emailValidation = await validateCurrentEmail();
    if (emailValidation && !emailValidation.valid) {
      setError(emailValidation.reason || "Please provide a valid, deliverable email address.");
      return;
    }

    setLoading(true);

    let result;
    if (roleTab === "hospital") {
      const hospitalDetails = {
        licenseNo: licenseNo.trim(),
        address: address.trim(),
        city: city.trim(),
        lat: Number(lat),
        lng: Number(lng),
        phone: phone.trim(),
        emergencyContact: emergencyContact.trim() || phone.trim(),
      };
      result = await register(hospitalName, email, password, "hospital", hospitalDetails);
    } else {
      result = await register(name, email, password, "patient");
    }

    setLoading(false);
    if (result.success) {
      const destination = redirectFrom || (roleTab === "hospital" ? "/blood" : "/dashboard");
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

      <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 w-full max-w-lg transition-colors">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2.5 text-slate-900 dark:text-white group mb-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <FiActivity className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">UniCare</span>
          </Link>

          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {roleTab === "hospital" ? "Register Your Hospital" : "Create your account"}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            {roleTab === "hospital"
              ? "Join the emergency blood network to publish requests and connect with donors"
              : "Join the unified healthcare operating platform"}
          </p>
        </div>

        {/* Security Notice from Protected Route or Learn More redirection */}
        {noticeMessage && !error && (
          <div className="mb-5 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900/60 text-blue-700 dark:text-blue-300 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2.5">
            <FiShield className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>{noticeMessage}</span>
          </div>
        )}

        {/* Role Switcher */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => {
              setRoleTab("patient");
              setError("");
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
            }}
            className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition ${
              roleTab === "hospital"
                ? "bg-white dark:bg-slate-700 text-rose-700 dark:text-rose-400 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <FiPlusSquare className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            <span>Hospital Registration</span>
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-6 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2.5">
            <FiAlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {roleTab === "patient" ? (
            /* Patient Fields */
            <>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Full Legal Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="e.g. Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-blue-500 bg-slate-50/50 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailStatus.valid !== null) setEmailStatus({ checking: false, valid: null, message: "" });
                    }}
                    onBlur={() => validateCurrentEmail()}
                    className={`w-full border text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg pl-10 pr-10 py-2.5 text-xs sm:text-sm focus:outline-none transition ${
                      emailStatus.valid === true
                        ? "border-emerald-500 focus:border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20"
                        : emailStatus.valid === false
                        ? "border-rose-500 focus:border-rose-500 bg-rose-50/20 dark:bg-rose-950/20"
                        : "border-slate-200 dark:border-slate-700 focus:border-blue-500 bg-slate-50/50 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800"
                    }`}
                    required
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {emailStatus.checking && <FiLoader className="w-4 h-4 text-blue-500 animate-spin" />}
                    {emailStatus.valid === true && <FiCheckCircle className="w-4 h-4 text-emerald-500" />}
                    {emailStatus.valid === false && <FiAlertCircle className="w-4 h-4 text-rose-500" />}
                  </div>
                </div>
                {emailStatus.message && (
                  <p
                    className={`mt-1.5 text-[11px] flex items-center gap-1.5 ${
                      emailStatus.valid === true
                        ? "text-emerald-600 dark:text-emerald-400 font-medium"
                        : emailStatus.valid === false
                        ? "text-rose-600 dark:text-rose-400 font-medium"
                        : "text-blue-600 dark:text-blue-400"
                    }`}
                  >
                    <span>{emailStatus.message}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
                  <input
                    type="password"
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-blue-500 bg-slate-50/50 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 transition"
                    required
                  />
                </div>
              </div>
            </>
          ) : (
            /* Hospital Fields */
            <>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Hospital / Institution Name
                </label>
                <div className="relative">
                  <FiPlusSquare className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="e.g. Manipal Super Speciality Hospital"
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    className="w-full border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-rose-500 bg-slate-50/50 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 transition"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Official Email
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
                    <input
                      type="email"
                      placeholder="blooddesk@hospital.org"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailStatus.valid !== null) setEmailStatus({ checking: false, valid: null, message: "" });
                      }}
                      onBlur={() => validateCurrentEmail()}
                      className={`w-full border text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg pl-10 pr-10 py-2.5 text-xs sm:text-sm focus:outline-none transition ${
                        emailStatus.valid === true
                          ? "border-emerald-500 focus:border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20"
                          : emailStatus.valid === false
                          ? "border-rose-500 focus:border-rose-500 bg-rose-50/20 dark:bg-rose-950/20"
                          : "border-slate-200 dark:border-slate-700 focus:border-rose-500 bg-slate-50/50 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800"
                      }`}
                      required
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {emailStatus.checking && <FiLoader className="w-4 h-4 text-blue-500 animate-spin" />}
                      {emailStatus.valid === true && <FiCheckCircle className="w-4 h-4 text-emerald-500" />}
                      {emailStatus.valid === false && <FiAlertCircle className="w-4 h-4 text-rose-500" />}
                    </div>
                  </div>
                  {emailStatus.message && (
                    <p
                      className={`mt-1.5 text-[11px] flex items-center gap-1.5 ${
                        emailStatus.valid === true
                          ? "text-emerald-600 dark:text-emerald-400 font-medium"
                          : emailStatus.valid === false
                          ? "text-rose-600 dark:text-rose-400 font-medium"
                          : "text-blue-600 dark:text-blue-400"
                      }`}
                    >
                      <span>{emailStatus.message}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    NABH / License No.
                  </label>
                  <div className="relative">
                    <FiShield className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="e.g. NABH-2024-912"
                      value={licenseNo}
                      onChange={(e) => setLicenseNo(e.target.value)}
                      className="w-full border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-rose-500 bg-slate-50/50 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 transition"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
                  <input
                    type="password"
                    placeholder="Create hospital portal password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-rose-500 bg-slate-50/50 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Full Hospital Address & Campus
                </label>
                <div className="relative">
                  <FiMapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="e.g. 154/11, Bannerghatta Main Rd, Bangalore"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-rose-500 bg-slate-50/50 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 transition"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    City / Region
                  </label>
                  <input
                    type="text"
                    placeholder="Bangalore"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg px-3 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-rose-500 bg-slate-50/50 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Blood Desk Helpline
                  </label>
                  <div className="relative">
                    <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="+91 80 2630 4055"
                      value={emergencyContact}
                      onChange={(e) => setEmergencyContact(e.target.value)}
                      className="w-full border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-rose-500 bg-slate-50/50 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 transition"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Map Coordinates & GPS detector */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <FiNavigation className="text-rose-600 dark:text-rose-400" /> Google Maps Pin Coordinates
                  </span>
                  <button
                    type="button"
                    onClick={detectLocation}
                    className="text-[11px] text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold"
                  >
                    📍 Detect GPS
                  </button>
                </div>
                {gpsStatus && <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">{gpsStatus}</p>}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-500 dark:text-slate-400">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      value={lat}
                      onChange={(e) => setLat(e.target.value)}
                      className="w-full border border-slate-200 dark:border-slate-700 rounded-md p-1.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 dark:text-slate-400">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      value={lng}
                      onChange={(e) => setLng(e.target.value)}
                      className="w-full border border-slate-200 dark:border-slate-700 rounded-md p-1.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

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
                ? "Registering..."
                : roleTab === "hospital"
                ? "Complete Hospital Registration"
                : "Create account"}
            </span>
            {!loading && <FiArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center pt-6 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Already have an account?{" "}
            <Link
              to={roleTab === "hospital" ? "/login?role=hospital" : "/login"}
              state={location.state}
              className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;