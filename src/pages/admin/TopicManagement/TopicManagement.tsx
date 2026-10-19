import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  Trash2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import topicApi from "../../../api/topicApi";
import { Topic } from "../../../types";

const AdminTopicManagement: React.FC = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("ALL");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchTopicsAndCategories = async () => {
    setLoading(true);
    setError("");
    try {
      const [topicsRes, catRes] = await Promise.all([
        topicApi.getAll({ page: 1, pageSize: 50 }),
        topicApi.getCategories().catch(() => ({ success: false, data: [] as string[] })),
      ]);

      if (topicsRes && topicsRes.success && topicsRes.data) {
        setTopics(topicsRes.data.items || []);
      } else {
        setError(topicsRes?.message || "Không thể tải danh sách chủ đề.");
      }

      if (catRes && catRes.success && catRes.data) {
        setCategories(catRes.data);
      }
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      setError(errObj?.message || "Lỗi khi kết nối với máy chủ chủ đề.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopicsAndCategories();
  }, []);

  const handleDelete = async (topicId: string, title: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa chủ đề "${title}" không?`)) {
      return;
    }

    setDeletingId(topicId);
    try {
      const res = await topicApi.delete(topicId);
      if (res && res.success) {
        setSuccess(`Đã xóa chủ đề "${title}" thành công.`);
        setTopics((prev) => prev.filter((t) => String(t.id) !== String(topicId)));
      } else {
        setError(res?.message || "Xóa chủ đề không thành công.");
      }
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      setError(errObj?.message || "Lỗi khi xóa chủ đề.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredTopics = topics.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "ALL" || t.category === selectedCategory;
    const matchesDifficulty =
      selectedDifficulty === "ALL" || t.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fade-in">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Quản lý chủ đề hệ thống
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Kiểm duyệt, chỉnh sửa và xuất bản các kiến nghị tranh biện trên nền tảng (Dữ liệu thời gian thực từ Backend).
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={fetchTopicsAndCategories}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#1A2E26] hover:bg-slate-100 dark:hover:bg-[#233F34] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-[rgba(148,163,184,0.18)] text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <RefreshCw size={13} className={loading ? "animate-spin text-[#008A64]" : ""} />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
          <AlertCircle size={16} className="text-rose-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 size={16} className="text-[#008A64] shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#12231C] p-4 rounded-2xl border border-slate-200/80 dark:border-[rgba(148,163,184,0.18)] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tiêu đề hoặc mô tả..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-[#0B1713] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008A64]/20 focus:border-[#008A64] text-slate-800 dark:text-slate-200"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <div className="flex items-center gap-1.5">
            <Filter size={13} className="text-slate-400" />
            <span className="text-[11px] font-bold text-slate-500 uppercase">Lọc:</span>
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-[#0B1713] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008A64]/20 focus:border-[#008A64] font-medium text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <option value="ALL">Tất cả danh mục</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-[#0B1713] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008A64]/20 focus:border-[#008A64] font-medium text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <option value="ALL">Mọi độ khó</option>
            <option value="Easy">Dễ (Easy)</option>
            <option value="Medium">Trung bình (Medium)</option>
            <option value="Hard">Khó (Hard)</option>
          </select>
        </div>
      </div>

      {/* Topics Table */}
      <div className="bg-white dark:bg-[#12231C] rounded-2xl border border-slate-200/80 dark:border-[rgba(148,163,184,0.18)] shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">
            <RefreshCw size={24} className="animate-spin text-[#008A64] mx-auto mb-2" />
            <span>Đang tải danh sách chủ đề từ máy chủ Backend...</span>
          </div>
        ) : filteredTopics.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            Không tìm thấy chủ đề nào phù hợp.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#0B1713] text-slate-500 dark:text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">ID</th>
                  <th className="px-5 py-3.5">Tiêu đề kiến nghị</th>
                  <th className="px-5 py-3.5">Danh mục</th>
                  <th className="px-5 py-3.5">Độ khó</th>
                  <th className="px-5 py-3.5 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[rgba(148,163,184,0.12)]">
                {filteredTopics.map((topic) => (
                  <tr key={topic.id} className="hover:bg-slate-50/60 dark:hover:bg-[#1A2E26]/40 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-slate-400">#{topic.id}</td>
                    <td className="px-5 py-3.5 max-w-md">
                      <p className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                        {topic.title}
                      </p>
                      {topic.description && (
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                          {topic.description}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-[11px]">
                        {topic.category || "Chung"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-[#008A64] dark:text-emerald-300 font-bold text-[11px]">
                        {topic.difficulty || "Medium"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      <Link
                        to={`/learner/topics/${topic.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-[11px] font-bold transition-all"
                        title="Xem trang chi tiết chủ đề"
                      >
                        <ExternalLink size={12} />
                        <span>Xem</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleDelete(String(topic.id), topic.title)}
                        disabled={deletingId === String(topic.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-[11px] font-bold transition-all disabled:opacity-50 cursor-pointer"
                        title="Xóa chủ đề"
                      >
                        <Trash2 size={12} />
                        <span>Xóa</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTopicManagement;
