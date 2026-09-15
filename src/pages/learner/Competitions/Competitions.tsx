import React from "react";
import { Trophy } from "lucide-react";

const Competitions: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Competitions & Tournaments</h1>
        <p className="text-sm text-slate-500 mt-1">
          Register teams, view match brackets, tournament schedules, and leaderboards.
        </p>
      </div>

      <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500">
        <Trophy className="mx-auto mb-2 text-amber-500" size={32} />
        <p className="text-sm">Tournament list, brackets, and standings will be rendered here.</p>
      </div>
    </div>
  );
};

export default Competitions;
