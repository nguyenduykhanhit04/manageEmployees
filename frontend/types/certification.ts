/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * certification.ts, 23/8/2026 nguyenduykhanh2
 */

export interface CertificationItem {
  certificationId: number;
  certificationName: string;
  certificationLevel?: number;
}

export interface CertificationListApiResponse {
  code: number;
  certifications: CertificationItem[];
}

export interface CertificationFormInput {
  certificationId: number | string;
  startDate: string;
  endDate: string;
  score: number | string;
}
