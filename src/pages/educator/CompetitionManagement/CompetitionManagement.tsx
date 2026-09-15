import React from "react";
import { Trophy } from "lucide-react";

const CompetitionManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Competition Management</h1>
        <p className="text-sm text-slate-500 mt-1">
          Create tournaments, configure round stages, oversee team brackets, and manage scores.
        </p>
      </div>

      <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500">
        <Trophy className="mx-auto mb-2 text-amber-500" size={32} />
        <p className="text-sm">Tournament bracket setup and scoring controls will be shown here.</p>
      </div>
    </div>
  );
};

export default CompetitionManagement;
