import React from "react";
import { FolderKanban } from "lucide-react";

const AdminTopicManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Topic Management</h1>
        <p className="text-sm text-slate-500 mt-1">
          Review, approve, and moderate global debate topics and categories across the platform.
        </p>
      </div>

      <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500">
        <FolderKanban className="mx-auto mb-2 text-slate-400" size={32} />
        <p className="text-sm">Global debate motion catalog and administration table will be rendered here.</p>
      </div>
    </div>
  );
};

export default AdminTopicManagement;
