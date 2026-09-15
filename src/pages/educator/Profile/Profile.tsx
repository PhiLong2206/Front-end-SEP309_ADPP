import React from "react";
import { User } from "lucide-react";

const EducatorProfile: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Educator Profile</h1>
        <p className="text-sm text-slate-500 mt-1">
          Update your academic bio, credentials, contact information, and teaching subjects.
        </p>
      </div>

      <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500">
        <User className="mx-auto mb-2 text-slate-400" size={32} />
        <p className="text-sm">Educator profile information and settings will be editable here.</p>
      </div>
    </div>
  );
};

export default EducatorProfile;
