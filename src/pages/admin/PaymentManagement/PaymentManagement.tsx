import React from "react";
import { CreditCard } from "lucide-react";

const PaymentManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Payment & Financial Management</h1>
        <p className="text-sm text-slate-500 mt-1">
          Monitor user subscriptions, payment gateway transactions (VNPAY/MOMO), refunds, and revenue.
        </p>
      </div>

      <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500">
        <CreditCard className="mx-auto mb-2 text-slate-400" size={32} />
        <p className="text-sm">Financial logs, payment analytics, and refund processing table will appear here.</p>
      </div>
    </div>
  );
};

export default PaymentManagement;
