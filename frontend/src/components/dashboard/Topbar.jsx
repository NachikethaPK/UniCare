import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch, FiBell, FiMenu, FiUser, FiLogOut, FiChevronDown } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useProfile } from "../../context/ProfileContext";
import FamilyProfileSwitcher from "../common/FamilyProfileSwitcher";
import ThemeToggle from "../common/ThemeToggle";

function Topbar({ onToggleMobile = () => {}, pageTitle = "Dashboard" }) {
  const { user, logout } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const displayName = profile?.name || user?.name || "User";

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (q.includes("appoint")) navigate("/appointments");
      else if (q.includes("blood")) navigate("/blood");
      else if (q.includes("pet")) navigate("/pets");
      else if (q.includes("record") || q.includes("report")) navigate("/records");
      else if (q.includes("ai")) navigate("/ai");
      else if (q.includes("profile") || q.includes("family")) navigate("/profile");
      else navigate("/appointments");
      setSearchQuery("");
    }
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-4 md:px-8 flex items-center justify-between gap-4 sticky top-0 z-30 transition-colors">
      {/* Left: Mobile Toggle & Breadcrumb Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobile}
          className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Open sidebar"
        >
          <FiMenu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* Right: Search, Family Profile, Theme Toggle, Notification Bell, User Menu */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Minimal Search Bar */}
        <form onSubmit={handleSearch} className="relative hidden md:block">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search records, doctors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-1.5 w-48 xl:w-60 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition"
          />
        </form>

        {/* Family Switcher */}
        <FamilyProfileSwitcher onOpenAddMember={() => navigate("/profile")} />

        {/* Global Dark Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition relative"
            title="Notifications"
          >
            <FiBell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white dark:ring-slate-900" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-4 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800 mb-3">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Notifications</span>
                <span className="text-[10px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded">2 unread</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-850 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                  <p className="font-semibold text-slate-900 dark:text-slate-200">Upcoming Consultation</p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">Cardiology follow-up with Dr. Sarah Chen tomorrow at 10:30 AM.</p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-850 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                  <p className="font-semibold text-slate-900 dark:text-slate-200">Vaccine Booster Reminder</p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">Bruno's Rabies vaccination window is scheduled next week.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 pl-2 pr-1.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left"
          >
            <div className="w-7 h-7 rounded-md bg-slate-900 dark:bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:block text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[100px] truncate">
              {displayName}
            </span>
            <FiChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-1.5 z-50">
              <Link
                to="/personal-details"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition"
              >
                <FiUser className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                <span>Personal Details</span>
              </Link>
              <Link
                to="/profile"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition"
              >
                <FiUser className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                <span>Family Vault</span>
              </Link>
              <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  logout();
                  navigate("/");
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
              >
                <FiLogOut className="w-3.5 h-3.5" />
                <span>Sign out</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}

export default Topbar;