/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * page.tsx (ADM003 Detail), 24/8/2026 nguyenduykhanh2
 */
'use client';

import React, { Suspense } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, useSearchParams } from 'next/navigation';
import { SYSTEM_MESSAGES } from '@/lib/constants/messages';

function EmployeeDetailContent() {
  useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Đọc returnTo từ URL nếu có, mặc định là /employees/adm002
  const returnTo = searchParams.get('returnTo') || '/employees/adm002';

  const handleBack = () => {
    router.push(returnTo);
  };

  const handleEdit = () => {
    const editUrl = `/employees/edit?returnTo=${encodeURIComponent(returnTo)}`;
    router.push(editUrl);
  };

  return (
    <div className="row">
      <form className="c-form box-shadow">
        <ul className="show-data">
          <li className="title">情報確認</li>
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">アカウント名</label>
            <div className="col-sm col-sm-10">ntmhuong</div>
          </li>
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">グループ</label>
            <div className="col-sm col-sm-10">Nhóm 1</div>
          </li>
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">氏名</label>
            <div className="col-sm col-sm-10">Nguyễn Thị Mai Hương</div>
          </li>
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">カタカナ氏名</label>
            <div className="col-sm col-sm-10">名カナ</div>
          </li>
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">生年月日</label>
            <div className="col-sm col-sm-10">1983/07/08</div>
          </li>
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">メールアドレス</label>
            <div className="col-sm col-sm-10">ntmhuong@luvina.net</div>
          </li>
          <li className="form-group row d-flex bor-none">
            <label className="col-form-label col-sm-2">電話番号</label>
            <div className="col-sm col-sm-10">0914326386</div>
          </li>
          <li className="title mt-12"><a href="#!">日本語能力</a></li>
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">資格</label>
            <div className="col-sm col-sm-10">Trình độ tiếng nhật cấp 1</div>
          </li>
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">資格交付日</label>
            <div className="col-sm col-sm-10">2010/07/08</div>
          </li>
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">失効日</label>
            <div className="col-sm col-sm-10">2010/07/08</div>
          </li>
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">点数</label>
            <div className="col-sm col-sm-10">290</div>
          </li>
          <li className="form-group row d-flex">
            <div className="btn-group col-sm col-sm-10 ml">
              <button type="button" onClick={handleEdit} className="btn btn-primary btn-sm">編集</button>
              <button type="button" className="btn btn-secondary btn-sm">削除</button>
              <button type="button" onClick={handleBack} className="btn btn-secondary btn-sm">戻る</button>
            </div>
          </li>
        </ul>
      </form>
    </div>
  );
}

export default function EmployeeDetailPage() {
  return (
    <Suspense
      fallback={
        <div style={{ textAlign: 'center', padding: '40px' }}>
          {SYSTEM_MESSAGES.LOADING}
        </div>
      }
    >
      <EmployeeDetailContent />
    </Suspense>
  );
}
