import React from "react";
import { Trophy } from "lucide-react";

const Competitions: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Cuộc thi & Giải đấu tranh biện</h1>
        <p className="text-sm text-slate-500 mt-1">
          Đăng ký đội thi, theo dõi nhánh đấu, lịch thi đấu giải và bảng xếp hạng thành tích.
        </p>
      </div>

      <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500">
        <Trophy className="mx-auto mb-2 text-amber-500" size={32} />
        <p className="text-sm">Danh sách giải đấu, phân nhánh thi đấu và bảng điểm xếp hạng sẽ hiển thị tại đây.</p>
      </div>
    </div>
  );
};

export default Competitions;
