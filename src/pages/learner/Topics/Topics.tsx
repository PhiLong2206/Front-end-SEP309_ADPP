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
    <div className="space-y-4">
      {/* Title Header */}
      <div>
        <h1 className="text-xl font-black text-slate-900 tracking-tight">
          Chủ đề tranh biện
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Chọn một chủ đề để bắt đầu luyện tập.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center gap-2.5 justify-between">
        <SearchInput
          value={searchTerm}
          onChange={(val) => {
            setSearchTerm(val);
            setCurrentPage(1);
          }}
          placeholder="Tìm kiếm chủ đề..."
          className="w-full sm:max-w-xs"
        />

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-auto px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
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
            className="w-full sm:w-auto px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
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
