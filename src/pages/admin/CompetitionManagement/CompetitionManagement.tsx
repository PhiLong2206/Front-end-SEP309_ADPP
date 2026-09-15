import React from "react";
import { Trophy } from "lucide-react";

const AdminCompetitionManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Competition Management</h1>
        <p className="text-sm text-slate-500 mt-1">
          Oversee platform tournaments, approve competition prize allocations, and manage disputes.
        </p>
      </div>

      <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500">
        <Trophy className="mx-auto mb-2 text-amber-500" size={32} />
        <p className="text-sm">Global competition management and bracket moderation will appear here.</p>
      </div>
    </div>
  );
};

export default AdminCompetitionManagement;
