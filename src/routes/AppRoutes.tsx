import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "../components/layout/PublicLayout";
import DashboardLayout from "../components/layout/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import { ROLES } from "../utils/constants";

// Public pages
import Home from "../pages/public/Home/Home";
import Login from "../pages/public/Login/Login";
import Register from "../pages/public/Register/Register";
import ForgotPassword from "../pages/public/ForgotPassword/ForgotPassword";
import ResetPassword from "../pages/public/ResetPassword/ResetPassword";
import VerifyOtp from "../pages/public/VerifyOtp/VerifyOtp";
import NotFound from "../pages/public/NotFound/NotFound";
import Unauthorized from "../pages/public/Unauthorized/Unauthorized";

// Child routes
import LearnerRoutes from "./LearnerRoutes";
import EducatorRoutes from "./EducatorRoutes";
import AdminRoutes from "./AdminRoutes";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages wrapped in PublicLayout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Route>

      {/* Protected Learner Portal */}
      <Route
        path="/learner/*"
        element={
          <ProtectedRoute allowedRoles={[ROLES.LEARNER]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="*" element={<LearnerRoutes />} />
      </Route>

      {/* Protected Educator Portal */}
      <Route
        path="/educator/*"
        element={
          <ProtectedRoute allowedRoles={[ROLES.EDUCATOR]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="*" element={<EducatorRoutes />} />
      </Route>

      {/* Protected Administrator Portal */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="*" element={<AdminRoutes />} />
      </Route>

      {/* 404 Not Found Page */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRoutes;
