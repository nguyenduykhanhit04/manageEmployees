# Tài liệu Thiết kế API — Get Employee

| Thông tin | Giá trị |
|---|---|
| Tên system | TKCB |
| Loại system | Thiết kế API |
| Category chức năng | Get employee |
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

---

## 2. Request

### Request URL

| No. | Service | API name | Method HTTP | Note |
|---|---|---|---|---|
| 1 | employee | Get employee | GET | |

### Request Parameter

| No. | Parameter | Bắt buộc | Kiểu | Giá trị default | Tên hạng mục | Note |
|---|---|---|---|---|---|---|
| 1 | `employeeId` | **o** | number | `{}` | id của employee cần lấy thông tin | |

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
| 3 | `employeeName` | string | | |
| 4 | `employeeBirthDate` | date | | |
| 5 | `departmentId` | string | | |
| 6 | `departmentName` | string | | |
| 7 | `employeeEmail` | string | | |
| 8 | `employeeTelephone` | string | | |
| 9 | `employeeNameKana` | string | | |
| 10 | `employeeLoginId` | string | | |
| 11 | `certifications` | array | | Mảng chứa thông tin chứng chỉ tiếng Nhật |
| 12 | &nbsp;&nbsp;`certificationId` | number | | |
| 13 | &nbsp;&nbsp;`certificationName` | string | | |
| 14 | &nbsp;&nbsp;`startDate` | date | | |
| 15 | &nbsp;&nbsp;`endDate` | date | | |
| 16 | &nbsp;&nbsp;`score` | decimal | | |

#### Sample Response (thành công)

```json
{
    "code": "200",
    "employeeId": "1",
    "employeeName": "Nguyễn Văn A",
    "employeeBirthDate": "1983/01/02",
    "departmentId": "1",
    "departmentName": "Phòng DEVN",
    "employeeEmail": "nguyenvana@luvina.net",
    "employeeTelephone": "01234567",
    "employeeNameKana": "名カナ",
    "employeeLoginId": "nguyenvana",
    "certifications": [
      {
        "certificationId": "1",
        "certificationName": "chứng chỉ tiếng Nhật cấp 1",
        "startDate": "2023/01/01",
        "endDate": "2024/01/01",
        "score": "180"
      },
      {
        "certificationId": "2",
        "certificationName": "chứng chỉ tiếng Nhật cấp 2",
        "startDate": "2023/02/01",
        "endDate": "2024/02/01",
        "score": "90"
      }
    ]
}
```

### Trường hợp API trả về lỗi

| No. | json key name | Kiểu | Tên hạng mục | Note |
|---|---|---|---|---|
| 1 | `code` | number | | |
| 2 | `message` | object | | Nội dung lỗi |

#### Sample Response (lỗi)

```json
{
    "code": "500",
    "message": {
        "code": "ER013",
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
2. Get thông tin chi tiết nhân viên
   (Bảng liên quan: employees, departments)
  │
  ▼
3. Get thông tin chứng chỉ tiếng Nhật
   (Bảng liên quan: certifications, employees_certifications)
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
- Nếu không tồn tại trong bảng `employees.employee_id` thì trả về lỗi có mã code **ER013**, tham số "ＩＤ".

- Nếu có lỗi thì chuyển sang bước **[4. Tạo dữ liệu response cho API]**.

#### 2. Get thông tin chi tiết nhân viên

**2.1 Get nhân viên từ database**

■ Danh sách bảng sử dụng

| No | Tên bảng logic | ID bảng vật lý | Create | Refer | Update | Xóa |
|---|---|---|---|---|---|---|
| 1 | Thông tin nhân viên | employees | | 〇 | | |
| 2 | Thông tin bộ phận | departments | | 〇 | | |

■ Table access

**① Hạng mục lấy**
- Trường hợp get data hiển thị màn hình:

| No | Tên bảng | Alias | Tên trường |
|---|---|---|---|
| 1 | employees | - | employee_id |
| 2 | employees | - | employee_name |
| 3 | employees | - | employee_birth_date |
| 4 | employees | - | employee_email |
| 5 | employees | - | employee_telephone |
| 6 | employees | - | employee_name_kana |
| 7 | employees | - | employee_login_id |
| 8 | departments | - | department_id |
| 8 | departments | - | department_name |

**② Điều kiện kết hợp**
- Lấy thông tin phòng ban:

| No | Tên bảng | Tên trường | Tên trường | Tên bảng / Alias | Điều kiện liên kết |
|---|---|---|---|---|---|
| 1 | employees | department_id | department_id | departments | INNER JOIN |

#### 3. Get thông tin chứng chỉ tiếng Nhật của nhân viên

**3.1 Get danh sách chứng chỉ tiếng Nhật của nhân viên từ database**

■ Danh sách bảng sử dụng

| No | Tên bảng logic | ID bảng vật lý | Create | Refer | Update | Xóa |
|---|---|---|---|---|---|---|
| 1 | Thông tin chứng chỉ tiếng Nhật | certifications | | 〇 | | |
| 2 | Thông tin nhân viên chứng chỉ tiếng Nhật | employees_certifications | | 〇 | | |

■ Table access

**① Hạng mục lấy**
- Trường hợp get data hiển thị màn hình:

| No | Tên bảng | Alias | Tên trường |
|---|---|---|---|
| 9 | certifications | - | certification_id |
| 10 | certifications | - | certification_name |
| 11 | employees_certifications | - | start_date |
| 12 | employees_certifications | - | end_date |
| 13 | employees_certifications | - | score |

**② Điều kiện kết hợp**
- Lấy thông tin chứng chỉ tiếng Nhật:

| No | Tên bảng | Tên trường | Tên trường | Tên bảng / Alias | Điều kiện liên kết |
|---|---|---|---|---|---|
| 1 | employees_certifications | certification_id | certification_id | certifications | INNER JOIN |

**③ Sort**

| No | Tên bảng | Tên hạng mục | Sort order |
|---|---|---|---|
| 1 | certifications | certification_level | ASC |

**④ WHERE**

| No | Tên bảng | Tên hạng mục | Giá trị |
|---|---|---|---|
| 1 | employees_certifications | employee_id | = employee_id từ parameter [employeeId] |

#### 4. Tạo dữ liệu response cho API

**Trường hợp không có lỗi xảy ra:**

| No. | Key | Giá trị |
|---|---|---|
| 1 | code | 200 |
| 2 | employeeId | Lấy giá trị từ No 2 |
| 3 | employeeName | |
| 4 | employeeBirthDate | |
| 5 | departmentId | |
| 6 | departmentName | |
| 7 | employeeEmail | |
| 8 | employeeTelephone | |
| 9 | employeeNameKana | |
| 10 | employeeLoginId | |
| 11 | certifications | Lấy giá trị từ No 3 |
| 12 | &nbsp;&nbsp;certificationId | |
| 13 | &nbsp;&nbsp;certificationName | |
| 14 | &nbsp;&nbsp;startDate | |
| 15 | &nbsp;&nbsp;endDate | |
| 16 | &nbsp;&nbsp;score | |

**Trường hợp có lỗi xảy ra:**

| No. | Key | Giá trị |
|---|---|---|
| 1 | code | 500 |
| 2 | message | Lấy giá trị từ No 1. Format `{code: "", params: []}` |

- Kết thúc xử lý.

---

## 6. Tham chiếu

### Danh sách tài liệu tham chiếu

| No. | Mã tham chiếu | Tài liệu tham chiếu |
|---|---|---|
| *(không có dữ liệu)* | | |
