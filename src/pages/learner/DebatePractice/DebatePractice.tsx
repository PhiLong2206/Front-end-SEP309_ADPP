import React from "react";
import { Mic } from "lucide-react";

const DebatePractice: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Phòng Luyện tập Tranh biện cùng AI</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Đấu trường tranh biện trực tiếp với AI: Lượt mở đầu, Phản biện và Tổng kết theo chuẩn WSDC & BP.
        </p>
      </div>

      <div className="bg-[#0e1626]/90 backdrop-blur-xl p-10 rounded-3xl border border-slate-800 text-center text-slate-400 shadow-xl space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto shadow-inner">
          <Mic size={32} />
        </div>
        <h3 className="text-base font-bold text-white">Sẵn sàng tranh luận cùng AI</h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
          Hệ thống đang thiết lập môi trường thu âm, nhận diện giọng nói (STT), phân tích luận điểm theo thời gian thực.
        </p>
      </div>
    </div>
  );
};

export default DebatePractice;
