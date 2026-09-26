import React from "react";
import { Trophy } from "lucide-react";

const CompetitionManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Quản lý cuộc thi & giải đấu</h1>
        <p className="text-sm text-slate-500 mt-1">
          Tạo giải đấu, thiết lập các vòng đấu, theo dõi nhánh đấu đội tuyển và quản lý điểm số.
        </p>
      </div>

      <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500">
        <Trophy className="mx-auto mb-2 text-amber-500" size={32} />
        <p className="text-sm">Bảng phân nhánh thi đấu và hệ thống chấm điểm giải đấu sẽ hiển thị tại đây.</p>
      </div>
    </div>
  );
};

export default CompetitionManagement;
