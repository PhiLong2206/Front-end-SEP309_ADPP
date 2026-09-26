import React from "react";
import { Link } from "react-router-dom";
import { Mic, BarChart2, Flame, ArrowRight, Play } from "lucide-react";
import DifficultyBadge from "../../../components/topic/DifficultyBadge";
import { useAuth } from "../../../hooks/useAuth";
import { MOCK_TOPICS } from "../../../mocks/topics";
import { MOCK_PROGRESS_DATA } from "../../../mocks/progress";

const LearnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const recommendedTopics = MOCK_TOPICS.slice(0, 4);

  return (
    <div className="space-y-8">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 bg-[#0e1626]/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl shadow-black/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Xin chào, {user?.fullName || "bạn"}!</span>
            <span>👋</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 mt-1.5">
            Hôm nay bạn muốn luyện tập kỹ năng tranh biện nào?
          </p>
        </div>

        <Link
          to="/learner/topics"
          className="relative z-10 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-sm font-bold rounded-2xl shadow-lg shadow-blue-600/30 transition-all duration-300 hover:scale-102 self-start sm:self-auto shrink-0"
        >
          <Mic size={18} />
          <span>Bắt đầu tranh biện</span>
        </Link>
      </div>

      {/* 2. THREE Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Stat 1 */}
        <div className="bg-[#0e1626]/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-800 shadow-lg flex items-center justify-between hover:border-blue-500/40 transition-all group">
          <div>
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight group-hover:text-cyan-400 transition-colors">
              {MOCK_PROGRESS_DATA.totalDebates}
            </div>
            <span className="text-sm font-medium text-slate-300 mt-1 inline-block">
              Phiên đã hoàn thành
            </span>
          </div>
          <div className="w-13 h-13 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center shadow-inner">
            <Mic size={24} />
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-[#0e1626]/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-800 shadow-lg flex items-center justify-between hover:border-emerald-500/40 transition-all group">
          <div>
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight group-hover:text-emerald-400 transition-colors">
              {Math.round(MOCK_PROGRESS_DATA.averageScore)}
            </div>
            <span className="text-sm font-medium text-slate-300 mt-1 inline-block">
              Điểm trung bình
            </span>
          </div>
          <div className="w-13 h-13 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-inner">
            <BarChart2 size={24} />
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-[#0e1626]/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-800 shadow-lg flex items-center justify-between hover:border-amber-500/40 transition-all group">
          <div>
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight group-hover:text-amber-400 transition-colors">
              {MOCK_PROGRESS_DATA.streakDays}
            </div>
            <span className="text-sm font-medium text-slate-300 mt-1 inline-block">
              Ngày luyện tập liên tiếp
            </span>
          </div>
          <div className="w-13 h-13 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-inner">
            <Flame size={24} />
          </div>
        </div>
      </div>

      {/* 3. Section: "Tiếp tục luyện tập" */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Tiếp tục luyện tập
        </h2>

        <div className="bg-[#0e1626]/90 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-5 hover:border-slate-700 transition-all">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-slate-900 border border-slate-700 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80"
                alt="Social Media Topic"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 border border-blue-400/30 text-blue-300">
                  Xã hội
                </span>
                <DifficultyBadge difficulty="Trung bình" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white truncate">
                Mạng xã hội có gây hại nhiều hơn lợi ích?
              </h3>
            </div>
          </div>

          <Link
            to="/learner/debate/session-demo-01"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold rounded-2xl shadow-md shadow-blue-600/30 transition-all shrink-0 hover:scale-102"
          >
            <Play size={14} className="fill-current" />
            <span>Tiếp tục tranh biện</span>
          </Link>
        </div>
      </div>

      {/* 4. Section: "Chủ đề dành cho bạn" */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Chủ đề dành cho bạn
          </h2>

          <Link
            to="/learner/topics"
            className="text-xs sm:text-sm font-bold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 hover:underline"
          >
            <span>Xem tất cả chủ đề →</span>
          </Link>
        </div>

        {/* Rows List */}
        <div className="bg-[#0e1626]/90 backdrop-blur-xl rounded-3xl border border-slate-800 shadow-lg divide-y divide-slate-800/80 overflow-hidden">
          {recommendedTopics.map((topic) => (
            <div
              key={topic.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors"
            >
              <div className="space-y-1.5 flex-1 min-w-0 pr-4">
                <h3 className="font-bold text-white text-sm sm:text-base line-clamp-1">
                  {topic.title}
                </h3>
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 border border-blue-400/30 text-blue-300">
                    {topic.category}
                  </span>
                  <DifficultyBadge difficulty={topic.difficulty} />
                  <span className="text-xs sm:text-sm text-slate-400 font-mono">
                    • {topic.practicesCount.toLocaleString()} lượt luyện
                  </span>
                </div>
              </div>

              <Link
                to={`/learner/topics/${topic.id}`}
                className="self-start sm:self-auto px-4 py-2 bg-slate-800/90 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 border border-slate-700/80 rounded-xl text-xs sm:text-sm font-bold transition-all inline-flex items-center gap-1.5 shrink-0 shadow-xs"
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

