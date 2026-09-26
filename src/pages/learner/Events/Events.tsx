import React from "react";
import { Calendar } from "lucide-react";

const Events: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sự kiện & Hội thảo tranh biện</h1>
        <p className="text-sm text-slate-500 mt-1">
          Khám phá các buổi tập huấn, hội thảo trực tuyến và các phiên tranh biện giao lưu sắp tới.
        </p>
      </div>

      <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500">
        <Calendar className="mx-auto mb-2 text-slate-400" size={32} />
        <p className="text-sm">Danh sách sự kiện sắp diễn ra và nút đăng ký tham gia sẽ hiển thị tại đây.</p>
      </div>
    </div>
  );
};

export default Events;
