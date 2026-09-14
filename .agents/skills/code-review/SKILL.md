---
name: code-review
description: Review and audit source code against ManageUser_Checklist.md and enterprise standards for Java Spring Boot and Next.js. Outputs a structured OK/NG/NA report with actionable suggestions.
---

# 🔍 Kỹ Năng Đối Soát & Review Code (Code Review Skill)

Kỹ năng chuyên biệt dùng để rà soát toàn bộ các thay đổi mã nguồn trước khi tạo Pull Request hoặc bàn giao tính năng, đối chiếu trực tiếp với tài liệu [ManageUser_Checklist.md](file:///d:/Project/manageEmployees/docs/guidelines/ManageUser_Checklist.md).

---

## 🎯 Quy Trình Thực Hiện Review

1. **Thu thập file thay đổi**: Xác định tất cả các file Java Backend (`Controller`, `Service`, `Repository`, `Validator`, `Entity`, `DTO`) và file Next.js Frontend (`page.tsx`, `Component.tsx`, `useXxx.ts`, `xxx.api.ts`, `schema.ts`).
2. **Kiểm tra theo Ma trận Checklist**:
   - **Mục 1**: Kiểm tra đúng thiết kế nghiệp vụ, bố cục, validate & xử lý mã lỗi.
   - **Mục 2 (Controller)**: Tên hậu tố `Controller`, không gọi Repository, trả về JSON chuẩn, gọi Service qua Interface.
   - **Mục 3 (Service)**: Tên hậu tố `Service`, tách Interface & Impl, `@Transactional`, không hardcode message.
   - **Mục 4 (Repository)**: Kế thừa JPA, tách Custom khi cần join bảng, không gọi ngược Service/Controller.
   - **Mục 5 (Java_BS Convention)**: Javadoc đầy đủ (`@author`, `@param`, `@return`), khoảng trắng toán tử, camelCase, so sánh an toàn `"val".equals(var)`, xử lý catch block.
   - **Mục 6 (FrontEnd Basic)**: Data flow 1 chiều, UI không chứa axios/fetch, Custom Hook có tiền tố `use`, Component PascalCase, Zod Validation, không dùng `any`.
3. **Xuất Báo Cáo Đối Soát (Audit Report)** theo định dạng bảng chuẩn.

---

## 📋 Mẫu Báo Cáo Bắt Buộc (Audit Report Format)

```markdown
### 📊 BÁO CÁO ĐỐI SOÁT CODE REVIEW (MANAGEUSER CHECKLIST)

| STT | Hạng Mục Kiểm Tra (Checklist Item) | Trạng Thái (OK / NG / NA) | Chi Tiết / Vị Trí Cần Lưu Ý |
| :---: | :--- | :---: | :--- |
| **1** | **Backend Architecture** | | |
| 1.1 | Controller gọi Service qua Interface, không gọi Repository | **OK** | `EmployeeController.java` |
| 1.2 | Xử lý Service có `@Transactional` và ném `BusinessException` chuẩn | **OK** | `EmployeeServiceImpl.java` |
| 1.3 | Không hardcode mã lỗi, dùng `Constants.ERxxx` | **OK** | |
| **2** | **Java_BS Coding Convention** | | |
| 2.1 | Header comment, Class Javadoc (`@author`) & Method Javadoc | **OK** / **NG** | *(Ghi rõ nếu thiếu)* |
| 2.2 | Format toán tử, khoảng trắng, camelCase | **OK** | |
| 2.3 | Bắt đúng ngoại lệ, không để trống catch block | **OK** | |
| **3** | **Frontend Architecture (Next.js)** | | |
| 3.1 | UI Component không chứa axios/fetch trực tiếp | **OK** | `EmployeeList.tsx` gọi qua hook |
| 3.2 | Custom Hook bắt đầu bằng `use`, xử lý state tập trung | **OK** | `useEmployee.ts` |
| 3.3 | API Function đặt tên `action + Entity` | **OK** | `getEmployees()` |
| 3.4 | Form validate bằng React Hook Form + Zod, không dùng `any` | **OK** | |

### 🛠️ Đề xuất chỉnh sửa cụ thể (nếu có mục NG):
- **Vấn đề 1**: ...
- **Cách khắc phục**: ...
```
