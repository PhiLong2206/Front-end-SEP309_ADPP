import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { MOCK_TOPICS } from "../../../mocks/topics";
import Badge from "../../../components/common/Badge";
import DifficultyBadge from "../../../components/topic/DifficultyBadge";
import { ArrowLeft, BookOpen, FileText, Play } from "lucide-react";

const TopicDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const topic = MOCK_TOPICS.find((t) => t.id === id) || MOCK_TOPICS[1]; // default social media topic

  const [activeTab, setActiveTab] = useState<"overview" | "materials">("overview");
  const [selectedSide, setSelectedSide] = useState<"Ủng hộ" | "Phản đối">("Ủng hộ");
  const [selectedDifficulty, setSelectedDifficulty] = useState<"Dễ" | "Trung bình" | "Khó">("Trung bình");

  const handleStartDebate = () => {
    navigate(`/learner/debate/session-${topic.id}`);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back button */}
      <div>
        <Link
          to="/learner/topics"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft size={15} />
          <span>Quay lại danh sách chủ đề</span>
        </Link>
      </div>

      {/* Main Topic Header Card */}
      <div className="bg-[#0e1626]/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="primary" size="sm">{topic.category}</Badge>
          <DifficultyBadge difficulty={topic.difficulty} />
        </div>

        <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight leading-snug">
          {topic.title}
        </h1>

        <p className="text-xs sm:text-sm text-slate-400 italic">
          Kiến nghị: &ldquo;{topic.motion}&rdquo;
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "overview"
              ? "border-blue-500 text-cyan-400"
              : "border-transparent text-slate-400 hover:text-white"
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
              ? "border-blue-500 text-cyan-400"
              : "border-transparent text-slate-400 hover:text-white"
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
          <div className="bg-[#0e1626]/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-800 shadow-xl">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Bối cảnh & Mục tiêu
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
              <div className="sm:col-span-8 space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <p>{topic.backgroundInfo || topic.description}</p>
                <p className="text-slate-400">
                  Phiên luyện tập sẽ giúp bạn rèn luyện kỹ năng xây dựng luận điểm (Claim), phân tích lập luận (Reasoning) và cung cấp bằng chứng thuyết phục (Evidence) trong tranh biện.
                </p>
              </div>

              {topic.imageUrl && (
                <div className="sm:col-span-4 h-36 rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 shrink-0 shadow-md">
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
          <div className="bg-[#0e1626]/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-800 shadow-xl space-y-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Thiết lập phiên tranh biện
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              {/* Column 1: Chọn phe */}
              <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-white block">
                  Chọn phe của bạn
                </span>
                <div className="space-y-2">
                  <label className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer text-xs sm:text-sm font-semibold transition-all ${
                    selectedSide === "Ủng hộ"
                      ? "bg-blue-600/20 border-blue-500/50 text-white"
                      : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}>
                    <input
                      type="radio"
                      name="side"
                      checked={selectedSide === "Ủng hộ"}
                      onChange={() => setSelectedSide("Ủng hộ")}
                      className="text-blue-600"
                    />
                    <span>Ủng hộ</span>
                  </label>

                  <label className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer text-xs sm:text-sm font-semibold transition-all ${
                    selectedSide === "Phản đối"
                      ? "bg-rose-600/20 border-rose-500/50 text-white"
                      : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}>
                    <input
                      type="radio"
                      name="side"
                      checked={selectedSide === "Phản đối"}
                      onChange={() => setSelectedSide("Phản đối")}
                      className="text-rose-600"
                    />
                    <span>Phản đối</span>
                  </label>
                </div>
              </div>

              {/* Column 2: Độ khó của đối thủ */}
              <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-white block">
                  Độ khó của AI
                </span>
                <div className="space-y-2">
                  {(["Dễ", "Trung bình", "Khó"] as const).map((diff) => (
                    <label
                      key={diff}
                      className={`flex items-center gap-2.5 p-2 rounded-xl border cursor-pointer text-xs sm:text-sm font-semibold transition-all ${
                        selectedDifficulty === diff
                          ? "bg-blue-600/20 border-blue-500/50 text-white"
                          : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <input
                        type="radio"
                        name="difficulty"
                        checked={selectedDifficulty === diff}
                        onChange={() => setSelectedDifficulty(diff)}
                        className="text-blue-600"
                      />
                      <span>{diff}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Column 3: Cấu trúc tranh biện */}
              <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-white block">
                  Cấu trúc thời gian
                </span>
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>• Mở đầu</span>
                    <span className="font-semibold text-white font-mono">3 phút</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Phản biện</span>
                    <span className="font-semibold text-white font-mono">3 phút</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Kết luận</span>
                    <span className="font-semibold text-white font-mono">2 phút</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-800 text-xs text-cyan-400 font-bold">
                  Thời lượng dự kiến: 8 phút
                </div>
              </div>
            </div>

            {/* Bottom Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <Link
                to="/learner/topics"
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-xl text-xs sm:text-sm font-semibold transition-all"
              >
                Quay lại
              </Link>

              <button
                type="button"
                onClick={handleStartDebate}
                className="px-7 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-sm font-bold rounded-2xl shadow-lg shadow-blue-600/30 transition-all inline-flex items-center gap-2 hover:scale-102"
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
        <div className="bg-[#0e1626]/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Tài liệu tham khảo
          </h2>
          {topic.materials && topic.materials.length > 0 ? (
            <div className="space-y-3">
              {topic.materials.map((mat) => (
                <div key={mat.id} className="p-4 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-1.5">
                  <h3 className="font-bold text-sm text-white">{mat.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{mat.content}</p>
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
