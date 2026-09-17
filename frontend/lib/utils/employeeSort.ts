import { SortField, SortOrders } from '@/types/employee';
import { QUERY_PARAMS } from '@/lib/constants/routes';
import { SORT_ORDER, SORT_FIELDS } from '@/lib/constants/table';

/**
 * Danh sách các cột hỗ trợ sắp xếp trên bảng nhân viên.
 */
export const ALL_SORT_FIELDS: SortField[] = [
  SORT_FIELDS.EMPLOYEE_NAME,
  SORT_FIELDS.CERTIFICATION_NAME,
  SORT_FIELDS.END_DATE,
];

/**
 * Trích xuất thứ tự ưu tiên và chiều sắp xếp của các cột từ URLSearchParams.
 *
 * @param params đối tượng URLSearchParams hoặc mock params chứa tham số URL
 * @return bộ giá trị sortOrders (chiều sắp xếp từng cột) và detectedPriority (thứ tự ưu tiên)
 */
export function parseSortFromParams(params: {
  get: (key: string) => string | null;
  forEach?: (callback: (value: string, key: string) => void) => void;
}): { parsedOrders: SortOrders; detectedPriority: SortField[] } {
  // 1. Khởi tạo chiều sắp xếp mặc định (ASC) cho tất cả các cột
  const parsedOrders: SortOrders = {
    [SORT_FIELDS.EMPLOYEE_NAME]: SORT_ORDER.ASC,
    [SORT_FIELDS.CERTIFICATION_NAME]: SORT_ORDER.ASC,
    [SORT_FIELDS.END_DATE]: SORT_ORDER.ASC,
  };
  const detectedPriority: SortField[] = [];

  // 2. Quét các tham số trên URL theo thứ tự xuất hiện để xác định độ ưu tiên
  if (typeof params.forEach === 'function') {
    params.forEach((val, key) => {
      const field = key as SortField;
      if (ALL_SORT_FIELDS.includes(field) && !detectedPriority.includes(field)) {
        parsedOrders[field] =
          val?.toUpperCase() === SORT_ORDER.DESC ? SORT_ORDER.DESC : SORT_ORDER.ASC;
        detectedPriority.push(field);
      }
    });
  }

  // 3. Bổ sung các cột chưa có trên URL vào cuối danh sách ưu tiên
  ALL_SORT_FIELDS.forEach((field) => {
    if (!detectedPriority.includes(field)) {
      const val = params.get(field);
      if (val?.toUpperCase() === SORT_ORDER.DESC) {
        parsedOrders[field] = SORT_ORDER.DESC;
      }
      detectedPriority.push(field);
    }
  });

  return { parsedOrders, detectedPriority };
}

/**
 * Tạo chuỗi Query String từ các tham số tìm kiếm, sắp xếp và phân trang.
 *
 * @param name từ khóa tìm kiếm tên nhân viên
 * @param deptId ID phòng ban được chọn
 * @param priority danh sách các cột theo thứ tự ưu tiên sắp xếp
 * @param orders chiều sắp xếp tương ứng của từng cột
 * @param page số trang hiện tại
 * @param limit số bản ghi trên mỗi trang
 * @return chuỗi query string chuẩn
 */
export function buildQueryString(
  name: string,
  deptId: string,
  priority: SortField[],
  orders: SortOrders,
  page: number,
  limit: number
): string {
  const params = new URLSearchParams();

  // 1. Thêm từ khóa tìm kiếm theo tên nếu có
  if (name.trim()) {
    params.set(QUERY_PARAMS.EMPLOYEE_NAME, name.trim());
  }

  // 2. Thêm phòng ban nếu có chọn
  if (deptId) {
    params.set(QUERY_PARAMS.DEPARTMENT_ID, deptId);
  }

  // 3. Thêm các cột sắp xếp theo thứ tự ưu tiên
  priority.forEach((fieldKey) => {
    params.set(fieldKey, orders[fieldKey]);
  });

  // 4. Thêm tham số offset nếu không ở trang 1
  const offsetVal = (page - 1) * limit;
  if (offsetVal > 0) {
    params.set(QUERY_PARAMS.OFFSET, offsetVal.toString());
  }

  return params.toString();
}
