import React from "react";
import { Calendar } from "lucide-react";

const EventManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Quản lý sự kiện</h1>
        <p className="text-sm text-slate-500 mt-1">
          Tổ chức, lên lịch và giám sát các buổi tập huấn tranh biện, hội thảo và phiên luyện tập trực tiếp.
        </p>
      </div>

      <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500">
        <Calendar className="mx-auto mb-2 text-slate-400" size={32} />
        <p className="text-sm">Công cụ lên lịch sự kiện và danh sách người đăng ký tham gia sẽ hiển thị tại đây.</p>
      </div>
    </div>
  );
};

export default EventManagement;
