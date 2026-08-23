# Tài liệu Thiết kế API — Get List Certifications

| Thông tin | Giá trị |
|---|---|
| Tên system | TKCB |
| Loại system | Thiết kế API |
| Category chức năng | Get List certifications |
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

Lấy thông tin danh sách chứng chỉ tiếng Nhật.

---

## 2. Request

### Request URL

| No. | Service | API name | Method HTTP | Note |
|---|---|---|---|---|
| 1 | certifications | Get List certifications | GET | |

### Request Parameter

| No. | Parameter | Bắt buộc | Kiểu | Giá trị default | Tên hạng mục | Note |
|---|---|---|---|---|---|---|
| *(Không có tham số request)* | | | | | | |

### Sample Request

```
/certifications
```

---

## 3. Response

### Trường hợp API trả về response bình thường

| No. | json key name | Kiểu | Tên hạng mục | Note |
|---|---|---|---|---|
| 1 | `code` | number | | |
| 2 | `certifications` | array | | Mảng chứa thông tin chứng chỉ tiếng Nhật |
| 3 | &nbsp;&nbsp;`certificationId` | number | | |
| 4 | &nbsp;&nbsp;`certificationName` | string | | |

#### Sample Response (thành công)

```json
{
    "code": "200",
    "certifications": [
      {
        "certificationId": "1",
        "certificationName": "Trình độ tiếng Nhật cấp 1"
      },
      {
        "certificationId": "2",
        "certificationName": "Trình độ tiếng Nhật cấp 2"
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
1. Get thông tin tất cả chứng chỉ tiếng Nhật
   (Bảng liên quan: certifications)
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

#### 1. Get thông tin chứng chỉ tiếng Nhật

**1.1 Get tất cả chứng chỉ từ database**

■ Danh sách bảng sử dụng

| No | Tên bảng logic | ID bảng vật lý | Create | Refer | Update | Xóa |
|---|---|---|---|---|---|---|
| 1 | Thông tin chứng chỉ tiếng Nhật | certifications | | 〇 | | |

■ Table access

**① Hạng mục lấy**
- Trường hợp get data hiển thị màn hình:

| No | Tên bảng | Alias | Tên trường |
|---|---|---|---|
| 1 | certifications | - | certification_id |
| 2 | certifications | - | certification_name |

#### 2. Tạo dữ liệu response cho API

**Trường hợp không có lỗi xảy ra:**

| No. | Key | Giá trị |
|---|---|---|
| 1 | code | 200 |
| 2 | certifications | Lấy giá trị từ No 1 |
| 3 | &nbsp;&nbsp;certificationId | |
| 4 | &nbsp;&nbsp;certificationName | |

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
