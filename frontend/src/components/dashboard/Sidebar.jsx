import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FiGrid,
  FiCalendar,
  FiFileText,
  FiDroplet,
  FiHeart,
  FiCpu,
  FiUser,
  FiUsers,
  FiLogOut,
  FiX,
  FiActivity,
} from "react-icons/fi";

function Sidebar({ mobileOpen = false, onCloseMobile = () => {} }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const menuItems = [
    {
      name: "Dashboard",
      icon: <FiGrid className="w-4 h-4" />,
      path: "/dashboard",
    },
    {
      name: "Appointments",
      icon: <FiCalendar className="w-4 h-4" />,
      path: "/appointments",
    },
    {
      name: "Health Records",
      icon: <FiFileText className="w-4 h-4" />,
      path: "/records",
    },
    {
      name: "Blood Donation",
      icon: <FiDroplet className="w-4 h-4" />,
      path: "/blood",
    },
    {
      name: "Pet Healthcare",
      icon: <FiHeart className="w-4 h-4" />,
      path: "/pets",
    },
    {
      name: "AI Assistant",
      icon: <FiCpu className="w-4 h-4" />,
      path: "/ai",
    },
    {
      name: "Personal Details",
      icon: <FiUser className="w-4 h-4" />,
      path: "/personal-details",
    },
    {
      name: "Family Vault",
      icon: <FiUsers className="w-4 h-4" />,
      path: "/profile",
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Element */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header / Logo */}
        <div className="h-16 px-6 border-b border-slate-800 flex items-center justify-between">
          <Link to="/" onClick={onCloseMobile} className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <FiActivity className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold text-base tracking-tight text-white">UniCare</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Portal</span>
            </div>
          </Link>
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-6 overflow-y-auto space-y-1">
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Navigation
          </p>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={onCloseMobile}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/70"
                }`}
              >
                <span className={isActive ? "text-white" : "text-slate-400"}>
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Footer / Logout */}
        <div className="p-3 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 transition-colors"
          >
            <FiLogOut className="w-4 h-4" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;