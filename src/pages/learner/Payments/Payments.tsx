import React from "react";
import { CreditCard } from "lucide-react";

const Payments: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Billing & Payments</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage subscriptions, practice packages, tournament fees, and transaction history.
        </p>
      </div>

      <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500">
        <CreditCard className="mx-auto mb-2 text-slate-400" size={32} />
        <p className="text-sm">Subscription plans and payment transaction records will appear here.</p>
      </div>
    </div>
  );
};

export default Payments;
