export interface ProgressTimelinePoint {
  date: string;
  score: number;
  topicTitle: string;
}

export interface SkillDistributionItem {
  skill: string;
  score: number;
  fullMark: number;
}

export const MOCK_PROGRESS_DATA = {
  averageScore: 76.4,
  totalDebates: 12,
  streakDays: 5,
  scoreTimeline: [
    { date: "01/03", score: 68, topicTitle: "Đại học miễn phí" },
    { date: "03/03", score: 72, topicTitle: "Xe tự hành" },
    { date: "06/03", score: 70, topicTitle: "Đồ nhựa dùng 1 lần" },
    { date: "09/03", score: 75, topicTitle: "Remote work" },
    { date: "11/03", score: 78, topicTitle: "Quản lý AI" },
    { date: "14/03", score: 82, topicTitle: "Mạng xã hội" }
  ],
  skills: [
    { skill: "Lập luận", score: 82, fullMark: 100 },
    { skill: "Dẫn chứng", score: 64, fullMark: 100 },
    { skill: "Tính liên quan", score: 88, fullMark: 100 },
    { skill: "Cấu trúc", score: 76, fullMark: 100 },
    { skill: "Thuyết phục", score: 78, fullMark: 100 }
  ],
  skillNeedImprovement: {
    name: "Dẫn chứng",
    currentScore: 64,
    description: "Bạn thường đưa ra lập luận logic tốt nhưng thiếu các số liệu, ví dụ thực tế hoặc nghiên cứu uy tín để củng cố độ tin cậy.",
    recommendedTopicId: "topic-1"
  },
  modeStatistics: {
    aiDebates: {
      count: 9,
      percentage: 75,
      avgScore: 77.2
    },
    pvpDebates: {
      count: 3,
      percentage: 25,
      avgScore: 74.0
    }
  }
};
