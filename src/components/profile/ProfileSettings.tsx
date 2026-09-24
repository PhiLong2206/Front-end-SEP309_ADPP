import React, { useState, useEffect } from "react";
import Input from "../common/Input";
import userApi from "../../api/userApi";
import authApi from "../../api/authApi";
import { useAuth } from "../../hooks/useAuth";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
  Save,
  Shield,
  User as UserIcon,
} from "lucide-react";

interface ProfileSettingsProps {
  portalTitle?: string;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ portalTitle: _portalTitle = "Thông tin cá nhân & Tài khoản" }) => {
  const { user: authUser, setUser } = useAuth();

  const [activeTab, setActiveTab] = useState<"info" | "security">("info");
  const [, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [changingPassword, setChangingPassword] = useState<boolean>(false);

  // Profile Form State
  const [profileData, setProfileData] = useState<{
    fullName: string;
    email: string;
    phoneNumber: string;
    gender: string;
    dateOfBirth: string;
    avatarUrl: string;
    roles: string[];
    isEmailVerified: boolean;
    createdAt: string;
  }>({
    fullName: "",
    email: "",
    phoneNumber: "",
    gender: "Nam",
    dateOfBirth: "",
    avatarUrl: "",
    roles: [],
    isEmailVerified: true,
    createdAt: "",
  });

  // Password Form State
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Alerts
  const [infoError, setInfoError] = useState("");
  const [infoSuccess, setInfoSuccess] = useState("");
  const [secError, setSecError] = useState("");
  const [secSuccess, setSecSuccess] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setInfoError("");

    try {
      const res = await userApi.getMyProfile();
      if (res && res.success && res.data) {
        const d = res.data;
        setProfileData({
          fullName: d.fullName || "",
          email: d.email || "",
          phoneNumber: d.phoneNumber || "",
          gender: d.gender || "Nam",
          dateOfBirth: d.dateOfBirth ? d.dateOfBirth.split("T")[0] : "",
          avatarUrl: d.avatarUrl || "",
          roles: d.roles || [],
          isEmailVerified: d.isEmailVerified,
          createdAt: d.createdAt ? new Date(d.createdAt).toLocaleDateString("vi-VN") : "",
        });
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setInfoError(errorObj?.message || "Không thể tải thông tin hồ sơ từ máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setInfoError("");
    setInfoSuccess("");

    if (!profileData.fullName.trim()) {
      setInfoError("Họ và tên không được để trống.");
      return;
    }

    setSaving(true);

    try {
      const res = await userApi.updateMyProfile({
        fullName: profileData.fullName.trim(),
        avatarUrl: profileData.avatarUrl || undefined,
        phoneNumber: profileData.phoneNumber || undefined,
        gender: profileData.gender || undefined,
        dateOfBirth: profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toISOString() : undefined,
      });

      if (res && res.success) {
        setInfoSuccess(res.message || "Cập nhật hồ sơ thành công!");
        if (authUser) {
          setUser({
            ...authUser,
            fullName: profileData.fullName.trim(),
            phoneNumber: profileData.phoneNumber,
            avatarUrl: profileData.avatarUrl,
          });
        }
      } else {
        setInfoError(res?.message || "Không thể cập nhật hồ sơ.");
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setInfoError(errorObj?.message || "Lỗi cập nhật hồ sơ.");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecError("");
    setSecSuccess("");

    if (!passwords.currentPassword) {
      setSecError("Vui lòng nhập mật khẩu hiện tại.");
      return;
    }

    if (passwords.newPassword.length < 8) {
      setSecError("Mật khẩu mới phải có tối thiểu 8 ký tự.");
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setSecError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setChangingPassword(true);

    try {
      const res = await authApi.changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });

      if (res && res.success) {
        setSecSuccess(res.message || "Đổi mật khẩu thành công!");
        setPasswords({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setSecError(res?.message || "Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu hiện tại.");
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setSecError(errorObj?.message || "Mật khẩu hiện tại không chính xác.");
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-[#0e1626]/90 backdrop-blur-xl border border-slate-800 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-5">
            {profileData.avatarUrl ? (
              <img
                src={profileData.avatarUrl}
                alt={profileData.fullName}
                className="w-18 h-18 rounded-2xl object-cover border-2 border-blue-500/40 shadow-lg shadow-blue-900/30 shrink-0"
              />
            ) : (
              <div className="w-18 h-18 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 border border-blue-400/40 flex items-center justify-center font-black text-2xl text-white shadow-lg shrink-0">
                {profileData.fullName ? profileData.fullName.charAt(0).toUpperCase() : "U"}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {profileData.fullName || authUser?.fullName || "Người dùng"}
                </h1>
                <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
                  {profileData.roles?.length ? profileData.roles.join(", ") : authUser?.role || "Learner"}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1.5 flex items-center gap-2">
                <Mail size={16} className="text-cyan-400" />
                <span>{profileData.email || authUser?.email}</span>
                {profileData.createdAt && (
                  <span className="ml-2 text-slate-400 font-mono">• Tham gia từ {profileData.createdAt}</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/90 border border-emerald-500/30 px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold text-emerald-300 shadow-sm">
            <Shield size={16} className="text-emerald-400" />
            <span>Tài khoản đã xác thực OTP</span>
          </div>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex items-center gap-4 border-b border-slate-800">
        <button
          type="button"
          onClick={() => setActiveTab("info")}
          className={`pb-3.5 px-4 text-xs sm:text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === "info"
              ? "border-blue-500 text-cyan-400"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <UserIcon size={16} />
          <span>Thông tin cá nhân</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("security")}
          className={`pb-3.5 px-4 text-xs sm:text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === "security"
              ? "border-blue-500 text-cyan-400"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <KeyRound size={16} />
          <span>Bảo mật & Đổi mật khẩu</span>
        </button>
      </div>

      {/* TAB 1: Profile Information Form */}
      {activeTab === "info" && (
        <div className="bg-[#0e1626]/90 backdrop-blur-xl rounded-3xl border border-slate-800 p-6 sm:p-9 shadow-xl">
          <div className="mb-7">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Chi tiết hồ sơ cá nhân</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Cập nhật thông tin nhận diện và liên hệ của bạn trên hệ thống.
            </p>
          </div>

          {infoError && (
            <div className="p-4 mb-6 text-xs sm:text-sm rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-medium animate-fade-in flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
              <span>{infoError}</span>
            </div>
          )}

          {infoSuccess && (
            <div className="p-4 mb-6 text-xs sm:text-sm rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-medium animate-fade-in flex items-center gap-3">
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
              <span>{infoSuccess}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Họ và tên"
                name="fullName"
                value={profileData.fullName}
                onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                required
              />

              <Input
                label="Địa chỉ Email (Định danh tài khoản)"
                name="email"
                value={profileData.email}
                disabled
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <Input
                label="Số điện thoại"
                name="phoneNumber"
                placeholder="Ví dụ: 0912345678"
                value={profileData.phoneNumber}
                onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
              />

              <div className="flex flex-col gap-1.5 mb-4">
                <label className="text-xs sm:text-sm font-semibold text-slate-300">Giới tính</label>
                <select
                  name="gender"
                  value={profileData.gender}
                  onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm sm:text-base bg-slate-900 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              <Input
                label="Ngày sinh"
                name="dateOfBirth"
                type="date"
                value={profileData.dateOfBirth}
                onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
              />
            </div>

            <Input
              label="Đường dẫn Ảnh đại diện (Avatar URL)"
              name="avatarUrl"
              placeholder="https://images.unsplash.com/..."
              value={profileData.avatarUrl}
              onChange={(e) => setProfileData({ ...profileData, avatarUrl: e.target.value })}
            />

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm sm:text-base font-bold rounded-2xl shadow-lg shadow-blue-600/30 transition-all inline-flex items-center gap-2 disabled:opacity-50 hover:scale-102"
              >
                <Save size={18} />
                <span>{saving ? "Đang lưu..." : "Lưu thay đổi"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: Change Password Form */}
      {activeTab === "security" && (
        <div className="bg-[#0e1626]/90 backdrop-blur-xl rounded-3xl border border-slate-800 p-6 sm:p-9 shadow-xl">
          <div className="mb-7">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Thay đổi mật khẩu</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Đảm bảo an toàn tài khoản bằng cách đặt mật khẩu phức tạp có tối thiểu 8 ký tự.
            </p>
          </div>

          {secError && (
            <div className="p-4 mb-6 text-xs sm:text-sm rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-medium animate-fade-in flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
              <span>{secError}</span>
            </div>
          )}

          {secSuccess && (
            <div className="p-4 mb-6 text-xs sm:text-sm rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-medium animate-fade-in flex items-center gap-3">
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
              <span>{secSuccess}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-5 max-w-xl">
            <div className="relative">
              <Input
                label="Mật khẩu hiện tại"
                name="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                placeholder="••••••••"
                value={passwords.currentPassword}
                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3.5 top-9 text-slate-400 hover:text-white p-1 transition-colors"
                title={showCurrentPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="relative">
              <Input
                label="Mật khẩu mới (≥ 8 ký tự)"
                name="newPassword"
                type={showNewPassword ? "text" : "password"}
                placeholder="••••••••"
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3.5 top-9 text-slate-400 hover:text-white p-1 transition-colors"
                title={showNewPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <Input
              label="Xác nhận mật khẩu mới"
              name="confirmPassword"
              type={showNewPassword ? "text" : "password"}
              placeholder="••••••••"
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
              required
            />

            <div className="pt-4">
              <button
                type="submit"
                disabled={changingPassword}
                className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm sm:text-base font-bold rounded-2xl shadow-lg shadow-blue-600/30 transition-all inline-flex items-center gap-2 disabled:opacity-50 hover:scale-102"
              >
                <Lock size={18} />
                <span>{changingPassword ? "Đang cập nhật..." : "Cập nhật mật khẩu"}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;

