import React from "react";
import { FolderKanban, Calendar, Trophy, Users } from "lucide-react";

const EducatorDashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Bảng điều khiển Nhà giáo dục</h1>
        <p className="text-sm text-slate-500 mt-1">
          Quản lý chủ đề tranh biện, sự kiện tập huấn và theo dõi tiến độ sinh viên.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Chủ đề đã tạo</span>
            <div className="p-2 rounded-xl bg-[#ECFDF5] text-[#008A64]">
              <FolderKanban size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-3">0</p>
          <span className="text-xs text-slate-400 mt-1 inline-block">Chủ đề tranh biện</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sự kiện đã tổ chức</span>
            <div className="p-2 rounded-xl bg-[#ECFDF5] text-[#008A64]">
              <Calendar size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-3">0</p>
          <span className="text-xs text-slate-400 mt-1 inline-block">Hội thảo & buổi luyện</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cuộc thi & Giải đấu</span>
            <div className="p-2 rounded-xl bg-[#ECFDF5] text-[#008A64]">
              <Trophy size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-3">0</p>
          <span className="text-xs text-slate-400 mt-1 inline-block">Giải đấu quản lý</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Học viên hoạt động</span>
            <div className="p-2 rounded-xl bg-[#ECFDF5] text-[#008A64]">
              <Users size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-3">0</p>
          <span className="text-xs text-slate-400 mt-1 inline-block">Người tham gia hướng dẫn</span>
        </div>
      </div>
    </div>
  );
};

export default EducatorDashboard;
