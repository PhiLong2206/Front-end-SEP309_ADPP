import React from "react";
import { Settings } from "lucide-react";

const SystemManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Cài đặt & cấu hình hệ thống</h1>
        <p className="text-sm text-slate-500 mt-1">
          Cấu hình tham số nền tảng, điểm cuối dịch vụ AI, độ sáng tạo (temperature) và nhật ký hệ thống.
        </p>
      </div>

      <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500">
        <Settings className="mx-auto mb-2 text-slate-400" size={32} />
        <p className="text-sm">Bảng thiết lập nền tảng, cấu hình mô hình AI và biến môi trường sẽ được quản lý tại đây.</p>
      </div>
    </div>
  );
};

export default SystemManagement;
