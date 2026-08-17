'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function EmployeeEditPage() {
  useAuth();
  const router = useRouter();
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [certificationStartDate, setCertificationStartDate] = useState<Date | null>(null);
  const [certificationEndDate, setCertificationEndDate] = useState<Date | null>(null);

  const birthDateRef = useRef<DatePicker>(null);
  const certificationStartDateRef = useRef<DatePicker>(null);
  const certificationEndDateRef = useRef<DatePicker>(null);

  const handleConfirm = () => {
    router.push('/employees/confirm');
  };

  const handleBack = () => {
    router.push('/employees/list');
  };
  return (
    <div className="row">
      <form className="c-form box-shadow was-validated">
        <ul>
          <li className="title">会員情報編集</li>
          <li className="box-err">
            <div className="box-err-content">Hiển thị lỗi chung lại đây</div>
          </li>
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2"><i className="relative">アカウント名:<span className="note-red">*</span></i></label>
            <div className="col-sm col-sm-10"><input type="text" className="form-control" /></div>
          </li>
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2"><i className="relative">グループ:<span className="note-red">*</span></i></label>
            <div className="col-sm col-sm-10">
              <select className="form-control">
                <option>選択してください</option>
                <option>Nhóm 1</option>
                <option>Nhóm 2</option>
              </select>
            </div>
          </li>
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2"><i className="relative">氏名:<span className="note-red">*</span></i></label>
            <div className="col-sm col-sm-10"><input type="text" className="form-control" /></div>
          </li>
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2"><i className="relative">カタカナ氏名:<span className="note-red">*</span></i></label>
            <div className="col-sm col-sm-10">
              <input type="text" className="form-control" required />
              <div className="invalid-feedback">Example invalid form file feedback</div>
            </div>
          </li>
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2"><i className="relative">生年月日:<span className="note-red">*</span></i></label>
            <div className="col-sm col-sm-10 d-flex">
              <div className="datepicker-wrapper">
                <DatePicker 
                  ref={birthDateRef}
                  placeholderText='yyyy/MM/dd' 
                  selected={birthDate} 
                  onChange={(date: Date | null) => setBirthDate(date ?? null)} 
                  dateFormat="yyyy/MM/dd" 
                />
                <span className="glyphicon glyphicon-calendar" onClick={() => birthDateRef.current?.setFocus()}></span>
              </div>
            </div>
          </li>
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2"><i className="relative">メールアドレス:<span className="note-red">*</span></i></label>
            <div className="col-sm col-sm-10"><input type="text" className="form-control" /></div>
          </li>
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2"><i className="relative">電話番号:<span className="note-red">*</span></i></label>
            <div className="col-sm col-sm-10"><input type="text" className="form-control" /></div>
          </li>
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2"><i className="relative">パスワード:<span className="note-red">*</span></i></label>
            <div className="col-sm col-sm-10"><input type="text" className="form-control" /></div>
          </li>
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2"><i className="relative">パスワード（確認）:</i></label>
            <div className="col-sm col-sm-10"><input type="text" className="form-control" /></div>
          </li>
          <li className="title mt-12"><a href="#!">日本語能力</a></li>
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2"><i className="relative">資格:</i></label>
            <div className="col-sm col-sm-10">
              <select className="form-control">
                <option>選択してください</option>
                <option>N 1</option>
                <option>N 2</option>
              </select>
            </div>
          </li>
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2"><i className="relative">資格交付日:<span className="note-red">*</span></i></label>
            <div className="col-sm col-sm-10 d-flex">
              <div className="datepicker-wrapper">
                <DatePicker 
                  ref={certificationStartDateRef}
                  placeholderText='yyyy/MM/dd' 
                  selected={certificationStartDate} 
                  onChange={(date: Date | null) => setCertificationStartDate(date ?? null)} 
                  dateFormat="yyyy/MM/dd" 
                />
                <span className="glyphicon glyphicon-calendar" onClick={() => certificationStartDateRef.current?.setFocus()}></span>
              </div>
            </div>
          </li>
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2"><i className="relative">失効日:<span className="note-red">*</span></i></label>
            <div className="col-sm col-sm-10 d-flex">
              <div className="datepicker-wrapper">
                <DatePicker 
                  ref={certificationEndDateRef}
                  placeholderText='yyyy/MM/dd' 
                  selected={certificationEndDate} 
                  onChange={(date: Date | null) => setCertificationEndDate(date ?? null)} 
                  dateFormat="yyyy/MM/dd" 
                />
                <span className="glyphicon glyphicon-calendar" onClick={() => certificationEndDateRef.current?.setFocus()}></span>
              </div>
            </div>
          </li>
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2"><i className="relative">点数:</i></label>
            <div className="col-sm col-sm-10"><input type="text" className="form-control" /></div>
          </li>
          <li className="form-group row d-flex">
            <div className="btn-group col-sm col-sm-10 ml">
              <button type="button" onClick={handleConfirm} className="btn btn-primary btn-sm">確認</button>
              <button type="button" onClick={handleBack} className="btn btn-secondary btn-sm">戻る</button>
            </div>
          </li>
        </ul>
      </form>
    </div>
  );
}

