import React from "react";
import { Users, FolderKanban, CreditCard, Activity } from "lucide-react";

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Bảng điều khiển Quản trị viên</h1>
        <p className="text-sm text-slate-500 mt-1">
          Tổng quan hệ thống, tài khoản người dùng, tài chính và trạng thái dịch vụ AI.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng số tài khoản</span>
            <div className="p-2 rounded-xl bg-[#ECFDF5] text-[#008A64]">
              <Users size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-3">0</p>
          <span className="text-xs text-slate-400 mt-1 inline-block">Học viên & Giảng viên</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Chủ đề hệ thống</span>
            <div className="p-2 rounded-xl bg-[#ECFDF5] text-[#008A64]">
              <FolderKanban size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-3">0</p>
          <span className="text-xs text-slate-400 mt-1 inline-block">Chủ đề tranh biện khả dụng</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Doanh thu nền tảng</span>
            <div className="p-2 rounded-xl bg-[#ECFDF5] text-[#008A64]">
              <CreditCard size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-3">0 ₫</p>
          <span className="text-xs text-slate-400 mt-1 inline-block">Tổng giao dịch</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Trạng thái Dịch vụ AI</span>
            <div className="p-2 rounded-xl bg-[#ECFDF5] text-[#008A64]">
              <Activity size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#008A64] mt-3">Hoạt động ổn định</p>
          <span className="text-xs text-slate-400 mt-1 inline-block">Dịch vụ AI Tranh biện</span>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
