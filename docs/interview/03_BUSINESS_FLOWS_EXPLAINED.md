# 📋 PHẦN 3: GIẢI THÍCH LUỒNG NGHIỆP VỤ CÁC CHỨC NĂNG (BẢN NÓI MỒM)

Tài liệu này cung cấp kịch bản giải thích chi tiết, gãy gọn từng chức năng nghiệp vụ trọng tâm trong dự án khi phỏng vấn.

---

## 🔍 1. Chức Năng Tìm Kiếm Nhân Viên (Search - Màn Hình ADM002)

### 📌 Luồng Xử Lý Nghiệp Vụ:
1. **Đầu vào (Input):** Người dùng nhập **Tên nhân viên** (`employee_name`) và/hoặc chọn **Phòng ban** (`department_id`).
2. **Phía Client (Frontend):**
   - Tự động `trim()` khoảng trắng thừa 2 đầu ở ô nhập tên.
   - **Reset trang về Page 1** (`offset = 0`) mỗi khi bấm nút "Tìm kiếm".
   - Gom các tham số (`employee_name`, `department_id`, `limit`, `sort_field`, `sort_type`) gửi request GET xuống Backend.
3. **Phía Server (Backend):**
   - Controller tiếp nhận qua `@RequestParam`, Validator kiểm tra định dạng và độ dài.
   - Repository xây dựng câu truy vấn SQL động:
     - **Tên nhân viên:** Xử lý **escape các ký tự đặc biệt** (`%`, `_`) để tránh lỗi Wildcard trong SQL, dùng `LIKE BINARY concat('%', :name, '%')` để tìm kiếm tương đối chính xác.
     - **Phòng ban:** Nếu chọn 1 phòng ban cụ thể $\rightarrow$ thêm điều kiện `WHERE e.department_id = :deptId`. Nếu chọn "Tất cả phòng ban" $\rightarrow$ bỏ qua điều kiện.
   - Thực thi **2 câu truy vấn**:
     1. Câu `COUNT(*)` để lấy tổng số bản ghi (`total_records`).
     2. Câu `SELECT` dữ liệu với `LIMIT` và `OFFSET`.
4. **Hiển thị (Output):**
   - Nếu có kết quả: Render danh sách nhân viên lên bảng, tính lại tổng số trang và hiển thị thanh phân trang.
   - Nếu không có kết quả: Ẩn thanh phân trang và hiển thị thông báo lỗi/chú ý: *"Không tìm thấy nhân viên nào"*.

### 🗣️ Kịch Bản Trả Lời Phỏng Vấn (Search):
> *"Dạ, ở chức năng Tìm kiếm nhân viên tại màn hình ADM002, em tổ chức luồng xử lý như sau:*
> - *Ở Frontend: Khi người dùng bấm Tìm kiếm, em tự động trim() khoảng trắng và **luôn reset trang về Page 1** để đảm bảo hiển thị đúng từ đầu.*
> - *Ở Backend: Em xây dựng câu query động có **escape các ký tự đại diện `%` và `_`** trước khi ghép vào mệnh đề `LIKE BINARY` để chống lỗi SQL wildcard. Đồng thời chạy câu lệnh `COUNT` để lấy tổng số bản ghi làm phân trang.*
> - *Đặc biệt, khi người dùng đang ở kết quả tìm kiếm mà bấm Chuyển trang hoặc Sắp xếp cột, hệ thống **vẫn giữ nguyên bộ lọc tìm kiếm** chứ không bị mất trạng thái ạ."*

---

## ↕️ 2. Chức Năng Sắp Xếp Đa Cột (Multi-Column Sorting - ADM002)

### 📌 Luồng Xử Lý Nghiệp Vụ:
1. **Phía Client (Frontend):**
   - Hỗ trợ sắp xếp theo 3 tiêu chí: **Tên nhân viên**, **Trình độ tiếng Nhật (N1-N5)**, và **Ngày hết hạn chứng chỉ**.
   - Khi click vào tiêu đề cột: Đảo chiều giữa `ASC` (Tăng dần) $\leftrightarrow$ `DESC` (Giảm dần).
   - Duy trì mảng **Sort Priority (Thứ tự ưu tiên)**: Cột nào được click gần nhất sẽ được đưa lên đầu danh sách ưu tiên.
2. **Phía Backend (Xử lý SQL Động):**
   - Tầng `EmployeeRepositoryCustomImpl` dùng `StringBuilder` để ghép các mệnh đề `ORDER BY` theo đúng thứ tự ưu tiên nhận được từ Frontend:
     - **Tên nhân viên:** Ghép `e.employee_name collate utf8mb4_vietnamese_ci + direction` để sắp xếp đúng bảng chữ cái tiếng Việt.
     - **Trình độ chứng chỉ:** Xử lý người không có chứng chỉ (`NULL`) xuống cuối cùng bằng `CASE WHEN c.certification_level IS NULL THEN 1 ELSE 0 END ASC, -c.certification_level + direction`.
     - **Ngày hết hạn:** Xử lý tương tự với `CASE WHEN ec.end_date IS NULL THEN 1 ELSE 0 END ASC, ec.end_date + direction`.
   - **Tiêu chí phá vỡ thế hòa (Tie-breaker):** Luôn luôn thêm **`e.employee_id ASC`** ở cuối cùng của mệnh đề `ORDER BY` để đảm bảo **tính ổn định của phân trang (Deterministic Pagination)**, tránh việc các bản ghi bị nhảy lộn xộn giữa các trang.

### 🗣️ Kịch Bản Trả Lời Phỏng Vấn (Sort):
> *"Dạ, chức năng Sắp xếp trong dự án hỗ trợ sắp xếp động nhiều cột theo thứ tự click từ Frontend:*
> - *Ở Backend, em xây dựng mệnh đề `ORDER BY` động bằng `StringBuilder`.*
> - *Em xử lý các trường hợp đặc thù: Dùng `COLLATE utf8mb4_vietnamese_ci` để sort đúng tiếng Việt, và dùng `CASE WHEN ... IS NULL THEN 1 ELSE 0 END` để đẩy các nhân viên không có chứng chỉ xuống cuối bảng.*
> - *Đặc biệt, em luôn thêm `e.employee_id ASC` ở cuối câu ORDER BY để làm tiêu chí Tie-breaker, giúp dữ liệu phân trang luôn nhất quán, không bị lặp bản ghi giữa các trang ạ."*

---

## 📄 3. Chức Năng Phân Trang (Pagination)

### 📌 Luồng Xử Lý Nghiệp Vụ:
1. **Công thức tính toán:**
   - $\text{offset} = (\text{page} - 1) \times \text{limit}$ (trong đó `limit` mặc định là số lượng bản ghi mỗi trang).
   - $\text{totalPages} = \lceil \frac{\text{total\_records}}{\text{limit}} \rceil$.
2. **Tối ưu hiệu năng Database:**
   - Phân trang thực hiện trực tiếp dưới Database bằng `LIMIT :limit OFFSET :offset`, **chỉ lấy đúng số lượng bản ghi của trang hiện tại lên RAM**, không kéo toàn bộ bảng về ứng dụng.

---

## 💾 4. Luồng Thêm Mới / Chỉnh Sửa Nhân Viên (ADM004 $\rightarrow$ ADM005 $\rightarrow$ ADM006)

```text
[ADM004: Nhập liệu Form]
       │
       ▼ (Bấm 'Xác nhận' -> Validate Zod phía Client)
[sessionStorage] ──► Lưu dữ liệu form tạm thời
       │
       ▼ (Chuyển trang)
[ADM005: Màn hình Xem lại & Xác nhận]
       │
       ├── Bấm 'Quay lại' ──► Quay về ADM004 (Đọc lại sessionStorage để fill lại Form)
       │
       └── Bấm 'Lưu' / 'Cập nhật'
               │
               ▼ (Gọi API POST/PUT lên Backend)
       [Backend Service]
               ├── Validate toàn diện (Bắt lỗi ER001 -> ER023)
               ├── Kiểm tra trùng Login ID, trùng Email (nếu thêm mới)
               ├── @Transactional: Lưu bảng 'employees' & bảng 'employees_certifications'
               └── Trả về mã HTTP 200 thành công
               │
               ▼
[ADM006: Thông báo hoàn tất Thao tác] ──► Xóa sạch dữ liệu tạm trong sessionStorage
```

### 🗣️ Kịch Bản Trả Lời Phỏng Vấn (CRUD Flow):
> *"Dạ, đối với luồng Thêm mới / Chỉnh sửa nhân viên:*
> - *Hệ thống tuân thủ quy trình 3 bước chuẩn nghiệp vụ: **Nhập liệu (ADM004) $\rightarrow$ Xác nhận (ADM005) $\rightarrow$ Hoàn tất (ADM006)**.*
> - *Ở bước ADM004, dữ liệu được validate chặt chẽ qua Zod Schema. Khi bấm xác nhận, dữ liệu tạm được lưu vào `sessionStorage` để chuyển sang ADM005 cho người dùng kiểm tra lại.*
> - *Khi bấm Lưu, Backend tiếp nhận qua `EmployeeSaveRequest`, validate tính duy nhất của Login ID/Email, sau đó sử dụng **`@Transactional`** để đảm bảo lưu đồng thời cả thông tin nhân viên lẫn chứng chỉ tiếng Nhật an toàn vào Database, tránh tình trạng mất tính toàn vẹn dữ liệu ạ."*
