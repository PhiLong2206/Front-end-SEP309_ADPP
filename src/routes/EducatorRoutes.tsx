import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import EducatorDashboard from "../pages/educator/Dashboard/Dashboard";
import TopicManagement from "../pages/educator/TopicManagement/TopicManagement";
import EventManagement from "../pages/educator/EventManagement/EventManagement";
import CompetitionManagement from "../pages/educator/CompetitionManagement/CompetitionManagement";
import EducatorProfile from "../pages/educator/Profile/Profile";

const EducatorRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<EducatorDashboard />} />
      <Route path="topics" element={<TopicManagement />} />
      <Route path="events" element={<EventManagement />} />
      <Route path="competitions" element={<CompetitionManagement />} />
      <Route path="profile" element={<EducatorProfile />} />
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
};

export default EducatorRoutes;
