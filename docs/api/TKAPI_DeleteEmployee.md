# Tài liệu Thiết kế API — Delete Employee

| Thông tin | Giá trị |
|---|---|
| Tên system | TKCB |
| Loại system | Thiết kế API |
| Category chức năng | Delete employee |
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

Lấy thông tin chi tiết nhân viên.

> Ghi chú: mô tả trong tài liệu gốc ghi "Lấy thông tin chi tiết nhân viên", tuy nhiên dựa vào Request/Response và tên API bên dưới, chức năng thực tế là **xóa nhân viên (delete employee)**.

---

## 2. Request

### Request URL

| No. | Service | API name | Method HTTP | Note |
|---|---|---|---|---|
| 1 | employee | Delete employee | DELETE | |

### Request Parameter

| No. | Parameter | Bắt buộc | Kiểu | Giá trị default | Tên hạng mục | Note |
|---|---|---|---|---|---|---|
| 1 | `employeeId` | **o** | number | `{}` | id của employee cần xóa | |

> Ghi chú: `o` = bắt buộc (required).

### Sample Request

```
/employee/1
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
        "code": "MSG003",
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
    "employeeId": "1",
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
2. Xóa thông tin chứng chỉ tiếng Nhật của nhân viên
   (Bảng liên quan: employees_certifications)
  │
  ▼
3. Xóa thông tin nhân viên
   (Bảng liên quan: employees)
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

**1.1 Validate parameter `[employeeId]`**
- Nếu không tồn tại parameter này thì trả về lỗi có mã code **ER001**, tham số "ＩＤ".
- Nếu không tồn tại trong bảng `employees.employee_id` thì trả về lỗi có mã code **ER014**, tham số "ＩＤ".

- Nếu có lỗi thì chuyển sang bước **[4. Tạo dữ liệu response cho API]**.

**Khởi tạo transaction**

#### 2. Xóa thông tin trình độ tiếng Nhật của nhân viên

■ Danh sách bảng sử dụng

| No | Tên bảng logic | ID bảng vật lý | Create | Refer | Update | Xóa |
|---|---|---|---|---|---|---|
| 1 | Thông tin chứng chỉ tiếng Nhật của nhân viên | employees_certifications | | | | 〇 |

■ Table access

**① Điều kiện xóa**

| No | Tên bảng | Tên hạng mục | Giá trị |
|---|---|---|---|
| 1 | employees_certifications | employee_id | = employee_id từ parameter [employeeId] |

- Nếu có lỗi khi xóa thì trả về lỗi và chuyển sang bước **[4. Tạo dữ liệu response cho API]**.

#### 3. Xóa thông tin nhân viên

■ Danh sách bảng sử dụng

| No | Tên bảng logic | ID bảng vật lý | Create | Refer | Update | Xóa |
|---|---|---|---|---|---|---|
| 1 | Thông tin nhân viên | employees | | | | 〇 |

■ Table access

**① Điều kiện xóa**

| No | Tên bảng | Tên hạng mục | Giá trị |
|---|---|---|---|
| 1 | employees | employee_id | = employee_id từ parameter [employeeId] |

- Nếu không có lỗi gì xảy ra thì **Commit transaction**.
- Nếu có lỗi xảy ra thì **Rollback transaction**.
- Nếu có lỗi khi xóa thì trả về lỗi với mã lỗi **ER015** và chuyển sang bước **[4. Tạo dữ liệu response cho API]**.

#### 4. Tạo dữ liệu response cho API

**Trường hợp không có lỗi xảy ra:**

| No. | Key | Giá trị |
|---|---|---|
| 1 | code | 200 |
| 2 | employeeId | Lấy giá trị từ parameter [employeeId] |
| 3 | message | `{code: "MSG003", params: []}` |

**Trường hợp có lỗi xảy ra:**

| No. | Key | Giá trị |
|---|---|---|
| 1 | code | 500 |
| 2 | employeeId | Lấy giá trị từ parameter [employeeId] |
| 3 | message | Lấy giá trị từ No 1, No 2, No 3. Format `{code: "", params: []}` |

- Kết thúc xử lý.

---

## 6. Tham chiếu

### Danh sách tài liệu tham chiếu

| No. | Mã tham chiếu | Tài liệu tham chiếu |
|---|---|---|
| *(không có dữ liệu)* | | |
