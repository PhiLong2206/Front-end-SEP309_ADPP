import React from "react";
import { Link } from "react-router-dom";
import Badge from "../../../components/common/Badge";
import DifficultyBadge from "../../../components/topic/DifficultyBadge";
import { ArrowRight, Swords } from "lucide-react";

export interface DebateHistoryItem {
  id: string;
  topicTitle: string;
  category: string;
  difficulty: "Dễ" | "Trung bình" | "Khó";
  date: string;
  score: number;
  rating: string;
  mode: string;
  side: "Ủng hộ" | "Phản đối";
}

const DebateHistory: React.FC = () => {
  const historyList: DebateHistoryItem[] = [];

  return (
    <div className="space-y-5 max-w-6xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Trận của tôi
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Danh sách các phiên tranh biện và đánh giá đã hoàn thành của bạn.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {historyList.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <Swords size={32} className="mx-auto text-slate-300" />
            <p className="text-sm font-semibold">Chưa có phiên tranh biện nào hoàn thành.</p>
            <p className="text-xs text-slate-400">Hãy bắt đầu luyện tập với AI để ghi nhận kết quả và điểm số.</p>
            <Link
              to="/learner/debate"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#008A64] hover:bg-[#007457] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              Luyện tập ngay
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500 tracking-wider border-b border-slate-200">
                <tr>
                  <th scope="col" className="px-5 py-3.5">Chủ đề</th>
                  <th scope="col" className="px-5 py-3.5">Hình thức</th>
                  <th scope="col" className="px-5 py-3.5">Phe</th>
                  <th scope="col" className="px-5 py-3.5 text-center">Điểm số</th>
                  <th scope="col" className="px-5 py-3.5">Ngày đấu</th>
                  <th scope="col" className="px-5 py-3.5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {historyList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-4 max-w-sm">
                      <div className="font-bold text-slate-900 line-clamp-1">{item.topicTitle}</div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Badge variant="primary" size="sm">{item.category}</Badge>
                        <DifficultyBadge difficulty={item.difficulty} />
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-xs font-medium text-slate-700">
                      {item.mode}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                        item.side === "Ủng hộ"
                          ? "bg-[#ECFDF5] text-[#008A64] border border-[#008A64]/30"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}>
                        {item.side}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center whitespace-nowrap">
                      <span className="font-black text-slate-900 text-base font-mono">{item.score}</span>
                      <span className="text-xs text-slate-400">/100</span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-xs text-slate-500 font-mono">
                      {item.date}
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <Link
                        to={`/learner/debate/${item.id}/result`}
                        className="px-3.5 py-1.5 bg-white hover:bg-[#ECFDF5] border border-slate-200 text-[#008A64] text-xs font-bold rounded-xl transition-all inline-flex items-center gap-1.5 shadow-xs"
                      >
                        <span>Xem kết quả</span>
                        <ArrowRight size={13} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DebateHistory;
