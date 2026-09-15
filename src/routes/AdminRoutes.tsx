import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import AdminDashboard from "../pages/admin/Dashboard/Dashboard";
import UserManagement from "../pages/admin/UserManagement/UserManagement";
import AdminTopicManagement from "../pages/admin/TopicManagement/TopicManagement";
import AdminEventManagement from "../pages/admin/EventManagement/EventManagement";
import AdminCompetitionManagement from "../pages/admin/CompetitionManagement/CompetitionManagement";
import PaymentManagement from "../pages/admin/PaymentManagement/PaymentManagement";
import SystemManagement from "../pages/admin/SystemManagement/SystemManagement";

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="users" element={<UserManagement />} />
      <Route path="topics" element={<AdminTopicManagement />} />
      <Route path="events" element={<AdminEventManagement />} />
      <Route path="competitions" element={<AdminCompetitionManagement />} />
      <Route path="payments" element={<PaymentManagement />} />
      <Route path="system" element={<SystemManagement />} />
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
};

export default AdminRoutes;
