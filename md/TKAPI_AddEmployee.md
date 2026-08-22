# Tài liệu Thiết kế API — Add Employee

| Thông tin | Giá trị |
|---|---|
| Tên system | TKCB |
| Loại system | Thiết kế API |
| Category chức năng | Add Employee |
| Người tạo | ThanhPD |
| Ngày tạo | 2023-01-04 |
| Người update | ThanhPD |
| Ngày update | 2023-01-04 |
| Version | 0.1 |

## Lịch sử thay đổi

| Date | Người update | Version | Nội dung thay đổi |
|---|---|---|---|
| 2023-01-04 | ThanhPD | 0.1 | Tạo mới tài liệu |

---

## 1. Khái quát

Tạo mới nhân viên.

---

## 2. Request

### Request URL

| No. | Service | API name | Method HTTP | Note |
|---|---|---|---|---|
| 1 | employee | Add Employee | POST | |

### Request Parameter

| No. | Parameter | Bắt buộc | Kiểu | Giá trị default | Tên hạng mục | Note |
|---|---|---|---|---|---|---|
| 1 | body (object key-value) | | string | `{}` | Tên hạng mục / giá trị hạng mục | Lưu vào table `employees` |
| 2 | `certifications` | - | array | `{}` | Mảng lưu các chứng chỉ tiếng Nhật của nhân viên | |
| &nbsp;&nbsp;— | key/value trong mỗi phần tử | | string | `{}` | Tên hạng mục / giá trị hạng mục | Lưu vào table `employees_certifications` |

> Ghi chú: Chỉ `certifications` có đánh dấu "Bắt buộc" = "-" (không bắt buộc) trong bảng gốc; các quy tắc bắt buộc chi tiết theo từng field cụ thể được nêu ở mục "5. Chi tiết xử lý — 1. Validate parameter" bên dưới.

### Sample Request

```json
{
    "employeeName": "Nguyễn Văn A",
    "employeeBirthDate": "1983/01/01",
    "employeeEmail": "nguyenvana@luvina.net",
    "employeeTelephone": "01234567",
    "employeeNameKana": "01234567",
    "employeeLoginId": "01234567",
    "employeeLoginPassword": "01234567",
    "departmentId": "1",
    "certifications": [
      {
        "certificationId": "1",
        "certificationStartDate": "2023/01/01",
        "certificationEndDate": "2024/01/01",
        "employeeCertificationScore": "999"
      },
      {
        "certificationId": "2",
        "certificationStartDate": "2023/06/01",
        "certificationEndDate": "2024/06/01",
        "employeeCertificationScore": "999"
      }
    ]
}
```

---

## 3. Response

### Trường hợp API trả về response bình thường

| No. | json key name | Kiểu | Tên hạng mục | Note |
|---|---|---|---|---|
| 1 | `code` | number | | |
| 2 | `employeeId` | number | | |
| 3 | `message` | object | | |

#### Sample Response (thành công)

```json
{
    "code": "200",
    "employeeId": "1",
    "message": {
        "code": "MSG001",
        "params": []
    }
}
```

### Trường hợp API trả về lỗi

*(Không có bảng định nghĩa json key riêng trong tài liệu gốc — xem sample bên dưới.)*

#### Sample Response (lỗi)

```json
{
    "code": "500",
    "message": {
        "code": "ER015",
        "params": []
    }
}
```

---

## 4. Flow xử lý

```
START
  │
  ▼
1. Validate parameter
  │
  ▼
2. Insert nhân viên
   (Bảng liên quan: employees)
  │
  ▼
3. Insert thông tin chứng chỉ tiếng Nhật của nhân viên
   (Bảng liên quan: employees_certifications)
  │
  ▼
4. Tạo mảng response
  │
  ▼
END
```

---

## 5. Chi tiết xử lý

### Xử lý common
`<Không có>`

### Xử lý chi tiết

#### 1. Validate parameter

**1.1 Validate parameter `[employeeLoginId]`**
- Nếu không tồn tại parameter này thì trả về lỗi có mã code **ER001**, tham số "アカウント名".
- Nếu có độ dài vượt quá 50 ký tự thì trả về lỗi có mã code **ER006**, tham số "アカウント名".
- Nếu không thỏa mãn điều kiện chỉ chứa các ký tự a-z, A-Z, 0-9 và `_` hoặc ký tự đầu tiên là số thì trả về lỗi có mã code **ER019**.
- Nếu đã tồn tại trong bảng `employees.employee_login_id` thì trả về lỗi có mã code **ER003**, tham số "アカウント名".

**1.2 Validate parameter `[employeeName]`**
- Nếu không tồn tại parameter này hoặc giá trị parameter là rỗng thì trả về lỗi có mã code **ER001**, tham số "氏名".
- Nếu có độ dài vượt quá 125 ký tự thì trả về lỗi có mã code **ER006**, tham số "氏名".

**1.3 Validate parameter `[employeeNameKana]`**
- Nếu không tồn tại parameter này hoặc giá trị parameter là rỗng thì trả về lỗi có mã code **ER001**, tham số "カタカナ氏名".
- Nếu có độ dài vượt quá 125 ký tự thì trả về lỗi có mã code **ER006**, tham số "カタカナ氏名".
- Nếu không phải là chỉ chứa ký tự katakana thì trả về lỗi có mã code **ER009**, tham số "カタカナ氏名".

**1.4 Validate parameter `[employeeBirthDate]`**
- Nếu không tồn tại parameter này hoặc giá trị parameter là rỗng thì trả về lỗi có mã code **ER001**, tham số "生年月日".
- Nếu không phải giá trị ngày tháng hợp lệ thì trả về lỗi có mã code **ER011**, tham số "生年月日".
- Nếu không thỏa mãn định dạng `yyyy/MM/dd` thì trả về lỗi có mã code **ER005**, tham số "生年月日", "yyyy/MM/dd".

**1.5 Validate parameter `[employeeEmail]`**
- Nếu không tồn tại parameter này hoặc giá trị parameter là rỗng thì trả về lỗi có mã code **ER001**, tham số "メールアドレス".
- Nếu có độ dài vượt quá 125 ký tự thì trả về lỗi có mã code **ER006**, tham số "メールアドレス".

**1.6 Validate parameter `[employeeTelephone]`**
- Nếu không tồn tại parameter này hoặc giá trị parameter là rỗng thì trả về lỗi có mã code **ER001**, tham số "電話番号".
- Nếu có độ dài vượt quá 50 ký tự thì trả về lỗi có mã code **ER006**, tham số "電話番号".
- Nếu chứa ký tự ngoài ký tự 1 byte thì trả về lỗi có mã code **ER008**, tham số "電話番号".

**1.7 Validate parameter `[employeeLoginPassword]`**
- Nếu không tồn tại parameter này hoặc giá trị parameter là rỗng thì trả về lỗi có mã code **ER001**, tham số "パスワード".
- Nếu có độ dài vượt quá 50 ký tự hoặc ngắn hơn 8 ký tự thì trả về lỗi có mã code **ER007**, tham số "パスワード", 8, 50.

**1.8 Validate parameter `[departmentId]`**
- Nếu không tồn tại parameter này thì trả về lỗi có mã code **ER002**, tham số "グループ".
- Nếu giá trị parameter này không phải là số nguyên dương thì trả về lỗi có mã code **ER018**, tham số "グループ".
- Nếu giá trị của parameter này không tồn tại trong `departments.departmentId` thì trả về lỗi có mã code **ER004**, tham số "グループ".

**1.9 Validate parameter `[certifications]`**
Nếu request có truyền parameter này thì cần check chi tiết cho từng phần tử:

| Field | Điều kiện | Lỗi trả về |
|---|---|---|
| `startDate` | Không tồn tại hoặc bị rỗng | ER001, tham số "資格交付日" |
| | Không phải giá trị ngày tháng hợp lệ | ER001, tham số "資格交付日" |
| | Không thỏa mãn định dạng `yyyy/MM/dd` | ER005, tham số "資格交付日", "yyyy/MM/dd" |
| `endDate` | Không tồn tại hoặc bị rỗng | ER001, tham số "失効日" |
| | Không phải giá trị ngày tháng hợp lệ | ER001, tham số "失効日" |
| | Không thỏa mãn định dạng `yyyy/MM/dd` | ER005, tham số "失効日", "yyyy/MM/dd" |
| | `certificationEndDate` < `certificationStartDate` | ER012 |
| `score` | Không tồn tại hoặc bị rỗng | ER001, tham số "点数" |
| | Không phải là giá trị kiểu số nguyên dương | ER018, tham số "点数" |
| `certificationId` | Không tồn tại hoặc bị rỗng | ER001, tham số "資格" |
| | Không phải giá trị kiểu số nguyên dương | ER018, tham số "資格" |
| | Không tồn tại giá trị này trong `certifications.certification_id` | ER004, tham số "資格" |

- Nếu có lỗi thì chuyển sang bước **[4. Tạo dữ liệu response cho API]**.

**Khởi tạo transaction**

#### 2. Insert thông tin nhân viên

**2.1 Insert nhân viên vào database**

■ Danh sách bảng sử dụng

| No | Tên bảng logic | ID bảng vật lý | Create | Refer | Update | Xóa |
|---|---|---|---|---|---|---|
| 1 | Thông tin nhân viên | employees | 〇 | | | |

■ Table access

**① Hạng mục insert**

| No | Tên bảng | Alias | Tên trường | Giá trị |
|---|---|---|---|---|
| 1 | employees | - | employee_id | Ko cần insert vì để tự động tăng |
| 2 | employees | - | department_id | parameter [departmentId] |
| 3 | employees | - | employee_name | parameter [employeeName] |
| 4 | employees | - | employee_name_kana | parameter [employeeNameKana] |
| 5 | employees | - | employee_birth_date | parameter [employeeBirthDate] |
| 7 | employees | - | employee_email | parameter [employeeEmail] |
| 8 | employees | - | employee_telephone | parameter [employeeTelephone] |
| 9 | employees | - | employee_login_id | parameter [employeeLoginId] |
| 10 | employees | - | employee_login_password | parameter [employeeLoginPassword] |

#### 3. Nếu tồn tại parameter `[certifications]` thì thực hiện Insert chứng chỉ tiếng Nhật

**3.1 Insert chứng chỉ vào database**

■ Danh sách bảng sử dụng

| No | Tên bảng logic | ID bảng vật lý | Create | Refer | Update | Xóa |
|---|---|---|---|---|---|---|
| 1 | Thông tin nhân viên chứng chỉ tiếng Nhật | employees_certifications | 〇 | | | |

■ Table access

**① Hạng mục insert**

| No | Tên bảng | Alias | Tên trường | Giá trị |
|---|---|---|---|---|
| 1 | employees_certifications | - | employee_certification_id | Ko cần insert vì để tự động tăng |
| 2 | employees_certifications | - | employee_id | lấy từ bước 2 |
| 3 | employees_certifications | - | certification_id | parameter [certificationId] |
| 4 | employees_certifications | - | start_date | parameter [startDate] |
| 5 | employees_certifications | - | end_date | parameter [endDate] |
| 7 | employees_certifications | - | score | parameter [score] |

- Nếu không có lỗi gì xảy ra thì **Commit transaction**.
- Nếu có lỗi xảy ra thì **Rollback transaction**, di chuyển đến **[4. Tạo dữ liệu response cho API]** với mã lỗi **ER015**.

#### 4. Tạo dữ liệu response cho API

**Trường hợp không có lỗi xảy ra:**

| No. | Key | Giá trị |
|---|---|---|
| 1 | code | 200 |
| 2 | employeeId | Lấy giá trị từ No 2 |
| 3 | message | `{code: "MSG001", params: []}` |

**Trường hợp có lỗi xảy ra:**

| No. | Key | Giá trị |
|---|---|---|
| 1 | code | 500 |
| 2 | message | Lấy giá trị từ No 1, No 2, No 3. Format `{code: "", params: []}` |

- Kết thúc xử lý.

---

## 6. Tham chiếu

### Danh sách tài liệu tham chiếu

| No. | Mã tham chiếu | Tài liệu tham chiếu |
|---|---|---|
| *(không có dữ liệu)* | | |
