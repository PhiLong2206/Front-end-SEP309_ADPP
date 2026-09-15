import { PaginationParams } from "./api.types";

export type PaymentStatus = "Pending" | "Success" | "Failed" | "Refunded";
export type PaymentMethod = "VNPAY" | "MOMO" | "BANK_TRANSFER" | "STRIPE";

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  durationDays: number;
  features: string[];
  isPopular?: boolean;
}

export interface PaymentTransaction {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  description: string;
  transactionRef: string;
  createdAt: string;
  completedAt?: string;
}

export interface CreatePaymentDto {
  planId?: string;
  competitionId?: string;
  amount: number;
  paymentMethod: PaymentMethod;
  description: string;
}

export interface PaymentFilterParams extends PaginationParams {
  status?: PaymentStatus;
  startDate?: string;
  endDate?: string;
}
