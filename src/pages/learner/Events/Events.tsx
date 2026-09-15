import React from "react";
import { Calendar } from "lucide-react";

const Events: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Debate Events & Workshops</h1>
        <p className="text-sm text-slate-500 mt-1">
          Explore upcoming debate workshops, webinars, and live scrimmages.
        </p>
      </div>

      <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500">
        <Calendar className="mx-auto mb-2 text-slate-400" size={32} />
        <p className="text-sm">Upcoming events list and registration buttons will appear here.</p>
      </div>
    </div>
  );
};

export default Events;
