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
