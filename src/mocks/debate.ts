export interface MockDebateMessage {
  id: string;
  speaker: "Learner" | "AI";
  speakerName: string;
  side: "Ủng hộ" | "Phản đối";
  stage: "Mở đầu" | "Phản biện" | "Kết luận";
  roundNumber: number;
  timestamp: string;
  content: string;
}

export const MOCK_DEBATE_TRANSCRIPT: MockDebateMessage[] = [
  {
    id: "msg-1",
    speaker: "Learner",
    speakerName: "Phi Long",
    side: "Ủng hộ",
    stage: "Mở đầu",
    roundNumber: 1,
    timestamp: "10:02",
    content: "Chào mọi người. Tôi ủng hộ quan điểm rằng mạng xã hội đang gây hại nhiều hơn mang lại lợi ích cho thanh thiếu niên. Lý do đầu tiên là sức khỏe tâm thần: việc tiếp xúc liên tục với các hình ảnh hoàn hảo giả tạo dẫn đến hội chứng so sánh xã hội tiêu cực, làm gia tăng tỷ lệ trầm cảm và tự ti ở người trẻ."
  },
  {
    id: "msg-2",
    speaker: "AI",
    speakerName: "AI Opponent (Phản biện)",
    side: "Phản đối",
    stage: "Mở đầu",
    roundNumber: 1,
    timestamp: "10:03",
    content: "Tôi xin phản bác lại. Mạng xã hội về bản chất chỉ là một công cụ truyền thông. Vấn đề không nằm ở bản thân nền tảng mà nằm ở cách sử dụng và sự định hướng từ gia đình. Mạng xã hội mở ra cánh cửa học hỏi không biên giới, cho phép các bạn trẻ ở vùng sâu vùng xa tiếp cận kho tri thức nhân loại, kết nối bạn bè cùng chí hướng và phát triển kỹ năng sáng tạo nội dung số mà trường học truyền thống chưa kịp đáp ứng."
  },
  {
    id: "msg-3",
    speaker: "Learner",
    speakerName: "Phi Long",
    side: "Ủng hộ",
    stage: "Phản biện",
    roundNumber: 2,
    timestamp: "10:05",
    content: "Mặc dù AI nêu ra lợi ích kết nối, nhưng các thuật toán mạng xã hội hiện nay được thiết kế có chủ đích để gây nghiện (dopamine loop). Người trẻ chưa phát triển đầy đủ thùy trán để tự kiểm soát thời gian, dẫn đến suy giảm giấc ngủ và khả năng tư duy tập trung sâu."
  },
  {
    id: "msg-4",
    speaker: "AI",
    speakerName: "AI Opponent (Phản biện)",
    side: "Phản đối",
    stage: "Phản biện",
    roundNumber: 2,
    timestamp: "10:06",
    content: "Lập luận về thuật toán có phần hợp lý, nhưng không thể phủ nhận rằng các giải pháp kỹ thuật số và tính năng quản lý thời lượng màn hình (Screen Time limit) đang được các nền tảng cập nhật liên tục. Trách nhiệm chính vẫn thuộc về giáo dục kỹ năng số (Digital Literacy) cho thanh thiếu niên thay vì đổ lỗi hoàn toàn cho nền tảng."
  }
];

export const MOCK_REBUTTAL_TIPS = {
  mainPoint: "Đối phương cho rằng mạng xã hội chỉ là công cụ trung lập và trách nhiệm thuộc về người dùng cùng giáo dục kỹ năng số.",
  vulnerabilities: [
    "Xem nhẹ sự chênh lệch quyền lực giữa các thuật toán tối ưu hóa tương tác của Big Tech và tâm lý non nớt của trẻ vị thành niên.",
    "Bỏ qua số liệu thực tế về các vụ rò rỉ dữ liệu và nội dung độc hại vượt qua bộ lọc kiểm duyệt."
  ],
  suggestedDirections: [
    "Nhấn mạnh tính bất cân xứng: Thuật toán AI được thiết kế bởi hàng nghìn kỹ sư để giữ chân người dùng thì không thể đơn thuần dựa vào ý chí tự kiểm soát của trẻ em.",
    "Đưa ra số liệu về tỷ lệ bắt nạt qua mạng và việc thiếu chế tài kiểm duyệt nội dung độc hại hiệu quả."
  ],
  suggestedQuestions: [
    "Nếu chỉ dựa vào giáo dục ý thức, tại sao chính các nhà sáng lập công nghệ ở Thung lũng Silicon lại cấm con cái họ sử dụng mạng xã hội từ sớm?",
    "Liệu một thanh thiếu niên 13 tuổi có đủ năng lực chống lại thuật toán được tinh chỉnh để giữ chân người dùng hàng giờ liền?"
  ]
};

export const MOCK_DEBATE_RESULT: {
  sessionId: string;
  topicTitle: string;
  overallScore: number;
  ratingText: string;
  scores: {
    logic: number;
    evidence: number;
    relevance: number;
    structure: number;
    persuasiveness: number;
  };
  strengths: string[];
  improvements: string[];
} = {
  sessionId: "session-demo-01",
  topicTitle: "Mạng xã hội có gây hại nhiều hơn lợi ích?",
  overallScore: 76,
  ratingText: "Khá tốt",
  scores: {
    logic: 80,
    evidence: 65,
    relevance: 85,
    structure: 75,
    persuasiveness: 75
  },
  strengths: [
    "Lập luận rõ ràng, mạch lạc và có cấu trúc xuyên suốt các vòng đấu.",
    "Xác định đúng trọng tâm vấn đề và bám sát chuyển biến của luận điểm đối phương.",
    "Khả năng phân tích tâm lý người dùng và tác động của thuật toán thuyết phục."
  ],
  improvements: [
    "Cần bổ sung thêm dẫn chứng, số liệu thống kê hoặc trích dẫn nghiên cứu khoa học cụ thể.",
    "Ở phần phản biện vòng 2, cần xoáy sâu hơn vào tính bất khả thi của việc tự kiểm soát thời gian."
  ]
};
