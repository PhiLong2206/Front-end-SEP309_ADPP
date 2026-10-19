import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { RoleType, User } from "../types";
import { ROLES } from "../utils/constants";
import Loading from "../components/common/Loading";

export interface RoleProtectedRouteProps {
  allowedRoles?: RoleType[];
  children?: React.ReactNode;
}

/**
 * Validates if the authenticated user has at least one of the allowed roles.
 * Matches normalized roles (Administrator, Educator, Learner) as well as
 * raw backend claims (Admin, Member, Educator, etc.).
 */
export const checkUserHasRole = (user: User | null, allowedRoles?: RoleType[]): boolean => {
  if (!allowedRoles || allowedRoles.length === 0) return true;
  if (!user) return false;

  const currentRole = String(user.role).toLowerCase();
  const userRolesList = (user.roles || []).map((r) => r.toLowerCase());

  return allowedRoles.some((roleItem) => {
    const target = String(roleItem).toLowerCase();

    // 1. Direct match
    if (currentRole === target || userRolesList.includes(target)) return true;

    // 2. Admin / Administrator checks
    if (target === "admin" || target === "administrator" || target === ROLES.ADMIN.toLowerCase()) {
      if (currentRole === "administrator" || currentRole === "admin") return true;
      if (userRolesList.includes("admin") || userRolesList.includes("administrator")) return true;
    }

    // 3. Learner / Member checks
    if (target === "learner" || target === "member" || target === ROLES.LEARNER.toLowerCase()) {
      if (currentRole === "learner" || currentRole === "member") return true;
      if (userRolesList.includes("learner") || userRolesList.includes("member")) return true;
    }

    // 4. Educator / Lecturer checks
    if (target === "educator" || target === "lecturer" || target === ROLES.EDUCATOR.toLowerCase()) {
      if (currentRole === "educator" || currentRole === "lecturer") return true;
      if (userRolesList.includes("educator") || userRolesList.includes("lecturer")) return true;
    }

    return false;
  });
};

/**
 * Role-Based Access Control Protected Route.
 * - Redirects unauthenticated users to /login with return state.
 * - Redirects authenticated users without required roles to /unauthorized (403 Forbidden).
 * - Renders children or Outlet if authorized.
 */
const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading fullScreen message="Đang xác thực quyền truy cập..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const isAuthorized = checkUserHasRole(user, allowedRoles);

  if (!isAuthorized) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default RoleProtectedRoute;
