import React from "react";
import CompetitionManagementView from "../../../components/competition/CompetitionManagementView";

const CompetitionManagement: React.FC = () => {
  return (
    <CompetitionManagementView
      title="Quản lý cuộc thi & giải đấu"
      subtitle="Tạo giải đấu, quản lý vòng đời, xét duyệt thí sinh/đội thi và phân công ban giám khảo."
    />
  );
};

export default CompetitionManagement;
