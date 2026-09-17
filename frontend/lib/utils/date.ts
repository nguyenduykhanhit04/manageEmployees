/**
 * Kiểm tra chuỗi ngày định dạng yyyy/MM/dd có phải ngày hợp lệ trên lịch hay không.
 *
 * @param val chuỗi ngày cần kiểm tra (định dạng yyyy/MM/dd)
 * @return true nếu chuỗi rỗng/undefined hoặc là ngày lịch hợp lệ; false nếu không hợp lệ
 */
export const isValidDateString = (val?: string): boolean => {
  if (!val || val.trim() === '') return true;

  const parts = val.split('/');
  if (parts.length !== 3) return false;

  const [year, month, day] = parts.map((num) => parseInt(num, 10));
  if (isNaN(year) || isNaN(month) || isNaN(day) || month < 1 || month > 12) {
    return false;
  }

  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};

/**
 * Chuyển đổi đối tượng Date sang chuỗi định dạng yyyy/MM/dd.
 *
 * @param date đối tượng ngày cần format
 * @return chuỗi định dạng yyyy/MM/dd, hoặc chuỗi rỗng nếu date là null
 */
export function formatDateToString(date: Date | null): string {
  if (!date) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
}

/**
 * Parse chuỗi ngày định dạng yyyy/MM/dd sang đối tượng Date cho DatePicker.
 *
 * @param dateStr chuỗi ngày đầu vào (yyyy/MM/dd hoặc ISO)
 * @return đối tượng Date hợp lệ, hoặc null nếu không thể parse
 */
export function parseStringToDate(dateStr?: string): Date | null {
  if (!dateStr) return null;
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}
