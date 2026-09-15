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
    <div className="space-y-4 max-w-6xl mx-auto">
      <div>
        <h1 className="text-xl font-black text-slate-900 tracking-tight">
          Trận của tôi
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Danh sách các phiên tranh biện và đánh giá đã hoàn thành.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-400 tracking-wider border-b border-slate-200/80">
              <tr>
                <th scope="col" className="px-5 py-3">Chủ đề</th>
                <th scope="col" className="px-5 py-3">Hình thức</th>
                <th scope="col" className="px-5 py-3">Phe</th>
                <th scope="col" className="px-5 py-3 text-center">Điểm số</th>
                <th scope="col" className="px-5 py-3">Ngày đấu</th>
                <th scope="col" className="px-5 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {historyList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-3.5 max-w-sm">
                    <div className="font-bold text-slate-900 line-clamp-1">{item.topic.title}</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Badge variant="primary" size="sm">{item.topic.category}</Badge>
                      <DifficultyBadge difficulty={item.topic.difficulty} />
                    </div>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap text-xs font-medium text-slate-700">
                    {item.mode}
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      item.side === "Ủng hộ" ? "bg-blue-50 text-blue-700" : "bg-rose-50 text-rose-700"
                    }`}>
                      {item.side}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-center whitespace-nowrap">
                    <span className="font-black text-slate-900 text-sm">{item.score}</span>
                    <span className="text-[10px] text-slate-400">/100</span>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap text-xs text-slate-500">
                    {item.date}
                  </td>
                  <td className="px-5 py-3.5 text-right whitespace-nowrap">
                    <Link
                      to={`/learner/debate/${item.id}/result`}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-md transition-colors inline-flex items-center gap-1"
                    >
                      <span>Xem kết quả</span>
                      <ArrowRight size={12} />
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
