import axiosClient from "./axiosClient";
import {
  ApiResponse,
  ChangePasswordRequest,
  GoogleLoginRequest,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ResetPasswordRequest,
  SendOtpRequest,
  VerifyOtpRequest,
  VerifyRegisterOtpRequest,
} from "../types";

const authApi = {
  /**
   * POST /api/auth/register
   * Registers a new user and sends an OTP code for email verification.
   */
  register: (data: RegisterRequest): Promise<ApiResponse<object>> =>
    axiosClient.post("/auth/register", {
      fullName: data.fullName,
      email: data.email,
      password: data.password,
    }),

  /**
   * POST /api/auth/verify-register-otp
   * Verifies the email with the received OTP.
   */
  verifyRegisterOtp: (data: VerifyRegisterOtpRequest): Promise<ApiResponse<object>> =>
    axiosClient.post("/auth/verify-register-otp", data),

  /**
   * POST /api/auth/login
   * Authenticates user and returns JWT accessToken, expiration, and user info.
   */
  login: (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> =>
    axiosClient.post("/auth/login", {
      email: credentials.email,
      password: credentials.password,
    }),

  /**
   * POST /api/auth/google-login
   * Authenticates user using Google ID Token.
   */
  googleLogin: (data: GoogleLoginRequest): Promise<ApiResponse<LoginResponse>> =>
    axiosClient.post("/auth/google-login", data),

  /**
   * POST /api/auth/send-otp
   * Sends OTP for specified operation type (e.g. "Registration", "ForgotPassword").
   */
  sendOtp: (data: SendOtpRequest): Promise<ApiResponse<object>> =>
    axiosClient.post("/auth/send-otp", data),

  /**
   * POST /api/auth/verify-otp
   * Validates OTP code for a given type.
   */
  verifyOtp: (data: VerifyOtpRequest): Promise<ApiResponse<object>> =>
    axiosClient.post("/auth/verify-otp", data),

  /**
   * POST /api/auth/forgot-password
   * Sends forgot password OTP to the provided email.
   */
  forgotPassword: (email: string): Promise<ApiResponse<object>> =>
    axiosClient.post("/auth/forgot-password", { email, type: "ForgotPassword" }),

  /**
   * POST /api/auth/reset-password
   * Resets user password using the OTP code.
   */
  resetPassword: (data: ResetPasswordRequest): Promise<ApiResponse<object>> =>
    axiosClient.post("/auth/reset-password", data),

  /**
   * PUT /api/auth/change-password [Authorized]
   * Changes password for currently authenticated user.
   */
  changePassword: (data: ChangePasswordRequest): Promise<ApiResponse<object>> =>
    axiosClient.put("/auth/change-password", data),
};

export default authApi;

