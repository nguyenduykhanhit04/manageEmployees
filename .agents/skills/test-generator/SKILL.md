---
name: test-generator
description: Generate comprehensive Unit and Integration tests for Spring Boot (JUnit 5, Mockito, MockMvc) and Next.js (Jest, React Testing Library), covering happy path, edge cases, and error codes (ER001-ER023).
---

# 🧪 Kỹ Năng Sinh Test Cases (Test Generator Skill)

Kỹ năng chuyên biệt dùng để tự động tạo bộ kiểm thử đơn vị (Unit Test) và kiểm thử tích hợp (Integration Test) đạt độ bao phủ cao (High Code Coverage) cho cả Backend và Frontend.

---

## ☕ 1. Backend Testing (Spring Boot / JUnit 5 / Mockito)

### 1.1. Cấu trúc Test Class
- **Location**: `backend/src/test/java/com/luvina/la/...`
- **Naming**: `<ClassName>Test.java` (ví dụ `EmployeeValidatorTest.java`, `EmployeeServiceImplTest.java`, `EmployeeControllerTest.java`).
- **Dependencies**: `@ExtendWith(MockitoExtension.class)`, `@Mock`, `@InjectMocks`, `MockMvc`.

### 1.2. Các Kịch Bản Bắt Buộc Bao Phủ:
1. **Happy Path**: Dữ liệu hợp lệ, trả về kết quả thành công, HTTP 200 / `CODE_SUCCESS`.
2. **Business Exception & Validation**:
   - Thiếu trường bắt buộc $\rightarrow$ Bắt ngoại lệ `Constants.ER001`.
   - Vượt quá độ dài $\rightarrow$ Bắt ngoại lệ `Constants.ER006`.
   - Lỗi định dạng Katakana/Email/Date $\rightarrow$ Bắt ngoại lệ `ER009`, `ER005`, `ER011`.
   - Ngày kết thúc $\le$ Ngày bắt đầu $\rightarrow$ Bắt ngoại lệ `Constants.ER012`.
   - Không tìm thấy ID $\rightarrow$ Bắt ngoại lệ `Constants.ER013` / `Constants.ER014`.
   - Xóa tài khoản Admin $\rightarrow$ Bắt ngoại lệ `Constants.ER020`.
3. **Database / Repository Edge Cases**: Danh sách rỗng, phân trang vượt quá số bản ghi, sắp xếp sai hướng (`ER021`).

---

## ⚛️ 2. Frontend Testing (Jest / React Testing Library)

### 2.1. Cấu trúc Test File
- **Location**: `frontend/tests/__tests__/...`
- **Naming**: `<ComponentName>.test.tsx` hoặc `<useHook>.test.tsx`.

### 2.2. Các Kịch Bản Bắt Buộc Bao Phủ:
1. **Render Component**: Hiển thị đúng các trường, nhãn tiếng Nhật và button.
2. **Custom Hook Lifecycle**: Khởi tạo state, gọi API mock, cập nhật state dữ liệu, xử lý loading flag.
3. **Form Validation (Zod Schema)**:
   - Nhập chuỗi rỗng $\rightarrow$ hiển thị thông báo lỗi `ER001`.
   - Nhập sai format $\rightarrow$ hiển thị đúng thông báo tiếng Nhật từ `formatErrorMessage`.
4. **Error Handling**: API trả về lỗi 500 kèm mã `ERxxx`, giao diện hiển thị đúng banner cảnh báo lỗi.
