import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div className="max-w-md mx-auto text-center py-20 px-6">
      <h1 className="text-7xl font-extrabold text-slate-300">404</h1>
      <h2 className="text-2xl font-bold text-slate-900 mt-4 mb-2">Trang không tìm thấy</h2>
      <p className="text-sm text-slate-500 mb-6">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
      </p>
      <Link
        to="/"
        className="inline-flex px-5 py-2.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-xs"
      >
        Về Trang chủ
      </Link>
    </div>
  );
};

export default NotFound;
