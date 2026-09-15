import React from "react";
import Badge from "../common/Badge";
import { TopicDifficulty } from "../../types";

export interface DifficultyBadgeProps {
  difficulty: TopicDifficulty | string;
  className?: string;
}

const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ difficulty, className = "" }) => {
  const getVariant = () => {
    switch (difficulty) {
      case "Dễ":
      case "Easy":
        return "success";
      case "Trung bình":
      case "Medium":
        return "warning";
      case "Khó":
      case "Hard":
        return "danger";
      default:
        return "neutral";
    }
  };

  const getLabel = () => {
    switch (difficulty) {
      case "Easy":
        return "Dễ";
      case "Medium":
        return "Trung bình";
      case "Hard":
        return "Khó";
      default:
        return difficulty;
    }
  };

  return (
    <Badge variant={getVariant()} className={className}>
      {getLabel()}
    </Badge>
  );
};

export default DifficultyBadge;
