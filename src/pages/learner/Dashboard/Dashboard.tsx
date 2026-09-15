import React from "react";
import { Link } from "react-router-dom";
import { Mic, BarChart2, Flame, ArrowRight, Play } from "lucide-react";
import Badge from "../../../components/common/Badge";
import DifficultyBadge from "../../../components/topic/DifficultyBadge";
import { MOCK_TOPICS } from "../../../mocks/topics";
import { MOCK_PROGRESS_DATA } from "../../../mocks/progress";

const LearnerDashboard: React.FC = () => {
  // Recommended topics in compact rows format matching reference
  const recommendedTopics = MOCK_TOPICS.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* 1. Compact Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-1.5">
            <span>Xin chào, Phi Long!</span>
            <span>👋</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Hôm nay bạn muốn luyện tập chủ đề nào?
          </p>
        </div>

        <Link
          to="/learner/topics"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors self-start sm:self-auto shrink-0"
        >
          <Mic size={14} />
          <span>Bắt đầu tranh biện</span>
        </Link>
      </div>

      {/* 2. THREE Compact Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Stat 1 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-2xl font-black text-slate-900">
              {MOCK_PROGRESS_DATA.totalDebates}
            </div>
            <span className="text-xs font-medium text-slate-500 mt-0.5 inline-block">
              Phiên đã hoàn thành
            </span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Mic size={18} />
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-2xl font-black text-slate-900">
              {Math.round(MOCK_PROGRESS_DATA.averageScore)}
            </div>
            <span className="text-xs font-medium text-slate-500 mt-0.5 inline-block">
              Điểm trung bình
            </span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <BarChart2 size={18} />
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-2xl font-black text-slate-900">
              {MOCK_PROGRESS_DATA.streakDays}
            </div>
            <span className="text-xs font-medium text-slate-500 mt-0.5 inline-block">
              Ngày luyện tập liên tiếp
            </span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Flame size={18} />
          </div>
        </div>
      </div>

      {/* 3. Section: "Tiếp tục luyện tập" (One Horizontal Card) */}
      <div className="space-y-2.5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Tiếp tục luyện tập
        </h2>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Small thumbnail */}
            <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
              <img
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80"
                alt="Social Media Topic"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <Badge variant="primary" size="sm">Xã hội</Badge>
                <DifficultyBadge difficulty="Trung bình" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                Mạng xã hội có gây hại nhiều hơn lợi ích?
              </h3>
            </div>
          </div>

          <Link
            to="/learner/debate/session-demo-01"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors shrink-0"
          >
            <Play size={12} className="fill-current" />
            <span>Tiếp tục</span>
          </Link>
        </div>
      </div>

      {/* 4. Section: "Chủ đề dành cho bạn" (Compact Rows Table List) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Chủ đề dành cho bạn
          </h2>

          <Link
            to="/learner/topics"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 hover:underline"
          >
            <span>Xem tất cả →</span>
          </Link>
        </div>

        {/* Compact Table Rows List */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs divide-y divide-slate-100 overflow-hidden">
          {recommendedTopics.map((topic) => (
            <div
              key={topic.id}
              className="p-3.5 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
            >
              <div className="space-y-1 flex-1 min-w-0 pr-4">
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1">
                  {topic.title}
                </h3>
                <div className="flex items-center gap-2">
                  <Badge variant="primary" size="sm">{topic.category}</Badge>
                  <DifficultyBadge difficulty={topic.difficulty} />
                  <span className="text-[11px] text-slate-400">• {topic.practicesCount.toLocaleString()} lượt luyện</span>
                </div>
              </div>

              <Link
                to={`/learner/topics/${topic.id}`}
                className="self-start sm:self-auto px-3.5 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1 shrink-0"
              >
                <span>Bắt đầu</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearnerDashboard;
