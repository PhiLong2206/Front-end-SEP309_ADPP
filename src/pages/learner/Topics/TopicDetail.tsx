import React, { useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { Topic } from "../../../types";
import Badge from "../../../components/common/Badge";
import DifficultyBadge from "../../../components/topic/DifficultyBadge";
import { ArrowLeft, BookOpen, FileText, Play } from "lucide-react";

const TopicDetail: React.FC = () => {
  const { id: _id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const topic: Topic | null = (location.state as { topic?: Topic })?.topic || null;

  const [activeTab, setActiveTab] = useState<"overview" | "materials">("overview");
  const [selectedSide, setSelectedSide] = useState<"Ủng hộ" | "Phản đối">("Ủng hộ");
  const [selectedDifficulty, setSelectedDifficulty] = useState<"Dễ" | "Trung bình" | "Khó">("Trung bình");

  if (!topic) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto py-16 text-center">
        <p className="text-base font-bold text-slate-800">Không tìm thấy chủ đề tranh biện</p>
        <p className="text-xs text-slate-500 mt-1">Chủ đề này không tồn tại hoặc chưa được tạo trên máy chủ.</p>
        <Link
          to="/learner/topics"
          className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-[#008A64] hover:bg-[#007457] text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
        >
          <ArrowLeft size={14} /> Quay lại danh sách chủ đề
        </Link>
      </div>
    );
  }

  const handleStartDebate = () => {
    navigate(`/learner/debate/session-${topic.id}`);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back button */}
      <div>
        <Link
          to="/learner/topics"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-[#008A64] transition-colors"
        >
          <ArrowLeft size={15} />
          <span>Quay lại danh sách chủ đề</span>
        </Link>
      </div>

      {/* Main Topic Header Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="primary" size="sm">{topic.category}</Badge>
          <DifficultyBadge difficulty={topic.difficulty} />
        </div>

        <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
          {topic.title}
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 italic">
          Kiến nghị: &ldquo;{topic.motion}&rdquo;
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "overview"
              ? "border-[#008A64] text-[#008A64]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <BookOpen size={16} />
          <span>Tổng quan</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("materials")}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "materials"
              ? "border-[#008A64] text-[#008A64]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <FileText size={16} />
          <span>Tài liệu tham khảo</span>
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Section: Bối cảnh */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Bối cảnh & Mục tiêu
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
              <div className="sm:col-span-8 space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <p>{topic.backgroundInfo || topic.description}</p>
                <p className="text-slate-500">
                  Phiên luyện tập sẽ giúp bạn rèn luyện kỹ năng xây dựng luận điểm, phân tích lập luận và cung cấp bằng chứng thuyết phục trong tranh biện.
                </p>
              </div>

              {topic.imageUrl && (
                <div className="sm:col-span-4 h-36 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0 shadow-xs">
                  <img
                    src={topic.imageUrl}
                    alt={topic.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Section: Thiết lập phiên tranh biện (3 Columns) */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Thiết lập phiên tranh biện
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              {/* Column 1: Chọn phe */}
              <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-800 block">
                  Chọn phe của bạn
                </span>
                <div className="space-y-2">
                  <label className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer text-xs sm:text-sm font-semibold transition-all ${
                    selectedSide === "Ủng hộ"
                      ? "bg-[#ECFDF5] border-[#008A64] text-[#008A64]"
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}>
                    <input
                      type="radio"
                      name="side"
                      checked={selectedSide === "Ủng hộ"}
                      onChange={() => setSelectedSide("Ủng hộ")}
                      className="accent-[#008A64]"
                    />
                    <span>Ủng hộ (Pro)</span>
                  </label>

                  <label className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer text-xs sm:text-sm font-semibold transition-all ${
                    selectedSide === "Phản đối"
                      ? "bg-rose-50 border-rose-400 text-rose-700"
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}>
                    <input
                      type="radio"
                      name="side"
                      checked={selectedSide === "Phản đối"}
                      onChange={() => setSelectedSide("Phản đối")}
                      className="accent-rose-600"
                    />
                    <span>Phản đối (Con)</span>
                  </label>
                </div>
              </div>

              {/* Column 2: Độ khó của đối thủ */}
              <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-800 block">
                  Độ khó của AI
                </span>
                <div className="space-y-2">
                  {(["Dễ", "Trung bình", "Khó"] as const).map((diff) => (
                    <label
                      key={diff}
                      className={`flex items-center gap-2.5 p-2 rounded-xl border cursor-pointer text-xs sm:text-sm font-semibold transition-all ${
                        selectedDifficulty === diff
                          ? "bg-[#ECFDF5] border-[#008A64] text-[#008A64]"
                          : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="difficulty"
                        checked={selectedDifficulty === diff}
                        onChange={() => setSelectedDifficulty(diff)}
                        className="accent-[#008A64]"
                      />
                      <span>{diff}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Column 3: Cấu trúc tranh biện */}
              <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-800 block">
                  Cấu trúc thời gian
                </span>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>• Mở đầu</span>
                    <span className="font-semibold text-slate-900 font-mono">3 phút</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Phản biện</span>
                    <span className="font-semibold text-slate-900 font-mono">3 phút</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Kết luận</span>
                    <span className="font-semibold text-slate-900 font-mono">2 phút</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200 text-xs text-[#008A64] font-bold">
                  Thời lượng dự kiến: 8 phút
                </div>
              </div>
            </div>

            {/* Bottom Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <Link
                to="/learner/topics"
                className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs"
              >
                Quay lại
              </Link>

              <button
                type="button"
                onClick={handleStartDebate}
                className="px-7 py-3 bg-[#008A64] hover:bg-[#007457] text-white text-sm font-bold rounded-2xl shadow-md shadow-[#008A64]/20 transition-all inline-flex items-center gap-2 hover:scale-102"
              >
                <Play size={15} className="fill-current" />
                <span>Bắt đầu tranh biện</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Materials */}
      {activeTab === "materials" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Tài liệu tham khảo
          </h2>
          {topic.materials && topic.materials.length > 0 ? (
            <div className="space-y-3">
              {topic.materials.map((mat) => (
                <div key={mat.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-1.5">
                  <h3 className="font-bold text-sm text-slate-900">{mat.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{mat.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-8 text-center">Chưa có tài liệu đính kèm.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TopicDetail;
