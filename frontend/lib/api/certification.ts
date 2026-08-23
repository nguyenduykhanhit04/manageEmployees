/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * certification.ts, 23/8/2026 nguyenduykhanh2
 */

import { CertificationListApiResponse } from "@/types/certification";
import { apiClient } from "@/lib/api/client";

/**
 * Gọi API lấy danh sách tất cả các chứng chỉ tiếng Nhật.
 *
 * @return phản hồi danh sách chứng chỉ từ Backend
 */
export const getCertifications = async (): Promise<CertificationListApiResponse> => {
  const response = await apiClient.get<CertificationListApiResponse>('/certifications');
  return response.data;
};
