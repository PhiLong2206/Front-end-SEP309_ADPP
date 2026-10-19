import React, { useState } from "react";
import { Swords, Search, Filter, RefreshCw, Clock } from "lucide-react";

const DebateManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const loading = false;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Quản lý các phiên tranh biện
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Giám sát phòng đấu luyện tập AI, phòng đối kháng 1v1 và các trận đấu đồng đội 2v2 trên nền tảng.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {}}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#1A2E26] hover:bg-slate-100 dark:hover:bg-[#233F34] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-[rgba(148,163,184,0.18)] text-xs font-bold transition-all shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw size={13} className={loading ? "animate-spin text-[#008A64]" : ""} />
          <span>Làm mới danh sách</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#12231C] p-4 rounded-2xl border border-slate-200/80 dark:border-[rgba(148,163,184,0.18)] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo chủ đề hoặc người tham gia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-[#0B1713] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008A64]/20 focus:border-[#008A64] text-slate-800 dark:text-slate-200"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <div className="flex items-center gap-1.5">
            <Filter size={13} className="text-slate-400" />
            <span className="text-[11px] font-bold text-slate-500 uppercase">Hình thức:</span>
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-[#0B1713] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008A64]/20 focus:border-[#008A64] font-medium text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <option value="ALL">Tất cả hình thức</option>
            <option value="AI_PRACTICE">Luyện tập AI</option>
            <option value="P2P_1V1">Đối kháng 1 vs 1</option>
            <option value="TEAM_2V2">Đồng đội 2 vs 2</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-[#0B1713] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008A64]/20 focus:border-[#008A64] font-medium text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <option value="ALL">Mọi trạng thái</option>
            <option value="In_Progress">Đang tranh biện</option>
            <option value="Completed">Đã kết thúc</option>
          </select>
        </div>
      </div>

      {/* Backend Microservice Status Box */}
      <div className="bg-white dark:bg-[#12231C] rounded-2xl border border-slate-200/80 dark:border-[rgba(148,163,184,0.18)] shadow-xs p-10 text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-[#008A64] dark:text-emerald-400 flex items-center justify-center mx-auto">
          <Swords size={28} />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            Dịch vụ Tranh biện đang kết nối với DebateController (.NET 8)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            Hạ tầng Backend hiện hỗ trợ API tạo phòng tranh biện học viên qua <code className="text-[#008A64] font-mono">POST /api/debate/ai-practice</code> và <code className="text-[#008A64] font-mono">POST /api/debate/p2p</code>. Endpoint tổng hợp danh sách phiên tranh biện cho Admin đang được hoàn thiện.
          </p>
        </div>
        <div className="pt-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40">
            <Clock size={12} /> Trạng thái: Chờ Backend bổ sung API Admin Debates Overview
          </span>
        </div>
      </div>
    </div>
  );
};

export default DebateManagement;
