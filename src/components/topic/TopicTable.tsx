import React from "react";
import { Link } from "react-router-dom";
import Badge from "../common/Badge";
import DifficultyBadge from "./DifficultyBadge";
import { MockTopic } from "../../mocks/topics";
import { BookOpen } from "lucide-react";

export interface TopicTableProps {
  topics: MockTopic[];
}

const TopicTable: React.FC<TopicTableProps> = ({ topics }) => {
  if (topics.length === 0) {
    return (
      <div className="py-12 text-center text-slate-400 bg-[#0e1626]/90 rounded-2xl border border-slate-800 shadow-lg">
        <BookOpen className="mx-auto text-slate-500 mb-2" size={32} />
        <p className="text-sm font-medium">Không tìm thấy chủ đề phù hợp</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0e1626]/90 backdrop-blur-xl rounded-2xl border border-slate-800 overflow-hidden shadow-xl shadow-black/30">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/90 text-[11px] font-bold uppercase text-slate-400 tracking-wider border-b border-slate-800">
            <tr>
              <th scope="col" className="px-5 py-3.5">Tiêu đề & Kiến nghị</th>
              <th scope="col" className="px-5 py-3.5">Danh mục</th>
              <th scope="col" className="px-5 py-3.5">Độ khó</th>
              <th scope="col" className="px-5 py-3.5 text-right">Lượt luyện</th>
              <th scope="col" className="px-5 py-3.5 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {topics.map((topic) => (
              <tr key={topic.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="px-5 py-4 max-w-md">
                  <div className="font-bold text-white text-sm line-clamp-1">{topic.title}</div>
                  <div className="text-xs text-slate-400 line-clamp-1 mt-0.5">{topic.motion}</div>
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <Badge variant="primary" size="sm">{topic.category}</Badge>
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <DifficultyBadge difficulty={topic.difficulty} />
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-right text-xs font-semibold text-slate-300 font-mono">
                  {topic.practicesCount.toLocaleString()}
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-right">
                  <div className="inline-flex items-center gap-2">
                    <Link
                      to={`/learner/topics/${topic.id}`}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800/90 hover:bg-slate-700 hover:text-white border border-slate-700 rounded-xl transition-colors"
                    >
                      Chi tiết
                    </Link>
                    <Link
                      to={`/learner/topics/${topic.id}`}
                      className="px-3.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl transition-all shadow-md shadow-blue-600/30 hover:scale-102"
                    >
                      Bắt đầu
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopicTable;
