# 🚀 PHẦN 6: KỊCH BẢN MỞ RỘNG TÍNH NĂNG & XỬ LÝ THAY ĐỔI YÊU CẦU DỰ ÁN (CHANGE REQUESTS)

Tài liệu này tổng hợp toàn bộ các tình huống:
1. **Phần A: Mở rộng thêm tính năng mới (New Features)** (Export, Import, Refresh Token, Upload Avatar, Phân quyền RBAC, Email Schedule, i18n).
2. **Phần B: Thay đổi yêu cầu nghiệp vụ hiện có trong Source Code (Requirement Modifications)** (Soft Delete, Tìm kiếm đa từ khóa, 1 nhân viên nhiều chứng chỉ, Đổi quy tắc Sort, Đổi mật khẩu mạnh, Chuyển ADM005 thành Modal Dialog).

---

# 🅰️ PHẦN A: MỞ RỘNG TÍNH NĂNG MỚI (NEW FEATURES)

---

## 📊 1. Thêm Nút Xuất File Excel / CSV (Export Data)

### 📌 Đề bài phỏng vấn:
> *"Nếu khách hàng muốn thêm nút **'Xuất Excel'** ở màn hình ADM002 để tải về toàn bộ danh sách nhân viên theo đúng bộ lọc tìm kiếm hiện tại, em sẽ làm như thế nào?"*

### 🔄 Luồng Xử Lý Chi Tiết (End-to-End Flow):
1. **Phía Frontend (Next.js):**
   - Thêm nút **"Xuất Excel"** cạnh nút Tìm kiếm trên `EmployeeSearchForm.tsx`.
   - Khi click, lấy các tham số tìm kiếm hiện tại (`employee_name`, `department_id`, các tiêu chí `sort`), gọi API GET `/api/employees/export` với cấu hình Axios: `responseType: 'blob'`.
   - Nhận binary stream từ Server $\rightarrow$ tạo `URL.createObjectURL(blob)` và kích hoạt thẻ `<a>` ảo để tự động tải file `.xlsx` về máy người dùng.
2. **Phía Backend (Spring Boot):**
   - **Tầng Controller:** Tạo endpoint `@GetMapping("/employees/export")`.
   - **Tầng Service:**
     - Gọi Repository lấy toàn bộ dữ liệu thỏa mãn điều kiện lọc (không giới hạn `LIMIT/OFFSET`).
     - Sử dụng thư viện **Apache POI** (dùng `SXSSFWorkbook` để hỗ trợ Streaming tối ưu RAM khi dữ liệu lớn).
     - Tạo Sheet, định dạng Header (Mã NV, Họ tên, Ngày sinh, Phòng ban, Chứng chỉ, Ngày hết hạn, Điểm).
     - Đổ dữ liệu DTO vào từng hàng, format ngày `"yyyy/MM/dd"`.
   - **Tầng Response:** Trả về `ResponseEntity<Resource>` với Header:
     `Content-Disposition: attachment; filename="Danh_sach_nhan_vien.xlsx"` và `Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`.

### 🗣️ Kịch Bản Trả Lời (Nói Mồm):
> *"Dạ, ở **Frontend**, em bắt sự kiện click nút Export, gửi đúng các tham số tìm kiếm và sort hiện tại xuống API với kiểu `responseType: blob` để nhận file binary và tải về máy. Ở **Backend**, em dùng thư viện **Apache POI** kết hợp class `SXSSFWorkbook` (Streaming Workbook) để ghi trực tiếp ra đĩa tạm, tránh hoàn toàn lỗi tràn bộ nhớ `OutOfMemoryError` nếu xuất hàng chục nghìn nhân viên ạ."*

---

## 📥 2. Thêm Chức Năng Nhập Danh Sách Từ Excel (Import Excel / Batch Insert)

### 📌 Đề bài phỏng vấn:
> *"Nếu muốn import hàng loạt nhân viên từ file Excel vào database, em xử lý kiểm tra lỗi và lưu dữ liệu thế nào?"*

### 🔄 Luồng Xử Lý Chi Tiết:
1. **Frontend:** Màn hình upload file $\rightarrow$ Validate kích thước file (< 10MB) và đuôi mở rộng (`.xlsx`, `.xls`) $\rightarrow$ Gửi `FormData` chứa `file` qua API POST `/api/employees/import`.
2. **Backend:**
   - Đọc file qua `MultipartFile` bằng Apache POI.
   - **Validate từng dòng (Row-by-Row Validation):**
     - Kiểm tra bắt buộc: Tên, Email, Login ID duy nhất, Phòng ban tồn tại trong DB...
     - Gom danh sách các dòng bị lỗi (ví dụ: *Dòng 5: Trùng Email, Dòng 12: Sai định dạng ngày*).
   - **Xử lý Transaction:**
     - *Phương án An toàn (All or Nothing):* Nếu có bất kỳ dòng nào lỗi $\rightarrow$ Rollback toàn bộ, trả về JSON danh sách chi tiết các dòng lỗi để người dùng sửa.
     - *Phương án Linh hoạt (Partial Success):* Lưu các dòng hợp lệ bằng `saveAll()`, trả về file Excel kết quả đánh dấu đỏ những dòng bị lỗi để người dùng nạp lại.

---

## 🔄 3. Thêm Cơ Chế Refresh Token (Tự Động Gia Hạn Đăng Nhập)

### 📌 Đề bài phỏng vấn:
> *"Hiện tại Access Token của em có hạn dùng. Khi Token hết hạn giữa chừng lúc người dùng đang làm việc, làm sao để hệ thống tự gia hạn mà không bắt người dùng phải đăng nhập lại?"*

### 🔄 Luồng Xử Lý (Silent Refresh):
1. **Cơ chế 2 Token:**
   - **Access Token:** Hạn ngắn (15 phút) $\rightarrow$ Dùng cho mọi request API.
   - **Refresh Token:** Hạn dài (7 ngày) $\rightarrow$ Lưu an toàn trong `HttpOnly Cookie` (chống bị đánh cắp bởi mã độc XSS).
2. **Xử lý phía Frontend (Axios Response Interceptor):**
   - Khi gửi request API và nhận lại mã **HTTP 401 Unauthorized** (Token hết hạn):
   - Axios Interceptor **tạm giữ request đó lại** trong một hàng đợi (Queue).
   - Tự động gọi ngầm API POST `/api/auth/refresh` để xin cấp Access Token mới.
   - Khi có Access Token mới $\rightarrow$ Cập nhật lại Header và **tự động retry lại request ban đầu**.
   - Người dùng tiếp tục thao tác mượt mà mà không hề nhận ra token vừa được làm mới!

---

## 🖼️ 4. Thêm Upload Ảnh Đại Diện (Avatar Upload)

### 📌 Đề bài phỏng vấn:
> *"Nếu ở màn hình ADM004 muốn cho phép người dùng chọn ảnh đại diện cho nhân viên thì em thiết kế thế nào?"*

### 🔄 Luồng Xử Lý:
1. **Database:** Thêm cột `avatar_url VARCHAR(500)` vào bảng `employees` (tạo Flyway migration script `V4__add_avatar_column.sql`).
2. **Backend:**
   - API upload nhận `MultipartFile`.
   - Validate dung lượng (tối đa 2MB) và loại file (chỉ cho phép `image/jpeg`, `image/png`).
   - Lưu trữ:
     - *Môi trường Dev:* Lưu vào thư mục static trên server `/uploads/avatars/`.
     - *Môi trường Production (Khuyên dùng):* Đẩy trực tiếp lên Cloud Storage như **Amazon S3** hoặc Cloudinary và lấy về URL công khai.
   - Lưu đường link `avatar_url` vào DB.

---

## 👥 5. Phân Quyền Động Nâng Cao (RBAC - Role Based Access Control)

### 📌 Đề bài phỏng vấn:
> *"Hiện tại hệ thống chỉ có Admin và User. Nếu bây giờ công ty có thêm vai trò **Trưởng phòng (Manager)** - chỉ được xem và duyệt nhân viên trong phòng ban của mình thì em làm sao?"*

### 🔄 Luồng Xử Lý:
1. **Database:** Mở rộng bảng `roles` hoặc enum `ROLE_ADMIN`, `ROLE_MANAGER`, `ROLE_USER`.
2. **Backend Security:**
   - Sử dụng `@PreAuthorize` của Spring Security:
     - `@PreAuthorize("hasRole('ADMIN')")`: Xem toàn bộ, xóa nhân viên.
     - `@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")`: Vào được màn hình ADM002.
   - **Ở tầng Query (Repository):**
     - Nếu `role == MANAGER`: Tự động gán cứng `departmentId = currentUser.getDepartmentId()` vào câu query tìm kiếm để Manager **không bao giờ xem được nhân viên của phòng ban khác**.

---

## ⏰ 6. Gửi Email Tự Động Nhắc Nhở Chứng Chỉ Sắp Hết Hạn (Scheduled Cron Job)

### 📌 Đề bài phỏng vấn:
> *"Làm sao để hệ thống tự động quét và gửi email thông báo cho các nhân viên có chứng chỉ tiếng Nhật sắp hết hạn trong vòng 30 ngày tới?"*

### 🔄 Luồng Xử Lý:
1. **Spring Scheduled Task:** Tạo một Class `@Component` sử dụng `@Scheduled(cron = "0 0 8 * * ?")` (chạy tự động vào 8:00 sáng mỗi ngày).
2. **Repository:** Viết câu query tìm các bản ghi trong `employees_certifications` có:
   `WHERE end_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)`.
3. **Service:** 
   - Duyệt qua danh sách nhân viên tìm được.
   - Sử dụng **`JavaMailSender`** kết hợp với template HTML (Thymeleaf/FreeMarker) để render nội dung email thân thiện: *"Chào bạn [Tên], chứng chỉ tiếng Nhật [N2] của bạn sẽ hết hạn vào ngày [yyyy/MM/dd]..."*.
   - Gửi bất đồng bộ bằng **`@Async`** để không làm nghẽn luồng xử lý.

---

## 🌐 7. Hỗ Trợ Đa Ngôn Ngữ (i18n: Tiếng Việt, Tiếng Anh, Tiếng Nhật)

### 📌 Đề bài phỏng vấn:
> *"Nếu khách hàng muốn chuyển đổi ngôn ngữ toàn bộ hệ thống giữa Tiếng Việt, Tiếng Anh và Tiếng Nhật thì em làm thế nào?"*

### 🔄 Luồng Xử Lý:
1. **Frontend:** 
   - Tận dụng từ điển mã lỗi `messages.ts` hiện có, mở rộng thành các file JSON ngôn ngữ: `vi.json`, `en.json`, `ja.json`.
   - Người dùng chọn cờ ngôn ngữ trên Header $\rightarrow$ lưu `locale` vào Cookie/LocalStorage.
2. **Backend:**
   - Cấu hình `LocaleResolver` đọc Header HTTP: `Accept-Language: ja` hoặc `vi`.
   - Sử dụng `ResourceBundleMessageSource` với các file `messages_vi.properties`, `messages_ja.properties` để trả về thông điệp lỗi đa ngôn ngữ chuẩn xác từ Server.

---

# 🅱️ PHẦN B: THAY ĐỔI YÊU CẦU NGHIỆP VỤ TRONG DỰ ÁN (PROJECT REQUIREMENT CHANGES)

---

## 🗑️ 8. Thay Đổi Nghiệp Vụ Xóa: Chuyển từ Xóa Vật Lý (Hard Delete) sang Xóa Mềm (Soft Delete)

### 📌 Đề bài phỏng vấn:
> *"Hiện tại khi bấm xóa nhân viên, hệ thống đang dùng lệnh `DELETE FROM employees`. Khách hàng yêu cầu: **Không được xóa hẳn khỏi Database** để lưu vết lịch sử kiểm toán. Em sẽ sửa code như thế nào?"*

### 🔄 Cách Thực Hiện & Trả Lời:
1. **Database:**
   - Viết Flyway script migration thêm cột: `ALTER TABLE employees ADD COLUMN is_deleted TINYINT(1) DEFAULT 0;` (0: còn hoạt động, 1: đã xóa).
2. **Backend:**
   - **Tầng Entity:** Đánh dấu `@SQLDelete(sql = "UPDATE employees SET is_deleted = 1 WHERE employee_id = ?")` và `@Where(clause = "is_deleted = 0")` trên `EmployeeEntity`.
   - **Tầng Custom Query:** Trong file `EmployeeRepositoryCustomImpl.java` và `EmployeeRepository.java`, sửa điều kiện lọc mặc định thành: `WHERE e.employee_role = 1 AND e.is_deleted = 0`.
   - Khi gọi `employeeRepository.delete(entity)` $\rightarrow$ Hibernate sẽ tự động biến thành lệnh `UPDATE is_deleted = 1` thay vì `DELETE`.

---

## 🔎 9. Thay Đổi Quy Tắc Tìm Kiếm: Tìm Kiếm Đa Từ Khóa & Không Phân Biệt Hoa Thường

### 📌 Đề bài phỏng vấn:
> *"Hiện tại tìm kiếm tên đang phân biệt hoa thường và tìm chuỗi liền (`LIKE BINARY`). Nếu khách hàng muốn: **Tìm kiếm không phân biệt hoa thường, và nếu nhập nhiều từ cách nhau bởi dấu cách (ví dụ: 'Nguyễn Nam') thì vẫn tìm ra nhân viên có tên 'Nguyễn Văn Nam'** thì em xử lý sao?"*

### 🔄 Cách Thực Hiện & Trả Lời:
1. **Phía Backend (`EmployeeRepositoryCustomImpl.java`):**
   - Loại bỏ từ khóa `BINARY` trong câu SQL để chuyển sang so khớp không phân biệt hoa thường (`Case-Insensitive`).
   - Tách chuỗi từ khóa theo dấu cách: `String[] keywords = employeeName.trim().split("\\s+");`.
   - Dùng vòng lặp ghép các điều kiện `AND`:
     ```sql
     AND (e.employee_name LIKE CONCAT('%', :kw0, '%') 
          OR e.employee_name_kana LIKE CONCAT('%', :kw0, '%'))
     AND (e.employee_name LIKE CONCAT('%', :kw1, '%') 
          OR e.employee_name_kana LIKE CONCAT('%', :kw1, '%'))
     ```
   - Nhờ đó, người dùng gõ *"nguyen nam"* hoặc *"NGUYEN NAM"* đều tìm thấy *"Nguyễn Văn Nam"*.

---

## 📜 10. Thay Đổi Nghiệp Vụ Chứng Chỉ: Cho Phép 1 Nhân Viên Có NHIỀU Chứng Chỉ (1-to-N)

### 📌 Đề bài phỏng vấn:
> *"Hiện tại màn hình ADM004 chỉ cho nhập 1 chứng chỉ tiếng Nhật. Nếu yêu cầu thay đổi thành: **1 nhân viên có thể thêm nhiều chứng chỉ (ví dụ vừa có N2 vừa có N1 ở các năm khác nhau)** thì em thay đổi từ Frontend xuống Backend ra sao?"*

### 🔄 Cách Thực Hiện & Trả Lời:
1. **Frontend (`ADM004`):**
   - Sử dụng hook **`useFieldArray`** của `React Hook Form` để quản lý danh sách chứng chỉ động.
   - Giao diện có thêm nút **"+ Thêm chứng chỉ"** và nút **"Xóa"** bên cạnh mỗi dòng chứng chỉ.
   - Cập nhật Zod Schema: `certifications: z.array(certificationSchema)`.
2. **Backend (`EmployeeServiceImpl.java`):**
   - Đổi `EmployeeSaveRequest` nhận vào `List<EmployeeCertificationDTO> certifications`.
   - Trong Service: Sử dụng `@Transactional`, xóa các chứng chỉ cũ trong bảng `employees_certifications` và gọi `employeeCertificationRepository.saveAll(...)` để lưu danh sách chứng chỉ mới.
3. **Màn hình ADM002 (Danh sách):**
   - Câu SQL hiển thị chứng chỉ sẽ dùng hàm gom nhóm `GROUP_CONCAT(c.certification_name SEPARATOR ', ')` hoặc câu Subquery chỉ lấy **chứng chỉ có cấp độ cao nhất** để hiển thị lên bảng.

---

## 📅 11. Thay Đổi Quy Tắc Sort Ngày Hết Hạn: Chứng Chỉ Vô Thời Hạn Lên Đầu Khi Sort Giảm Dần

### 📌 Đề bài phỏng vấn:
> *"Hiện tại khi sort `end_date`, các chứng chỉ không có ngày hết hạn (`NULL`) luôn bị đẩy xuống cuối. Nếu khách hàng coi chứng chỉ không có ngày hết hạn là **'Vô thời hạn' (có giá trị cao nhất)** và yêu cầu khi sort Giảm dần (`DESC`) thì nó phải **nằm ở trên cùng** thì em sửa thế nào?"*

### 🔄 Cách Thực Hiện & Trả Lời:
- Trong file `EmployeeRepositoryCustomImpl.java`, sửa lại mệnh đề `CASE WHEN` động theo chiều sort:
  ```java
  if ("DESC".equalsIgnoreCase(direction)) {
      // Khi DESC: NULL coi như vô thời hạn -> đưa lên đầu bảng (gán trọng số 0)
      orderClauses.add("case when ec.end_date is null then 0 else 1 end asc, ec.end_date desc");
  } else {
      // Khi ASC: NULL đưa xuống cuối bảng (gán trọng số 1)
      orderClauses.add("case when ec.end_date is null then 1 else 0 end asc, ec.end_date asc");
  }
  ```

---

## 🔒 12. Thay Đổi Chính Sách Bảo Mật Mật Khẩu (Password Policy)

### 📌 Đề bài phỏng vấn:
> *"Khách hàng yêu cầu tăng cường bảo mật: Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số, 1 ký tự đặc biệt, và **không được đặt trùng mật khẩu cũ** khi chỉnh sửa nhân viên thì em làm thế nào?"*

### 🔄 Cách Thực Hiện & Trả Lời:
1. **Validate Độ Phức Tạp:**
   - **Frontend (Zod):** Thêm regex kiểm tra `.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)`.
   - **Backend (`EmployeeValidator.java`):** Bổ sung Regex tương tự để chặn nếu có ai cố tình bypass client.
2. **Kiểm Tra Trùng Mật Khẩu Cũ:**
   - Trong Service khi update: Sử dụng `passwordEncoder.matches(newPassword, currentEmployee.getEmployeeLoginPassword())`.
   - Nếu trả về `true` (người dùng nhập mật khẩu y hệt mật khẩu cũ đang dùng) $\rightarrow$ ném ngoại lệ `BusinessException(ErrorCode.ER003_PASSWORD_CANNOT_BE_SAME)`.

---

## 🪟 13. Thay Đổi Trải Nghiệm UX: Chuyển Màn Hình Xác Nhận ADM005 Thành Modal Dialog Tại ADM004

### 📌 Đề bài phỏng vấn:
> *"Để tối ưu trải nghiệm người dùng hiện đại, khách hàng không muốn chuyển trang sang `/employees/adm005` nữa mà muốn khi bấm 'Xác nhận' ở ADM004 sẽ **bật một cửa sổ Modal Popup tại chỗ** để xem lại thông tin. Em sẽ tái cấu trúc Frontend thế nào?"*

### 🔄 Cách Thực Hiện & Trả Lời:
1. **Frontend:**
   - Tách phần giao diện hiển thị bảng thông tin của ADM005 thành một Component độc lập: `EmployeeConfirmModal.tsx`.
   - Tại `useAdm004.ts`, thêm State `isConfirmModalOpen: boolean`.
   - Khi bấm submit form và validate Zod thành công $\rightarrow$ không lưu `sessionStorage` và không chuyển route nữa, mà chỉ cần `setIsConfirmModalOpen(true)`.
   - Trong Modal:
     - Bấm *"Chỉnh sửa lại"* $\rightarrow$ Đóng modal (`setIsConfirmModalOpen(false)`), giữ nguyên dữ liệu trên form.
     - Bấm *"Xác nhận Lưu"* $\rightarrow$ Gọi trực tiếp API `createEmployee()` hoặc `updateEmployee()` ngay tại chỗ, sau đó điều hướng thẳng sang ADM006.
2. **Lợi ích:** Tiết kiệm thời gian chuyển trang, loại bỏ sự phụ thuộc vào `sessionStorage` để truyền dữ liệu giữa các route.

---

### 💡 Tóm Lược Bí Quyết Đối Đáp Tình Huống Phỏng Vấn:

> Khi gặp câu hỏi thay đổi yêu cầu, hãy bình tĩnh phân tích theo **3 trụ cột**:
> 1. **Data Layer (Database):** Có cần sửa bảng / thêm cột / thêm Index không?
> 2. **Business Layer (Backend):** Sửa câu Query nào, validate thêm cái gì, có cần `@Transactional` không?
> 3. **Presentation Layer (Frontend):** Sửa Form, State, Component nào và trải nghiệm UX cải thiện ra sao?
> 
> *Cách trả lời rành mạch từ Dưới lên Trên (Bottom-up) này sẽ chứng minh cho người phỏng vấn thấy bạn là một lập trình viên có tư duy hệ thống rất vững vàng!*
