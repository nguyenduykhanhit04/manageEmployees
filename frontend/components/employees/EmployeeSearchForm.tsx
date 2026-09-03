'use client';

import React from 'react';
import { DepartmentItem } from '@/types/department';

/**
 * Props truyền vào Component EmployeeSearchForm.
 */
export interface EmployeeSearchFormProps {
  /** Giá trị tên nhân viên cần tìm kiếm */
  employeeName: string;
  /** Callback cập nhật giá trị tên nhân viên */
  onEmployeeNameChange: (value: string) => void;
  /** Giá trị mã phòng ban đã chọn */
  departmentId: string;
  /** Callback cập nhật giá trị phòng ban */
  onDepartmentIdChange: (value: string) => void;
  /** Danh sách phòng ban phục vụ dropdown */
  departments: DepartmentItem[];
  /** Handler xử lý khi submit form tìm kiếm */
  onSearch: (e?: React.FormEvent) => void;
  /** Handler xử lý khi bấm nút Thêm mới (新規追加) */
  onAddNew: () => void;
}

/**
 * Component Form tìm kiếm nhân viên.
 *
 * @author nguyenduykhanh2
 */
export const EmployeeSearchForm: React.FC<EmployeeSearchFormProps> = ({
  employeeName,
  onEmployeeNameChange,
  departmentId,
  onDepartmentIdChange,
  departments,
  onSearch,
  onAddNew,
}) => {
  return (
    <div className="search-memb">
      <h1 className="title">
        会員名称で会員を検索します。検索条件無しの場合は全て表示されます。
      </h1>
      <form className="c-form" onSubmit={onSearch}>
        <ul className="d-flex">
          {/* Trường tìm kiếm: Tên nhân viên */}
          <li className="form-group row">
            <label className="col-form-label">氏名:</label>
            <div className="col-sm">
              <input
                type="text"
                maxLength={125}
                value={employeeName}
                onChange={(e) => onEmployeeNameChange(e.target.value)}
              />
            </div>
          </li>

          {/* Trường tìm kiếm: Phòng ban */}
          <li className="form-group row">
            <label className="col-form-label">グループ:</label>
            <div className="col-sm">
              <select
                value={departmentId}
                onChange={(e) => onDepartmentIdChange(e.target.value)}
              >
                <option value="">全て</option>
                {departments.map((dept) => (
                  <option key={dept.departmentId} value={dept.departmentId}>
                    {dept.departmentName}
                  </option>
                ))}
              </select>
            </div>
          </li>

          {/* Nhóm nút bấm: Tìm kiếm và Thêm mới */}
          <li className="form-group row">
            <div className="btn-group">
              <button type="submit" className="btn btn-primary btn-sm">
                検索
              </button>
              <button
                type="button"
                onClick={onAddNew}
                className="btn btn-secondary btn-sm"
              >
                新規追加
              </button>
            </div>
          </li>
        </ul>
      </form>
    </div>
  );
};
