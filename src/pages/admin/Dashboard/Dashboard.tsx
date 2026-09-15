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
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Accounts</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Users size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-3">0</p>
          <span className="text-xs text-slate-400 mt-1 inline-block">Learners & Educators</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">System Topics</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <FolderKanban size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-3">0</p>
          <span className="text-xs text-slate-400 mt-1 inline-block">Active debate motions</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Platform Revenue</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <CreditCard size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-3">0 ₫</p>
          <span className="text-xs text-slate-400 mt-1 inline-block">Total transactions</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">AI Service Status</span>
            <div className="p-2 rounded-lg bg-teal-50 text-teal-600">
              <Activity size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-3">Operational</p>
          <span className="text-xs text-slate-400 mt-1 inline-block">Python AI FastAPI / ML</span>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
