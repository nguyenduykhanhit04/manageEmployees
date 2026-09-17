import { ROUTES } from '@/lib/constants/routes';

/**
 * Danh sách các Key sử dụng để lưu trữ trong sessionStorage.
 */
export const STORAGE_KEYS = {
  /** Lưu trữ URL bộ lọc tìm kiếm & phân trang hiện tại của ADM002 */
  ADM002_FILTER_URL: 'ADM002_FILTER_URL',
  /** Lưu trữ dữ liệu tạm thời của form ADM004 khi chuyển sang ADM005 */
  ADM004_TEMP_DATA: 'ADM004_TEMP_DATA',
  /** Lưu trữ thông báo lỗi nghiệp vụ trả về từ ADM005 về ADM004 */
  ADM004_ERROR_MESSAGE: 'ADM004_ERROR_MESSAGE',
} as const;

/**
 * Lấy URL quay về danh sách nhân viên từ sessionStorage.
 *
 * @return URL bộ lọc trước đó hoặc URL danh sách mặc định (/employees/adm002)
 */
export function getStoredReturnUrl(): string {
  if (typeof window === 'undefined') {
    return ROUTES.EMPLOYEE_LIST;
  }
  return sessionStorage.getItem(STORAGE_KEYS.ADM002_FILTER_URL) || ROUTES.EMPLOYEE_LIST;
}

/**
 * Lưu URL bộ lọc hiện tại của màn hình danh sách ADM002 vào sessionStorage.
 *
 * @param url URL kèm query string hiện tại của ADM002
 */
export function setStoredReturnUrl(url: string): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(STORAGE_KEYS.ADM002_FILTER_URL, url);
  }
}
