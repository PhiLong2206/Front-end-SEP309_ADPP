import React, { useState } from "react";
import {
  CreditCard, Zap, Bot, Mic, FileText, Gavel,
  CheckCircle2, Clock, AlertCircle, ArrowRight,
  Receipt, Wallet, ChevronDown, ChevronUp, X
} from "lucide-react";
import { MOCK_AI_USAGE, MOCK_TRANSACTIONS, AI_SERVICE_PRICE, AIUsageRecord, PaymentTransaction } from "../../../mocks/events";

// ── Service icon map ──────────────────────────────────────────
const SERVICE_ICONS: Record<string, React.ElementType> = {
  AI_COACHING: Bot,
  REBUTTAL_HINT: Zap,
  AI_EVALUATION: FileText,
  AI_JUDGE_1V1: Gavel,
  SPEECH_TO_TEXT: Mic,
};

const SERVICE_COLORS: Record<string, string> = {
  AI_COACHING: "bg-violet-50 text-violet-600 border-violet-200",
  REBUTTAL_HINT: "bg-amber-50 text-amber-600 border-amber-200",
  AI_EVALUATION: "bg-blue-50 text-blue-600 border-blue-200",
  AI_JUDGE_1V1: "bg-[#ECFDF5] text-[#008A64] border-[#008A64]/30",
  SPEECH_TO_TEXT: "bg-rose-50 text-rose-600 border-rose-200",
};

// ── Payment Checkout Modal ────────────────────────────────────
function PaymentModal({
  amount,
  onClose,
  onSuccess,
}: {
  amount: number;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [method, setMethod] = useState<"momo" | "vnpay" | "bank">("momo");
  const [loading, setLoading] = useState(false);

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 1800);
  };

  const methods = [
    { id: "momo" as const, label: "MoMo", desc: "Ví điện tử MoMo", color: "bg-pink-600 text-white" },
    { id: "vnpay" as const, label: "VNPay", desc: "Cổng thanh toán VNPay", color: "bg-blue-700 text-white" },
    { id: "bank" as const, label: "Ngân hàng", desc: "Chuyển khoản ngân hàng", color: "bg-slate-700 text-white" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#008A64] to-emerald-500 p-5 flex items-center justify-between">
          <div>
            <h2 className="font-black text-white text-lg">Thanh toán AI Usage</h2>
            <p className="text-emerald-100 text-xs mt-0.5">Chọn phương thức thanh toán</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Amount */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
            <p className="text-xs text-slate-500 mb-1">Tổng số tiền cần thanh toán</p>
            <p className="text-3xl font-black text-slate-900 font-mono">{amount.toLocaleString("vi-VN")}<span className="text-base font-bold text-slate-500 ml-1">đ</span></p>
          </div>

          {/* Method selection */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Phương thức</p>
            {methods.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMethod(m.id)}
                className={`w-full p-3.5 rounded-xl border flex items-center gap-3 transition-all ${
                  method === m.id
                    ? "border-[#008A64] bg-[#ECFDF5]/60 ring-1 ring-[#008A64]"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <div className={`w-10 h-10 rounded-lg ${m.color} flex items-center justify-center text-xs font-black shrink-0`}>
                  {m.label.slice(0, 2)}
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-900">{m.label}</p>
                  <p className="text-xs text-slate-500">{m.desc}</p>
                </div>
                <div className={`ml-auto w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${method === m.id ? "border-[#008A64] bg-[#008A64]" : "border-slate-300"}`}>
                  {method === m.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </button>
            ))}
          </div>

          {/* Pay button */}
          <button
            type="button"
            onClick={handlePay}
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-[#008A64] hover:bg-[#007457] text-white font-bold text-sm transition-all shadow-md shadow-[#008A64]/25 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                <span>Đang xử lý...</span>
              </>
            ) : (
              <>
                <CreditCard size={16} />
                <span>Thanh toán {amount.toLocaleString("vi-VN")}đ</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Usage Record Row ──────────────────────────────────────────
function UsageRow({ record }: { record: AIUsageRecord }) {
  const Icon = SERVICE_ICONS[record.service] ?? Zap;
  const colorCls = SERVICE_COLORS[record.service] ?? "bg-slate-50 text-slate-600 border-slate-200";

  return (
    <tr className="hover:bg-slate-50/60 transition-colors">
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className={`p-1.5 rounded-lg border ${colorCls}`}>
            <Icon size={13} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900">{record.serviceLabel}</p>
            <p className="text-[11px] text-slate-400 line-clamp-1">{record.sessionTopic}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-3.5 text-xs text-slate-500 whitespace-nowrap font-mono">{record.usedAt}</td>
      <td className="px-5 py-3.5 text-xs text-center font-bold text-slate-700 font-mono">{record.quantity}</td>
      <td className="px-5 py-3.5 text-xs text-right font-bold text-slate-900 font-mono">{record.totalCost.toLocaleString("vi-VN")}đ</td>
      <td className="px-5 py-3.5 text-right">
        {record.status === "paid" ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#ECFDF5] text-[#008A64] border border-[#008A64]/30">
            <CheckCircle2 size={11} />Đã thanh toán
          </span>
        ) : record.status === "pending" ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock size={11} />Chờ thanh toán
          </span>
        ) : (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
            Miễn phí
          </span>
        )}
      </td>
    </tr>
  );
}

// ── Main Payments Page ────────────────────────────────────────
const Payments: React.FC = () => {
  const [showPricing, setShowPricing] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(MOCK_TRANSACTIONS);

  const pendingUsage = MOCK_AI_USAGE.filter((u) => u.status === "pending");
  const paidUsage = MOCK_AI_USAGE.filter((u) => u.status === "paid");
  const pendingTotal = pendingUsage.reduce((s, u) => s + u.totalCost, 0);
  const totalPaidAll = paidUsage.reduce((s, u) => s + u.totalCost, 0);

  const handlePaySuccess = () => {
    setShowPayModal(false);
    setPaySuccess(true);
    const newTxn: PaymentTransaction = {
      id: `txn-${Date.now()}`,
      amount: pendingTotal,
      method: "MoMo",
      status: "SUCCESS",
      createdAt: new Date().toLocaleString("vi-VN"),
      description: `Thanh toán AI Usage – ${new Date().toLocaleDateString("vi-VN")}`,
    };
    setTransactions((prev) => [newTxn, ...prev]);
    setTimeout(() => setPaySuccess(false), 5000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">Thanh toán & Sử dụng AI</h1>
        <p className="text-sm text-slate-500 mt-1">
          Lịch sử sử dụng dịch vụ AI, số tiền phát sinh và quản lý giao dịch thanh toán.
        </p>
      </div>

      {/* Success toast */}
      {paySuccess && (
        <div className="p-4 bg-[#ECFDF5] border border-[#008A64]/30 rounded-2xl flex items-center gap-3">
          <CheckCircle2 size={20} className="text-[#008A64] shrink-0" />
          <div>
            <p className="text-sm font-bold text-emerald-900">Thanh toán thành công!</p>
            <p className="text-xs text-emerald-700 mt-0.5">Giao dịch đã được ghi nhận. Bạn tiếp tục sử dụng đầy đủ dịch vụ AI.</p>
          </div>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Pending amount */}
        <div className={`rounded-2xl border p-5 space-y-3 shadow-xs ${pendingTotal > 0 ? "bg-amber-50 border-amber-200" : "bg-white border-slate-200"}`}>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-amber-500" />
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Chờ thanh toán</span>
          </div>
          <p className="text-3xl font-black text-slate-900 font-mono">
            {pendingTotal.toLocaleString("vi-VN")}<span className="text-sm text-slate-500 ml-1">đ</span>
          </p>
          <p className="text-xs text-slate-500">{pendingUsage.length} lần sử dụng AI chưa thanh toán</p>
          {pendingTotal > 0 && (
            <button
              type="button"
              onClick={() => setShowPayModal(true)}
              className="w-full py-2.5 rounded-xl bg-[#008A64] hover:bg-[#007457] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
            >
              <CreditCard size={13} />
              Thanh toán ngay
            </button>
          )}
        </div>

        {/* Total paid */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#008A64]" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Đã thanh toán</span>
          </div>
          <p className="text-3xl font-black text-slate-900 font-mono">
            {totalPaidAll.toLocaleString("vi-VN")}<span className="text-sm text-slate-500 ml-1">đ</span>
          </p>
          <p className="text-xs text-slate-500">{paidUsage.length} lần sử dụng AI đã thanh toán</p>
          <p className="text-xs text-slate-400">{transactions.length} giao dịch thành công</p>
        </div>

        {/* Pricing info */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Wallet size={16} className="text-violet-500" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bảng giá AI</span>
            </div>
            <button type="button" onClick={() => setShowPricing(!showPricing)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
              {showPricing ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
          {showPricing ? (
            <ul className="space-y-2">
              {Object.entries(AI_SERVICE_PRICE).map(([key, val]) => {
                const Icon = SERVICE_ICONS[key] ?? Zap;
                return (
                  <li key={key} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <Icon size={11} className="text-slate-400" />
                      {val.label}
                    </span>
                    <span className="font-bold text-slate-800 font-mono">{val.price.toLocaleString()}đ/{val.unitLabel}</span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-xs text-slate-500">Nhấn để xem chi tiết bảng giá từng dịch vụ AI.</p>
          )}
        </div>
      </div>

      {/* AI Usage table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-black text-slate-900">Lịch sử sử dụng AI</h2>
          <span className="text-xs text-slate-400">{MOCK_AI_USAGE.length} bản ghi</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-400 tracking-wider">
              <tr>
                <th className="px-5 py-3">Dịch vụ</th>
                <th className="px-5 py-3">Thời gian</th>
                <th className="px-5 py-3 text-center">Số lần</th>
                <th className="px-5 py-3 text-right">Chi phí</th>
                <th className="px-5 py-3 text-right">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_AI_USAGE.map((record) => (
                <UsageRow key={record.id} record={record} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction history */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
          <Receipt size={16} className="text-slate-500" />
          <h2 className="text-sm font-black text-slate-900">Lịch sử giao dịch</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {transactions.map((txn) => (
            <div key={txn.id} className="px-5 py-4 flex items-center gap-4 hover:bg-slate-50/60 transition-colors">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${txn.status === "SUCCESS" ? "bg-[#ECFDF5]" : txn.status === "FAILED" ? "bg-rose-50" : "bg-amber-50"}`}>
                {txn.status === "SUCCESS" ? (
                  <CheckCircle2 size={18} className="text-[#008A64]" />
                ) : txn.status === "FAILED" ? (
                  <AlertCircle size={18} className="text-rose-500" />
                ) : (
                  <Clock size={18} className="text-amber-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900">{txn.description}</p>
                <p className="text-xs text-slate-400 mt-0.5">{txn.method} • {txn.createdAt}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-black text-slate-900 font-mono">{txn.amount.toLocaleString("vi-VN")}đ</p>
                <p className={`text-[11px] font-bold mt-0.5 ${txn.status === "SUCCESS" ? "text-[#008A64]" : txn.status === "FAILED" ? "text-rose-600" : "text-amber-600"}`}>
                  {txn.status === "SUCCESS" ? "Thành công" : txn.status === "FAILED" ? "Thất bại" : "Đang xử lý"}
                </p>
              </div>
            </div>
          ))}
        </div>

        {pendingTotal > 0 && (
          <div className="px-5 py-4 bg-amber-50/60 border-t border-amber-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-amber-700">
              <AlertCircle size={15} />
              <span className="font-semibold">Còn <strong>{pendingTotal.toLocaleString("vi-VN")}đ</strong> chưa thanh toán</span>
            </div>
            <button
              type="button"
              onClick={() => setShowPayModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#008A64] hover:bg-[#007457] text-white text-xs font-bold transition-all shadow-sm"
            >
              Thanh toán <ArrowRight size={13} />
            </button>
          </div>
        )}
      </div>

      {/* Payment modal */}
      {showPayModal && (
        <PaymentModal
          amount={pendingTotal}
          onClose={() => setShowPayModal(false)}
          onSuccess={handlePaySuccess}
        />
      )}
    </div>
  );
};

export default Payments;
