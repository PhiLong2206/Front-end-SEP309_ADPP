import React, { useState, useMemo } from "react";
import SearchInput from "../../../components/common/SearchInput";
import Pagination from "../../../components/common/Pagination";
import TopicTable from "../../../components/topic/TopicTable";
import { MOCK_TOPICS } from "../../../mocks/topics";
import { useDebounce } from "../../../hooks/useDebounce";

const Topics: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedDifficulty, setSelectedDifficulty] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const debouncedSearch = useDebounce(searchTerm, 300);

  const categories = ["ALL", "Công nghệ", "Xã hội", "Giáo dục", "Kinh tế", "Đạo đức"];
  const difficulties = ["ALL", "Dễ", "Trung bình", "Khó"];

  const filteredTopics = useMemo(() => {
    return MOCK_TOPICS.filter((topic) => {
      const matchSearch =
        topic.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        topic.motion.toLowerCase().includes(debouncedSearch.toLowerCase());

      const matchCategory =
        selectedCategory === "ALL" || topic.category === selectedCategory;

      const matchDifficulty =
        selectedDifficulty === "ALL" || topic.difficulty === selectedDifficulty;

      return matchSearch && matchCategory && matchDifficulty;
    });
  }, [debouncedSearch, selectedCategory, selectedDifficulty]);

  const totalPages = Math.ceil(filteredTopics.length / pageSize) || 1;
  const paginatedTopics = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTopics.slice(start, start + pageSize);
  }, [filteredTopics, currentPage, pageSize]);

  return (
    <div className="space-y-5">
      {/* Title Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Chủ đề tranh biện
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          Chọn một chủ đề để bắt đầu luyện tập lập luận và phản biện đa chiều cùng AI.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-[#0e1626]/90 backdrop-blur-xl p-4 rounded-2xl border border-slate-800 shadow-lg flex flex-col sm:flex-row items-center gap-3 justify-between">
        <SearchInput
          value={searchTerm}
          onChange={(val) => {
            setSearchTerm(val);
            setCurrentPage(1);
          }}
          placeholder="Tìm kiếm chủ đề..."
          className="w-full sm:max-w-xs"
        />

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-auto px-3 py-2 text-xs bg-slate-900 border border-slate-700/80 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-medium cursor-pointer"
          >
            <option value="ALL">Tất cả danh mục</option>
            {categories.filter((c) => c !== "ALL").map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Difficulty Dropdown */}
          <select
            value={selectedDifficulty}
            onChange={(e) => {
              setSelectedDifficulty(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-auto px-3 py-2 text-xs bg-slate-900 border border-slate-700/80 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-medium cursor-pointer"
          >
            <option value="ALL">Tất cả độ khó</option>
            {difficulties.filter((d) => d !== "ALL").map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Topics Table */}
      <TopicTable topics={paginatedTopics} />

      {/* Pagination at bottom right */}
      <div className="flex justify-end">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default Topics;
