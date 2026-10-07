import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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
} from "react-icons/fi";
import ThemeToggle from "../../components/common/ThemeToggle";

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
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get("role") === "hospital") {
      setRoleTab("hospital");
    }
  }, [searchParams]);

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
        (err) => {
          setGpsStatus("Could not detect GPS. Using default city coordinates.");
          setTimeout(() => setGpsStatus(""), 3000);
        }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
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
      if (roleTab === "hospital") {
        navigate("/blood");
      } else {
        navigate("/dashboard");
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6 py-12 relative">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-slate-200/80 w-full max-w-lg">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2.5 text-slate-900 group mb-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <FiActivity className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900">UniCare</span>
          </Link>

          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {roleTab === "hospital" ? "Register Your Hospital" : "Create your account"}
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            {roleTab === "hospital"
              ? "Join the emergency blood network to publish requests and connect with donors"
              : "Join the unified healthcare operating platform"}
          </p>
        </div>

        {/* Role Switcher */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => {
              setRoleTab("patient");
              setError("");
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
            }}
            className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition ${
              roleTab === "hospital"
                ? "bg-white text-rose-700 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <FiPlusSquare className="w-3.5 h-3.5 text-rose-600" />
            <span>Hospital Registration</span>
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2.5">
            <FiAlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {roleTab === "patient" ? (
            /* Patient Fields */
            <>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Full Legal Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="e.g. Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-blue-500 bg-slate-50/50 focus:bg-white transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-blue-500 bg-slate-50/50 focus:bg-white transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="password"
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-blue-500 bg-slate-50/50 focus:bg-white transition"
                    required
                  />
                </div>
              </div>
            </>
          ) : (
            /* Hospital Fields */
            <>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Hospital / Institution Name
                </label>
                <div className="relative">
                  <FiPlusSquare className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="e.g. Manipal Super Speciality Hospital"
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-rose-500 bg-slate-50/50 focus:bg-white transition"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Official Email
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="email"
                      placeholder="blooddesk@hospital.org"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-rose-500 bg-slate-50/50 focus:bg-white transition"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    NABH / License No.
                  </label>
                  <div className="relative">
                    <FiShield className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="e.g. NABH-2024-912"
                      value={licenseNo}
                      onChange={(e) => setLicenseNo(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-rose-500 bg-slate-50/50 focus:bg-white transition"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="password"
                    placeholder="Create hospital portal password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-rose-500 bg-slate-50/50 focus:bg-white transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Full Hospital Address & Campus
                </label>
                <div className="relative">
                  <FiMapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="e.g. 154/11, Bannerghatta Main Rd, Bangalore"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-rose-500 bg-slate-50/50 focus:bg-white transition"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    City / Region
                  </label>
                  <input
                    type="text"
                    placeholder="Bangalore"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-rose-500 bg-slate-50/50 focus:bg-white transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Blood Desk Helpline
                  </label>
                  <div className="relative">
                    <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="+91 80 2630 4055"
                      value={emergencyContact}
                      onChange={(e) => setEmergencyContact(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-rose-500 bg-slate-50/50 focus:bg-white transition"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Map Coordinates & GPS detector */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <FiNavigation className="text-rose-600" /> Google Maps Pin Coordinates
                  </span>
                  <button
                    type="button"
                    onClick={detectLocation}
                    className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    📍 Detect GPS
                  </button>
                </div>
                {gpsStatus && <p className="text-[11px] text-emerald-600 font-semibold">{gpsStatus}</p>}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-500">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      value={lat}
                      onChange={(e) => setLat(e.target.value)}
                      className="w-full border border-slate-200 rounded-md p-1.5 bg-white text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      value={lng}
                      onChange={(e) => setLng(e.target.value)}
                      className="w-full border border-slate-200 rounded-md p-1.5 bg-white text-xs outline-none"
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
                ? "bg-rose-700 hover:bg-rose-800"
                : "bg-slate-900 hover:bg-slate-800"
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
        <div className="mt-6 text-center pt-6 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Already have an account?{" "}
            <Link
              to={roleTab === "hospital" ? "/login?role=hospital" : "/login"}
              className="font-semibold text-blue-600 hover:text-blue-700"
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