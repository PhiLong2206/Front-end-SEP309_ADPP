import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowUpRight } from "lucide-react";
import DifficultyBadge from "../../../components/topic/DifficultyBadge";
import Pagination from "../../../components/common/Pagination";
import { MockTopic } from "../../../mocks/topics";
import { useDebounce } from "../../../hooks/useDebounce";

// Extended mock topics for rich 6-card display matching screen 5
const EXTENDED_TOPICS: MockTopic[] = [
  {
    id: "topic-social-media",
    title: "Mạng xã hội có gây hại nhiều hơn lợi ích?",
    motion: "Chúng tôi tin rằng mạng xã hội đem lại nhiều tác động tiêu cực hơn là tích cực cho sự phát triển của giới trẻ.",
    description: "Phân tích ảnh hưởng của mạng xã hội đến tâm lý, sự tập trung và gắn kết đời thực.",
    category: "Xã hội",
    difficulty: "Trung bình",
    practicesCount: 1200,
    isActive: true,
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
    createdAt: "2026-01-05"
  },
  {
    id: "topic-ai-control",
    title: "Trí tuệ nhân tạo có nên được quản lý chặt chẽ?",
    motion: "Chính phủ các quốc gia nên ban hành quy chuẩn kiểm soát nghiêm ngặt quy trình huấn luyện AI.",
    description: "Cân bằng giữa đổi mới sáng tạo công nghệ và an toàn đạo đức thông tin.",
    category: "Công nghệ",
    difficulty: "Trung bình",
    practicesCount: 2500,
    isActive: true,
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=600&auto=format&fit=crop&q=80",
    createdAt: "2026-01-01"
  },
  {
    id: "topic-free-college",
    title: "Giáo dục đại học có nên miễn phí?",
    motion: "Nhà nước nên bao cấp 100% học phí bậc đại học nhằm đảm bảo quyền tiếp cận giáo dục bình đẳng.",
    description: "Đánh giá tính khả thi tài khóa công, giá trị bằng cấp và công bằng xã hội.",
    category: "Giáo dục",
    difficulty: "Dễ",
    practicesCount: 856,
    isActive: true,
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80",
    createdAt: "2026-01-08"
  },
  {
    id: "topic-climate-change",
    title: "Biến đổi khí hậu có phải là ưu tiên hàng đầu?",
    motion: "Chính sách ứng phó biến đổi khí hậu phải được ưu tiên cao hơn tăng trưởng kinh tế ngắn hạn.",
    description: "Chi phí chuyển đổi năng lượng xanh so với nguy cơ thảm họa sinh thái toàn cầu.",
    category: "Môi trường",
    difficulty: "Trung bình",
    practicesCount: 1100,
    isActive: true,
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
    createdAt: "2026-01-10"
  },
  {
    id: "topic-digital-economy",
    title: "Nền kinh tế số có làm gia tăng bất bình đẳng?",
    motion: "Sự bùng nổ của nền kinh tế nền tảng đang làm nới rộng khoảng cách giàu nghèo.",
    description: "Cơ hội việc làm công nghệ mới và nguy cơ mất an sinh của lao động truyền thống.",
    category: "Kinh tế",
    difficulty: "Khó",
    practicesCount: 642,
    isActive: true,
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80",
    createdAt: "2026-01-15"
  },
  {
    id: "topic-genetic-engineering",
    title: "Genetic engineering: cơ hội hay mối đe dọa?",
    motion: "Cho phép chỉnh sửa gen phôi người nhằm mục đích loại bỏ bệnh di truyền.",
    description: "Ranh giới giữa chữa bệnh nhân đạo và nguy cơ tạo ra con người nhân tạo theo đơn đặt hàng.",
    category: "Khoa học",
    difficulty: "Khó",
    practicesCount: 418,
    isActive: true,
    imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&auto=format&fit=crop&q=80",
    createdAt: "2026-01-20"
  }
];

const Topics: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const debouncedSearch = useDebounce(searchTerm, 300);

  const categories = [
    "Tất cả",
    "Xã hội",
    "Giáo dục",
    "Công nghệ",
    "Môi trường",
    "Kinh tế",
    "Văn hóa",
  ];

  const filteredTopics = useMemo(() => {
    return EXTENDED_TOPICS.filter((topic) => {
      const matchSearch =
        topic.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        topic.motion?.toLowerCase().includes(debouncedSearch.toLowerCase());

      const matchCategory =
        selectedCategory === "Tất cả" || topic.category === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [debouncedSearch, selectedCategory]);

  const totalPages = Math.ceil(filteredTopics.length / pageSize) || 1;
  const paginatedTopics = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTopics.slice(start, start + pageSize);
  }, [filteredTopics, currentPage, pageSize]);

  return (
    <div className="space-y-6">
      {/* Top Search & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Bar with rounded-full pill design */}
        <div className="relative w-full md:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Tìm kiếm chủ đề, kỹ năng..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 rounded-full text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#008A64] focus:ring-2 focus:ring-[#008A64]/15 shadow-xs transition-all"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full sidebar-scroll">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shadow-xs ${
                  isActive
                    ? "bg-[#008A64] text-white shadow-[#008A64]/20"
                    : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of 6 Cards (3 Columns on desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {paginatedTopics.map((topic) => (
          <Link
            key={topic.id}
            to={`/learner/topics/${topic.id}`}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-[#008A64]/40 transition-all duration-300 flex flex-col overflow-hidden group"
          >
            {/* Thumbnail Image */}
            <div className="h-40 w-full overflow-hidden relative bg-slate-100">
              <img
                src={topic.imageUrl}
                alt={topic.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity shadow-xs">
                <ArrowUpRight size={14} className="text-[#008A64]" />
              </div>
            </div>

            {/* Content Area */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <h3 className="font-bold text-[#0F172A] text-sm sm:text-base line-clamp-2 leading-snug group-hover:text-[#008A64] transition-colors">
                  {topic.title}
                </h3>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 border border-blue-200 text-blue-700">
                  {topic.category}
                </span>
                <DifficultyBadge difficulty={topic.difficulty} />
                <span className="text-xs text-slate-400 font-medium ml-auto">
                  {topic.practicesCount ? `${topic.practicesCount >= 1000 ? (topic.practicesCount/1000).toFixed(1) + 'k' : topic.practicesCount}` : "1.2k"}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination at bottom right */}
      {totalPages > 1 && (
        <div className="flex justify-end pt-2">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default Topics;
