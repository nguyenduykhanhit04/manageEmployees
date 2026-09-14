---
name: frontend-development
description: Develop modern, type-safe Next.js App Router UI components, custom hooks, React Hook Form with Zod validation, and Axios integration following enterprise standards.
---

# 🎨 Kỹ Năng Phát Triển Frontend (Frontend Development Skill)

Kỹ năng chuyên biệt dùng để phát triển các màn hình giao diện người dùng trên nền tảng Next.js (App Router), TypeScript, React Hook Form và Zod theo đúng tài liệu thiết kế màn hình.

---

## 🏗️ 1. Quy Trình Xây Dựng Màn Hình Mới

1. **Định nghĩa Type/Interface (`@/types/`)**:
   - Khai báo model dữ liệu rõ ràng, không dùng `any`.
   - Đồng bộ type giữa API response và Form state.
2. **Xây dựng Schema Validation (Zod)**:
   - Viết schema tại `@/lib/validation/`.
   - Tích hợp `formatErrorMessage(code, params)` từ `@/lib/constants/messages.ts` cho mọi rule.
3. **Xây dựng API Client (`@/lib/api/`)**:
   - Tạo file `xxx.api.ts` chứa các hàm gọi API qua `httpClient`.
   - Đặt tên theo quy tắc `action + Entity` (ví dụ `getEmployees()`, `createEmployee()`).
4. **Xây dựng Custom Hook (`@/hooks/`)**:
   - Bắt đầu với tiền tố `use` (ví dụ `useAdm003`, `useEmployeeList`).
   - Đóng gói toàn bộ logic gọi API, quản lý state (data, loading, error, pagination, sorting).
5. **Xây dựng UI Components (`@/components/` & `@/app/`)**:
   - Sử dụng Server / Client Component (`"use client"`) hợp lý.
   - Component viết theo `PascalCase`.
   - Kết nối dữ liệu thông qua Custom Hook, UI không gọi Axios trực tiếp.
6. **Kiểm tra luồng chuyển màn hình**:
   - ADM003 (Input) $\rightarrow$ ADM004 (Confirm) $\rightarrow$ ADM005 (Complete) $\rightarrow$ ADM002 (List).
