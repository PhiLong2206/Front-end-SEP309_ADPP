import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { ROLES } from "../../utils/constants";
import { LogOut, User as UserIcon } from "lucide-react";
import Button from "../common/Button";

const Header: React.FC = () => {
  const { user, role, logout } = useAuth();

  const getRoleBadge = () => {
    switch (role) {
      case ROLES.LEARNER:
        return <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Học viên</span>;
      case ROLES.EDUCATOR:
        return <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">Giảng viên</span>;
      case ROLES.ADMIN:
        return <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-rose-100 text-rose-800">Quản trị viên</span>;
      default:
        return null;
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-30">
      <div>
        <h2 className="text-base font-semibold text-slate-800">
          Nền tảng Luyện tập Tranh biện AI
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end">
          <span className="text-sm font-semibold text-slate-800 leading-tight">
            {user?.fullName || user?.email || "Người dùng"}
          </span>
          <div className="mt-0.5">{getRoleBadge()}</div>
        </div>

        <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-medium">
          <UserIcon size={18} />
        </div>

        <Button variant="ghost" size="sm" onClick={logout} title="Đăng xuất">
          <LogOut size={16} />
          <span>Đăng xuất</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;
