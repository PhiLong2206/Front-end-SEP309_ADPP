import React from "react";
import { Link } from "react-router-dom";
import { MOCK_TOPICS } from "../../../mocks/topics";
import Badge from "../../../components/common/Badge";
import DifficultyBadge from "../../../components/topic/DifficultyBadge";
import { ArrowRight } from "lucide-react";

const DebateHistory: React.FC = () => {
  const historyList = [
    {
      id: "session-1",
      topic: MOCK_TOPICS[1],
      date: "14/03/2026",
      score: 76,
      rating: "Khá tốt",
      mode: "Tranh biện với AI",
      side: "Ủng hộ",
    },
    {
      id: "session-2",
      topic: MOCK_TOPICS[0],
      date: "11/03/2026",
      score: 78,
      rating: "Khá tốt",
      mode: "Tranh biện với AI",
      side: "Phản đối",
    },
    {
      id: "session-3",
      topic: MOCK_TOPICS[3],
      date: "09/03/2026",
      score: 75,
      rating: "Khá tốt",
      mode: "Tranh biện 1 vs 1",
      side: "Ủng hộ",
    },
    {
      id: "session-4",
      topic: MOCK_TOPICS[2],
      date: "01/03/2026",
      score: 68,
      rating: "Trung bình",
      mode: "Tranh biện với AI",
      side: "Ủng hộ",
    },
  ];

  return (
    <div className="space-y-5 max-w-6xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Trận của tôi
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          Danh sách các phiên tranh biện và đánh giá đã hoàn thành của bạn.
        </p>
      </div>

      <div className="bg-[#0e1626]/90 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-[11px] font-bold uppercase text-slate-400 tracking-wider border-b border-slate-800">
              <tr>
                <th scope="col" className="px-5 py-3.5">Chủ đề</th>
                <th scope="col" className="px-5 py-3.5">Hình thức</th>
                <th scope="col" className="px-5 py-3.5">Phe</th>
                <th scope="col" className="px-5 py-3.5 text-center">Điểm số</th>
                <th scope="col" className="px-5 py-3.5">Ngày đấu</th>
                <th scope="col" className="px-5 py-3.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {historyList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-4 max-w-sm">
                    <div className="font-bold text-white line-clamp-1">{item.topic.title}</div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Badge variant="primary" size="sm">{item.topic.category}</Badge>
                      <DifficultyBadge difficulty={item.topic.difficulty} />
                    </div>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-xs font-medium text-slate-300">
                    {item.mode}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                      item.side === "Ủng hộ"
                        ? "bg-blue-500/20 text-blue-300 border border-blue-400/30"
                        : "bg-rose-500/20 text-rose-300 border border-rose-400/30"
                    }`}>
                      {item.side}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center whitespace-nowrap">
                    <span className="font-black text-white text-base font-mono">{item.score}</span>
                    <span className="text-xs text-slate-400">/100</span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-xs text-slate-400 font-mono">
                    {item.date}
                  </td>
                  <td className="px-5 py-4 text-right whitespace-nowrap">
                    <Link
                      to={`/learner/debate/${item.id}/result`}
                      className="px-3.5 py-1.5 bg-slate-800/90 hover:bg-cyan-500 hover:text-slate-950 border border-slate-700 text-cyan-400 text-xs font-bold rounded-xl transition-all inline-flex items-center gap-1.5 shadow-xs"
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
      </div>
    </div>
  );
};

export default DebateHistory;
