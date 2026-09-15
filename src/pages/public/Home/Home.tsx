import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Bot, Swords, BarChart3 } from "lucide-react";
import TopicCard from "../../../components/topic/TopicCard";
import { MOCK_TOPICS } from "../../../mocks/topics";
import { useAuth } from "../../../hooks/useAuth";

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const featuredTopics = MOCK_TOPICS.slice(0, 4);

  return (
    <div className="space-y-12 pb-16 bg-slate-50 min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column (~55%) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Outlined University Capstone Label */}
            <div className="inline-block">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium text-slate-700 bg-white border border-slate-300 shadow-2xs">
                Đề tài Khóa luận Tốt nghiệp - Đại học FPT
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold tracking-tight leading-[1.15] text-slate-900">
              Luyện tranh biện. <br />
              <span className="text-blue-600">Rèn tư duy.</span>
            </h1>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
              Nền tảng giúp bạn luyện tập lập luận, phản biện và nhận đánh giá sau mỗi
              phiên tranh biện với trợ lý AI và cộng đồng sinh viên.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                to={isAuthenticated ? "/learner/dashboard" : "/register"}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs transition-colors inline-flex items-center gap-1.5"
              >
                <span>Bắt đầu luyện tập</span>
                <ArrowRight size={13} />
              </Link>
              <Link
                to="/learner/topics"
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-md border border-slate-300 shadow-2xs transition-colors inline-flex items-center gap-1.5"
              >
                <BookOpen size={13} className="text-slate-500" />
                <span>Khám phá chủ đề</span>
              </Link>
            </div>

            {/* Subtle Divider */}
            <hr className="border-slate-200/90 pt-1" />

            {/* Hero Statistics: exactly 3 compact columns, no cards, no icons */}
            <div className="grid grid-cols-3 gap-4 pt-1">
              <div>
                <p className="text-sm font-bold text-slate-900">3 Vòng</p>
                <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                  Mở đầu · Phản biện · Kết luận
                </p>
              </div>

              <div>
                <p className="text-sm font-bold text-slate-900">5 Tiêu chí</p>
                <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                  Đánh giá năng lực tranh biện
                </p>
              </div>

              <div>
                <p className="text-sm font-bold text-slate-900">2 Hình thức</p>
                <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                  Với AI · Tranh biện 1 vs 1
                </p>
              </div>
            </div>
          </div>

          {/* Right Column (~45%): Compact Debate UI Preview Window */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden text-xs">
              {/* Preview Window Header */}
              <div className="bg-slate-100/90 px-3.5 py-2 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  </div>
                  <span className="font-semibold text-[11px] text-slate-700 ml-1">
                    Phòng tranh biện AI mẫu
                  </span>
                </div>

                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Đang diễn ra</span>
                </div>
              </div>

              {/* Debate Body Content */}
              <div className="p-3.5 space-y-3 bg-white">
                {/* Motion Statement */}
                <div className="p-2.5 rounded-md bg-blue-50/70 border border-blue-100">
                  <p className="text-[11px] font-medium text-blue-900 leading-snug">
                    <span className="font-bold">Kiến nghị:</span> &ldquo;Mạng xã hội có gây hại nhiều hơn mang lại lợi ích cho giới trẻ?&rdquo;
                  </p>
                </div>

                {/* Argument 1: Affirmative (User) */}
                <div className="p-2.5 rounded-md border border-slate-200 bg-slate-50/60 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-900">Bạn (Phe Ủng hộ)</span>
                    <span className="text-[10px] text-slate-500 font-medium">Vòng 1 - Mở đầu</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Mạng xã hội làm gia tăng tỷ lệ trầm cảm và hội chứng FOMO ở giới trẻ do
                    sự so sánh xã hội liên tục...
                  </p>
                </div>

                {/* Argument 2: Negative (AI Opponent) */}
                <div className="p-2.5 rounded-md border border-slate-200 bg-slate-50/60 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-blue-700">Đối thủ AI (Phe Phản đối)</span>
                    <span className="text-[10px] text-slate-500 font-medium">Vòng 1 - Phản hồi</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Bản chất công nghệ là trung tính. Mạng xã hội cũng là kênh học tập cộng
                    tác và mở rộng cơ hội nghề nghiệp lớn nhất...
                  </p>
                </div>
              </div>

              {/* Preview Window Bottom Status & Score */}
              <div className="bg-slate-50 px-3.5 py-2.5 border-t border-slate-200 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  <span className="font-medium">Trọng tài AI chấm điểm Rubric</span>
                </div>
                <div className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/80">
                  Điểm tổng: 76/100 (Khá tốt)
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PRACTICE METHODS SECTION */}
      <section id="methods" className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <div className="mb-4">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Bạn có thể luyện tập như thế nào?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Bot size={16} />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-xs font-bold text-slate-900">Tranh biện với AI</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Luyện tập đối kháng theo chủ đề với trợ lý AI nhiều cấp độ.
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Swords size={16} />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-xs font-bold text-slate-900">Tranh biện 1 vs 1</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tạo phòng hoặc ghép cặp trực tiếp cùng cộng đồng sinh viên.
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <BarChart3 size={16} />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-xs font-bold text-slate-900">Nhận đánh giá toàn diện</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Nhận phân tích logic, phản biện và gợi ý cải thiện chi tiết.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED TOPICS SECTION */}
      <section id="featured-topics" className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Chủ đề nổi bật
          </h2>

          <Link
            to="/learner/topics"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 hover:underline"
          >
            <span>Xem tất cả →</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredTopics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
