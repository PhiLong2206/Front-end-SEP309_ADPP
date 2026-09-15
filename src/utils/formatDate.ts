export const formatDate = (
  dateString?: string | null,
  locale = "vi-VN",
  options?: Intl.DateTimeFormatOptions
): string => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      ...options,
    }).format(date);
  } catch {
    return "";
  }
};

export const formatDateTime = (
  dateString?: string | null,
  locale = "vi-VN"
): string => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return "";
  }
};
