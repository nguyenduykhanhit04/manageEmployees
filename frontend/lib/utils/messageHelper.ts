import { ERROR_MESSAGES, FIELD_LABELS, SUCCESS_MESSAGES } from '@/lib/constants/messages';

/**
 * Format thông báo lỗi dựa theo mã lỗi và danh sách tham số truyền vào.
 *
 * @param errorCode Mã lỗi (ví dụ ER001, ER006)
 * @param params Danh sách các tham số thay thế cho {0}, {1}...
 * @returns Chuỗi thông báo lỗi đã được format hoàn chỉnh
 */
export const getErrorMessage = (errorCode?: string, params: string[] = []): string => {
  if (!errorCode) {
    return '';
  }

  let template = ERROR_MESSAGES[errorCode] || ERROR_MESSAGES.ER015 || 'システムエラーが発生しました。';

  // Format từng placeholder {0}, {1}, {2}...
  params.forEach((param, index) => {
    // Nếu param là tên trường tiếng Anh, map sang tiếng Nhật tương ứng
    const displayParam = FIELD_LABELS[param] || param;
    const placeholder = new RegExp(`\\{${index}\\}`, 'g');
    template = template.replace(placeholder, displayParam);
  });

  return template;
};

/**
 * Lấy câu thông báo thành công theo mã MSG.
 *
 * @param msgCode Mã thông báo (MSG001, MSG002, MSG003)
 * @returns Chuỗi thông báo thành công
 */
export const getSuccessMessage = (msgCode: string): string => {
  return SUCCESS_MESSAGES[msgCode] || '';
};
