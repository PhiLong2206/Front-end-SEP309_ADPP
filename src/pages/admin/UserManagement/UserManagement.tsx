import React from "react";
import { Users } from "lucide-react";

const UserManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">User Management</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage system users across 3 roles (Learner, Educator, Administrator), verify credentials, and adjust statuses.
        </p>
      </div>

      <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500">
        <Users className="mx-auto mb-2 text-slate-400" size={32} />
        <p className="text-sm">User list table, role filters, and account controls will appear here.</p>
      </div>
    </div>
  );
};

export default UserManagement;
