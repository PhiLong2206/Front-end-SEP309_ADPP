import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "../components/layout/PublicLayout";
import DashboardLayout from "../components/layout/DashboardLayout";
import AdminLayout from "../components/layout/AdminLayout";
import RoleProtectedRoute from "./RoleProtectedRoute";
import GuestRoute from "./GuestRoute";
import { ROLES } from "../utils/constants";
import { useAuth } from "../hooks/useAuth";

// Public pages
import Home from "../pages/public/Home/Home";
import Login from "../pages/public/Login/Login";
import Register from "../pages/public/Register/Register";
import ForgotPassword from "../pages/public/ForgotPassword/ForgotPassword";
import ResetPassword from "../pages/public/ResetPassword/ResetPassword";
import VerifyOtp from "../pages/public/VerifyOtp/VerifyOtp";
import NotFound from "../pages/public/NotFound/NotFound";
import Unauthorized from "../pages/public/Unauthorized/Unauthorized";

// Child portals
import LearnerRoutes from "./LearnerRoutes";
import EducatorRoutes from "./EducatorRoutes";

// Admin pages & Reusable Profile/Settings
import AdminDashboard from "../pages/admin/Dashboard/Dashboard";
import UserManagement from "../pages/admin/UserManagement/UserManagement";
import RoleManagement from "../pages/admin/RoleManagement/RoleManagement";
import AdminTopicManagement from "../pages/admin/TopicManagement/TopicManagement";
import PaymentManagement from "../pages/admin/PaymentManagement/PaymentManagement";
import DebateManagement from "../pages/admin/DebateManagement/DebateManagement";
import ReportManagement from "../pages/admin/ReportManagement/ReportManagement";
import AdminEventManagement from "../pages/admin/EventManagement/EventManagement";
import AdminCompetitionManagement from "../pages/admin/CompetitionManagement/CompetitionManagement";
import SystemManagement from "../pages/admin/SystemManagement/SystemManagement";
import LearnerProfile from "../pages/learner/Profile/Profile";
import LearnerSettings from "../pages/learner/Settings/Settings";

/**
 * Smart redirect for /profile based on authenticated role.
 */
const ProfileRedirect: React.FC = () => {
  const { role } = useAuth();
  if (role === ROLES.ADMIN) return <Navigate to="/admin/profile" replace />;
  if (role === ROLES.EDUCATOR) return <Navigate to="/educator/profile" replace />;
  return <Navigate to="/learner/profile" replace />;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Direct /profile shortcut: protected, redirects to portal matching user role */}
      <Route
        path="/profile"
        element={
          <RoleProtectedRoute>
            <ProfileRedirect />
          </RoleProtectedRoute>
        }
      />

      {/* Public Pages wrapped in PublicLayout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/403" element={<Unauthorized />} />

        {/* Guest Only Routes (Redirects to role dashboard if already authenticated) */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
        </Route>
      </Route>

      {/* Protected Learner Portal (Learner & Admin can preview) */}
      <Route
        path="/learner/*"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.LEARNER, ROLES.ADMIN]}>
            <DashboardLayout />
          </RoleProtectedRoute>
        }
      >
        <Route path="*" element={<LearnerRoutes />} />
      </Route>

      {/* Protected Educator Portal */}
      <Route
        path="/educator/*"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.EDUCATOR]}>
            <DashboardLayout />
          </RoleProtectedRoute>
        }
      >
        <Route path="*" element={<EducatorRoutes />} />
      </Route>

      {/* Protected Administrator Portal (Strictly Admin only: Learners redirected to 403) */}
      <Route
        path="/admin"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <AdminLayout />
          </RoleProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="roles" element={<RoleManagement />} />
        <Route path="topics" element={<AdminTopicManagement />} />
        <Route path="payments" element={<PaymentManagement />} />

        {/* Reusable Profile & Settings for Admin */}
        <Route path="profile" element={<LearnerProfile />} />
        <Route path="settings" element={<LearnerSettings />} />

        {/* Preserved routes (hidden from sidebar but accessible) */}
        <Route path="debates" element={<DebateManagement />} />
        <Route path="reports" element={<ReportManagement />} />
        <Route path="events" element={<AdminEventManagement />} />
        <Route path="competitions" element={<AdminCompetitionManagement />} />
        <Route path="system" element={<SystemManagement />} />

        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* 404 Not Found Page */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRoutes;
