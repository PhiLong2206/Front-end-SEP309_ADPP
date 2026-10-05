import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowUpRight, BookOpen } from "lucide-react";
import DifficultyBadge from "../../../components/topic/DifficultyBadge";
import Pagination from "../../../components/common/Pagination";
import { Topic } from "../../../types";
import { useDebounce } from "../../../hooks/useDebounce";

const Topics: React.FC = () => {
  const [topics] = useState<Topic[]>([]);
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
    return topics.filter((topic) => {
      const matchSearch =
        topic.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        topic.motion?.toLowerCase().includes(debouncedSearch.toLowerCase());

      const matchCategory =
        selectedCategory === "Tất cả" || topic.category === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [topics, debouncedSearch, selectedCategory]);

  const totalPages = Math.ceil(filteredTopics.length / pageSize) || 1;
  const paginatedTopics = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTopics.slice(start, start + pageSize);
  }, [filteredTopics, currentPage, pageSize]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
          Danh mục chủ đề
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Khám phá và lựa chọn các chủ đề phong phú để bắt đầu luyện tập phản biện.
        </p>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Tìm kiếm chủ đề, kiến nghị..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#008A64]/20 focus:border-[#008A64] shadow-xs transition-colors"
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

      {/* Grid of Cards */}
      {paginatedTopics.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-500 shadow-xs space-y-3">
          <BookOpen size={36} className="mx-auto text-slate-300" />
          <p className="text-sm font-semibold">Chưa có chủ đề tranh biện nào trên hệ thống.</p>
          <p className="text-xs text-slate-400">Chủ đề từ máy chủ sẽ được hiển thị tại đây khi được thêm vào cơ sở dữ liệu.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedTopics.map((topic) => (
            <Link
              key={topic.id}
              to={`/learner/topics/${topic.id}`}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-[#008A64]/40 transition-all duration-300 flex flex-col overflow-hidden group"
            >
              {topic.imageUrl && (
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
              )}

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
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
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
