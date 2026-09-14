import React, { Suspense } from 'react';
import { Adm006 } from '@/components/employees/Adm006';
import { SYSTEM_MESSAGES } from '@/lib/constants/messages';

/**
 * Màn hình Hoàn thành thao tác nhân viên (ADM006).
 *
 * @author nguyenduykhanh2
 * @return Giao diện trang ADM006
 */
export default function EmployeeCompletePage() {
  return (
    <Suspense
      fallback={
        <div style={{ textAlign: 'center', padding: '40px' }}>
          {SYSTEM_MESSAGES.LOADING}
        </div>
      }
    >
      <Adm006 />
    </Suspense>
  );
}
