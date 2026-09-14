import React, { Suspense } from 'react';
import { Adm003 } from '@/components/employees/Adm003';
import { SYSTEM_MESSAGES } from '@/lib/constants/messages';

/**
 * Màn hình Chi tiết nhân viên (ADM003).
 *
 * @author nguyenduykhanh2
 * @return Giao diện trang ADM003
 */
export default function EmployeeDetailPage() {
  return (
    <Suspense
      fallback={
        <div style={{ textAlign: 'center', padding: '40px' }}>
          {SYSTEM_MESSAGES.LOADING}
        </div>
      }
    >
      <Adm003 />
    </Suspense>
  );
}
