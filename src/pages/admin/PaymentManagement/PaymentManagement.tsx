import React from "react";
import { CreditCard } from "lucide-react";

const PaymentManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Quản lý thanh toán & tài chính</h1>
        <p className="text-sm text-slate-500 mt-1">
          Theo dõi các gói đăng ký người dùng, giao dịch cổng thanh toán (VNPAY/MOMO), hoàn tiền và doanh thu.
        </p>
      </div>

      <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500">
        <CreditCard className="mx-auto mb-2 text-slate-400" size={32} />
        <p className="text-sm">Nhật ký tài chính, số liệu phân tích doanh thu và bảng xử lý hoàn tiền sẽ hiển thị tại đây.</p>
      </div>
    </div>
  );
};

export default PaymentManagement;
