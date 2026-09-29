import React from "react";
import UserAvatarDropdown from "./UserAvatarDropdown";

const Header: React.FC = () => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div>
        <h2 className="text-sm sm:text-base font-bold text-slate-800">
          Nền tảng Luyện tập Tranh biện AI
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <UserAvatarDropdown />
      </div>
    </header>
  );
};

export default Header;

