import { Topic } from "../types";

export interface MockTopic extends Topic {
  practicesCount: number;
  tags?: string[];
  imageUrl?: string;
  durationMinutes?: number;
}

export const MOCK_TOPICS: MockTopic[] = [
  {
    id: "topic-ai-control",
    title: "Trí tuệ nhân tạo có nên được quản lý chặt chẽ?",
    motion: "Chính phủ các quốc gia nên ban hành quy chuẩn kiểm soát nghiêm ngặt quy trình huấn luyện và ứng dụng các mô hình AI tạo sinh.",
    description: "Cân bằng giữa đổi mới sáng tạo công nghệ và việc bảo vệ quyền riêng tư, an toàn thông tin và đạo đức AI.",
    category: "Công nghệ",
    difficulty: "Trung bình",
    practicesCount: 2340,
    isActive: true,
    durationMinutes: 8,
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=600&auto=format&fit=crop&q=80",
    backgroundInfo: "Sự phát triển nhanh chóng của các hệ thống AI tạo sinh đang đặt ra nhiều thách thức lớn về bảo mật dữ liệu, bản quyền trí tuệ và nguy cơ lan truyền tin giả diện rộng.",
    prosHints: [
      "Kiểm soát nguy cơ phát tán thông tin giả mạo và deepfake.",
      "Bảo vệ dữ liệu cá nhân của người dùng và sở hữu trí tuệ."
    ],
    consHints: [
      "Quản lý quá mức có thể kìm hãm tốc độ nghiên cứu và đổi mới sáng tạo công nghệ.",
      "Nguy cơ tụt hậu trong cạnh tranh AI toàn cầu."
    ],
    materials: [
      {
        id: "mat-ai-1",
        topicId: "topic-ai-control",
        title: "Báo cáo thường niên về đạo đức Trí tuệ Nhân tạo",
        content: "Phân tích khung pháp lý AI Act của Liên minh Châu Âu và bài học kinh nghiệm quản lý thuật toán.",
        sourceUrl: "https://example.com/ai-report",
        createdAt: "2026-01-10"
      }
    ],
    createdAt: "2026-01-01"
  },
  {
    id: "topic-social-media",
    title: "Mạng xã hội có gây hại nhiều hơn lợi ích?",
    motion: "Chúng tôi tin rằng mạng xã hội đem lại nhiều tác động tiêu cực hơn là tích cực cho sự phát triển tâm lý và lối sống của người trẻ.",
    description: "Phân tích tác động của các nền tảng trực tuyến đến sức khỏe tâm thần, thói quen sinh hoạt và các mối quan hệ xã hội thực tế.",
    category: "Xã hội",
    difficulty: "Trung bình",
    practicesCount: 1890,
    isActive: true,
    durationMinutes: 8,
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
    backgroundInfo: "Mạng xã hội đã trở thành một phần không thể thiếu trong cuộc sống hiện đại. Tuy nhiên, các nghiên cứu gần đây chỉ ra sự gia tăng của hội chứng lo âu xã hội và suy giảm khả năng tập trung sâu ở thanh thiếu niên.",
    prosHints: [
      "Ảnh hưởng tiêu cực đến sức khỏe tâm thần và hội chứng FOMO.",
      "Gia tăng tình trạng bắt nạt qua mạng và so sánh xã hội độc hại."
    ],
    consHints: [
      "Kết nối cộng đồng, chia sẻ tri thức và cơ hội học tập từ xa.",
      "Kênh thể hiện bản thân và phát triển kỹ năng sáng tạo số."
    ],
    materials: [
      {
        id: "mat-sm-1",
        topicId: "topic-social-media",
        title: "Nghiên cứu tác động của mạng xã hội tới tâm lý học đường",
        content: "Khảo sát trên 2.000 học sinh cho thấy tỷ lệ giảm chất lượng giấc ngủ khi sử dụng mạng xã hội ban đêm.",
        sourceUrl: "https://example.com/sm-study",
        createdAt: "2026-01-12"
      }
    ],
    createdAt: "2026-01-05"
  },
  {
    id: "topic-free-college",
    title: "Đại học có nên miễn học phí?",
    motion: "Nhà nước nên bao cấp 100% học phí bậc đại học nhằm đảm bảo quyền tiếp cận giáo dục bình đẳng cho mọi công dân.",
    description: "Đánh giá tính khả thi tài khóa công, giá trị bằng cấp và công bằng xã hội trong cơ hội học tập bậc cao.",
    category: "Giáo dục",
    difficulty: "Khó",
    practicesCount: 1420,
    isActive: true,
    durationMinutes: 8,
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80",
    backgroundInfo: "Chính sách miễn học phí đại học đang được áp dụng tại một số nước Bắc Âu, trong khi nhiều quốc gia khác duy trì cơ chế chia sẻ chi phí hoặc cho vay ưu đãi sinh viên.",
    prosHints: [
      "Giảm rào cản tài chính đối với sinh viên có hoàn cảnh khó khăn.",
      "Nâng cao trình độ học vấn bình quân của lực lượng lao động."
    ],
    consHints: [
      "Gia tăng gánh nặng thuế lên ngân sách nhà nước.",
      "Có thể dẫn tới hiện tượng lạm phát bằng cấp nếu không có tiêu chuẩn đầu vào chặt chẽ."
    ],
    createdAt: "2026-01-08"
  },
  {
    id: "topic-remote-work",
    title: "Làm việc từ xa có hiệu quả hơn làm việc tại văn phòng?",
    motion: "Mô hình làm việc từ xa (Remote Work) đem lại năng suất và chất lượng công việc cao hơn so với mô hình văn phòng truyền thống.",
    description: "So sánh hiệu suất làm việc, sự linh hoạt cuộc sống và sự gắn kết văn hóa doanh nghiệp giữa hai hình thức làm việc.",
    category: "Kinh tế",
    difficulty: "Dễ",
    practicesCount: 1150,
    isActive: true,
    durationMinutes: 8,
    imageUrl: "https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=600&auto=format&fit=crop&q=80",
    backgroundInfo: "Xu hướng làm việc linh hoạt sau đại dịch đã thúc đẩy các doanh nghiệp chuyển đổi số và đánh giá lại tiêu chuẩn năng suất lao động.",
    prosHints: [
      "Tiết kiệm thời gian và chi phí di chuyển hàng ngày.",
      "Tăng sự tự chủ và khả năng cân bằng giữa công việc và gia đình."
    ],
    consHints: [
      "Giảm tương tác trực tiếp và tính gắn kết văn hóa doanh nghiệp.",
      "Khó khăn trong việc phối hợp nhóm tức thì và đào tạo nhân sự mới."
    ],
    createdAt: "2026-01-15"
  },
  {
    id: "topic-autonomous-vehicles",
    title: "Xe tự hành có nên ưu tiên tính mạng hành khách hơn người đi bộ?",
    motion: "Trong các tình huống va chạm không thể tránh khỏi, thuật toán xe tự lái nên ưu tiên bảo vệ hành khách trên xe.",
    description: "Vấn đề đạo đức xe tự lái và nguyên tắc lập trình quyết định sinh tử của thuật toán AI.",
    category: "Đạo đức",
    difficulty: "Khó",
    practicesCount: 890,
    isActive: true,
    durationMinutes: 10,
    imageUrl: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&auto=format&fit=crop&q=80",
    createdAt: "2026-01-20"
  },
  {
    id: "topic-single-use-plastic",
    title: "Có nên cấm hoàn toàn đồ nhựa dùng một lần?",
    motion: "Chính phủ cần ban hành lệnh cấm triệt để việc sản xuất và tiêu thụ đồ nhựa dùng một lần trong thương mại.",
    description: "Đánh giá chi phí chuyển đổi kinh tế so với lợi ích bảo vệ môi trường và hệ sinh thái.",
    category: "Xã hội",
    difficulty: "Dễ",
    practicesCount: 1620,
    isActive: true,
    durationMinutes: 8,
    imageUrl: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=600&auto=format&fit=crop&q=80",
    createdAt: "2026-01-22"
  }
];
