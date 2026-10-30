import React from "react";
import { FileText } from "lucide-react";

const Feedback: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Đánh giá & Phản hồi chuyên sâu</h1>
        <p className="text-sm text-slate-500 mt-1">
          Bảng điểm chi tiết theo Logic, Dẫn chứng, Độ phù hợp, Cấu trúc và Tính thuyết phục kèm giải thích từ AI.
        </p>
      </div>

      <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500">
        <FileText className="mx-auto mb-2 text-slate-400" size={32} />
        <p className="text-sm">Báo cáo đánh giá chi tiết và các gợi ý cải thiện kỹ năng sẽ hiển thị tại đây.</p>
      </div>
    </div>
  );
};

export default Feedback;
