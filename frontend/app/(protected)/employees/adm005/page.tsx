import React, { Suspense } from 'react';
import { Adm005 } from '@/components/employees/Adm005';
import { SYSTEM_MESSAGES } from '@/lib/constants/messages';

/**
 * Màn hình Xác nhận thông tin nhân viên (ADM005).
 *
 * @author nguyenduykhanh2
 * @return Giao diện trang ADM005
 */
export default function EmployeeConfirmPage() {
  return (
    <Suspense
      fallback={
        <div style={{ textAlign: 'center', padding: '40px' }}>
          {SYSTEM_MESSAGES.LOADING}
        </div>
      }
    >
      <Adm005 />
    </Suspense>
  );
}
