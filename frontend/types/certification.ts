/**
 * Kiểu dữ liệu một chứng chỉ tiếng Nhật.
 */
export interface CertificationItem {
  certificationId: number;
  certificationName: string;
}

/**
 * Phản hồi API danh sách chứng chỉ tiếng Nhật.
 */
export interface CertificationListApiResponse {
  code: number;
  certifications?: CertificationItem[];
}
