import React, { Suspense } from 'react';
import { Adm004 } from '@/components/employees/Adm004';
import { SYSTEM_MESSAGES } from '@/lib/constants/messages';

/**
 * Màn hình Form thêm mới / chỉnh sửa nhân viên (ADM004).
 *
 * @author nguyenduykhanh2
 * @return Giao diện trang ADM004
 */
export default function EmployeeEditPage() {
  return (
    <Suspense
      fallback={
        <div style={{ textAlign: 'center', padding: '40px' }}>
          {SYSTEM_MESSAGES.LOADING}
        </div>
      }
    >
      <Adm004 />
    </Suspense>
  );
}
