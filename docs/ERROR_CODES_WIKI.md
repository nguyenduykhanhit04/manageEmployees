# 📚 WIKI HỆ THỐNG MÃ LỖI & THÔNG BÁO (ERROR CODES & SYSTEM MESSAGES WIKI)

Tài liệu WIKI chuẩn hóa toàn bộ các mã lỗi nghiệp vụ (`ERxxx`), thông báo thành công (`MSGxxx`), danh mục nhãn trường tiếng Nhật (`FIELD_LABELS`) và ma trận ràng buộc dữ liệu (Validation Matrix) trong dự án Quản Lý Nhân Viên (**Manage Employees**).

---

## 📑 Mục Lục
1. [Kiến Trúc & Quy Chuẩn Xử Lý Lỗi](#1-kiến-trúc--quy-chuẩn-xử-lý-lỗi)
2. [Bảng Tra Cứu Toàn Bộ Mã Lỗi Nghiệp Vụ (ER001 - ER023)](#2-bảng-tra-cứu-toàn-bộ-mã-lỗi-nghiệp-vụ-er001---er023)
3. [Bảng Tra Cứu Thông Báo Thành Công & Hệ Thống (MSG001 - MSG005)](#3-bảng-tra-cứu-thông-báo-thành-công--hệ-thống-msg001---msg005)
4. [Danh Mục Nhãn Trường Tiếng Nhật (Field Labels Catalog)](#4-danh-mục-nhãn-trường-tiếng-nhật-field-labels-catalog)
5. [Ma Trận Kiểm Tra Ràng Buộc Dữ Liệu (Field Validation Matrix)](#5-ma-trận-kiểm-tra-ràng-buộc-dữ-liệu-field-validation-matrix)
6. [Xử Lý Lỗi Hệ Thống & Ngoại Lệ Toàn Cục](#6-xử-lý-lỗi-hệ-thống--ngoại-lệ-toàn-cục)
7. [Hướng Dẫn Tích Hợp Cho Lập Trình Viên (Developer Guide)](#7-hướng-dẫn-tích-hợp-cho-lập-trình-viên-developer-guide)

---

## 1. Kiến Trúc & Quy Chuẩn Xử Lý Lỗi

Hệ thống áp dụng cơ chế xử lý lỗi **Template-based Parametric Error Format**:
- **Backend**: Khi có lỗi nghiệp vụ xảy ra, Controller/Service/Validator sẽ ném `BusinessException` mang theo `code` (ví dụ: `ER001`) và mảng tham số động `params` (ví dụ: `["氏名"]`).
- **Response Format**: Trả về chuẩn HTTP 500 (hoặc 400) theo cấu trúc JSON:

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

- **Frontend**: Hàm `formatErrorMessage(code, params)` sẽ thay thế các placeholder `{0}`, `{1}`, `{2}`... trong template bằng giá trị thực tế của `params` để hiển thị câu tiếng Nhật hoàn chỉnh cho người dùng:
  $$\text{Template: } \texttt{"\{0\}を\{1\}文字以下で入力してください。"} \xrightarrow{\text{params: ["氏名", "125"]}} \textbf{"氏名を125文字以下で入力してください。"}$$

---

## 2. Bảng Tra Cứu Toàn Bộ Mã Lỗi Nghiệp Vụ (ER001 - ER023)

| Mã lỗi | Template tiếng Nhật | Ý nghĩa tiếng Việt | Danh sách tham số (`params`) | Ví dụ hiển thị thực tế | Nơi phát sinh |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **`ER001`** | `{0}を入力してください。` | Bắt buộc nhập trường `{0}` | `{0}`: Nhãn trường | `氏名を入力してください。` *(Vui lòng nhập họ tên)* | Validator, GlobalException |
| **`ER002`** | `{0}を選択してください。` | Bắt buộc chọn trường `{0}` | `{0}`: Nhãn trường | `グループを選択してください。` *(Vui lòng chọn phòng ban)* | Validator |
| **`ER003`** | `{0}は既に存在しています。` | Dữ liệu trường `{0}` đã tồn tại trong DB | `{0}`: Nhãn trường | `アカウント名は既に存在しています。` *(Tên tài khoản đã tồn tại)* | EmployeeValidator (LoginId, Email) |
| **`ER004`** | `{0}は存在していません。` | Bản ghi `{0}` không tồn tại trong DB | `{0}`: Nhãn trường | `グループは存在していません。` *(Phòng ban không tồn tại)* | EmployeeValidator (DeptId, CertId) |
| **`ER005`** | `{0}を正しい書式で入力してください。` | Sai định dạng email theo chuẩn RFC 5322 | `{0}`: Nhãn trường | `メールアドレスを正しい書式で入力してください。` | EmployeeValidator (Email) |
| **`ER006`** | `{0}を{1}文字以下で入力してください。` | Vượt quá độ dài tối đa cho phép | `{0}`: Nhãn trường<br>`{1}`: Số ký tự tối đa | `氏名を125文字以下で入力してください。` | Validator (Tên, Email, Điện thoại, Kana...) |
| **`ER007`** | `{0}を{1}桁以上{2}桁以下で入力してください。` | Độ dài ký tự phải nằm trong khoảng | `{0}`: Nhãn trường<br>`{1}`: Min length<br>`{2}`: Max length | `パスワードを8桁以上50桁以下で入力してください。` | EmployeeValidator (Mật khẩu) |
| **`ER008`** | `{0}は半角英数を入力してください。` | Chỉ cho phép nhập ký tự half-size (số/chữ/gạch nối) | `{0}`: Nhãn trường | `電話番号は半角英数を入力してください。` | EmployeeValidator (Điện thoại) |
| **`ER009`** | `{0}はカタカナで入力してください。` | Bắt buộc phải là ký tự Katakana toàn giác | `{0}`: Nhãn trường | `カタカナ氏名はカタカナで入力してください。` | EmployeeValidator (Tên Kana) |
| **`ER011`** | `{0}を正しい日付で入力してください。` | Ngày tháng không đúng định dạng `YYYY/MM/DD` hoặc không tồn tại | `{0}`: Nhãn trường | `生年月日を正しい日付で入力してください。` | EmployeeValidator (Ngày sinh, Ngày cấp, Hết hạn) |
| **`ER012`** | `{0}は{1}より後の日付を入力してください。` | Ngày kết thúc phải lớn hơn ngày bắt đầu | `{0}`: Nhãn ngày kết thúc<br>`{1}`: Nhãn ngày bắt đầu | `失効日は資格交付日より後の日付を入力してください。` | EmployeeValidator (Chứng chỉ) |
| **`ER013`** | `該当するユーザは存在しません。` | Không tìm thấy nhân viên khi xem chi tiết (ADM006) | *(Không có tham số)* | `該当するユーザは存在しません。` *(Nhân viên không tồn tại)* | EmployeeService (`GET /employee/{id}`) |
| **`ER014`** | `該当するユーザは存在しません。` | Không tìm thấy nhân viên khi xóa | *(Không có tham số)* | `該当するユーザは存在しません。` | EmployeeService (`DELETE /employee/{id}`) |
| **`ER015`** | `システムエラーが発生しました。` | Lỗi hệ thống nghiêm trọng / Lỗi cơ sở dữ liệu / 500 | *(Không có tham số)* | `システムエラーが発生しました。` *(Đã xảy ra lỗi hệ thống)* | GlobalExceptionHandler, Controller |
| **`ER017`** | `パスワードが一致しません。` | Mật khẩu xác nhận không khớp | *(Không có tham số)* | `パスワードが一致しません。` *(Mật khẩu không khớp)* | Frontend Zod Schema (ADM003) |
| **`ER018`** | `{0}は半角英数を入力してください。` | Tham số phân trang (`offset`/`limit`) hoặc điểm (`score`) không hợp lệ | `{0}`: Nhãn trường | `オフセットは半角英数を入力してください。` | Controller, GlobalException, Validator |
| **`ER019`** | `{0}を正しい書式で入力してください。` | Tên tài khoản (Login ID) chứa ký tự không hợp lệ (ngoài a-z, A-Z, 0-9, _) | `{0}`: Nhãn trường | `アカウント名を正しい書式で入力してください。` | EmployeeValidator (Login ID) |
| **`ER021`** | `{0}のソート順が不正です。` | Tham số sắp xếp (`ord_*`) không phải `ASC` hoặc `DESC` | `{0}`: Tên cột sắp xếp | `ord_employee_nameのソート順が不正です。` | Controller / Service |
| **`ER023`** | `システムエラーが発生しました。` | Lỗi khi truy vấn danh sách phòng ban hoặc chứng chỉ | *(Không có tham số)* | `システムエラーが発生しました。` | DepartmentController, CertificationController |

---

## 3. Bảng Tra Cứu Thông Báo Thành Công & Hệ Thống (MSG001 - MSG005)

| Mã thông báo | Chuỗi tiếng Nhật | Ý nghĩa tiếng Việt | Màn hình sử dụng |
| :---: | :--- | :--- | :--- |
| **`MSG001`** | `ユーザの登録が完了しました。` | Đăng ký (thêm mới) người dùng thành công. | **ADM005** (Sau khi thêm mới từ ADM004) |
| **`MSG002`** | `ユーザの更新が完了しました。` | Cập nhật thông tin người dùng thành công. | **ADM005** (Sau khi cập nhật từ ADM004) |
| **`MSG003`** | `ユーザの削除が完了しました。` | Xóa người dùng thành công. | **ADM005** (Sau khi xác nhận xóa) |
| **`MSG005`** | `該当するデータがありません。` | Không tìm thấy dữ liệu nào phù hợp với điều kiện tìm kiếm. | **ADM002** (Bảng kết quả rỗng) |
| **`LOADING`** | `データを読み込み中...` | Đang tải dữ liệu từ máy chủ. | Toàn bộ màn hình khi đang gọi API |

---

## 4. Danh Mục Nhãn Trường Tiếng Nhật (Field Labels Catalog)

Bảng đối chiếu giữa tên trường trong mã nguồn (DTO / Entity) và nhãn hiển thị tiếng Nhật trong thông báo lỗi:

| Tên trường (Field Name) | Nhãn tiếng Nhật (`LABEL`) | Tên hiển thị tiếng Việt | Quy cách kiểm tra |
| :--- | :--- | :--- | :--- |
| `employeeId` / `id` | **`ＩＤ`** | Mã định danh nhân viên | Số nguyên dương |
| `employeeLoginId` | **`アカウント名`** | Tên đăng nhập / Tên tài khoản | Ký tự chữ, số, gạch dưới `_`, tối đa 50 ký tự |
| `employeeName` | **`氏名`** | Họ và tên nhân viên | Tối đa 125 ký tự |
| `employeeNameKana` | **`カタカナ氏名`** | Tên phiên âm Katakana | Ký tự Katakana toàn giác, tối đa 125 ký tự |
| `employeeBirthDate` | **`生年月日`** | Ngày tháng năm sinh | Định dạng `YYYY/MM/DD`, ngày có thực |
| `departmentId` | **`グループ`** | Phòng ban / Nhóm | Bắt buộc chọn, phải tồn tại trong bảng `departments` |
| `employeeEmail` | **`メールアドレス`** | Địa chỉ Email | Định dạng RFC 5322, tối đa 125 ký tự, không trùng lặp |
| `employeeTelephone` | **`電話番号`** | Số điện thoại liên lạc | Ký tự số half-size và dấu gạch nối `-`, tối đa 50 ký tự |
| `employeeLoginPassword` | **`パスワード`** | Mật khẩu đăng nhập | Độ dài từ 8 đến 50 ký tự |
| `employeeLoginPasswordConfirm` | **`パスワード（確認）`** | Xác nhận mật khẩu | Phải trùng khớp 100% với mật khẩu |
| `certificationId` | **`資格`** | Trình độ tiếng Nhật | Phải tồn tại trong bảng `certifications` |
| `startDate` | **`資格交付日`** | Ngày cấp chứng chỉ | Định dạng `YYYY/MM/DD` |
| `endDate` | **`失効日`** | Ngày hết hạn chứng chỉ | Định dạng `YYYY/MM/DD`, lớn hơn `startDate` |
| `score` | **`点数`** | Điểm chứng chỉ | Số nguyên half-size $\ge 0$ |
| `offset` | **`オフセット`** | Vị trí phân trang | Số nguyên half-size $\ge 0$ |
| `limit` | **`リミット`** | Số bản ghi mỗi trang | Số nguyên half-size $> 0$ |

---

## 5. Ma Trận Kiểm Tra Ràng Buộc Dữ Liệu (Field Validation Matrix)

Bảng tổng hợp toàn bộ thứ tự kiểm tra lỗi (Validation Rule Priority) trên từng trường:

```
                                  THỨ TỰ ƯU TIÊN KIỂM TRA (VALIDATION FLOW)
              ┌─────────────────────────────────────────────────────────────────────────────┐
              │ 1. Bắt buộc nhập (ER001) / Bắt buộc chọn (ER002)                           │
              │ 2. Độ dài tối đa (ER006) / Khoảng độ dài (ER007)                           │
              │ 3. Định dạng ký tự: Ký tự hợp lệ (ER019) / Katakana (ER009) / Email (ER005) │
              │ 4. Kiểm tra logic ngày tháng (ER011) / Quan hệ ngày (ER012)                 │
              │ 5. Kiểm tra tồn tại DB (ER004) / Kiểm tra trùng lặp DB (ER003)              │
              └─────────────────────────────────────────────────────────────────────────────┘
```

### Chi tiết từng trường:

| Trường kiểm tra | Điều kiện kiểm tra 1 | Điều kiện kiểm tra 2 | Điều kiện kiểm tra 3 | Điều kiện kiểm tra 4 |
| :--- | :--- | :--- | :--- | :--- |
| **`employeeLoginId`** | Không để trống (`ER001`) | $\le 50$ ký tự (`ER006`) | Đúng regex `^[a-zA-Z0-9_]+$` (`ER019`) | Không trùng lặp trong DB (`ER003`) |
| **`departmentId`** | Không để trống (`ER002`) | Phải tồn tại trong DB (`ER004`) | — | — |
| **`employeeName`** | Không để trống (`ER001`) | $\le 125$ ký tự (`ER006`) | — | — |
| **`employeeNameKana`** | Không để trống (`ER001`) | $\le 125$ ký tự (`ER006`) | Phải là Katakana toàn giác (`ER009`) | — |
| **`employeeBirthDate`**| Không để trống (`ER001`) | Đúng ngày `YYYY/MM/DD` (`ER011`) | — | — |
| **`employeeEmail`** | Không để trống (`ER001`) | $\le 125$ ký tự (`ER006`) | Đúng định dạng email (`ER005`) | Không trùng lặp trong DB (`ER003`) |
| **`employeeTelephone`**| Không để trống (`ER001`) | $\le 50$ ký tự (`ER006`) | Ký tự số & dấu `-` half-size (`ER008`) | — |
| **`employeeLoginPassword`** | Không để trống khi thêm (`ER001`)| Độ dài từ 8 đến 50 ký tự (`ER007`) | — | — |
| **`certificationId`** | *(Nếu có chọn)* Phải tồn tại trong DB (`ER004`) | — | — | — |
| **`startDate`** | Bắt buộc chọn nếu có chứng chỉ (`ER002`) | Đúng ngày `YYYY/MM/DD` (`ER011`) | — | — |
| **`endDate`** | Bắt buộc chọn nếu có chứng chỉ (`ER002`) | Đúng ngày `YYYY/MM/DD` (`ER011`) | Phải lớn hơn `startDate` (`ER012`) | — |
| **`score`** | Bắt buộc nhập nếu có chứng chỉ (`ER001`) | Số half-size nguyên dương (`ER018`) | — | — |

---

## 6. Xử Lý Lỗi Hệ Thống & Ngoại Lệ Toàn Cục

Cơ chế ánh xạ Exception tại `GlobalExceptionHandler.java`:

| Loại Ngoại Lệ (Exception Class) | Mã Lỗi HTTP | Mã Lỗi Trả Về | Nội Dung Xử Lý |
| :--- | :---: | :---: | :--- |
| `BusinessException` | **500** / 400 | `ex.getCode()` (ví dụ `ER001`, `ER003`...) | Trả về mã lỗi nghiệp vụ kèm `ex.getParams()` |
| `MethodArgumentNotValidException` | **500** | Lấy mã từ annotation hoặc `ER015` | Bắt lỗi validate DTO tầng Controller |
| `BindException` | **500** | Lấy mã từ annotation hoặc `ER015` | Bắt lỗi bind query params |
| `MissingServletRequestParameterException` | **500** | `ER001` | Thiếu tham số request bắt buộc |
| `MethodArgumentTypeMismatchException` | **500** | `ER018` | Sai kiểu dữ liệu tham số phân trang / ID |
| `Exception` (Mọi lỗi không lường trước) | **500** | `ER015` | Bắt lỗi Runtime, NullPointer, DB Connection |

---

## 7. Hướng Dẫn Tích Hợp Cho Lập Trình Viên (Developer Guide)

### 7.1. Cách ném lỗi ở Backend (Java)
```java
// 1. Ném lỗi bắt buộc nhập
throw new BusinessException(Constants.ER001, List.of(Constants.LABEL_EMPLOYEE_NAME));

// 2. Ném lỗi vượt quá độ dài
throw new BusinessException(Constants.ER006, List.of(Constants.LABEL_EMPLOYEE_NAME, "125"));

// 3. Ném lỗi quan hệ ngày tháng
throw new BusinessException(Constants.ER012, List.of(Constants.LABEL_CERT_END_DATE, Constants.LABEL_CERT_START_DATE));
```

### 7.2. Cách format hiển thị lỗi ở Frontend (TypeScript/React)
```typescript
import { formatErrorMessage } from '@/lib/constants/messages';

// Nhận response từ API: { code: 500, message: { code: "ER006", params: ["氏名", "125"] } }
const apiError = error.response?.data?.message;
if (apiError) {
  const displayMsg = formatErrorMessage(apiError.code, apiError.params);
  // Kết quả: "氏名を125文字以下で入力してください。"
  setErrorMessage(displayMsg);
}
```
