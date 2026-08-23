# Tài liệu Thiết kế API — List Employees

| Thông tin | Giá trị |
|---|---|
| Tên system | TKCB |
| Loại system | 13_Thiết kế API |
| Category chức năng | List employees |
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

Lấy thông tin nhân viên và phòng ban cùng thông tin chứng chỉ tiếng Nhật (nếu có) của nhân viên theo điều kiện tìm kiếm để hiển thị màn hình list.

---

## 2. Request

### Request URL

| No. | Service | API name |
|---|---|---|
| 1 | employee | List employees |

### Request Parameter

| No. | Parameter | Bắt buộc | Kiểu | Giá trị default |
|---|---|---|---|---|
| 1 | `employee_name` | - | string | `""` |
| 2 | `department_id` | - | string | `""` |
| 3 | `ord_employee_name` | - | string | `""` |
| 4 | `ord_certification_name` | - | string | `""` |
| 5 | `ord_end_date` | - | string | `""` |
| 6 | `offset` | - | string | `""` |
| 7 | `limit` | - | string | `""` |

> Ghi chú: Tất cả tham số đều **không bắt buộc** (cột "Bắt buộc" = "-"), có giá trị mặc định là chuỗi rỗng.

### Sample Request

```
/employee?employee_name=A&department_id=1&ord_employee_name=ASC&ord_certification_name=ASC&ord_end_date=DESC&offset=2&limit=30
```

---

## 3. Response

### Trường hợp API trả về response bình thường

| No. | json key name | Kiểu | Tên hạng mục | Note |
|---|---|---|---|---|
| 1 | `code` | number | | |
| 2 | `totalRecords` | number | | Tổng số nhân viên |
| 3 | `employees` | array | | Mảng chứa thông tin nhân viên |
| 4 | &nbsp;&nbsp;`employeeId` | number | | |
| 5 | &nbsp;&nbsp;`employeeName` | string | | |
| 6 | &nbsp;&nbsp;`employeeBirthDate` | date | | |
| 7 | &nbsp;&nbsp;`departmentName` | string | | |
| 8 | &nbsp;&nbsp;`employeeEmail` | string | | |
| 9 | &nbsp;&nbsp;`employeeTelephone` | string | | |
| 10 | &nbsp;&nbsp;`certificationName` | string | | |
| 11 | &nbsp;&nbsp;`endDate` | date | | |
| 12 | &nbsp;&nbsp;`score` | decimal | | |

#### Sample Response (thành công)

```json
{
    "code": "200",
    "totalRecords": 2,
    "employees": [
      {
        "employeeId": "1",
        "employeeName": "Nguyễn Văn A",
        "employeeBirthDate": "1983/01/01",
        "departmentName": "Phòng DevN",
        "employeeEmail": "nguyenvana@luvina.net",
        "employeeTelephone": "01234567",
        "certificationName": "Trình độ tiếng Nhật cấp 1",
        "endDate": "9999/12/31",
        "score": "999"
      },
      {
        "employeeId": "2",
        "employeeName": "Nguyễn Văn B",
        "employeeBirthDate": "1983/01/02",
        "departmentName": "Phòng DevN",
        "employeeEmail": "nguyenvanb@luvina.net",
        "employeeTelephone": "01234568",
        "certificationName": "Trình độ tiếng Nhật cấp 2",
        "endDate": "9999/12/31",
        "score": "999"
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
    "message":  {
        "code": "ER015",
        "params": []
    }
}
```

---

## 4. Flow xử lý

Sơ đồ luồng xử lý (dạng flowchart) gồm các bước chính:

```
START
  │
  ▼
1. Validate parameter
  │
  ▼
2. Get danh sách người dùng
   (Bảng liên quan: employees, departments, certifications, employees_certifications)
  │
  ▼
3. Tạo mảng response
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

**1.1 Validate parameter `[ord_employee_name]`, `[ord_certification_name]`, `[ord_end_date]`**
- Nếu giá trị order không phải là `"ASC"` hoặc `"DESC"` thì trả về lỗi có mã code **ER021**.

**1.2 Validate parameter `[offset]`**
- Nếu giá trị parameter này không phải là số nguyên dương thì trả về lỗi có mã code **ER018**, tham số "オフセット" (offset).

**1.3 Validate parameter `[limit]`**
- Nếu giá trị parameter này không phải là số nguyên dương thì trả về lỗi có mã code **ER018**, tham số "リミット" (limit).

- Nếu có lỗi thì chuyển sang bước **[3. Tạo dữ liệu response cho API]**.

#### 2. Get danh sách nhân viên

**2.1 Thực hiện lấy tổng số nhân viên từ database**

■ Danh sách bảng sử dụng

| No | Tên bảng logic |
|---|---|
| 1 | Thông tin nhân viên |
| 2 | Thông tin bộ phận |

■ Table access

**① Hạng mục lấy**
- Trường hợp get data hiển thị màn hình:

| No | Tên bảng | Alias |
|---|---|---|
| 1 | employees | - |

**② Điều kiện kết hợp**
- Lấy thông tin phòng ban:

| No | Tên bảng | Tên trường |
|---|---|---|
| 1 | employees | department_id |

**③ Điều kiện lấy**
- Nếu tồn tại parameter `[department_id]` và không rỗng => Thêm điều kiện search theo phòng ban:

| No | Tên bảng | Tên trường |
|---|---|---|
| 1 | employees | department_id |

- Nếu tồn tại parameter `[employee_name]` và không rỗng => Thêm điều kiện search theo tên nhân viên (AND):

| No | Tên bảng | Tên trường |
|---|---|---|
| 1 | employees | employee_name |

- Nếu tổng số bản ghi là 0 thì chuyển đến **[3. Tạo dữ liệu response cho API]**.

**2.2 Thực hiện get danh sách nhân viên từ database**

■ Danh sách bảng sử dụng

| No | Tên bảng logic |
|---|---|
| 1 | Thông tin nhân viên |
| 2 | Thông tin bộ phận |
| 3 | Thông tin chứng chỉ tiếng Nhật |
| 4 | Thông tin nhân viên chứng chỉ tiếng Nhật |

■ Table access

**① Hạng mục lấy**
- Trường hợp get data hiển thị màn hình:

| No | Tên bảng | Alias |
|---|---|---|
| 1 | employees | - |
| 2 | employees | - |
| 3 | employees | - |
| 4 | employees | - |
| 5 | employees | - |
| 7 | departments | - |
| 8 | certifications | - |
| 9 | employees_certifications | - |
| 10 | employees_certifications | - |

**② Điều kiện kết hợp**
- Lấy thông tin phòng ban:

| No | Tên bảng | Tên trường |
|---|---|---|
| 1 | employees | department_id |

- Lấy thông tin chứng chỉ tiếng Nhật:

| No | Tên bảng | Tên trường |
|---|---|---|
| 2 | employees | employee_id |
| 3 | employees_certifications | certification_id |

**③ Điều kiện lấy**
- Nếu tồn tại parameter `[department_id]` và không rỗng => Thêm điều kiện search theo phòng ban (AND):

| No | Tên bảng | Tên trường |
|---|---|---|
| 1 | employees | department_id |

- Nếu tồn tại parameter `[employee_name]` và không rỗng => Thêm điều kiện search theo tên nhân viên (AND):

| No | Tên bảng | Tên trường |
|---|---|---|
| 1 | employees | employee_name |

**④ Sort**
- Nếu tồn tại `[ord_employee_name]` và không rỗng => Thêm sort theo hạng mục [氏名] (tên nhân viên):

| No | Tên bảng | Tên hạng mục |
|---|---|---|
| 1 | employees | employee_name |

- Nếu tồn tại `[ord_certification_name]` và không rỗng => Thêm sort theo hạng mục [日本語能力] (trình độ tiếng Nhật):

| No | Tên bảng | Tên hạng mục |
|---|---|---|
| 1 | certifications | certification_name |

- Nếu tồn tại `[ord_end_date]` và không rỗng => Thêm sort theo hạng mục [失効日] (ngày hết hạn):

| No | Tên bảng | Tên hạng mục |
|---|---|---|
| 1 | employees_certifications | end_date |

> ※ Nếu không chỉ định các tham số orderBy thì sort mặc định theo `employee_id` tăng dần.

**⑤ Phân trang**

| No | Tên bảng | Tên hạng mục |
|---|---|---|
| 1 | employees | limit |
| 2 | employees | offset |

#### 3. Tạo dữ liệu response cho API

**Trường hợp không có lỗi xảy ra:**

| No. | Key | Giá trị |
|---|---|---|
| 1 | code | 200 |
| 2 | totalRecords | Lấy giá trị từ No 2.1 |
| 3 | employees | Lấy giá trị từ No 2.2 |
| 4 | &nbsp;&nbsp;employeeId | |
| 5 | &nbsp;&nbsp;employeeName | |
| 6 | &nbsp;&nbsp;employeeBirthDate | |
| 7 | &nbsp;&nbsp;departmentName | |
| 8 | &nbsp;&nbsp;employeeEmail | |
| 9 | &nbsp;&nbsp;employeeTelephone | |
| 10 | &nbsp;&nbsp;certificationName | |
| 11 | &nbsp;&nbsp;endDate | |
| 12 | &nbsp;&nbsp;score | |

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
