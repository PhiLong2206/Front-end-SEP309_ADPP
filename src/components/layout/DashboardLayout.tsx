import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";

const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-slate-50/70">
      <Sidebar />
      <div className="flex-1 ml-56 flex flex-col min-h-screen min-w-0">
        <DashboardHeader />
        <main className="flex-1 p-5 sm:p-6 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
