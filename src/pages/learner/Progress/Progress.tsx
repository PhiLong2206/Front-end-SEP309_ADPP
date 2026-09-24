import React from "react";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { MOCK_PROGRESS_DATA } from "../../../mocks/progress";
import { AlertCircle, ArrowRight } from "lucide-react";
import Button from "../../../components/common/Button";

const Progress: React.FC = () => {
  const data = MOCK_PROGRESS_DATA;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-8">
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Tiến độ học tập
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          Theo dõi sự tiến bộ và phân tích kỹ năng tranh biện của bạn theo thời gian.
        </p>
      </div>

      {/* TOP 3 CARDS: Điểm trung bình | Điểm số theo thời gian | Phân bố kỹ năng */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Top Left: Điểm trung bình (~30%) */}
        <div className="md:col-span-4 bg-[#0e1626]/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Điểm trung bình
          </span>

          <div className="my-4">
            <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              76.4
            </div>
            <span className="text-xs font-semibold text-emerald-400 mt-1 inline-block">
              +5.2 so với tháng trước
            </span>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-between text-xs text-slate-400">
            <span>Tổng số trận đã đấu:</span>
            <span className="font-bold text-white font-mono">12 trận</span>
          </div>
        </div>

        {/* Top Center: Điểm số theo thời gian (~45%) */}
        <div className="md:col-span-4 bg-[#0e1626]/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Điểm số theo thời gian
            </h3>
          </div>

          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.scoreTimeline}>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#64748b" }} stroke="#1e293b" />
                <YAxis domain={[60, 90]} tick={{ fontSize: 10, fill: "#64748b" }} stroke="#1e293b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0a0f1d",
                    borderRadius: "12px",
                    border: "1px solid #334155",
                    fontSize: "12px",
                    color: "#f8fafc",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#38bdf8"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#38bdf8" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Right: Phân bố kỹ năng (~25%) */}
        <div className="md:col-span-4 bg-[#0e1626]/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Phân bố kỹ năng
            </h3>
          </div>

          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={data.skills} outerRadius="70%">
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="skill" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  dataKey="score"
                  stroke="#818cf8"
                  fill="#818cf8"
                  fillOpacity={0.35}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* BOTTOM 2 CARDS: Kỹ năng cần cải thiện | Thống kê theo hình thức */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Bottom Left: Kỹ năng cần cải thiện (~50%) */}
        <div className="md:col-span-6 bg-[#0e1626]/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <AlertCircle size={16} className="text-amber-400" />
              <span>Kỹ năng cần cải thiện</span>
            </div>

            <div className="font-extrabold text-base text-white">
              Dẫn chứng (64/100)
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Bạn thường lập luận logic tốt nhưng thiếu các số liệu, ví dụ thực tế hoặc nghiên cứu uy tín để củng cố độ tin cậy của luận điểm.
            </p>
          </div>

          <div className="pt-2">
            <Link to="/learner/topics/topic-social-media">
              <Button variant="primary" size="sm" className="font-bold text-xs inline-flex items-center gap-1.5 shadow-md shadow-blue-600/30">
                <span>Luyện tập kỹ năng này</span>
                <ArrowRight size={13} />
              </Button>
            </Link>
          </div>
        </div>

        {/* Bottom Right: Thống kê theo hình thức (~50%) */}
        <div className="md:col-span-6 bg-[#0e1626]/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-800 shadow-xl space-y-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Thống kê theo hình thức
          </h3>

          <div className="space-y-4">
            {/* Với AI */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Với AI</span>
                <span className="text-white font-mono">9 trận (75%) • Điểm TB: 77.2</span>
              </div>
              <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full shadow-sm" style={{ width: "75%" }} />
              </div>
            </div>

            {/* 1 vs 1 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">1 vs 1</span>
                <span className="text-white font-mono">3 trận (25%) • Điểm TB: 74.0</span>
              </div>
              <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-sm" style={{ width: "25%" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
