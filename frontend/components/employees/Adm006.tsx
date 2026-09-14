'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, useSearchParams } from 'next/navigation';
import { ROUTES } from '@/lib/constants/routes';

/**
 * Component hiển thị nội dung hoàn thành thao tác thêm/sửa/xóa nhân viên (ADM006).
 *
 * @author nguyenduykhanh2
 * @return Giao diện thông báo hoàn thành
 */
export function Adm006() {
  useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Đọc mode và returnTo từ searchParams
  const mode = searchParams.get('mode') || 'add';
  const returnTo = searchParams.get('returnTo') || ROUTES.EMPLOYEE_LIST;

  // 2. Xác định thông điệp hoàn thành tương ứng
  let message = 'ユーザの登録が完了しました。'; // MSG001: Mặc định thêm mới
  if (mode === 'delete') {
    message = 'ユーザの削除が完了しました。'; // MSG003: Xóa thành công
  } else if (mode === 'edit') {
    message = 'ユーザの更新が完了しました。'; // MSG002: Cập nhật thành công
  }

  // 3. Xử lý khi nhấn nút OK -> Điều hướng về returnTo (hoặc danh sách ADM002)
  const handleOk = () => {
    router.push(returnTo);
  };

  return (
    <div className="box-shadow">
      <div className="notification-box">
        <h1 className="msg-title">{message}</h1>
        <div className="notification-box-btn">
          <button type="button" onClick={handleOk} className="btn btn-primary btn-sm">
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

export default Adm006;
