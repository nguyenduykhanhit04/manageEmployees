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

Following strict **Separation of Concerns (SoC)** and Layered Architecture:

```text
frontend/
├── app/                              # Next.js App Router
│   ├── (auth)/                       # Public Auth Route Group
│   │   ├── login/page.tsx            # ADM001: Login Screen
│   │   └── logout/page.tsx           # Logout Handler & Token Cleanup
│   ├── (protected)/                  # Protected Route Group (Requires JWT)
│   │   └── employees/
│   │       ├── adm002/page.tsx       # ADM002: Employee List Route Entry Point
│   │       ├── adm003/page.tsx       # ADM003: Employee Detail Route Entry Point
│   │       ├── adm004/page.tsx       # ADM004: Add/Edit Employee Form Route Entry Point
│   │       ├── adm005/page.tsx       # ADM005: Confirmation Screen Route Entry Point
│   │       └── adm006/page.tsx       # ADM006: Completion Screen Route Entry Point
│   ├── globals.css                   # Global CSS & Design System Tokens
│   ├── layout.tsx                    # Root Layout with Header & Footer conditionally rendered
│   └── page.tsx                      # Root Index Redirect
├── components/                       # UI Presentation Components
│   ├── auth/
│   │   └── LoginForm.tsx             # Login form component
│   ├── common/                       # Reusable UI widgets
│   │   ├── Button.tsx                # Standard action button
│   │   ├── DatePicker.tsx            # Integrated calendar picker
│   │   ├── Footer.tsx                # App footer
│   │   ├── Header.tsx                # App header & navigation
│   │   ├── Input.tsx                 # Text / Password input with error feedback
│   │   ├── Modal.tsx                 # System error / Confirmation dialog
│   │   ├── Pagination.tsx            # Sliding window pagination component
│   │   └── Select.tsx                # Standard select dropdown
│   └── employees/                    # Employee domain UI components
│       ├── Adm002.tsx                # List view wrapper
│       ├── Adm003.tsx                # Detail view wrapper
│       ├── Adm004.tsx                # Add/Edit form wrapper
│       ├── Adm005.tsx                # Confirmation view wrapper
│       ├── Adm006.tsx                # Completion notice wrapper
│       ├── EmployeeSearchForm.tsx    # Search filter bar
│       └── EmployeeTable.tsx         # CSS Grid data table with sortable headers
├── hooks/                            # Business Logic Layer (Custom React Hooks)
│   ├── useAdm002.ts                  # ADM002 State (search, multi-sort, pagination, URL sync)
│   ├── useAdm003.ts                  # ADM003 State (fetch, delete modal, system error handling)
│   ├── useAdm004.ts                  # ADM004 State (form lifecycle, session restore, tab trap)
│   ├── useAdm005.ts                  # ADM005 State (API submit, double-submit guard)
│   ├── useAdm006.ts                  # ADM006 State (success message mapping, return navigation)
│   ├── useAuth.ts                    # Auth guards (`useAuth`, `useGuest`)
│   ├── useCertifications.ts          # Japanese Certification Master Data fetcher
│   └── useDepartments.ts             # Department Master Data fetcher
├── lib/                              # Core Infrastructure & Utilities
│   ├── api/                          # HTTP REST Services
│   │   ├── client.ts                 # Axios instance with request/response interceptors
│   │   ├── employee.api.ts           # Employee CRUD & check-exist API calls
│   │   ├── department.api.ts         # Department list API call
│   │   └── certification.api.ts      # Certification list API call
│   ├── auth/
│   │   └── token.ts                  # JWT token storage & expiration check utilities
│   ├── constants/                    # Centralized Constants
│   │   ├── routes.ts                 # Application route constants (`ROUTES`)
│   │   ├── http.ts                   # HTTP status codes & content types
│   │   ├── table.ts                  # Pagination limits & sort field keys
│   │   ├── validation.ts             # Validation limits & date formats
│   │   └── messages.ts               # Japanese error codes (ER001-ER023) & messages (MSG001-MSG005)
│   ├── utils/
│   │   ├── format.ts                 # String formatting & truncate helpers
│   │   └── messageHelper.ts          # Parametric error message compiler
│   └── validation/                   # Zod Validation Schemas
│       ├── auth.ts                   # Login schema (`loginSchema`)
│       └── employee.ts               # Employee schemas (`base`, `add`, `edit`)
├── types/                            # TypeScript Type Definitions
│   ├── api.ts                        # API response wrappers & error types
│   ├── auth.ts                       # Auth payloads & token types
│   ├── certification.ts              # Certification master data interfaces
│   ├── department.ts                 # Department master data interfaces
│   └── employee.ts                   # Employee DTOs, request payloads, sort types
└── tests/                            # Unit & Component Test Suites (Jest + RTL)
    └── __tests__/                    # Structured test cases for hooks, components, lib
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
