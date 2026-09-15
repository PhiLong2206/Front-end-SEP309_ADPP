import React from "react";
import { Mic } from "lucide-react";

const DebatePractice: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI Debate Practice Room</h1>
        <p className="text-sm text-slate-500 mt-1">
          Interactive debate room supporting Opening, Rebuttal, and Closing rounds against AI Opponent.
        </p>
      </div>

      <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500">
        <Mic className="mx-auto mb-2 text-indigo-500" size={32} />
        <p className="text-sm">
          Live transcript, round timer, rebuttal suggestions, and argument submission workspace will be rendered here.
        </p>
      </div>
    </div>
  );
};

export default DebatePractice;
