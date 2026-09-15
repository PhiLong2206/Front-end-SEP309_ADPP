import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { MOCK_TOPICS } from "../../../mocks/topics";
import Badge from "../../../components/common/Badge";
import DifficultyBadge from "../../../components/topic/DifficultyBadge";
import Button from "../../../components/common/Button";
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
    <div className="space-y-5 max-w-5xl mx-auto">
      {/* Back button */}
      <div>
        <Link
          to="/learner/topics"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft size={13} />
          <span>Quay lại danh sách chủ đề</span>
        </Link>
      </div>

      {/* Main Topic Header Card */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs space-y-2.5">
        <div className="flex items-center gap-2">
          <Badge variant="primary" size="sm">{topic.category}</Badge>
          <DifficultyBadge difficulty={topic.difficulty} />
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
          {topic.title}
        </h1>

        <p className="text-xs text-slate-600 italic">
          Kiến nghị: &ldquo;{topic.motion}&rdquo;
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === "overview"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <BookOpen size={14} />
          <span>Tổng quan</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("materials")}
          className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === "materials"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <FileText size={14} />
          <span>Tài liệu tham khảo</span>
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === "overview" && (
        <div className="space-y-5">
          {/* Section: Bối cảnh (Text on left, small image on right) */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
              Bối cảnh
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
              <div className="sm:col-span-8 space-y-2.5 text-xs text-slate-600 leading-relaxed">
                <p>{topic.backgroundInfo || topic.description}</p>
                <p>
                  Phiên luyện tập sẽ giúp bạn rèn luyện kỹ năng xây dựng luận điểm (Claim), phân tích lập luận (Reasoning) và cung cấp bằng chứng thuyết phục (Evidence) trong tranh biện.
                </p>
              </div>

              {topic.imageUrl && (
                <div className="sm:col-span-4 h-32 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
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
          <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Thiết lập phiên tranh biện
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              {/* Column 1: Chọn phe */}
              <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/80 space-y-2.5">
                <span className="text-xs font-bold text-slate-800 block">
                  Chọn phe của bạn
                </span>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 cursor-pointer text-xs font-semibold text-slate-800 hover:border-blue-400">
                    <input
                      type="radio"
                      name="side"
                      checked={selectedSide === "Ủng hộ"}
                      onChange={() => setSelectedSide("Ủng hộ")}
                      className="text-blue-600"
                    />
                    <span>Ủng hộ</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 cursor-pointer text-xs font-semibold text-slate-800 hover:border-blue-400">
                    <input
                      type="radio"
                      name="side"
                      checked={selectedSide === "Phản đối"}
                      onChange={() => setSelectedSide("Phản đối")}
                      className="text-blue-600"
                    />
                    <span>Phản đối</span>
                  </label>
                </div>
              </div>

              {/* Column 2: Độ khó của đối thủ */}
              <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/80 space-y-2.5">
                <span className="text-xs font-bold text-slate-800 block">
                  Độ khó của đối thủ
                </span>
                <div className="space-y-1.5">
                  {(["Dễ", "Trung bình", "Khó"] as const).map((diff) => (
                    <label
                      key={diff}
                      className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 cursor-pointer text-xs font-semibold text-slate-800 hover:border-blue-400"
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
              <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/80 space-y-2.5">
                <span className="text-xs font-bold text-slate-800 block">
                  Cấu trúc tranh biện
                </span>
                <div className="space-y-1 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>• Mở đầu</span>
                    <span className="font-semibold text-slate-800">3 phút</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Phản biện</span>
                    <span className="font-semibold text-slate-800">3 phút</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Kết luận</span>
                    <span className="font-semibold text-slate-800">2 phút</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200 text-xs text-blue-700 font-bold">
                  Thời lượng dự kiến: 8 phút
                </div>
              </div>
            </div>

            {/* Bottom Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate("/learner/topics")}
              >
                Quay lại
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={handleStartDebate}
                className="px-6 font-bold inline-flex items-center gap-1.5 shadow-xs"
              >
                <Play size={13} className="fill-current" />
                <span>Bắt đầu tranh biện</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Materials */}
      {activeTab === "materials" && (
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Tài liệu tham khảo
          </h2>
          {topic.materials && topic.materials.length > 0 ? (
            <div className="space-y-2.5">
              {topic.materials.map((mat) => (
                <div key={mat.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1">
                  <h3 className="font-bold text-xs text-slate-900">{mat.title}</h3>
                  <p className="text-xs text-slate-600">{mat.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-6 text-center">Chưa có tài liệu đính kèm.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TopicDetail;
