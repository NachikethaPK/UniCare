import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Route wrapper that enforces user authentication.
 * If user is not authenticated, redirects to /login and preserves intended destination.
 */
function ProtectedRoute({ children, allowedRoles }) {
  const { user, token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  // Not authenticated: redirect to login with saved location state
  if (!user || !token) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location.pathname + location.search,
          message: "Please sign in to access this feature.",
        }}
        replace
      />
    );
  }

  // Role validation if restricted to specific roles
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <Navigate
        to={user.role === "hospital" ? "/blood" : "/dashboard"}
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;
