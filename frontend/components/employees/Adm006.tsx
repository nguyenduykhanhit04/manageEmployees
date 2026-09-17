'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter, useSearchParams } from 'next/navigation';
import { getStoredReturnUrl } from '@/lib/constants/storage';
import { SUCCESS_MESSAGES } from '@/lib/constants/messages';

/**
 * Component hiển thị nội dung hoàn thành thao tác thêm/sửa/xóa nhân viên (ADM006).
 */
export function Adm006() {
  useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Đọc mode từ searchParams
  const mode = searchParams.get('mode') || 'add';

  // 2. Xác định thông điệp hoàn thành tương ứng theo mode
  const MESSAGE_MAP: Record<string, string> = {
    add: SUCCESS_MESSAGES.MSG001,
    edit: SUCCESS_MESSAGES.MSG002,
    delete: SUCCESS_MESSAGES.MSG003,
  };
  const message = MESSAGE_MAP[mode] ?? SUCCESS_MESSAGES.MSG001;

  // 3. Xử lý khi nhấn nút OK -> Điều hướng về URL đã lưu trong sessionStorage (hoặc danh sách ADM002)
  const handleOk = () => {
    router.push(getStoredReturnUrl());
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
