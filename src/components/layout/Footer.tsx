import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0B132B] text-slate-300 py-10 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
              A
            </div>
            <span className="font-extrabold text-white text-base tracking-tight">ADPP</span>
          </div>
          <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
            Nền tảng luyện tập tranh biện ứng dụng Trí tuệ nhân tạo.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-5">
            <Link to="/" className="hover:text-white transition-colors">Trang chủ</Link>
            <Link to="/learner/topics" className="hover:text-white transition-colors">Chủ đề</Link>
            <a href="#guide" className="hover:text-white transition-colors">Hướng dẫn</a>
            <a href="#about" className="hover:text-white transition-colors">Về chúng tôi</a>
          </div>
          <span className="text-[11px] text-slate-500 md:pl-6 md:border-l md:border-slate-800">
            © 2026 ADPP. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
