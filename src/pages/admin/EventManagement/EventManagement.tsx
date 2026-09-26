import React from "react";
import { Calendar } from "lucide-react";

const AdminEventManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Quản lý sự kiện hệ thống</h1>
        <p className="text-sm text-slate-500 mt-1">
          Giám sát toàn bộ hội thảo, sự kiện chính thức và quản lý lịch trình trên nền tảng.
        </p>
      </div>

      <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500">
        <Calendar className="mx-auto mb-2 text-slate-400" size={32} />
        <p className="text-sm">Bảng quản trị sự kiện và công cụ điều phối sẽ hiển thị tại đây.</p>
      </div>
    </div>
  );
};

export default AdminEventManagement;
