# Employee Management Frontend (Next.js)

A production-grade, type-safe Next.js frontend application for the **Manage Employees** system (Quản lý Hồ sơ & Trình độ Nhân viên), built with **Next.js 16 (App Router)**, **React 19**, **TypeScript 5.7+**, **React Hook Form**, **Zod**, and **Axios**.

---

## 🌟 Key Features

- **🔐 Robust Authentication & Route Protection**:
  - Stateless JWT token lifecycle management (`localStorage` + `sessionStorage`).
  - Route guards (`useAuth` for protected screens, `useGuest` for public auth screens).
  - Centralized Axios Interceptors: automatic `Authorization: Bearer <token>` injection and seamless `401 Unauthorized` redirect handling.
- **📋 Employee Listing & Advanced Filtering (ADM002)**:
  - Search by employee name (case-sensitive LIKE binary match) and department filter.
  - **Priority Multi-column Sorting**: dynamically prioritizes columns based on user interaction order (`ord_employee_name`, `ord_certification_name`, `ord_end_date`).
  - **Sliding Window Pagination**: responsive 3-page window with total record counting and deterministic tie-breaker sorting (`employee_id ASC`).
  - **Full Bidirectional URL Search Params Sync**: enables seamless browser back/forward navigation, bookmarking, and link sharing without state loss.
- **🔍 Employee Details (ADM003)**:
  - Complete personal information & Japanese certification score details view.
  - Confirmation modals for deletion (`MSG004`) and Admin protection checks (`ER020`).
  - Safe System Error fallback modal with single `[OK]` button navigating back to list view.
- **📝 Add / Edit Employee Form (ADM004)**:
  - Unified input form supporting both **Add** (`mode=add`) and **Edit** (`mode=edit`) modes.
  - Dynamic schema validation via **Zod**: mandatory password in Add mode, optional password in Edit mode.
  - **React Datepicker** with month/year dropdowns and custom keyboard navigation.
  - Japanese character validation: Half-width Katakana, ASCII Half-size, RFC Email, Date constraints (`certificationEndDate >= certificationStartDate`).
  - **Tab Focus Loop** (Accessibility) and automatic first-field focus.
  - Concurrent modification safety check (`checkEmployeeExist`) before navigating to confirmation.
- **✅ Confirmation Screen (ADM005)**:
  - Read-only review of entered data before committing to the database.
  - Dual-state persistence using `sessionStorage` (`ADM004_TEMP_DATA`) allowing smooth Back navigation without data loss.
  - Anti double-submit mechanism with disabled state during request execution.
- **🎉 Operation Completion (ADM006)**:
  - Displays localized Japanese success notices (`MSG001` Add, `MSG002` Update, `MSG003` Delete).
  - Safe redirect returning to ADM002 with preserved search criteria (`returnTo` pattern).

---

## 🛠️ Tech Stack & Dependencies

| Category | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Framework** | [Next.js](https://nextjs.org/) (App Router) | `16.0.8` | Server/Client rendering, file-system routing, layout grouping |
| **UI Library** | [React](https://react.dev/) | `19.2.3` | Reactive component-based user interface |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | `5.7.2` | Compile-time static type safety across API, Form, and Props |
| **Form Management** | [React Hook Form](https://react-hook-form.com/) | `7.69.0` | Uncontrolled performant form state management |
| **Schema Validation** | [Zod](https://zod.dev/) | `4.2.1` | Runtime data validation & TypeScript type inference |
| **Form Resolver** | [@hookform/resolvers](https://github.com/react-hook-form/resolvers) | `5.2.2` | Bridge between Zod schemas and React Hook Form |
| **HTTP Client** | [Axios](https://axios-http.com/) | `1.13.2` | REST API communication, interceptors, error extraction |
| **Date Utilities** | [date-fns](https://date-fns.org/) & [react-datepicker](https://reactdatepicker.com/) | `4.1.0` / `9.1.0` | Pure date calculations & accessible datepicker UI |
| **Testing** | [Jest](https://jestjs.io/) & [React Testing Library](https://testing-library.com/) | `30.2.0` / `16.3.1` | Unit tests for components, custom hooks, and validation |
| **Styling** | Vanilla CSS (`globals.css`) | — | Pure CSS, CSS Grid Table (`.css-grid-table`), Japanese enterprise UI theme |

---

## 📁 Architecture & Folder Structure

Cấu trúc toàn bộ các tệp mã nguồn phục vụ biên dịch và thực thi ứng dụng Frontend:

```text
frontend/
├── app/                                      # Next.js App Router (Routing & Layouts)
│   ├── (auth)/                               # Public Auth Route Group
│   │   ├── login/page.tsx                    # ADM001: Màn hình đăng nhập
│   │   └── logout/page.tsx                   # Xử lý đăng xuất & xóa JWT token
│   ├── (protected)/                          # Protected Route Group (Yêu cầu JWT)
│   │   └── employees/
│   │       ├── adm002/page.tsx               # ADM002: Danh sách nhân viên & tìm kiếm
│   │       ├── adm003/page.tsx               # ADM003: Chi tiết thông tin nhân viên
│   │       ├── adm004/page.tsx               # ADM004: Thêm mới / Chỉnh sửa nhân viên
│   │       ├── adm005/page.tsx               # ADM005: Xác nhận thông tin nhân viên
│   │       └── adm006/page.tsx               # ADM006: Thông báo thao tác thành công
│   ├── globals.css                           # CSS toàn cục & biến giao diện chuẩn UI
│   ├── layout.tsx                            # Root Layout (bọc Header & Footer)
│   ├── page.module.css                       # CSS Module cho trang gốc
│   └── page.tsx                              # Trang gốc điều hướng tự động
├── components/                               # Thành phần giao diện (UI Presentation)
│   ├── auth/
│   │   └── LoginForm.tsx                     # Form đăng nhập tài khoản
│   ├── common/
│   │   └── Pagination.tsx                    # Phân trang cửa sổ trượt (3 trang hiển thị)
│   ├── employees/
│   │   ├── Adm002.tsx                        # Giao diện màn hình danh sách nhân viên
│   │   ├── Adm003.tsx                        # Giao diện màn hình chi tiết nhân viên
│   │   ├── Adm004.tsx                        # Giao diện form thêm/sửa nhân viên
│   │   ├── Adm005.tsx                        # Giao diện màn hình xác nhận thông tin
│   │   ├── Adm006.tsx                        # Giao diện màn hình thông báo hoàn thành
│   │   ├── EmployeeSearchForm.tsx            # Khối tìm kiếm (tên nhân viên, phòng ban)
│   │   └── EmployeeTable.tsx                 # Bảng danh sách CSS Grid & sort đa cột
│   └── layout/
│       ├── Header.tsx                        # Thanh tiêu đề điều hướng
│       └── Footer.tsx                        # Chân trang bản quyền
├── hooks/                                    # Tầng xử lý nghiệp vụ (Custom React Hooks)
│   ├── useAdm002.ts                          # Quản lý state danh sách, đa sort, phân trang, URL sync
│   ├── useAdm003.ts                          # Quản lý chi tiết nhân viên, modal xóa & kiểm tra admin
│   ├── useAdm004.ts                          # Quản lý form nhập liệu, lưu sessionStorage, tab trap
│   ├── useAdm005.ts                          # Quản lý xác nhận submit API, chặn double-click
│   ├── useAdm006.ts                          # Quản lý hiển thị thông báo MSG001-MSG003 & quay lại
│   ├── useAuth.ts                            # Guard điều hướng (useAuth, useGuest)
│   ├── useCertifications.ts                  # Fetch danh mục chứng chỉ tiếng Nhật
│   └── useDepartments.ts                     # Fetch danh mục phòng ban
├── lib/                                      # Tầng tiện ích, hằng số & kết nối API
│   ├── api/                                  # Tầng gọi API Backend (Axios Services)
│   │   ├── auth.api.ts                       # API đăng nhập hệ thống (/login)
│   │   ├── certification.api.ts              # API lấy danh sách chứng chỉ (/certifications)
│   │   ├── client.ts                         # Cấu hình Axios instance & Interceptors
│   │   ├── department.api.ts                 # API lấy danh sách phòng ban (/departments)
│   │   └── employee.api.ts                   # API nhân viên (CRUD, check-exist)
│   ├── auth/
│   │   └── token.ts                          # Quản lý lưu trữ & kiểm tra JWT token
│   ├── constants/                            # Hằng số hệ thống
│   │   ├── http.ts                           # HTTP Status codes & Content-Types
│   │   ├── messages.ts                       # Danh mục mã lỗi ER001-ER023 & MSG001-MSG005
│   │   ├── regex.ts                          # Regex kiểm tra định dạng dữ liệu
│   │   ├── routes.ts                         # Định nghĩa các đường dẫn URL nội bộ
│   │   ├── storage.ts                        # Khóa lưu trữ LocalStorage & SessionStorage
│   │   ├── table.ts                          # Cấu hình phân trang, độ dài text, cột sắp xếp
│   │   └── validation.ts                     # Giới hạn độ dài, khoảng điểm & format ngày
│   ├── utils/                                # Hàm tiện ích dùng chung
│   │   ├── apiError.ts                       # Trích xuất và định dạng mã lỗi parametric
│   │   ├── date.ts                           # Parse, format và validate chuỗi ngày yyyy/MM/dd
│   │   ├── employeeMapper.ts                 # Map dữ liệu API <-> Form & build payload
│   │   ├── employeeSort.ts                   # Xử lý logic sắp xếp đa cột ưu tiên
│   │   └── format.ts                         # Cắt ngắn chuỗi hiển thị bảng (truncateText)
│   └── validation/                           # Schemas xác thực dữ liệu (Zod)
│       ├── auth.ts                           # Schema xác thực đăng nhập
│       ├── employee.ts                       # Schemas xác thực nhân viên (base, add, edit)
│       └── helpers.ts                        # Các bộ kiểm tra Zod dùng chung (date, katakana...)
├── types/                                    # Định nghĩa kiểu dữ liệu TypeScript
│   ├── api.ts                                # Kiểu phản hồi API & cấu trúc lỗi parametric
│   ├── auth.ts                               # Kiểu dữ liệu đăng nhập & token phản hồi
│   ├── certification.ts                      # Kiểu dữ liệu danh mục chứng chỉ
│   ├── department.ts                         # Kiểu dữ liệu danh mục phòng ban
│   └── employee.ts                           # Kiểu dữ liệu nhân viên, request payload & sort orders
├── next.config.ts                            # Cấu hình Next.js
├── package.json                              # Quản lý dependencies & scripts thực thi
└── tsconfig.json                             # Cấu hình TypeScript compiler
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v18.17.0` or higher (Node.js 20 LTS recommended)
- **npm**: `v9.0.0` or higher
- **Backend Service**: Spring Boot API running at `http://localhost:8085`

### 1. Environment Configuration

Create a `.env.local` file in the `frontend/` root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8085
```

### 2. Install Dependencies

```bash
cd frontend
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm run start
```

---

## 🧪 Testing & Quality Assurance

The frontend includes comprehensive unit and integration tests using **Jest** and **React Testing Library**:

```bash
# Run all unit tests
npm test

# Run tests with coverage report
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

### Linting

```bash
npm run lint
```

---

## 🇯🇵 Japanese Business Error Code Specification

Errors received from the Backend are formatted parametrically via `formatErrorMessage(code, params)` based on [ERROR_CODES_WIKI.md](../docs/ERROR_CODES_WIKI.md):

| Code | Message Template | Example Context |
| :--- | :--- | :--- |
| **`ER001`** | `{0}を入力してください。` | Mandatory input validation (Name, Login ID, Password, etc.) |
| **`ER002`** | `{0}を選択してください。` | Mandatory selection (Department, Certification dates) |
| **`ER003`** | `「{0}」は既に存在しています。` | Duplicate Login ID or Email in database |
| **`ER004`** | `「{0}」は存在していません。` | Non-existent Department or Certification ID |
| **`ER005`** | `「{0}」を{1}形式で入力してください。` | Invalid Email address syntax |
| **`ER006`** | `「{0}」は{1}文字以下で入力してください。` | Max length exceeded |
| **`ER007`** | `「{0}」は{1}桁から{2}桁で入力してください。` | Password length not in 8-50 range |
| **`ER008`** | `「{0}」は半角英数字で入力してください。` | Invalid characters in telephone number |
| **`ER009`** | `「{0}」はカタカナで入力してください。` | Half-width Katakana validation for `employeeNameKana` |
| **`ER011`** | `「{0}」を{1}形式で入力してください。` | Invalid Date format (`yyyy/MM/dd`) |
| **`ER012`** | `「{0}」は「{1}」より未来の日付を入力してください。` | Certification End Date must be after Start Date |
| **`ER013`** | `該当する社員が存在しません。` | Employee not found on detail/edit |
| **`ER014`** | `該当する社員が存在しません。` | Employee not found on delete |
| **`ER015`** | `システムエラーが発生しました。` | General / unexpected system error |
| **`ER017`** | `パスワードが一致しません。` | Password and Password Confirm do not match |
| **`ER018`** | `「{0}」は{1}以上の数値を入力してください。` | Negative certification score or invalid offset/limit |
| **`ER019`** | `「{0}」は半角英字、数字、アンダースコア（_）で入力してください。先頭文字は英字またはアンダースコア（_）である必要があります。` | Login ID syntax rules |
| **`ER020`** | `管理者ユーザを削除することはできません。` | Cannot delete Administrator account |
| **`ER021`** | `無効なソートパラメータです。` | Invalid sort column key or order direction |
