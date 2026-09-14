# 🌿 Quy Chuẩn Git & Commit (Git Workflow & Commits)

> **Mục tiêu**: Chuẩn hóa thông điệp commit, quản lý branch và đảm bảo lịch sử mã nguồn rõ ràng, dễ truy vết.

---

## 1. Quy Chuẩn Đặt Tên Branch

- **Feature**: `feat/<screen-or-api-code>-<short-description>` (Ví dụ: `feat/ADM003-add-employee`, `feat/TKAPI-03-search-employees`)
- **Bugfix**: `fix/<issue-code>-<short-description>` (Ví dụ: `fix/ER012-date-validation-bug`)
- **Refactor / Docs**: `refactor/<module>`, `docs/<topic>` (Ví dụ: `refactor/employee-service`, `docs/update-wiki`)

---

## 2. Chuẩn Conventional Commits

Thông điệp commit phải viết bằng tiếng Anh hoặc tiếng Việt rõ ràng, theo định dạng:

```text
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

### Các tiền tố Type:
- **`feat`**: Thêm mới một tính năng / API / Component (Ví dụ: `feat(employee): implement add employee API (TKAPI-03)`).
- **`fix`**: Sửa lỗi chức năng hoặc xử lý ngoại lệ (Ví dụ: `fix(validation): fix date comparison logic for ER012`).
- **`docs`**: Cập nhật tài liệu, README, WIKI (Ví dụ: `docs(wiki): update error codes catalog ER001-ER023`).
- **`style`**: Format code, điều chỉnh CSS, không thay đổi logic code.
- **`refactor`**: Cấu trúc lại code mà không thay đổi tính năng.
- **`test`**: Thêm mới hoặc cập nhật unit test cases (Ví dụ: `test(employee): add unit tests for EmployeeValidator`).
- **`chore`**: Cấu hình build, dependencies, npm, maven, CI/CD.
