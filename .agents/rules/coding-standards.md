# 📐 Quy Chuẩn Lập Trình (Coding Standards & Conventions)

> **Mục tiêu**: Đảm bảo toàn bộ mã nguồn Backend (Java Spring Boot) và Frontend (Next.js) tuân thủ 100% tài liệu [ManageUser_Checklist.md](file:///d:/Project/manageEmployees/docs/guidelines/ManageUser_Checklist.md).

---

## ☕ 1. Quy Chuẩn Backend (Java Spring Boot — Java_BS)

### 1.1. Javadoc Bắt Buộc (Mục 3.1 trong Checklist)
Mọi file, class, method đều phải có Javadoc đầy đủ theo mẫu chuẩn:

```java
/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * [TênFile].java, [dd/MM/yyyy] [Tên người tạo / tác giả]
 */
package com.luvina.la.service.impl;

/**
 * [Mô tả chi tiết chức năng và vai trò của class/interface]
 *
 * @author [tên tác giả]
 */
public class EmployeeServiceImpl implements EmployeeService {

    /**
     * [Mô tả chi tiết xử lý của phương thức]
     *
     * @param employeeId [mô tả ý nghĩa biến truyền vào]
     * @return [mô tả giá trị trả về]
     * @throws BusinessException [mô tả trường hợp ném ngoại lệ nghiệp vụ]
     */
    @Override
    public EmployeeDetailDto getEmployeeById(Long employeeId) {
        ...
    }
}
```

### 1.2. Phân Tầng Kiến Trúc & Quan Hệ Phụ Thuộc
- **Controller**:
  - Hậu tố class bắt buộc là `Controller` (ví dụ `EmployeeController`).
  - Đặt trong package `com.luvina.la.controller`.
  - **TUYỆT ĐỐI KHÔNG** gọi trực tiếp `Repository`. Phải gọi qua Interface của `Service`.
  - Không trả về HTML/String tùy tiện, phải trả về `ApiResponse<T>` hoặc `ResponseEntity<ApiResponse<T>>`.
- **Service**:
  - Tách thành `Interface` (ví dụ `EmployeeService`) và Class thực thi `ServiceImpl` (ví dụ `EmployeeServiceImpl`).
  - Toàn bộ xử lý nghiệp vụ đặt tại Service.
  - Phải dùng `@Transactional` (readOnly = true cho hàm query, `@Transactional(rollbackFor = Exception.class)` cho hàm ghi).
  - Gọi Repository thông qua Interface.
- **Repository**:
  - Kế thừa `JpaRepository<Entity, ID>` hoặc `JpaSpecificationExecutor<Entity>`.
  - Khi có logic query phức tạp (join nhiều bảng, dynamic search, phân trang sắp xếp), tách thành `RepositoryCustom` và `RepositoryCustomImpl`.
  - **KHÔNG** truy cập ngược vào `Service` hoặc `Controller`.
- **Entity & DTO**:
  - Entity dùng để map bảng DB.
  - DTO dùng cho Request Body, Response Data. Sử dụng **MapStruct** hoặc Mapper chuẩn để chuyển đổi giữa Entity $\leftrightarrow$ DTO.

### 1.3. Quy Tắc Code Style & Clean Code
- **Hằng số**: Khai báo `public static final`, tên viết HOA toàn bộ nối bằng `_` (ví dụ `Constants.ER001`), gom vào `Constants.java`.
- **Format toán tử**: Có khoảng trắng trước và sau các toán tử `=`, `+`, `-`, `*`, `/`, `==`, `!=`, `<`, `>`, `&&`, `||`.
- **Format dấu phẩy & chấm phẩy**: Có khoảng trắng sau dấu `,` và `;`.
- **Không so sánh thừa**: Dùng `if (isValid)` hoặc `if (!isValid)`, không viết `if (isValid == true)`.
- **So sánh chuỗi an toàn**: Dùng `"CONSTANT".equals(variable)` để tránh `NullPointerException`.
- **Xử lý Exception**:
  - Bắt đúng kiểu ngoại lệ cụ thể (ví dụ `NumberFormatException`, `DateTimeParseException`).
  - Không để trống catch block (`catch(Exception e) {}`). Phải log hoặc xử lý fallback.

---

## ⚛️ 2. Quy Chuẩn Frontend (Next.js App Router & TypeScript)

### 2.1. Kiến Trúc Phân Tách 3 Lớp (Data Flow 1 Chiều)
```text
[UI Component (.tsx)]
       │ (sử dụng state, gọi handler)
       ▼
[Custom Hook: useEmployee.ts]
       │ (xử lý state, error, loading, gọi service)
       ▼
[API Layer: employee.api.ts]
       │ (định nghĩa hàm gọi endpoint)
       ▼
[HTTP Client: httpClient / axios.ts]
       │
       ▼
[Backend REST API]
```
- **UI Component**: Tuyệt đối không import `axios` hoặc gọi `fetch()` trực tiếp trong file `.tsx`.
- **Custom Hook**: Bắt buộc bắt đầu bằng tiền tố `use` (ví dụ `useEmployee`, `useDepartments`).
- **Function API**: Bắt buộc đặt tên theo quy tắc `động từ + Entity` (ví dụ `getEmployees()`, `createEmployee()`, `deleteEmployee()`).

### 2.2. Type Safety & Validation
- **Không dùng `any`**: Mọi dữ liệu phải có `interface` hoặc `type` rõ ràng trong `@/types/`.
- **Validation chuẩn**: Sử dụng **React Hook Form (RHF)** kết hợp **Zod** schema.
- **Xử lý lỗi**: Tích hợp hàm `formatErrorMessage(code, params)` từ `@/lib/constants/messages.ts` để hiển thị đúng template tiếng Nhật chuẩn.

### 2.3. Quy Chuẩn Đặt Tên (Naming Conventions)
- **Component**: Luôn viết `PascalCase` (ví dụ `EmployeeTable.tsx`, `ConfirmModal.tsx`).
- **Handler**: Tiền tố `handle` (ví dụ `handleSubmit`, `handleSearch`, `handleSort`).
- **Biến & Hàm**: Viết rõ nghĩa tiếng Anh, không viết tắt vô nghĩa (dùng `employeeList` thay vì `empLst`, `fetchData` thay vì `fn1`).
