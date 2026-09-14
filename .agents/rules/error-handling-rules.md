# 🚨 Quy Chuẩn Xử Lý Lỗi & Thông Báo (Error Handling Rules)

> **Tham chiếu chính**: [ERROR_CODES_WIKI.md](file:///d:/Project/manageEmployees/docs/ERROR_CODES_WIKI.md) & [GlobalExceptionHandler.java](file:///d:/Project/manageEmployees/backend/src/main/java/com/luvina/la/exception/GlobalExceptionHandler.java)

---

## 1. Cấu Trúc Lỗi Chuẩn (Template-Based Parametric Format)

Tất cả các lỗi nghiệp vụ trong hệ thống đều phải tuân theo cấu trúc mã lỗi tham số hóa:

```json
{
  "code": 500,
  "message": {
    "code": "ER006",
    "params": [
      "氏名",
      "125"
    ]
  }
}
```

### 1.1. Phản Hồi HTTP Status
- **Backend (Chuẩn TKAPI)**: `GlobalExceptionHandler` luôn trả về HTTP Status **500** (`HttpStatus.INTERNAL_SERVER_ERROR`) cho tất cả các lỗi ném ra từ `BusinessException`, `MethodArgumentNotValidException`, `BindException`, `ConstraintViolationException`, `MissingServletRequestParameterException` và `Exception`.
- **Cấm**: Tuyệt đối không hardcode text tiếng Nhật/tiếng Việt trực tiếp trong chuỗi trả về từ Controller/Service.

---

## 2. Danh Mục Mã Lỗi Toàn Hệ Thống

| Mã Lỗi | Mô Tả & Điều Kiện Kích Hoạt | Tham Số (`params`) |
| :---: | :--- | :--- |
| **`ER001`** | Bắt buộc nhập trường `{0}` | `[Tên nhãn trường]` |
| **`ER002`** | Bắt buộc chọn trường `{0}` | `[Tên nhãn trường]` |
| **`ER003`** | Dữ liệu `{0}` đã tồn tại trong DB (Email, Login ID) | `[Tên nhãn trường]` |
| **`ER004`** | Bản ghi `{0}` không tồn tại trong DB (Department, Certification) | `[Tên nhãn trường]` |
| **`ER005`** | Sai định dạng email hoặc format ngày tháng | `[Tên nhãn trường, Định dạng]` |
| **`ER006`** | Vượt quá độ dài tối đa cho phép | `[Tên nhãn trường, Độ dài tối đa]` |
| **`ER007`** | Độ dài ký tự phải nằm trong khoảng (Mật khẩu 8-50) | `[Tên nhãn trường, Min, Max]` |
| **`ER008`** | Chỉ cho phép nhập ký tự half-size (Số điện thoại) | `[Tên nhãn trường]` |
| **`ER009`** | Bắt buộc phải là ký tự Katakana toàn giác | `[Tên nhãn trường]` |
| **`ER010`** | Bắt buộc phải là ký tự Hiragana | `[Tên nhãn trường]` |
| **`ER011`** | Ngày tháng không hợp lệ hoặc không có thực | `[Tên nhãn trường]` |
| **`ER012`** | Ngày hết hạn phải lớn hơn ngày cấp chứng chỉ | `[Nhãn ngày kết thúc, Nhãn ngày bắt đầu]` |
| **`ER013`** | Không tìm thấy nhân viên khi xem chi tiết (404 / ADM006) | `[]` *(Rỗng)* |
| **`ER014`** | Không tìm thấy nhân viên khi thực hiện xóa (ADM005) | `[]` *(Rỗng)* |
| **`ER015`** | Lỗi hệ thống nghiêm trọng / Cơ sở dữ liệu | `[]` *(Rỗng)* |
| **`ER016`** | Đăng nhập thất bại (Sai username hoặc password) | `[]` *(Rỗng)* |
| **`ER017`** | Mật khẩu xác nhận không trùng khớp | `[]` *(Rỗng)* |
| **`ER018`** | Tham số phân trang / điểm số không hợp lệ | `[Tên nhãn trường]` |
| **`ER019`** | Login ID chứa ký tự không hợp lệ hoặc bắt đầu bằng số | `[]` *(Rỗng)* |
| **`ER020`** | Không thể xóa người dùng có quyền Admin | `[]` *(Rỗng)* |
| **`ER021`** | Tham số sắp xếp không phải ASC hoặc DESC | `[]` *(Rỗng)* |
| **`ER022`** | Không tìm thấy trang (404) | `[]` *(Rỗng)* |
| **`ER023`** | Lỗi hệ thống khi lấy danh sách phòng ban / chứng chỉ | `[]` *(Rỗng)* |

---

## 3. Quy Tắc Gọi Ở Mã Nguồn

### Backend (Java):
```java
// Đúng:
throw new BusinessException(Constants.ER001, List.of(Constants.LABEL_EMPLOYEE_NAME));
throw new BusinessException(Constants.ER006, List.of(Constants.LABEL_EMPLOYEE_NAME, "125"));

// Sai: (Cấm)
throw new RuntimeException("Tên không được để trống");
```

### Frontend (TypeScript):
```typescript
// Đúng:
import { formatErrorMessage } from '@/lib/constants/messages';
const message = formatErrorMessage(apiError.code, apiError.params);

// Sai: (Cấm)
alert("Có lỗi xảy ra");
```
