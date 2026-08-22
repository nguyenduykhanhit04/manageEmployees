# Tài liệu Thiết kế API — Get List Departments

| Thông tin | Giá trị |
|---|---|
| Tên system | TKCB |
| Loại system | Thiết kế API |
| Category chức năng | Get List Departments |
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

Lấy thông tin chi tiết người dùng.

> Ghi chú: mô tả trong tài liệu gốc ghi "Lấy thông tin chi tiết người dùng", tuy nhiên dựa vào Request/Response và tên API bên dưới, chức năng thực tế là **lấy danh sách phòng ban (departments)**.

---

## 2. Request

### Request URL

| No. | Service | API name | Method HTTP | Note |
|---|---|---|---|---|
| 1 | departments | Get List Departments | GET | |

### Request Parameter

| No. | Parameter | Bắt buộc | Kiểu | Giá trị default | Tên hạng mục | Note |
|---|---|---|---|---|---|---|
| *(Không có tham số request)* | | | | | | |

### Sample Request

```
/departments
```

---

## 3. Response

### Trường hợp API trả về response bình thường

| No. | json key name | Kiểu | Tên hạng mục | Note |
|---|---|---|---|---|
| 1 | `code` | number | | |
| 2 | `departments` | array | | Mảng chứa thông tin list phòng ban |
| 3 | &nbsp;&nbsp;`departmentId` | number | | |
| 4 | &nbsp;&nbsp;`departmentName` | string | | |

#### Sample Response (thành công)

```json
{
    "code": "200",
    "departments": [
      {
        "departmentId": "1",
        "departmentName": "Phòng DEV1"
      },
      {
        "departmentId": "2",
        "departmentName": "Phòng DEV2"
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
        "code": "ER023",
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
1. Get thông tin tất cả phòng ban
   (Bảng liên quan: departments)
  │
  ▼
2. Tạo mảng response
  │
  ▼
END
```

---

## 5. Chi tiết xử lý

### Xử lý common
`<Không có>`

### Xử lý chi tiết

#### 1. Get thông tin phòng ban

**1.1 Get tất cả phòng ban từ database**

■ Danh sách bảng sử dụng

| No | Tên bảng logic | ID bảng vật lý | Create | Refer | Update | Xóa |
|---|---|---|---|---|---|---|
| 1 | Thông tin bộ phận | departments | | 〇 | | |

■ Table access

**① Hạng mục lấy**
- Trường hợp get data hiển thị màn hình:

| No | Tên bảng | Alias | Tên trường |
|---|---|---|---|
| 1 | departments | - | department_id |
| 2 | departments | - | department_name |

#### 2. Tạo dữ liệu response cho API

**Trường hợp không có lỗi xảy ra:**

| No. | Key | Giá trị |
|---|---|---|
| 1 | code | 200 |
| 2 | departments | Lấy giá trị từ No 1 |
| 3 | &nbsp;&nbsp;departmentId | |
| 4 | &nbsp;&nbsp;departmentName | |

**Trường hợp có lỗi xảy ra:**

| No. | Key | Giá trị |
|---|---|---|
| 1 | code | 500 |
| 2 | message | `{code: "ER023", params: []}` |

- Kết thúc xử lý.

---

## 6. Tham chiếu

### Danh sách tài liệu tham chiếu

| No. | Mã tham chiếu | Tài liệu tham chiếu |
|---|---|---|
| *(không có dữ liệu)* | | |
