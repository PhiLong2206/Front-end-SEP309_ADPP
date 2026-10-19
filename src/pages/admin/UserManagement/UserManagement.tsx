import React, { useEffect, useState } from "react";
import { Search, Filter, RefreshCw, AlertCircle, Shield, CheckCircle, XCircle } from "lucide-react";
import userApi from "../../../api/userApi";
import { User } from "../../../types";

const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [backendReady, setBackendReady] = useState<boolean>(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userApi.getAllUsers();
      if (res && res.success && res.data) {
        setUsers(res.data.items || []);
        setBackendReady(true);
      } else {
        setBackendReady(false);
        setUsers([]);
      }
    } catch {
      // Backend /admin/users endpoint is not implemented yet
      setBackendReady(false);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" && u.isActive !== false) ||
      (statusFilter === "INACTIVE" && u.isActive === false);
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Quản lý người dùng
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Quản trị danh sách tài khoản học viên, giảng viên và kiểm duyệt phân quyền hệ thống.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchUsers}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#1A2E26] hover:bg-slate-100 dark:hover:bg-[#233F34] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-[rgba(148,163,184,0.18)] text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw size={13} className={loading ? "animate-spin text-[#008A64]" : ""} />
          <span>Làm mới danh sách</span>
        </button>
      </div>

      {/* Security & RBAC Policy Notice */}
      <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/40 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-3">
        <Shield size={18} className="text-[#008A64] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold">Chính sách Phân quyền RBAC (Role-Based Access Control)</p>
          <p className="text-[11.5px] text-emerald-700 dark:text-emerald-400 leading-relaxed">
            Vai trò người dùng được xác thực tập trung từ Identity Service thông qua JWT Token Claim. Hệ thống tuân thủ nguyên tắc không cho phép tự sửa đổi role từ giao diện người dùng để đảm bảo an toàn tuyệt đối cho nền tảng.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-[#12231C] p-4 rounded-2xl border border-slate-200/80 dark:border-[rgba(148,163,184,0.18)] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-[#0B1713] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008A64]/20 focus:border-[#008A64] text-slate-800 dark:text-slate-200"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <div className="flex items-center gap-1.5">
            <Filter size={13} className="text-slate-400" />
            <span className="text-[11px] font-bold text-slate-500 uppercase">Vai trò:</span>
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-[#0B1713] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008A64]/20 focus:border-[#008A64] font-medium text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <option value="ALL">Tất cả vai trò</option>
            <option value="Learner">Học viên (Learner)</option>
            <option value="Educator">Giảng viên (Educator)</option>
            <option value="Administrator">Quản trị viên (Admin)</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-[#0B1713] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008A64]/20 focus:border-[#008A64] font-medium text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="ACTIVE">Hoạt động (Active)</option>
            <option value="INACTIVE">Vô hiệu hóa (Inactive)</option>
          </select>
        </div>
      </div>

      {/* User Table or Pending Backend Diagnostic State */}
      <div className="bg-white dark:bg-[#12231C] rounded-2xl border border-slate-200/80 dark:border-[rgba(148,163,184,0.18)] shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">
            <RefreshCw size={24} className="animate-spin text-[#008A64] mx-auto mb-2" />
            <span>Đang tải danh sách người dùng từ máy chủ...</span>
          </div>
        ) : !backendReady ? (
          <div className="p-10 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <AlertCircle size={28} />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                Chưa có endpoint danh sách người dùng phía Backend (.NET 8)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
                Hiện tại Backend <code className="text-[#008A64]">SystemService</code> chỉ cung cấp endpoint <code className="font-mono">GET /api/users/me</code> cho tài khoản cá nhân, chưa cung cấp endpoint <code className="font-mono">GET /api/admin/users</code> để truy vấn danh sách toàn hệ thống.
              </p>
            </div>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                Trạng thái: Đang chờ Backend bổ sung Controller AdminUsers
              </span>
            </div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-400">
            Không tìm thấy người dùng nào phù hợp với bộ lọc.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#0B1713] text-slate-500 dark:text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Mã ID</th>
                  <th className="px-5 py-3.5">Họ và tên</th>
                  <th className="px-5 py-3.5">Email</th>
                  <th className="px-5 py-3.5">Vai trò hệ thống</th>
                  <th className="px-5 py-3.5">Trạng thái</th>
                  <th className="px-5 py-3.5 text-right">Ngày tham gia</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[rgba(148,163,184,0.12)]">
                {filteredUsers.map((u) => (
                  <tr key={String(u.id || u.userId)} className="hover:bg-slate-50/60 dark:hover:bg-[#1A2E26]/40 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-slate-400">#{u.id || u.userId}</td>
                    <td className="px-5 py-3.5 font-bold text-slate-800 dark:text-slate-200">{u.fullName}</td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">{u.email}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-md font-bold text-[10.5px] ${
                          u.role === "Administrator"
                            ? "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200"
                            : u.role === "Educator"
                            ? "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200"
                            : "bg-emerald-50 text-[#008A64] dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {u.isActive !== false ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle size={13} /> Hoạt động
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-500">
                          <XCircle size={13} /> Đã khóa
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right text-slate-400">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString("vi-VN") : "--"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
