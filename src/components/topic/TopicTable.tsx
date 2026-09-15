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
      <div className="py-10 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
        <BookOpen className="mx-auto text-slate-400 mb-2" size={28} />
        <p className="text-xs font-medium">Không tìm thấy chủ đề phù hợp</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-400 tracking-wider border-b border-slate-200/80">
            <tr>
              <th scope="col" className="px-5 py-3">Tiêu đề</th>
              <th scope="col" className="px-5 py-3">Danh mục</th>
              <th scope="col" className="px-5 py-3">Độ khó</th>
              <th scope="col" className="px-5 py-3 text-right">Lượt luyện</th>
              <th scope="col" className="px-5 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {topics.map((topic) => (
              <tr key={topic.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-3.5 max-w-md">
                  <div className="font-bold text-slate-900 line-clamp-1">{topic.title}</div>
                  <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{topic.motion}</div>
                </td>
                <td className="px-5 py-3.5 whitespace-nowrap">
                  <Badge variant="primary" size="sm">{topic.category}</Badge>
                </td>
                <td className="px-5 py-3.5 whitespace-nowrap">
                  <DifficultyBadge difficulty={topic.difficulty} />
                </td>
                <td className="px-5 py-3.5 whitespace-nowrap text-right text-xs font-semibold text-slate-700">
                  {topic.practicesCount.toLocaleString()}
                </td>
                <td className="px-5 py-3.5 whitespace-nowrap text-right">
                  <div className="inline-flex items-center gap-2">
                    <Link
                      to={`/learner/topics/${topic.id}`}
                      className="px-2.5 py-1 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                    >
                      Xem chi tiết
                    </Link>
                    <Link
                      to={`/learner/topics/${topic.id}`}
                      className="px-3 py-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-2xs"
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
