import { DISPLAY_CONFIG } from '@/lib/constants';

/**
 * Cắt ngắn chuỗi văn bản nếu vượt quá độ dài tối đa và thêm dấu ba chấm (...).
 *
 * @param text chuỗi văn bản cần xử lý
 * @param maxLength độ dài tối đa cho phép (mặc định: 22 ký tự)
 * @return chuỗi đã được cắt ngắn kèm dấu ... hoặc chuỗi gốc nếu không vượt quá độ dài
 */
export function truncateText(
  text?: string | null,
  maxLength: number = DISPLAY_CONFIG.MAX_TABLE_TEXT_LENGTH
): string {
  if (!text) {
    return '';
  }

  return text.length > maxLength
    ? `${text.slice(0, maxLength)}...`
    : text;
}
