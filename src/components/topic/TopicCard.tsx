import React from "react";
import { Link } from "react-router-dom";
import Badge from "../common/Badge";
import DifficultyBadge from "./DifficultyBadge";
import { MockTopic } from "../../mocks/topics";
import { ArrowUpRight } from "lucide-react";

export interface TopicCardProps {
  topic: MockTopic;
  showImage?: boolean;
}

const TopicCard: React.FC<TopicCardProps> = ({ topic, showImage = true }) => {
  return (
    <Link
      to={`/learner/topics/${topic.id}`}
      className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-indigo-300 transition-all duration-300 flex flex-col overflow-hidden group relative"
    >
      {showImage && topic.imageUrl && (
        <div className="h-40 w-full overflow-hidden relative bg-slate-900">
          <img
            src={topic.imageUrl}
            alt={topic.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
          <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
            <ArrowUpRight size={14} />
          </div>
        </div>
      )}

      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Badge variant="primary" size="sm">{topic.category}</Badge>
            <DifficultyBadge difficulty={topic.difficulty} />
          </div>
          <h3 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
            {topic.title}
          </h3>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Tranh biện ngay</span>
          <span className="font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>
    </Link>
  );
};

export default TopicCard;

