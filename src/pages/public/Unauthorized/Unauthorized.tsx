import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { ROLES } from "../../../utils/constants";
import { ShieldAlert } from "lucide-react";

const Unauthorized: React.FC = () => {
  const { role } = useAuth();

  const getFallbackPath = () => {
    if (role === ROLES.ADMIN) return "/admin/dashboard";
    if (role === ROLES.EDUCATOR) return "/educator/dashboard";
    if (role === ROLES.LEARNER) return "/learner/dashboard";
    return "/login";
  };

  return (
    <div className="max-w-md mx-auto text-center py-20 px-6">
      <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
        <ShieldAlert size={32} />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900">403</h1>
      <h2 className="text-xl font-bold text-slate-900 mt-2 mb-2">Không có quyền truy cập</h2>
      <p className="text-sm text-slate-500 mb-6">
        Bạn không có quyền truy cập vào trang này với vai trò hiện tại.
      </p>
      <Link
        to={getFallbackPath()}
        className="inline-flex px-5 py-2.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-xs"
      >
        Quay về Bảng điều khiển
      </Link>
    </div>
  );
};

export default Unauthorized;
