import React, { useState, useEffect } from "react";
import {
  Bell,
  Bot,
  CheckCircle2,
  Globe,
  Moon,
  Save,
  Sliders,
  Sparkles,
  Volume2,
} from "lucide-react";

interface LearnerSettingsState {
  aiDifficulty: "beginner" | "intermediate" | "advanced";
  aiSpeed: "fast" | "standard" | "thoughtful";
  enableVoiceResponse: boolean;
  notifyMatchInvite: boolean;
  notifyCompetition: boolean;
  notifyEmailProgress: boolean;
  theme: "dark" | "navy";
  language: "vi" | "en";
}

const defaultSettings: LearnerSettingsState = {
  aiDifficulty: "intermediate",
  aiSpeed: "standard",
  enableVoiceResponse: true,
  notifyMatchInvite: true,
  notifyCompetition: true,
  notifyEmailProgress: false,
  theme: "dark",
  language: "vi",
};

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<LearnerSettingsState>(() => {
    try {
      const saved = localStorage.getItem("adpp_learner_settings");
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return defaultSettings;
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (savedSuccess) {
      const timer = setTimeout(() => setSavedSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [savedSuccess]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("adpp_learner_settings", JSON.stringify(settings));
    setSavedSuccess(true);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-[#0e1626]/90 backdrop-blur-xl border border-slate-800 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 border border-blue-400/40 flex items-center justify-center font-black text-white shadow-lg shadow-blue-900/30">
              <Sliders size={26} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Cài đặt & Tùy chọn ứng dụng
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Tùy chỉnh trải nghiệm tranh biện với AI, thông báo và giao diện người dùng của bạn.
              </p>
            </div>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-medium animate-fade-in flex items-center gap-3">
          <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
          <span>Đã lưu thành công các cài đặt tùy chọn của bạn!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: AI Debate Experience */}
        <div className="bg-[#0e1626]/90 backdrop-blur-xl rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Bot size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Trải nghiệm Tranh biện với AI</h2>
              <p className="text-xs text-slate-400">Điều chỉnh mức độ thử thách và phương thức tương tác</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* AI Difficulty */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-semibold text-slate-300">
                Độ khó đối thủ AI
              </label>
              <select
                value={settings.aiDifficulty}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    aiDifficulty: e.target.value as LearnerSettingsState["aiDifficulty"],
                  })
                }
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                <option value="beginner">Cơ bản - Luận điểm rõ ràng, tốc độ vừa phải</option>
                <option value="intermediate">Trung cấp - Phản biện sắc bén, có dẫn chứng</option>
                <option value="advanced">Nâng cao - Chiến thuật tranh luận giải đấu chuyên nghiệp</option>
              </select>
            </div>

            {/* AI Response Speed */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-semibold text-slate-300">
                Tốc độ phản hồi của AI
              </label>
              <select
                value={settings.aiSpeed}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    aiSpeed: e.target.value as LearnerSettingsState["aiSpeed"],
                  })
                }
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                <option value="fast">Nhanh - Ưu tiên tốc độ tranh luận liên tục</option>
                <option value="standard">Tiêu chuẩn - Cân bằng giữa tốc độ và độ chi tiết</option>
                <option value="thoughtful">Phân tích sâu - Đào sâu dữ liệu và góc nhìn đa chiều</option>
              </select>
            </div>
          </div>

          {/* Voice Output Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-3.5">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                <Volume2 size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Giọng đọc AI (Chuyển văn bản thành giọng nói)</p>
                <p className="text-xs text-slate-400">Tự động phát giọng đọc mỗi khi AI đưa ra lượt phản biện mới</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableVoiceResponse}
                onChange={(e) => setSettings({ ...settings, enableVoiceResponse: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        {/* Section 2: Notifications */}
        <div className="bg-[#0e1626]/90 backdrop-blur-xl rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Bell size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Cài đặt Thông báo</h2>
              <p className="text-xs text-slate-400">Quản lý các thông báo nhận được trong quá trình học tập</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div>
                <p className="text-sm font-bold text-white">Lời mời đấu tranh biện 1 vs 1</p>
                <p className="text-xs text-slate-400">Nhận thông báo khi học viên khác gửi lời thách đấu</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifyMatchInvite}
                  onChange={(e) => setSettings({ ...settings, notifyMatchInvite: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div>
                <p className="text-sm font-bold text-white">Sự kiện & Giải đấu mới</p>
                <p className="text-xs text-slate-400">Nhận thông báo khi có cuộc thi tranh biện mới mở đăng ký</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifyCompetition}
                  onChange={(e) => setSettings({ ...settings, notifyCompetition: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div>
                <p className="text-sm font-bold text-white">Tổng kết tiến độ hàng tuần qua Email</p>
                <p className="text-xs text-slate-400">Gửi thống kê số trận, điểm kỹ năng và đề xuất cải thiện qua email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifyEmailProgress}
                  onChange={(e) => setSettings({ ...settings, notifyEmailProgress: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Section 3: Interface & Language */}
        <div className="bg-[#0e1626]/90 backdrop-blur-xl rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Giao diện & Ngôn ngữ</h2>
              <p className="text-xs text-slate-400">Tùy biến hiển thị theo phong cách của bạn</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-semibold text-slate-300 flex items-center gap-2">
                <Moon size={16} className="text-blue-400" />
                <span>Chủ đề giao diện</span>
              </label>
              <select
                value={settings.theme}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    theme: e.target.value as LearnerSettingsState["theme"],
                  })
                }
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                <option value="dark">Không gian tối (Mặc định)</option>
                <option value="navy">Xanh đêm huyền bí</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-semibold text-slate-300 flex items-center gap-2">
                <Globe size={16} className="text-cyan-400" />
                <span>Ngôn ngữ hiển thị</span>
              </label>
              <select
                value={settings.language}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    language: e.target.value as LearnerSettingsState["language"],
                  })
                }
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                <option value="vi">Tiếng Việt (Mặc định)</option>
                <option value="en">Tiếng Anh (US)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm sm:text-base font-bold rounded-2xl shadow-lg shadow-blue-600/30 transition-all inline-flex items-center gap-2 hover:scale-102 cursor-pointer"
          >
            <Save size={18} />
            <span>Lưu tất cả tùy chọn</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
