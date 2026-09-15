export const formatCurrency = (
  amount?: number | null,
  currency = "VND",
  locale = "vi-VN"
): string => {
  if (amount === undefined || amount === null || isNaN(amount)) return "0 ₫";
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(amount);
  } catch {
    return `${amount} ₫`;
  }
};
