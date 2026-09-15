import axiosClient from "./axiosClient";
import {
  PaymentTransaction,
  SubscriptionPlan,
  CreatePaymentDto,
  PaymentFilterParams,
  ApiResponse,
  PaginatedResponse,
} from "../types";

const paymentApi = {
  // Learner payments
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
