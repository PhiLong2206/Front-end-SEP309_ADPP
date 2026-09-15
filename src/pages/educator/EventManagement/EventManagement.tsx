import React from "react";
import { Calendar } from "lucide-react";

const EventManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Event Management</h1>
        <p className="text-sm text-slate-500 mt-1">
          Organize, schedule, and oversee live debate workshops, seminars, and training sessions.
        </p>
      </div>

      <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500">
        <Calendar className="mx-auto mb-2 text-slate-400" size={32} />
        <p className="text-sm">Event scheduling tools and participant registrations will appear here.</p>
      </div>
    </div>
  );
};

export default EventManagement;
