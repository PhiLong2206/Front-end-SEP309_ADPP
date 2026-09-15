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
    <div className="space-y-4 max-w-6xl mx-auto pb-8">
      {/* Title */}
      <div>
        <h1 className="text-xl font-black text-slate-900 tracking-tight">
          Tiến độ học tập
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Theo dõi sự tiến bộ và phân tích kỹ năng tranh biện của bạn.
        </p>
      </div>

      {/* TOP 3 CARDS: Điểm trung bình | Điểm số theo thời gian | Phân bố kỹ năng */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Top Left: Điểm trung bình (~30%) */}
        <div className="md:col-span-4 bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Điểm trung bình
          </span>

          <div className="my-3">
            <div className="text-4xl font-black text-slate-900">
              76.4
            </div>
            <span className="text-xs font-semibold text-emerald-600 mt-1 inline-block">
              +5.2 so với tháng trước
            </span>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-500">
            <span>Tổng số trận đã đấu:</span>
            <span className="font-bold text-slate-800">12 trận</span>
          </div>
        </div>

        {/* Top Center: Điểm số theo thời gian (~45%) */}
        <div className="md:col-span-4 bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Điểm số theo thời gian
            </h3>
          </div>

          <div className="h-36 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.scoreTimeline}>
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: "#94a3b8" }} stroke="#e2e8f0" />
                <YAxis domain={[60, 90]} tick={{ fontSize: 9, fill: "#94a3b8" }} stroke="#e2e8f0" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "6px",
                    border: "1px solid #e2e8f0",
                    fontSize: "11px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#1677ff"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#1677ff" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Right: Phân bố kỹ năng (~25%) */}
        <div className="md:col-span-4 bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Phân bố kỹ năng
            </h3>
          </div>

          <div className="h-36 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={data.skills} outerRadius="70%">
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="skill" tick={{ fontSize: 9, fill: "#64748b" }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  dataKey="score"
                  stroke="#1677ff"
                  fill="#1677ff"
                  fillOpacity={0.25}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* BOTTOM 2 CARDS: Kỹ năng cần cải thiện | Thống kê theo hình thức */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Bottom Left: Kỹ năng cần cải thiện (~50%) */}
        <div className="md:col-span-6 bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800">
              <AlertCircle size={15} className="text-amber-600" />
              <span>Kỹ năng cần cải thiện</span>
            </div>

            <div className="font-extrabold text-sm text-slate-900">
              Dẫn chứng (64/100)
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Bạn thường lập luận logic tốt nhưng thiếu các số liệu, ví dụ thực tế hoặc nghiên cứu uy tín để củng cố độ tin cậy của luận điểm.
            </p>
          </div>

          <div className="pt-2">
            <Link to="/learner/topics/topic-social-media">
              <Button variant="primary" size="sm" className="font-bold text-xs inline-flex items-center gap-1 shadow-2xs">
                <span>Luyện tập kỹ năng này</span>
                <ArrowRight size={12} />
              </Button>
            </Link>
          </div>
        </div>

        {/* Bottom Right: Thống kê theo hình thức (~50%) */}
        <div className="md:col-span-6 bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Thống kê theo hình thức
          </h3>

          <div className="space-y-3.5">
            {/* Với AI */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700">Với AI</span>
                <span className="text-slate-900">9 trận (75%) • Điểm TB: 77.2</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: "75%" }} />
              </div>
            </div>

            {/* 1 vs 1 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700">1 vs 1</span>
                <span className="text-slate-900">3 trận (25%) • Điểm TB: 74.0</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: "25%" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
