import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import LearnerDashboard from "../pages/learner/Dashboard/Dashboard";
import Topics from "../pages/learner/Topics/Topics";
import TopicDetail from "../pages/learner/Topics/TopicDetail";
import DebatePractice from "../pages/learner/DebatePractice/DebatePractice";
import DebateRoom from "../pages/learner/DebatePractice/DebateRoom";
import DebateResult from "../pages/learner/DebatePractice/DebateResult";
import Debate1v1 from "../pages/learner/Debate1v1/Debate1v1";
import Debate1v1Result from "../pages/learner/Debate1v1/Debate1v1Result";
import DebateHistory from "../pages/learner/DebateHistory/DebateHistory";
import Feedback from "../pages/learner/Feedback/Feedback";
import Progress from "../pages/learner/Progress/Progress";
import Events from "../pages/learner/Events/Events";
import Competitions from "../pages/learner/Competitions/Competitions";
import Payments from "../pages/learner/Payments/Payments";
import LearnerProfile from "../pages/learner/Profile/Profile";
import LearnerSettings from "../pages/learner/Settings/Settings";

const LearnerRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<LearnerDashboard />} />
      <Route path="topics" element={<Topics />} />
      <Route path="topics/:id" element={<TopicDetail />} />
      <Route path="debate" element={<DebatePractice />} />
      <Route path="debate/:sessionId" element={<DebateRoom />} />
      <Route path="debate/:sessionId/result" element={<DebateResult />} />
      <Route path="debate-1v1" element={<Debate1v1 />} />
      <Route path="debate-1v1/:matchId/result" element={<Debate1v1Result />} />
      <Route path="history" element={<DebateHistory />} />
      <Route path="feedback" element={<Feedback />} />
      <Route path="progress" element={<Progress />} />
      <Route path="events" element={<Events />} />
      <Route path="competitions" element={<Competitions />} />
      <Route path="payments" element={<Payments />} />
      <Route path="profile" element={<LearnerProfile />} />
      <Route path="settings" element={<LearnerSettings />} />
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
};

export default LearnerRoutes;
