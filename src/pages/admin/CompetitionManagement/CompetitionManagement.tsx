import React from "react";
import { Trophy } from "lucide-react";

const AdminCompetitionManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Quản lý giải đấu hệ thống</h1>
        <p className="text-sm text-slate-500 mt-1">
          Giám sát các giải đấu trên nền tảng, phê duyệt cơ cấu giải thưởng và giải quyết khiếu nại.
        </p>
      </div>

      <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500">
        <Trophy className="mx-auto mb-2 text-amber-500" size={32} />
        <p className="text-sm">Bảng quản lý giải đấu tổng thể và điều phối nhánh đấu sẽ hiển thị tại đây.</p>
      </div>
    </div>
  );
};

export default AdminCompetitionManagement;
