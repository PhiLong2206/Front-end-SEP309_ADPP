import React from "react";
import { FileText } from "lucide-react";

const Feedback: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Feedback & Analysis</h1>
        <p className="text-sm text-slate-500 mt-1">
          Detailed evaluation scores on Logic, Evidence, Relevance, Structure, and Persuasiveness with AI explanations.
        </p>
      </div>

      <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500">
        <FileText className="mx-auto mb-2 text-slate-400" size={32} />
        <p className="text-sm">Detailed feedback reports and rebuttal improvements will appear here.</p>
      </div>
    </div>
  );
};

export default Feedback;
