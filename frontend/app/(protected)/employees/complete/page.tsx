/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * page.tsx (EmployeeCompletePage - ADM005), 23/8/2026 nguyenduykhanh2
 */
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SUCCESS_MESSAGES } from '@/lib/constants/messages';

/**
 * Màn hình Hoàn thành thao tác (ADM005).
 *
 * @author nguyenduykhanh2
 * @return Giao diện thông báo thành công
 */
export default function EmployeeCompletePage() {
  useAuth();
  const router = useRouter();
  const [message, setMessage] = useState<string>('ユーザの登録が完了しました。');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const msgCode = sessionStorage.getItem('complete_message');
      if (msgCode && SUCCESS_MESSAGES[msgCode]) {
        setMessage(SUCCESS_MESSAGES[msgCode]);
      }
    }
  }, []);

  const handleOk = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('complete_message');
    }
    router.push('/employees/adm002');
  };

  return (
    <div className="box-shadow">
      <div className="notification-box">
        <h1 className="msg-title">{message}</h1>
        <div className="notification-box-btn">
          <button
            type="button"
            onClick={handleOk}
            className="btn btn-primary btn-sm"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
