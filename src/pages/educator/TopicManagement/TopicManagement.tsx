import React from "react";
import { FolderKanban } from "lucide-react";

const TopicManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Quản lý chủ đề tranh biện</h1>
        <p className="text-sm text-slate-500 mt-1">
          Tạo mới, chỉnh sửa và quản lý các kiến nghị tranh biện, tài liệu tham khảo và gợi ý luận điểm.
        </p>
      </div>

      <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500">
        <FolderKanban className="mx-auto mb-2 text-slate-400" size={32} />
        <p className="text-sm">Bộ công cụ soạn thảo chủ đề và danh sách kiến nghị sẽ hiển thị tại đây.</p>
      </div>
    </div>
  );
};

export default TopicManagement;
