import React, { Suspense } from 'react';
import { Adm002 } from '@/components/employees/Adm002';
import { SYSTEM_MESSAGES } from '@/lib/constants/messages';

/**
 * Màn hình danh sách nhân viên (ADM002).
 *
 * @author nguyenduykhanh2
 * @return Giao diện trang ADM002
 */
export default function EmployeeListPage() {
  return (
    <Suspense
      fallback={
        <div style={{ textAlign: 'center', padding: '40px' }}>
          {SYSTEM_MESSAGES.LOADING}
        </div>
      }
    >
      <Adm002 />
    </Suspense>
  );
}
