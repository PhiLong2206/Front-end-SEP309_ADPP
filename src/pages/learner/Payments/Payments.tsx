import React, { useEffect, useState, useCallback } from "react";
import {
  Coins,
  CreditCard,
  Gift,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  X,
  QrCode,
  ShieldCheck,
  Check,
} from "lucide-react";
import paymentApi from "../../../api/paymentApi";
import {
  LearnerCreditPackage,
  WalletInfo,
  WalletTransactionItem,
  PaymentLinkResponse,
} from "../../../types";

const Payments: React.FC = () => {
  // Data states
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [packages, setPackages] = useState<LearnerCreditPackage[]>([]);
  const [transactions, setTransactions] = useState<WalletTransactionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [checkingStatus, setCheckingStatus] = useState<boolean>(false);

  // Messages
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  // PayOS Checkout Modal State
  const [selectedPackage, setSelectedPackage] = useState<LearnerCreditPackage | null>(null);
  const [paymentLink, setPaymentLink] = useState<PaymentLinkResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Active Tab: Gói nạp vs Lịch sử giao dịch
  const [activeTab, setActiveTab] = useState<"PACKAGES" | "HISTORY">("PACKAGES");

  // Fetch Wallet & Active Packages
  const fetchData = useCallback(async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const [walletRes, packagesRes, txnsRes] = await Promise.all([
        paymentApi.getMyWallet().catch(() => null),
        paymentApi.getActivePackages().catch(() => null),
        paymentApi.getMyWalletTransactions({ page: 1, pageSize: 20 }).catch(() => null),
      ]);

      if (walletRes && walletRes.success && walletRes.data) {
        setWallet(walletRes.data);
      }

      if (packagesRes && packagesRes.success && packagesRes.data) {
        setPackages(packagesRes.data);
      }

      if (txnsRes && txnsRes.success && txnsRes.data) {
        setTransactions(txnsRes.data);
      }
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      setErrorMsg(errObj?.message || "Lỗi khi tải thông tin ví và gói nạp.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle Select Package to Top Up: POST /api/payments/top-up
  const handleSelectPackage = async (pkg: LearnerCreditPackage) => {
    setSelectedPackage(pkg);
    setPaymentLink(null);
    setIsModalOpen(true);
    setActionLoading(true);
    setErrorMsg("");

    try {
      const res = await paymentApi.createTopUpPayment({ packageId: pkg.packageId });
      if (res && res.success && res.data) {
        setPaymentLink(res.data);
      } else {
        setErrorMsg(res?.message || "Không thể tạo liên kết thanh toán PayOS.");
        setIsModalOpen(false);
      }
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      setErrorMsg(errObj?.message || "Lỗi khi khởi tạo thanh toán.");
      setIsModalOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  // Check Payment Status: GET /api/payments/{id}
  const handleCheckStatus = async () => {
    if (!paymentLink) return;
    setCheckingStatus(true);
    setErrorMsg("");
    try {
      const res = await paymentApi.getPaymentStatus(paymentLink.paymentId);
      if (res && res.success && res.data) {
        if (res.data.isCompleted || res.data.status?.toLowerCase() === "paid" || res.data.status?.toLowerCase() === "success") {
          setSuccessMsg("Thanh toán thành công! Điểm tín chỉ đã được cộng vào ví của bạn.");
          setIsModalOpen(false);
          // Refresh wallet balance and transactions
          fetchData();
        } else {
          setErrorMsg("Giao dịch đang chờ thanh toán qua cổng PayOS. Vui lòng quét mã QR hoặc mở trang thanh toán.");
        }
      } else {
        setErrorMsg(res?.message || "Chưa nhận được xác nhận thanh toán.");
      }
    } catch {
      setErrorMsg("Chưa tìm thấy trạng thái thanh toán thành công. Vui lòng thử lại sau giây lát.");
    } finally {
      setCheckingStatus(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
            <Coins className="text-amber-500" size={26} />
            <span>Ví điểm tín chỉ & Nạp Credit</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Nạp điểm tín chỉ để tham gia luyện tập đối kháng với AI, thi đấu giải đấu và nhận phản hồi chấm điểm chuyên sâu.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchData}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#1A2E26] hover:bg-slate-100 dark:hover:bg-[#233F34] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-[rgba(148,163,184,0.18)] text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw size={13} className={loading ? "animate-spin text-[#008A64]" : ""} />
          <span>Làm mới số dư</span>
        </button>
      </div>

      {/* Alerts */}
      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-center justify-between gap-2 shadow-xs">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-rose-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button type="button" onClick={() => setErrorMsg("")} className="text-rose-400 hover:text-rose-600">
            <X size={14} />
          </button>
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-xs font-medium flex items-center justify-between gap-2 shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#008A64] shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button type="button" onClick={() => setSuccessMsg("")} className="text-emerald-500 hover:text-emerald-700">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Wallet Balance Card Banner */}
      <div className="bg-gradient-to-br from-[#008A64] via-[#007454] to-[#014D38] rounded-3xl p-6 sm:p-7 text-white shadow-xl shadow-[#008A64]/15 relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-white/15 backdrop-blur-xs text-amber-300">
                <Wallet size={20} />
              </span>
              <span className="text-xs uppercase tracking-wider font-bold text-emerald-100">
                Ví tín chỉ học viên
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black tracking-tight font-mono">
                {wallet ? wallet.balance.toLocaleString("vi-VN") : "--"}
              </span>
              <span className="text-base font-bold text-emerald-200">Credit khả dụng</span>
            </div>

            <p className="text-xs text-emerald-100/80 max-w-lg leading-relaxed">
              Điểm tín chỉ dùng để chi trả cho các buổi luyện tập tranh biện cùng AI Coach, chấm điểm tự động và tham gia các giải đấu có thưởng.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 text-xs text-emerald-50 space-y-1">
              <div className="flex items-center justify-between gap-3">
                <span className="text-emerald-200">Cổng thanh toán:</span>
                <span className="font-bold flex items-center gap-1">
                  <ShieldCheck size={13} className="text-emerald-300" /> PayOS / VietQR
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-emerald-200">Xử lý tự động:</span>
                <span className="font-bold text-amber-300">Cộng điểm tức thì</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Selection: Packages vs History */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-[rgba(148,163,184,0.18)] pb-1">
        <button
          type="button"
          onClick={() => setActiveTab("PACKAGES")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
            activeTab === "PACKAGES"
              ? "bg-[#008A64] text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#12231C]"
          }`}
        >
          <Coins size={14} />
          <span>Danh sách gói nạp ({packages.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("HISTORY")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
            activeTab === "HISTORY"
              ? "bg-[#008A64] text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#12231C]"
          }`}
        >
          <Clock size={14} />
          <span>Lịch sử biến động ví ({transactions.length})</span>
        </button>
      </div>

      {/* Tab 1: Packages List */}
      {activeTab === "PACKAGES" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Chọn gói nạp điểm phù hợp với bạn
            </h2>
            <span className="text-xs text-[#008A64] font-bold">
              Thanh toán an toàn qua quét mã VietQR ngân hàng
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400 bg-white dark:bg-[#12231C] rounded-3xl border border-slate-200/80 dark:border-[rgba(148,163,184,0.18)]">
              <RefreshCw size={24} className="animate-spin text-[#008A64] mx-auto mb-2" />
              <span>Đang tải danh sách gói nạp khả dụng...</span>
            </div>
          ) : packages.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs bg-white dark:bg-[#12231C] rounded-3xl border border-slate-200/80 dark:border-[rgba(148,163,184,0.18)]">
              Hiện tại chưa có gói nạp nào được mở bán. Vui lòng quay lại sau!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {packages.map((pkg) => {
                const totalCredits = pkg.creditAmount + (pkg.bonusCredit || 0);

                return (
                  <div
                    key={pkg.packageId}
                    className="bg-white dark:bg-[#12231C] rounded-3xl border border-slate-200/80 dark:border-[rgba(148,163,184,0.18)] p-6 shadow-xs flex flex-col justify-between transition-all hover:border-[#008A64] hover:shadow-lg hover:shadow-[#008A64]/5 group relative"
                  >
                    <div className="space-y-4">
                      {/* Top Bar */}
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-black px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          #{pkg.packageCode}
                        </span>

                        {pkg.bonusCredit > 0 && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-300 px-2.5 py-0.5 rounded-full border border-rose-200 dark:border-rose-800/40">
                            <Gift size={11} /> Tặng +{pkg.bonusCredit}
                          </span>
                        )}
                      </div>

                      {/* Package Name & Price */}
                      <div>
                        <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">
                          {pkg.packageName}
                        </h3>
                        <div className="mt-2 flex items-baseline gap-1.5">
                          <span className="text-3xl font-black text-[#008A64]">
                            {pkg.price.toLocaleString("vi-VN")}
                          </span>
                          <span className="text-xs font-bold text-slate-400">
                            {pkg.currency || "VNĐ"}
                          </span>
                        </div>
                      </div>

                      {/* Credit Breakdown */}
                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B1713] space-y-2 border border-slate-100 dark:border-slate-800/80 text-xs">
                        <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                          <span className="flex items-center gap-1.5">
                            <Coins size={14} className="text-amber-500" />
                            Credit cơ bản:
                          </span>
                          <span className="font-bold">{pkg.creditAmount.toLocaleString()} Credit</span>
                        </div>

                        {pkg.bonusCredit > 0 && (
                          <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                            <span className="flex items-center gap-1.5">
                              <Gift size={14} className="text-rose-500" />
                              Khuyến mãi thêm:
                            </span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">
                              +{pkg.bonusCredit.toLocaleString()} Credit
                            </span>
                          </div>
                        )}

                        <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between font-bold">
                          <span className="text-slate-800 dark:text-slate-200">Tổng nhận về ví:</span>
                          <span className="text-sm font-black text-[#008A64]">
                            {totalCredits.toLocaleString()} Credit
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      type="button"
                      onClick={() => handleSelectPackage(pkg)}
                      className="mt-5 w-full py-2.5 rounded-xl bg-[#008A64] hover:bg-[#007454] text-white font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 group-hover:shadow-md group-hover:shadow-[#008A64]/20"
                    >
                      <CreditCard size={14} />
                      <span>Nạp ngay gói này</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Wallet Transactions History */}
      {activeTab === "HISTORY" && (
        <div className="bg-white dark:bg-[#12231C] rounded-2xl border border-slate-200/80 dark:border-[rgba(148,163,184,0.18)] shadow-xs overflow-hidden">
          {transactions.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400">
              Bạn chưa có biến động số dư nào trong ví điểm tín chỉ.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-[#0B1713] text-slate-500 dark:text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">Mã GD</th>
                    <th className="px-5 py-3.5">Loại giao dịch</th>
                    <th className="px-5 py-3.5">Số lượng</th>
                    <th className="px-5 py-3.5">Số dư sau</th>
                    <th className="px-5 py-3.5">Thời gian</th>
                    <th className="px-5 py-3.5">Nội dung</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[rgba(148,163,184,0.12)]">
                  {transactions.map((tx) => {
                    const isCredit = tx.amount > 0 || tx.transactionType?.toLowerCase().includes("topup") || tx.transactionType?.toLowerCase().includes("credit");

                    return (
                      <tr key={tx.walletTransactionId} className="hover:bg-slate-50/60 dark:hover:bg-[#1A2E26]/40 transition-colors">
                        <td className="px-5 py-3.5 font-mono text-slate-400">
                          #{tx.walletTransactionId}
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md font-bold text-[11px] ${
                              isCredit
                                ? "bg-emerald-50 dark:bg-emerald-950/60 text-[#008A64] dark:text-emerald-300"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                            }`}
                          >
                            {isCredit ? <ArrowDownLeft size={11} /> : <ArrowUpRight size={11} />}
                            {tx.transactionType === "TopUp" ? "Nạp điểm tín chỉ" : tx.transactionType}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 font-bold font-mono">
                          <span className={isCredit ? "text-emerald-600 dark:text-emerald-400" : "text-slate-600"}>
                            {isCredit ? `+${tx.amount.toLocaleString()}` : `-${Math.abs(tx.amount).toLocaleString()}`} Credit
                          </span>
                        </td>
                        <td className="px-5 py-3.5 font-bold font-mono text-slate-700 dark:text-slate-300">
                          {tx.balanceAfter.toLocaleString()} Credit
                        </td>
                        <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">
                          {new Date(tx.createdAt).toLocaleString("vi-VN")}
                        </td>
                        <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                          {tx.description || "Giao dịch nạp điểm tín chỉ"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* PayOS Checkout Modal */}
      {isModalOpen && selectedPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-[#12231C] w-full max-w-md rounded-3xl border border-slate-200 dark:border-[rgba(148,163,184,0.18)] shadow-2xl p-6 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[rgba(148,163,184,0.12)]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#008A64] flex items-center justify-center">
                  <QrCode size={16} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Thanh toán qua PayOS
                  </h3>
                  <p className="text-[11px] text-slate-400">Quét mã VietQR chuyển khoản tự động</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            {actionLoading ? (
              <div className="p-8 text-center space-y-3">
                <RefreshCw size={28} className="animate-spin text-[#008A64] mx-auto" />
                <p className="text-xs text-slate-500">Đang khởi tạo liên kết thanh toán PayOS...</p>
              </div>
            ) : paymentLink ? (
              <div className="space-y-4 text-xs">
                {/* Package Recap */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B1713] border border-slate-100 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Gói nạp:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {selectedPackage.packageName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Số điểm nhận được:</span>
                    <span className="font-bold text-[#008A64]">
                      {(selectedPackage.creditAmount + selectedPackage.bonusCredit).toLocaleString()} Credit
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-800">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Tổng thanh toán:</span>
                    <span className="text-base font-black text-rose-600 font-mono">
                      {paymentLink.amount.toLocaleString("vi-VN")} VNĐ
                    </span>
                  </div>
                </div>

                {/* QR Code Display (if QrCode is an image link or available) */}
                <div className="text-center p-3 bg-white dark:bg-[#0B1713] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                  <p className="font-bold text-slate-700 dark:text-slate-300">
                    Quét mã QR bằng ứng dụng Ngân hàng (VietQR)
                  </p>

                  <div className="flex justify-center p-2">
                    {paymentLink.qrCode?.startsWith("http") ? (
                      <img
                        src={paymentLink.qrCode}
                        alt="PayOS VietQR"
                        className="w-48 h-48 object-contain rounded-xl border border-slate-100"
                      />
                    ) : (
                      // VietQR fallback image using quick qr API
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                          paymentLink.checkoutUrl || paymentLink.qrCode || "https://pay.payos.vn"
                        )}`}
                        alt="PayOS QR"
                        className="w-44 h-44 object-contain rounded-xl"
                      />
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400">
                    Mã đơn hàng: <span className="font-mono font-bold text-slate-600 dark:text-slate-300">#{paymentLink.providerOrderCode}</span>
                  </p>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-1">
                  {paymentLink.checkoutUrl && (
                    <a
                      href={paymentLink.checkoutUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 rounded-xl bg-[#008A64] hover:bg-[#007454] text-white font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 text-center cursor-pointer"
                    >
                      <span>Mở trang thanh toán bảo mật PayOS</span>
                      <ExternalLink size={13} />
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={handleCheckStatus}
                    disabled={checkingStatus}
                    className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {checkingStatus ? (
                      <RefreshCw size={13} className="animate-spin text-[#008A64]" />
                    ) : (
                      <Check size={14} className="text-[#008A64]" />
                    )}
                    <span>Tôi đã chuyển khoản xong (Kiểm tra ngay)</span>
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
