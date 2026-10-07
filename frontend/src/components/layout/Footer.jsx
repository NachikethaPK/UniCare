import { Link } from "react-router-dom";
import { FiActivity, FiMail, FiPhone, FiMapPin } from "react-icons/fi";

function Footer() {
  return (
    <footer id="contact" className="bg-slate-950 text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-12 gap-10">
        
        {/* Col 1: Brand & Status */}
        <div className="md:col-span-4 space-y-4">
          <Link to="/" className="flex items-center gap-2.5 text-white">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <FiActivity className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">UniCare</span>
          </Link>

          <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
            The unified healthcare operating system combining human medical records, veterinary profiles, and verified emergency blood matching.
          </p>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-medium text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>All Systems Operational · HIPAA Ready</span>
          </div>
        </div>

        {/* Col 2: Platform Links */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
            Platform
          </h4>
          <ul className="space-y-2 text-xs">
            <li><a href="#features" className="hover:text-white transition-colors">Core Architecture</a></li>
            <li><a href="#services" className="hover:text-white transition-colors">Specialist Network</a></li>
            <li><Link to="/blood-donation" className="hover:text-white transition-colors">Blood Donation Radar</Link></li>
            <li><Link to="/pet-dashboard" className="hover:text-white transition-colors">Veterinary Health Vault</Link></li>
            <li><Link to="/ai-assistant" className="hover:text-white transition-colors">AI Clinical Triage</Link></li>
          </ul>
        </div>

        {/* Col 3: Resources */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
            Account
          </h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/login" className="hover:text-white transition-colors">Patient Sign In</Link></li>
            <li><Link to="/signup" className="hover:text-white transition-colors">Create Account</Link></li>
            <li><Link to="/dashboard" className="hover:text-white transition-colors">Portal Dashboard</Link></li>
            <li><Link to="/profile" className="hover:text-white transition-colors">Security & Privacy</Link></li>
          </ul>
        </div>

        {/* Col 4: Contact Information */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
            Clinical Support
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li className="flex items-center gap-2">
              <FiMail className="w-4 h-4 text-slate-500" />
              <span>support@unicare.health</span>
            </li>
            <li className="flex items-center gap-2">
              <FiPhone className="w-4 h-4 text-slate-500" />
              <span>+1 (800) 456-CARE</span>
            </li>
            <li className="flex items-center gap-2">
              <FiMapPin className="w-4 h-4 text-slate-500" />
              <span>Karnataka, India</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="border-t border-slate-900 py-6 px-6 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>© {new Date().getFullYear()} UniCare Health Systems, Inc. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-slate-400 transition">Privacy Policy</a>
          <a href="#" className="hover:text-slate-400 transition">Terms of Service</a>
          <a href="#" className="hover:text-slate-400 transition">Security Disclosure</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;