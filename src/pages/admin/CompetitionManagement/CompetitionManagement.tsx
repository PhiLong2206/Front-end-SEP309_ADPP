import React from "react";
import CompetitionManagementView from "../../../components/competition/CompetitionManagementView";

const AdminCompetitionManagement: React.FC = () => {
  return (
    <CompetitionManagementView
      title="Quản trị giải đấu toàn hệ thống"
      subtitle="Giám sát mọi cuộc thi tranh biện, phê duyệt và điều phối vòng đời giải đấu trên nền tảng."
    />
  );
};

export default AdminCompetitionManagement;
