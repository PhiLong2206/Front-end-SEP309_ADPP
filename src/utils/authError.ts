/**
 * Utility for formatting and sanitizing authentication and API error messages.
 * Prevents raw backend exceptions/stack traces from leaking to the UI
 * and maps standard HTTP status codes to user-friendly messages.
 */

const RAW_EXCEPTION_PATTERNS = [
  /Exception/i,
  /Stack trace/i,
  /inner exception/i,
  /entity changes/i,
  /Microsoft\./i,
  /System\./i,
  /at System\./i,
  /at Microsoft\./i,
  /SqlError/i,
  /SqlException/i,
  /DbUpdate/i,
  /NullReference/i,
  /SyntaxError/i,
  /AxiosError/i,
  /Request failed with status code/i,
  /Internal Server Error/i,
  /Failed to fetch/i,
  /TypeError/i,
  /Object reference not set/i,
  /The connection was closed/i,
];

/**
 * Checks if a string contains raw stack traces, database exceptions, or technical framework errors.
 */
export const isRawBackendException = (message?: unknown): boolean => {
  if (typeof message !== "string" || !message.trim()) return false;
  return RAW_EXCEPTION_PATTERNS.some((pattern) => pattern.test(message));
};

/**
 * Maps authentication responses and errors to localized, user-friendly messages.
 * 
 * Standard status code mappings:
 * - 400: Invalid login information.
 * - 401: Incorrect email or password.
 * - 403: Account access denied.
 * - 429: Too many attempts. Please try again later.
 * - 500: Server error. Please try again later.
 * - Network errors: Unable to connect to the server.
 */
export const getAuthErrorMessage = (
  error: unknown,
  fallbackMessage = "Đăng nhập không thành công. Vui lòng thử lại."
): string => {
  if (!error) return fallbackMessage;

  // Extract HTTP status code
  let status: number | undefined;
  if (typeof error === "object" && error !== null) {
    const errObj = error as Record<string, unknown>;
    if (typeof errObj.status === "number") {
      status = errObj.status;
    } else if (typeof errObj.statusCode === "number") {
      status = errObj.statusCode;
    } else if (
      typeof (errObj.response as Record<string, unknown>)?.status === "number"
    ) {
      status = (errObj.response as Record<string, unknown>).status as number;
    }
  }

  // Check for Network Error or server offline
  let isNetworkError = false;
  if (typeof error === "object" && error !== null) {
    const errObj = error as Record<string, unknown>;
    if (
      errObj.isNetworkError ||
      errObj.code === "ERR_NETWORK" ||
      errObj.code === "ECONNABORTED" ||
      (typeof errObj.message === "string" &&
        (errObj.message.includes("Network Error") ||
          errObj.message.includes("Failed to fetch") ||
          errObj.message.includes("ERR_NETWORK") ||
          errObj.message.includes("Không thể kết nối đến máy chủ")))
    ) {
      isNetworkError = true;
    }
  }

  if (isNetworkError || status === 0) {
    return "Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại kết nối mạng.";
  }

  // Extract message candidate
  let rawMessage: string | undefined;
  if (typeof error === "string") {
    rawMessage = error;
  } else if (typeof error === "object" && error !== null) {
    const errObj = error as Record<string, unknown>;
    if (typeof errObj.message === "string") {
      rawMessage = errObj.message;
    } else if (
      typeof (errObj.data as Record<string, unknown>)?.message === "string"
    ) {
      rawMessage = (errObj.data as Record<string, unknown>).message as string;
    } else if (
      typeof (errObj.response as Record<string, unknown>)?.data === "object" &&
      errObj.response
    ) {
      const resData = (errObj.response as Record<string, unknown>).data as Record<string, unknown>;
      if (typeof resData?.message === "string") {
        rawMessage = resData.message;
      } else if (typeof resData?.title === "string") {
        rawMessage = resData.title;
      }
    }
  }

  const hasRawException = isRawBackendException(rawMessage);

  // If status is 500 or message contains raw exception, never leak backend traces
  if (status === 500 || (status !== undefined && status > 500) || hasRawException) {
    return "Lỗi hệ thống máy chủ. Vui lòng thử lại sau.";
  }

  // Status code-specific mapping
  switch (status) {
    case 400:
      // If backend provided a clean, readable validation message (e.g., "Email không đúng định dạng")
      if (rawMessage && !hasRawException && !rawMessage.startsWith("Request failed")) {
        return rawMessage;
      }
      return "Thông tin đăng nhập không hợp lệ. Vui lòng kiểm tra lại.";

    case 401:
      return "Email hoặc mật khẩu không chính xác.";

    case 403:
      return "Tài khoản của bạn đã bị khóa hoặc không có quyền truy cập.";

    case 429:
      return "Bạn đã thử đăng nhập quá nhiều lần. Vui lòng thử lại sau ít phút.";
  }

  // If there is a safe, user-friendly message from backend
  if (rawMessage && !hasRawException && !rawMessage.startsWith("Request failed")) {
    return rawMessage;
  }

  return fallbackMessage;
};
