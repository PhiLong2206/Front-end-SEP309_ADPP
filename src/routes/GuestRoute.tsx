import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ROLES } from "../utils/constants";
import Loading from "../components/common/Loading";

export interface GuestRouteProps {
  children?: React.ReactNode;
}

/**
 * GuestRoute prevents authenticated users from accessing guest-only pages
 * like /login, /register, /forgot-password.
 * If user is already authenticated, redirects them to their respective dashboard.
 */
const GuestRoute: React.FC<GuestRouteProps> = ({ children }) => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return <Loading fullScreen message="Đang kiểm tra phiên đăng nhập..." />;
  }

  if (isAuthenticated) {
    const userRole = String(role);
    if (userRole === "Administrator" || userRole === "Admin" || userRole === ROLES.ADMIN) {
      return <Navigate to="/admin/dashboard" replace />;
    }
    if (userRole === "Educator" || userRole === ROLES.EDUCATOR) {
      return <Navigate to="/educator/dashboard" replace />;
    }
    return <Navigate to="/learner/dashboard" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default GuestRoute;
