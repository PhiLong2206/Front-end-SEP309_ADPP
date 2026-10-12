import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Shield,
  Flame,
  Swords,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Info,
  BookOpen,
  Layers,
} from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";

const PRESET_MOTIONS = [
  "Chính phủ có nên áp đặt quy định mã hóa đầu cuối bắt buộc?",
  "Mạng xã hội đang gây hại nhiều hơn mang lại lợi ích cho giới trẻ?",
  "Trí tuệ nhân tạo (AI) nên được phép tham gia vào các quyết định tư pháp?",
  "Nên cấm hoàn toàn xe chạy bằng nhiên liệu hóa thạch tại các đô thị lớn trước năm 2035?",
];

const Debate2v2Lobby: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [selectedMotion, setSelectedMotion] = useState<string>(PRESET_MOTIONS[0]);
  const [customMotion, setCustomMotion] = useState<string>("");
  const [isCustomMotion, setIsCustomMotion] = useState<boolean>(false);
  const [isUserReady, setIsUserReady] = useState<boolean>(true);
  const [selectedUserRole, setSelectedUserRole] = useState<"PRO1" | "PRO2">("PRO1");

  const currentMotion = isCustomMotion && customMotion.trim() ? customMotion.trim() : selectedMotion;

  const handleEnterPreviewRoom = () => {
    const encodedMotion = encodeURIComponent(currentMotion);
    navigate(`/learner/debate/preview-2v2?mode=2v2&format=2v2&role=PRO&motion=${encodedMotion}`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-fade-in">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER & PREVIEW NOTICE
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-[#12231C] rounded-2xl border border-slate-200 dark:border-[rgba(148,163,184,0.18)] p-6 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
                <Users size={22} />
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-[#F8FAFC] tracking-tight">
                Phòng Chuẩn Bị Tranh Biện 2 vs 2 (Team vs Team)
              </h1>
            </div>
            <p className="text-sm text-slate-500 dark:text-[#94A3B8]">
              Tranh biện đồng đội chuẩn WSDC: Hai đội PRO và CON, mỗi đội gồm 2 thành viên phát biểu luân phiên theo lượt.
            </p>
          </div>

          <span className="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 flex items-center gap-1.5 shrink-0">
            <Sparkles size={13} />
            <span>UI Preview · Sắp ra mắt</span>
          </span>
        </div>

        {/* Informational banner about backend roadmap */}
        <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-[rgba(16,185,129,0.08)] border border-emerald-200/60 dark:border-[rgba(16,185,129,0.20)] text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2.5">
          <Info size={16} className="text-[#008A64] shrink-0 mt-0.5" />
          <div className="space-y-0.5 leading-relaxed">
            <p className="font-bold">Chế độ Tranh biện Đồng đội 2 vs 2:</p>
            <p className="text-slate-600 dark:text-slate-300">
              Giao diện chuẩn bị trận và phòng đấu ChatGPT 2vs2 đã được thiết kế hoàn thiện ở Frontend. Bạn có thể nhấn{" "}
              <strong>&quot;Vào phòng tranh biện 2vs2 (Xem trước)&quot;</strong> bên dưới để trải nghiệm ngay không gian tranh luận 4 người.
            </p>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. MOTION SELECTION & CONFIGURATION
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-[#12231C] rounded-2xl border border-slate-200 dark:border-[rgba(148,163,184,0.18)] p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-[16px] font-bold text-slate-900 dark:text-[#F8FAFC]">
          <BookOpen size={18} className="text-[#008A64]" />
          <span>Kiến nghị / Chủ đề tranh biện</span>
        </div>

        {/* Preset Motions */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Chọn chủ đề có sẵn:
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {PRESET_MOTIONS.map((motion, idx) => {
              const isSelected = !isCustomMotion && selectedMotion === motion;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedMotion(motion);
                    setIsCustomMotion(false);
                  }}
                  className={`p-3.5 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#ECFDF5] text-[#008A64] border-[#008A64]/40 dark:bg-[rgba(16,185,129,0.12)] dark:text-[#34D399] dark:border-[rgba(16,185,129,0.40)] shadow-xs"
                      : "bg-slate-50 dark:bg-[#091713] text-slate-700 dark:text-[#CBD5E1] border-slate-200 dark:border-slate-800 hover:border-slate-300"
                  }`}
                >
                  <span className="font-bold mr-1.5 text-slate-400">#{idx + 1}</span>
                  <span>{motion}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Motion Input */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/70 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Hoặc nhập kiến nghị tùy chỉnh:
            </label>
            {isCustomMotion && (
              <span className="text-[11px] text-[#008A64] font-bold">Đang sử dụng chủ đề tùy chỉnh</span>
            )}
          </div>
          <input
            type="text"
            value={customMotion}
            onChange={(e) => {
              setCustomMotion(e.target.value);
              setIsCustomMotion(true);
            }}
            placeholder="Nhập chủ đề tranh biện 2 vs 2 mong muốn..."
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#091713] border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#008A64]/20 focus:border-[#008A64]"
          />
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. TEAMS MATCH PREPARATION: TEAM PRO (2) VS TEAM CON (2)
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-4 sm:gap-6 items-stretch">
        {/* ── TEAM PRO CARD ────────────────────────────────────── */}
        <div className="bg-white dark:bg-[#12231C] rounded-2xl border border-emerald-200 dark:border-[rgba(16,185,129,0.30)] p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#008A64] text-white flex items-center justify-center shadow-xs">
                  <Shield size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-[16px] text-[#008A64] dark:text-[#34D399]">
                    Đội Ủng Hộ (Team PRO)
                  </h3>
                  <p className="text-[11px] text-slate-500">Phe khẳng định kiến nghị</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#ECFDF5] text-[#008A64] border border-[#008A64]/30">
                PRO
              </span>
            </div>

            {/* Slot 1: PRO 1 (First Speaker) */}
            <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-[rgba(16,185,129,0.06)] border border-emerald-200/60 dark:border-[rgba(16,185,129,0.20)] space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 dark:bg-[#163529] text-white font-bold text-sm flex items-center justify-center shadow-xs">
                    {user?.fullName?.slice(0, 2).toUpperCase() || "NL"}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="font-bold text-sm text-slate-800 dark:text-[#F8FAFC]">
                        {user?.fullName || "Nguyễn Phi Long"}
                      </p>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-200/60 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold">
                        Bạn
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">PRO 1 · Người mở đầu (First Speaker)</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsUserReady(!isUserReady)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    isUserReady
                      ? "bg-[#008A64] text-white shadow-xs"
                      : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                  }`}
                >
                  {isUserReady ? <CheckCircle2 size={13} /> : null}
                  <span>{isUserReady ? "Đã sẵn sàng" : "Chưa sẵn sàng"}</span>
                </button>
              </div>

              <div className="text-[11px] text-slate-500 pl-1">
                Nhiệm vụ: Trình bày định nghĩa kiến nghị & đưa ra 2 luận điểm trọng tâm ban đầu.
              </div>
            </div>

            {/* Slot 2: PRO 2 (Second Speaker) */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#091713] border border-slate-200/80 dark:border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-[#12231C] text-slate-500 font-bold text-sm flex items-center justify-center border border-dashed border-slate-300">
                    P2
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-800 dark:text-[#F8FAFC]">
                      Thành viên PRO 2
                    </p>
                    <p className="text-xs text-slate-500">PRO 2 · Người phản biện & Củng cố</p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-200/70 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  Chờ ghép đội
                </span>
              </div>

              <div className="text-[11px] text-slate-500 pl-1">
                Nhiệm vụ: Trực tiếp phản bác luận điểm của CON 1 và củng cố toàn diện case PRO.
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800/80">
            <span>Vai trò chọn:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedUserRole("PRO1")}
                className={`px-2 py-0.5 rounded text-xs font-semibold cursor-pointer ${
                  selectedUserRole === "PRO1"
                    ? "bg-[#008A64] text-white"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-800"
                }`}
              >
                PRO 1
              </button>
              <button
                type="button"
                onClick={() => setSelectedUserRole("PRO2")}
                className={`px-2 py-0.5 rounded text-xs font-semibold cursor-pointer ${
                  selectedUserRole === "PRO2"
                    ? "bg-[#008A64] text-white"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-800"
                }`}
              >
                PRO 2
              </button>
            </div>
          </div>
        </div>

        {/* ── VS DIVIDER ───────────────────────────────────────── */}
        <div className="flex flex-row lg:flex-col items-center justify-center py-2 lg:py-0">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg ring-4 ring-slate-100 dark:ring-slate-800 shrink-0">
            <Swords size={22} className="text-amber-400" />
          </div>
        </div>

        {/* ── TEAM CON CARD ────────────────────────────────────── */}
        <div className="bg-white dark:bg-[#12231C] rounded-2xl border border-rose-200 dark:border-[rgba(244,63,94,0.30)] p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-rose-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
                  <Flame size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-[16px] text-rose-700 dark:text-rose-400">
                    Đội Phản Đối (Team CON)
                  </h3>
                  <p className="text-[11px] text-slate-500">Phe bác bỏ kiến nghị</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                CON
              </span>
            </div>

            {/* Slot 1: CON 1 (First Speaker) */}
            <div className="p-4 rounded-xl bg-rose-50/50 dark:bg-[rgba(244,63,94,0.06)] border border-rose-200/60 dark:border-[rgba(244,63,94,0.20)] space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 font-bold text-sm flex items-center justify-center">
                    C1
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-800 dark:text-[#F8FAFC]">
                      Thành viên CON 1
                    </p>
                    <p className="text-xs text-slate-500">CON 1 · Người mở đầu & Bác bỏ</p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-600 text-white shadow-xs">
                  Sẵn sàng
                </span>
              </div>

              <div className="text-[11px] text-slate-500 pl-1">
                Nhiệm vụ: Phản bác định nghĩa của PRO và đưa ra hệ thống luận điểm đối lập.
              </div>
            </div>

            {/* Slot 2: CON 2 (Second Speaker) */}
            <div className="p-4 rounded-xl bg-rose-50/50 dark:bg-[rgba(244,63,94,0.06)] border border-rose-200/60 dark:border-[rgba(244,63,94,0.20)] space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 font-bold text-sm flex items-center justify-center">
                    C2
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-800 dark:text-[#F8FAFC]">
                      Thành viên CON 2
                    </p>
                    <p className="text-xs text-slate-500">CON 2 · Người phản biện & Kết luận</p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-600 text-white shadow-xs">
                  Sẵn sàng
                </span>
              </div>

              <div className="text-[11px] text-slate-500 pl-1">
                Nhiệm vụ: Củng cố lập trường bên Phản đối và chốt lại luận cứ then chốt.
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800/80">
            <span>Trạng thái đối thủ:</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              Đầy đủ 2 thành viên
            </span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. RULES & MATCH CONFIGURATION
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-[#12231C] rounded-2xl border border-slate-200 dark:border-[rgba(148,163,184,0.18)] p-5 sm:p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2 font-bold text-[15px] text-slate-900 dark:text-[#F8FAFC]">
          <Layers size={17} className="text-[#008A64]" />
          <span>Quy cách trận đấu WSDC 2 vs 2</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#091713] border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 font-medium">Định dạng</span>
            <p className="font-bold text-slate-800 dark:text-[#F8FAFC]">2 vs 2 (Team Match)</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#091713] border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 font-medium">Thời gian mỗi lượt</span>
            <p className="font-bold text-[#008A64] dark:text-[#34D399]">3 phút (180 giây)</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#091713] border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 font-medium">Số vòng đấu</span>
            <p className="font-bold text-slate-800 dark:text-[#F8FAFC]">3 vòng chuẩn</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#091713] border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 font-medium">Giám sát & Chấm điểm</span>
            <p className="font-bold text-slate-800 dark:text-[#F8FAFC]">AI Rubric & Giám khảo</p>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          5. ACTION BUTTONS & PREVIEW NAVIGATION
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={() => navigate("/learner/dashboard")}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-[#CBD5E1] hover:bg-slate-100 font-semibold text-sm transition-colors cursor-pointer"
        >
          Quay lại Dashboard
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Main button to enter 2vs2 Preview room */}
          <button
            type="button"
            onClick={handleEnterPreviewRoom}
            className="w-full sm:w-auto px-6 py-3 bg-[#008A64] hover:bg-[#007457] text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-[#008A64]/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Vào phòng tranh biện 2vs2 (Xem trước)</span>
            <ArrowRight size={16} />
          </button>

          {/* Official Match start button (Disabled for backend readiness) */}
          <button
            type="button"
            disabled
            className="w-full sm:w-auto px-5 py-3 bg-slate-200 dark:bg-slate-800 text-slate-400 rounded-xl font-bold text-sm cursor-not-allowed hidden md:inline-flex items-center gap-1.5"
            title="Đang chờ hoàn thiện API tạo phiên 2vs2 ở Backend"
          >
            <span>Bắt đầu chính thức</span>
            <span className="text-[10px] font-normal opacity-75">(Sắp ra mắt)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Debate2v2Lobby;
