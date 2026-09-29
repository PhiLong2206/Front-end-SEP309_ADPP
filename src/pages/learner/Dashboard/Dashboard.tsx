import React from "react";
import { Link } from "react-router-dom";
import { Mic, BarChart2, Flame, ArrowRight } from "lucide-react";
import DifficultyBadge from "../../../components/topic/DifficultyBadge";
import { useAuth } from "../../../hooks/useAuth";
import { MOCK_TOPICS } from "../../../mocks/topics";
import { MOCK_PROGRESS_DATA } from "../../../mocks/progress";

import natureBg from "../../../assets/images/nature-bg.jpg";

const LearnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const recommendedTopics = MOCK_TOPICS.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* 1. Header Welcome Banner */}
      <div className="relative overflow-hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 bg-white dark:bg-[#0F1C17] p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-[rgba(148,163,184,0.18)] shadow-xs">
        {/* Subtle Nature background image slice on the right */}
        <div
          className="absolute right-0 top-0 bottom-0 w-1/2 bg-cover bg-center bg-no-repeat opacity-25 dark:opacity-15 pointer-events-none hidden md:block"
          style={{ backgroundImage: `url(${natureBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/40 dark:from-[#0F1C17] dark:via-[#0F1C17]/95 dark:to-[#0F1C17]/50 pointer-events-none" />

        <div className="relative z-10 space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-[#F8FAFC] tracking-tight flex items-center gap-2">
            <span>Xin chào, {user?.fullName || user?.email?.split("@")[0] || "bạn"}!</span>
            <span>👋</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-normal">
            Hôm nay bạn muốn luyện tập kỹ năng tranh biện nào?
          </p>
        </div>

        <Link
          to="/learner/topics"
          className="relative z-10 inline-flex items-center gap-2 px-6 py-3 bg-[#008A64] hover:bg-[#007457] active:bg-[#005e45] text-white text-sm font-bold rounded-full shadow-md shadow-[#008A64]/20 transition-all duration-200 hover:scale-102 self-start sm:self-auto shrink-0 cursor-pointer"
        >
          <span>Bắt đầu tranh biện</span>
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* 2. THREE Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        {/* Stat 1 */}
        <div className="bg-white dark:bg-[#12231C] p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-[rgba(148,163,184,0.18)] shadow-xs flex items-center justify-between hover:border-[#008A64]/40 hover:shadow-sm transition-all group">
          <div>
            <div className="text-3xl sm:text-4xl font-black text-[#0F172A] dark:text-[#F8FAFC] tracking-tight group-hover:text-[#008A64] dark:group-hover:text-emerald-400 transition-colors">
              {MOCK_PROGRESS_DATA.totalDebates || 12}
            </div>
            <span className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 inline-block">
              Phiên đã hoàn thành
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-100 dark:border-emerald-500/30 text-[#008A64] dark:text-emerald-400 flex items-center justify-center shadow-xs">
            <Mic size={22} />
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-white dark:bg-[#12231C] p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-[rgba(148,163,184,0.18)] shadow-xs flex items-center justify-between hover:border-[#008A64]/40 hover:shadow-sm transition-all group">
          <div>
            <div className="text-3xl sm:text-4xl font-black text-[#0F172A] dark:text-[#F8FAFC] tracking-tight group-hover:text-[#008A64] dark:group-hover:text-emerald-400 transition-colors">
              {Math.round(MOCK_PROGRESS_DATA.averageScore) || 76}
            </div>
            <span className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 inline-block">
              Điểm trung bình
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-100 dark:border-emerald-500/30 text-[#008A64] dark:text-emerald-400 flex items-center justify-center shadow-xs">
            <BarChart2 size={22} />
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-white dark:bg-[#12231C] p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-[rgba(148,163,184,0.18)] shadow-xs flex items-center justify-between hover:border-amber-500/40 hover:shadow-sm transition-all group">
          <div>
            <div className="text-3xl sm:text-4xl font-black text-[#0F172A] dark:text-[#F8FAFC] tracking-tight group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
              {MOCK_PROGRESS_DATA.streakDays || 5}
            </div>
            <span className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 inline-block">
              Ngày luyện tập liên tiếp
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-500/15 border border-amber-100 dark:border-amber-500/30 text-amber-500 dark:text-amber-400 flex items-center justify-center shadow-xs">
            <Flame size={22} />
          </div>
        </div>
      </div>

      {/* 3. Section: "Tiếp tục luyện tập" */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          TIẾP TỤC LUYỆN TẬP
        </h2>

        <div className="bg-white dark:bg-[#12231C] p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-[rgba(148,163,184,0.18)] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#008A64]/30 hover:shadow-sm transition-all">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-emerald-50 dark:bg-emerald-500/15 border border-slate-200/80 dark:border-[rgba(148,163,184,0.18)] shadow-xs">
              <img
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80"
                alt="Social Media Topic"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 border border-blue-200 text-blue-700">
                  Xã hội
                </span>
                <DifficultyBadge difficulty="Trung bình" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC] truncate">
                Mạng xã hội có gây hại nhiều hơn lợi ích?
              </h3>
            </div>
          </div>

          <Link
            to="/learner/debate/session-demo-01"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#008A64] hover:bg-[#007457] active:bg-[#005e45] text-white text-sm font-bold rounded-xl shadow-sm shadow-[#008A64]/20 transition-all shrink-0 hover:scale-102 cursor-pointer"
          >
            <span>Tiếp tục tranh biện</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      {/* 4. Section: "Chủ đề dành cho bạn" */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            CHỦ ĐỀ DÀNH CHO BẠN
          </h2>

          <Link
            to="/learner/topics"
            className="text-xs sm:text-sm font-bold text-[#008A64] hover:text-[#007457] dark:text-[#34D399] inline-flex items-center gap-1 hover:underline"
          >
            <span>Xem tất cả chủ đề →</span>
          </Link>
        </div>

        {/* Rows List */}
        <div className="bg-white dark:bg-[#12231C] rounded-2xl border border-slate-200/80 dark:border-[rgba(148,163,184,0.18)] shadow-xs divide-y divide-slate-100 dark:divide-[rgba(148,163,184,0.14)] overflow-hidden">
          {recommendedTopics.map((topic) => (
            <div
              key={topic.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-[#172C23] transition-colors"
            >
              <div className="flex items-center gap-3.5 flex-1 min-w-0 pr-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-[rgba(148,163,184,0.18)]">
                  <img
                    src={topic.imageUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80"}
                    alt={topic.title}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80";
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1 min-w-0">
                  <h3 className="font-bold text-[#0F172A] dark:text-[#F8FAFC] text-sm sm:text-base truncate">
                    {topic.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 border border-blue-200 text-blue-700">
                      {topic.category}
                    </span>
                    <DifficultyBadge difficulty={topic.difficulty} />
                    <span className="text-xs text-slate-400">
                      • {topic.practicesCount.toLocaleString()} lượt luyện
                    </span>
                  </div>
                </div>
              </div>

              <Link
                to={`/learner/topics/${topic.id}`}
                className="self-start sm:self-auto px-4 py-2 bg-slate-50 dark:bg-[#101F1A] hover:bg-[#008A64] hover:text-white text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[rgba(148,163,184,0.18)] rounded-xl text-xs sm:text-sm font-bold transition-all inline-flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
              >
                <span>Bắt đầu</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearnerDashboard;

