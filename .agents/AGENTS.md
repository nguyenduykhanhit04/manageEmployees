# 🤖 Quản Lý Nhân Viên (Manage Employees) — Agent System Instructions

Tệp chỉ dẫn định hình vai trò, phạm vi kiến trúc và nguyên tắc phát triển phần mềm cho các Trợ lý AI và Lập trình viên trong Repository **Manage Employees**.

---

## 📌 1. Tổng Quan Dự Án & Công Nghệ Cốt Lõi

Dự án là hệ thống Quản Lý Thông Tin Nhân Viên & Trình Độ Tiếng Nhật (**Manage Employees**) gồm 2 phân hệ:

| Phân Hệ | Công Nghệ & Thư Viện Chính | Đường Dẫn Thư Mục |
| :--- | :--- | :--- |
| **Backend** | Java 17+, Spring Boot 2.7+, Spring Data JPA, Spring Security, Flyway, MapStruct, Lombok, MySQL 8 | `backend/` |
| **Frontend** | Next.js 14+ (App Router), TypeScript, React Hook Form, Zod, Axios, Vanilla CSS Module | `frontend/` |
| **Tài liệu** | TKAPI (API Design), TKDB (Database), Checklist Coding Rule, Error Codes WIKI | `docs/` |

---

## 🛡️ 2. Nguyên Tắc Cốt Lõi Bất Biến (Non-Negotiable Rules)

1. **Tuân thủ quy chuẩn mã nguồn**: Mọi dòng code Backend và Frontend được sinh ra hoặc chỉnh sửa **BẮT BUỘC** phải tuân thủ nghiêm ngặt [ManageUser_Checklist.md](file:///d:/Project/manageEmployees/docs/guidelines/ManageUser_Checklist.md) và các quy tắc trong `.agents/rules/`.
2. **Chuẩn hóa xử lý lỗi Parametric**:
   - Backend chỉ ném `BusinessException(errorCode, params)` và trả về HTTP **500** (`HttpStatus.INTERNAL_SERVER_ERROR`) với payload JSON `{ code: 500, message: { code: "ERxxx", params: [...] } }`.
   - Frontend format qua `formatErrorMessage(code, params)` từ `messages.ts`.
   - Xem chi tiết tại [ERROR_CODES_WIKI.md](file:///d:/Project/manageEmployees/docs/ERROR_CODES_WIKI.md).
3. **Bảo toàn chức năng lõi**: Không được làm gián đoạn hoặc phá vỡ các chức năng đã hoàn thiện (đặc biệt là Auth / Login / Logout / JWT Filter / Flyway V1).
4. **Data Flow 1 chiều & Phân tầng**:
   - Backend: `Controller` $\rightarrow$ `Service (Interface)` $\rightarrow$ `Repository (Interface / Custom)` $\rightarrow$ `Entity / Database`. Controller không gọi Repository trực tiếp!
   - Frontend: `Component UI` $\rightarrow$ `Custom Hook (useXxx)` $\rightarrow$ `Service / API (xxx.api.ts)` $\rightarrow$ `Axios Instance`. UI không chứa `axios`/`fetch` trực tiếp!

---

## 🗂️ 3. Cấu Trúc Hệ Thống Agent (.agents)

```text
.agents/
├── AGENTS.md                          # Hướng dẫn tổng quan và nguyên tắc dự án (File này)
├── rules/                             # Các quy chuẩn bất biến luôn được áp dụng
│   ├── coding-standards.md            # Chuẩn Java Spring Boot & Next.js (theo Checklist)
│   ├── error-handling-rules.md        # Chuẩn mã lỗi ER001 - ER023 & Parametric Error Format
│   ├── security-rules.md              # Chuẩn bảo mật, phân quyền RBAC & chặn xóa Admin (ER020)
│   └── git-workflow.md                # Chuẩn commit Conventional Commits & quản lý branch
│
├── skills/                            # Các bộ kỹ năng chuyên biệt khi thực hiện tác vụ
│   ├── api-development/               # Kỹ năng xây dựng Backend API chuẩn Spring Data JPA
│   ├── frontend-development/          # Kỹ năng xây dựng giao diện Next.js, RHF & Zod
│   ├── code-review/                   # Kỹ năng đối soát & đánh giá code theo Checklist
│   ├── test-generator/                # Kỹ năng sinh Unit Test JUnit 5 / Mockito & Jest / RTL
│   └── db-migration/                  # Kỹ năng quản lý Migration Flyway & Index
│
├── hooks.json                         # Cấu hình automation hooks
└── mcp_config.json                    # Cấu hình kết nối công cụ MCP
```

---

## 🎯 4. Luồng Phân Tích & Triển Khai Chức Năng Mới

Khi nhận yêu cầu triển khai một chức năng:
1. **Xác định tài liệu**: Đọc tài liệu tương ứng theo thứ tự:
   $$\text{Thiết kế Nghiệp vụ / Màn hình} \longrightarrow \text{Thiết kế Database (TKDB)} \longrightarrow \text{Thiết kế API (TKAPI)} \longrightarrow \text{Checklist Coding Rule}$$
2. **Kiểm tra hiện trạng Code**: Không tự suy đoán; kiểm tra các Entity, DTO, Repository, Service, Component đã có sẵn trước khi tạo mới.
3. **Thực thi theo Checklist**: Áp dụng đúng Javadoc Java_BS (`@author`, `@param`, `@return`), đặt tên biến, tách tầng, xử lý ngoại lệ đầy đủ.
4. **Đối soát & Viết Test**: Chạy đối soát checklist và viết unit test cho cả happy path lẫn error/boundary cases.
