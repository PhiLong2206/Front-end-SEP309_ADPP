import axiosClient from "./axiosClient";
import {
  PaymentTransaction,
  SubscriptionPlan,
  CreatePaymentDto,
  PaymentFilterParams,
  ApiResponse,
  PaginatedResponse,
  LearnerCreditPackage,
  WalletInfo,
  WalletTransactionItem,
  CreateTopUpPaymentRequest,
  PaymentLinkResponse,
  PaymentStatusResponse,
} from "../types";

const paymentApi = {
  // Real Backend .NET 8 Credit Packages & Wallets
  /**
   * GET /api/credit-packages
   * Lấy danh sách các gói nạp credit đang mở bán cho học viên
   */
  getActivePackages: (): Promise<ApiResponse<LearnerCreditPackage[]>> =>
    axiosClient.get("/credit-packages"),

  /**
   * POST /api/payments/top-up
   * Tạo yêu cầu nạp điểm tín chỉ, sinh link PayOS và mã QR quét chuyển khoản
   */
  createTopUpPayment: (
    data: CreateTopUpPaymentRequest
  ): Promise<ApiResponse<PaymentLinkResponse>> =>
    axiosClient.post("/payments/top-up", data),

  /**
   * GET /api/payments/{paymentId}
   * Kiểm tra trạng thái giao dịch nạp tiền
   */
  getPaymentStatus: (paymentId: number | string): Promise<ApiResponse<PaymentStatusResponse>> =>
    axiosClient.get(`/payments/${paymentId}`),

  /**
   * GET /api/wallets/me
   * Lấy số dư ví hiện tại của người dùng
   */
  getMyWallet: (): Promise<ApiResponse<WalletInfo>> =>
    axiosClient.get("/wallets/me"),

  /**
   * GET /api/wallets/me/transactions
   * Lấy lịch sử biến động số dư và giao dịch nạp tiền của người dùng
   */
  getMyWalletTransactions: (params?: {
    page?: number;
    pageSize?: number;
  }): Promise<ApiResponse<WalletTransactionItem[]>> =>
    axiosClient.get("/wallets/me/transactions", { params }),

  // Learner payments legacy
  createPaymentUrl: (data: CreatePaymentDto): Promise<ApiResponse<{ paymentUrl: string }>> =>
    axiosClient.post("/payments/create-url", data),

  getMyTransactions: (
    params?: PaymentFilterParams
  ): Promise<ApiResponse<PaginatedResponse<PaymentTransaction>>> =>
    axiosClient.get("/payments/my-transactions", { params }),

  getTransactionDetails: (id: string): Promise<ApiResponse<PaymentTransaction>> =>
    axiosClient.get(`/payments/transactions/${id}`),

  getSubscriptionPlans: (): Promise<ApiResponse<SubscriptionPlan[]>> =>
    axiosClient.get("/payments/plans"),

  // Admin management
  getAllTransactions: (
    params?: PaymentFilterParams
  ): Promise<ApiResponse<PaginatedResponse<PaymentTransaction>>> =>
    axiosClient.get("/admin/payments/transactions", { params }),

  getPaymentStats: (): Promise<ApiResponse<{ totalRevenue: number; monthlyRevenue: number }>> =>
    axiosClient.get("/admin/payments/stats"),

  refundTransaction: (id: string, reason: string): Promise<ApiResponse<PaymentTransaction>> =>
    axiosClient.post(`/admin/payments/transactions/${id}/refund`, { reason }),
};

export default paymentApi;
