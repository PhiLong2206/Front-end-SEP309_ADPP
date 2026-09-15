import React from "react";
import { Link } from "react-router-dom";
import Badge from "../common/Badge";
import DifficultyBadge from "./DifficultyBadge";
import { MockTopic } from "../../mocks/topics";

export interface TopicCardProps {
  topic: MockTopic;
  showImage?: boolean;
}

const TopicCard: React.FC<TopicCardProps> = ({ topic, showImage = true }) => {
  return (
    <Link
      to={`/learner/topics/${topic.id}`}
      className="bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-sm hover:border-slate-300 transition-all flex flex-col overflow-hidden group"
    >
      {showImage && topic.imageUrl && (
        <div className="h-32 w-full overflow-hidden relative bg-slate-100">
          <img
            src={topic.imageUrl}
            alt={topic.title}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
          />
        </div>
      )}

      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="font-bold text-slate-900 text-xs line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
            {topic.title}
          </h3>
        </div>

        <div className="flex items-center gap-1.5 pt-1">
          <Badge variant="primary" size="sm">{topic.category}</Badge>
          <DifficultyBadge difficulty={topic.difficulty} />
        </div>
      </div>
    </Link>
  );
};

export default TopicCard;
