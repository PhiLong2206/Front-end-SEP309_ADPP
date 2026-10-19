import React from "react";
import { Shield, ShieldCheck, Check, X, Lock } from "lucide-react";

interface RolePermission {
  module: string;
  description: string;
  admin: boolean;
  educator: boolean;
  learner: boolean;
}

const RoleManagement: React.FC = () => {
  const permissions: RolePermission[] = [
    {
      module: "Truy cập Cổng Quản trị (/admin/*)",
      description: "Xem Dashboard tổng quan, quản lý hạ tầng và kiểm soát hệ thống",
      admin: true,
      educator: false,
      learner: false,
    },
    {
      module: "Kiểm duyệt & Quản lý Chủ đề",
      description: "Thêm mới, sửa, xóa và xuất bản chủ đề tranh biện toàn nền tảng",
      admin: true,
      educator: true,
      learner: false,
    },
    {
      module: "Quản lý Gói nạp & Giao dịch Credit",
      description: "Thiết lập giá gói credit tranh biện và điều chỉnh thông số thanh toán",
      admin: true,
      educator: false,
      learner: false,
    },
    {
      module: "Tạo & Quản lý Giải đấu / Cuộc thi",
      description: "Tổ chức giải đấu tranh biện, xét duyệt đội thi và trọng tài",
      admin: true,
      educator: true,
      learner: false,
    },
    {
      module: "Luyện tập Tranh biện AI",
      description: "Khởi tạo phòng đấu với đối thủ AI và nhận đánh giá tự động",
      admin: true,
      educator: true,
      learner: true,
    },
    {
      module: "Tham gia Tranh biện 1 vs 1 & 2 vs 2",
      description: "Đấu trực tiếp với người học khác trong thời gian thực",
      admin: true,
      educator: true,
      learner: true,
    },
    {
      module: "Tự thay đổi vai trò hệ thống",
      description: "Thay đổi Role từ giao diện phía Client",
      admin: false,
      educator: false,
      learner: false,
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fade-in">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Phân quyền vai trò (Role-Based Access Control)
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Hệ thống phân quyền truy cập đa cấp độ dựa trên vai trò thực tế từ Backend Identity Service (.NET 8).
        </p>
      </div>

      {/* Security Rule Callout */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-start gap-3 shadow-md">
        <Lock size={18} className="text-[#10B981] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-xs font-bold text-white">
            Nguyên tắc bảo mật: Vai trò bất biến từ giao diện người dùng
          </p>
          <p className="text-[11.5px] text-slate-300 leading-relaxed">
            Mọi vai trò (Administrator, Educator, Learner) đều được kiểm tra nghiêm ngặt thông qua JWT Claims <code className="text-emerald-400 font-mono">ClaimTypes.Role</code> từ máy chủ. Người dùng hoặc Learner hoàn toàn không thể tự nâng quyền hoặc thay đổi role từ client UI.
          </p>
        </div>
      </div>

      {/* Role Cards Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Admin Role */}
        <div className="bg-white dark:bg-[#12231C] p-6 rounded-3xl border-2 border-[#008A64]/40 shadow-xs space-y-3 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-[#008A64] dark:text-emerald-400 flex items-center justify-center font-black">
            <ShieldCheck size={26} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#008A64] uppercase tracking-wider">
              Cấp độ quyền cao nhất
            </span>
            <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 mt-0.5">
              Administrator (Admin)
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Toàn quyền quản trị hệ thống, giám sát tài khoản, cấu hình thanh toán credit và can thiệp bảo mật nền tảng.
          </p>
          <div className="pt-2 text-[11px] font-bold text-slate-700 dark:text-slate-300">
            Mã định danh trong Token: <code className="text-[#008A64] font-mono font-bold">Admin</code>
          </div>
        </div>

        {/* Educator Role */}
        <div className="bg-white dark:bg-[#12231C] p-6 rounded-3xl border border-slate-200/80 dark:border-[rgba(148,163,184,0.18)] shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black">
            <Shield size={26} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
              Cấp độ chuyên môn
            </span>
            <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 mt-0.5">
              Educator (Giảng viên)
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Quản trị chuyên môn học thuật: tạo đề tài tranh biện, tổ chức sự kiện workshop, làm trọng tài chấm thi giải đấu.
          </p>
          <div className="pt-2 text-[11px] font-bold text-slate-700 dark:text-slate-300">
            Mã định danh trong Token: <code className="text-amber-600 font-mono font-bold">Educator</code>
          </div>
        </div>

        {/* Learner Role */}
        <div className="bg-white dark:bg-[#12231C] p-6 rounded-3xl border border-slate-200/80 dark:border-[rgba(148,163,184,0.18)] shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center font-black">
            <Shield size={26} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Người học tiêu chuẩn
            </span>
            <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 mt-0.5">
              Learner (Học viên)
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Truy cập cổng học viên: luyện tập AI, thi đấu 1v1, thi đấu 2v2, theo dõi tiến độ và tích lũy credit.
          </p>
          <div className="pt-2 text-[11px] font-bold text-slate-700 dark:text-slate-300">
            Mã định danh trong Token: <code className="text-slate-600 font-mono font-bold">Member</code> / <code className="text-slate-600 font-mono font-bold">Learner</code>
          </div>
        </div>
      </div>

      {/* Permissions Matrix Table */}
      <div className="bg-white dark:bg-[#12231C] rounded-3xl border border-slate-200/80 dark:border-[rgba(148,163,184,0.18)] p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Ma trận Phân quyền Chức năng (RBAC Matrix)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Chi tiết các chức năng được cấp phép theo từng vai trò đã định nghĩa trong mã nguồn ADPP.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-[#0B1713] text-slate-500 dark:text-slate-400 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-4 py-3 rounded-l-xl">Chức năng / Phân hệ</th>
                <th className="px-4 py-3">Mô tả chi tiết</th>
                <th className="px-4 py-3 text-center">Administrator</th>
                <th className="px-4 py-3 text-center">Educator</th>
                <th className="px-4 py-3 rounded-r-xl text-center">Learner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[rgba(148,163,184,0.12)]">
              {permissions.map((p, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-[#1A2E26]/40 transition-colors">
                  <td className="px-4 py-3.5 font-bold text-slate-800 dark:text-slate-200">
                    {p.module}
                  </td>
                  <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400">
                    {p.description}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    {p.admin ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-[#008A64]">
                        <Check size={14} />
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
                        <X size={14} />
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    {p.educator ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-[#008A64]">
                        <Check size={14} />
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
                        <X size={14} />
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    {p.learner ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-[#008A64]">
                        <Check size={14} />
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
                        <X size={14} />
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RoleManagement;
