# 🎯 PHẦN 5: TOP CÂU HỎI PHỎNG VẤN & BỘ CÂU TRẢ LỜI "ĂN ĐIỂM"

Tập hợp các câu hỏi phỏng vấn thực tế hay gặp nhất đối với dự án Manage Employees, kèm theo câu trả lời mẫu gãy gọn và mẹo đối đáp.

---

### ❓ Câu 1: Em hãy giới thiệu tổng quan về dự án và vai trò của mình?
> **Trả lời:**
> *"Dạ, dự án Manage Employees là hệ thống quản lý thông tin nhân sự và chứng chỉ tiếng Nhật full-stack được em xây dựng bằng Spring Boot (Java 17) và Next.js (TypeScript). Trên nền source base có sẵn module Auth JWT, em trực tiếp phát triển trọn vẹn luồng nghiệp vụ CRUD nhân viên từ ADM001 đến ADM006, trong đó điểm nhấn là chức năng tìm kiếm, phân trang và sắp xếp động đa cột ở màn hình ADM002, bám sát các tài liệu chuẩn TKDB, TKAPI và Coding Checklist của doanh nghiệp ạ."*

---

### ❓ Câu 2: Tại sao ở Backend em lại dùng `Tuple` trong `createNativeQuery` mà không map thẳng vào Entity?
> **Trả lời:**
> *"Dạ, vì câu truy vấn danh sách nhân viên cần JOIN 4 bảng (`employees`, `departments`, `employees_certifications`, `certifications`) và sử dụng các mệnh đề sắp xếp động của MySQL. Kết quả trả về là tập hợp cột từ nhiều bảng khác nhau chứ không thuộc về một Entity đơn lẻ nào. Việc sử dụng `Tuple` của JPA giúp em trích xuất dữ liệu an toàn theo Tên cột (Column Alias) với cơ chế Type-safe, tránh được rủi ro bị lệch vị trí cột như khi dùng mảng `Object[]` mộc ạ."*

---

### ❓ Câu 3: Làm thế nào em giải quyết bài toán Sắp xếp động nhiều cột (Multi-column sorting)?
> **Trả lời:**
> *"Dạ, ở Frontend, em duy trì một mảng Sort Priority lưu thứ tự các cột được click. Khi gửi lên Backend, em dùng `StringBuilder` để ghép các mệnh đề `ORDER BY` theo đúng thứ tự ưu tiên đó:*
> - *Em dùng `COLLATE utf8mb4_vietnamese_ci` để sort đúng tên tiếng Việt.*
> - *Dùng `CASE WHEN ... IS NULL THEN 1 ELSE 0 END` để đẩy các nhân viên không có chứng chỉ xuống cuối.*
> - *Đặc biệt, em luôn thêm `e.employee_id ASC` ở cuối câu ORDER BY để làm tiêu chí Tie-breaker, đảm bảo dữ liệu phân trang luôn nhất quán, không bị lặp bản ghi giữa các trang ạ."*

---

### ❓ Câu 4: JWT là gì và tại sao lại gọi nó là cơ chế Stateless?
> **Trả lời:**
> *"Dạ, JWT (JSON Web Token) là cơ chế xác thực Stateless gồm 3 phần: Header (thuật toán HMAC-512), Payload (chứa thông tin loginId và hạn dùng), và Signature (chữ ký số tạo từ Secret Key của Server để chống giả mạo).*
> *Nó gọi là Stateless vì toàn bộ thông tin xác thực nằm trong chính Token ở phía Client, Server không cần lưu Session trong bộ nhớ RAM, giúp hệ thống nhẹ nhàng, an toàn và dễ dàng mở rộng nhiều server ạ."*

---

### ❓ Câu 5: Em phân biệt giúp anh/chị giữa `CrudRepository` và `JpaRepository`?
> **Trả lời:**
> *"Dạ, `CrudRepository` cung cấp các phương thức CRUD cơ bản nhất và trả về kiểu `Iterable`. Còn `JpaRepository` kế thừa từ `CrudRepository` và `PagingAndSortingRepository`, bổ sung thêm khả năng phân trang, sắp xếp, trả về trực tiếp kiểu `List` và có thêm các hàm đồng bộ bộ đệm như `flush()`, `saveAndFlush()`, hay xóa theo lô `deleteInBatch()` chuyên biệt cho JPA/Hibernate ạ."*

---

### ❓ Câu 6: Tại sao cần màn hình Xác nhận ADM005 mà không lưu thẳng vào DB từ ADM004?
> **Trả lời:**
> *"Dạ, đây là quy chuẩn trải nghiệm người dùng (UX) rất phổ biến trong các hệ thống phần mềm của Nhật Bản. Đối với dữ liệu nhân sự quan trọng, bước xác nhận ADM005 giúp người dùng kiểm tra lại toàn bộ thông tin một lần nữa trước khi ghi đè vào Database, giảm thiểu tối đa sai sót do nhập liệu nhầm. Dữ liệu giữa ADM004 và ADM005 được truyền an toàn qua `sessionStorage` của trình duyệt ạ."*

---

### ❓ Câu 7: Làm thế nào em đảm bảo an toàn dữ liệu khi Thêm hoặc Xóa một nhân viên có chứng chỉ tiếng Nhật?
> **Trả lời:**
> *"Dạ, vì thông tin nhân viên và chứng chỉ nằm ở 2 bảng khác nhau (`employees` và `employees_certifications`), em sử dụng annotation **`@Transactional`** ở tầng Service. Nếu quá trình lưu hoặc xóa xảy ra bất kỳ lỗi ngoại lệ nào (`BusinessException` hoặc lỗi hệ thống), Spring sẽ tự động Rollback toàn bộ giao dịch về trạng thái ban đầu, đảm bảo không bao giờ bị tình trạng dữ liệu 'rác' hoặc mất tính toàn vẹn dữ liệu ạ."*

---

### ❓ Câu 8: Dự án xử lý lỗi (Error Handling) như thế nào?
> **Trả lời:**
> *"Dạ, hệ thống áp dụng mô hình **Parametric Error Code (ER001 -> ER023)**:*
> - *Ở Backend: Khi phát hiện dữ liệu không hợp lệ hoặc không tìm thấy bản ghi, hệ thống ném `BusinessException(errorCode, params)` và được **`GlobalExceptionHandler`** bắt lại, trả về cấu trúc JSON chuẩn `{ code: 500, message: { code: "ERxxx", params: [...] } }`.*
> - *Ở Frontend: Tầng Client có hàm `formatErrorMessage()` đọc mã lỗi và mảng params để thay thế động vào chuỗi thông báo hiển thị cho người dùng, giúp thông điệp lỗi luôn chính xác và dễ dàng đa ngôn ngữ (i18n) ạ."*

---

### ❓ Câu 9: Nếu hệ thống có 1 triệu bản ghi nhân viên, em sẽ tối ưu chức năng Tìm kiếm và Sắp xếp như thế nào?
> **Trả lời:**
> *"Dạ, với dữ liệu lớn 1 triệu bản ghi:*
> 1. * **Về Index:** Em sẽ đánh Index dạng **Composite Index** trên các cột hay tìm kiếm và sắp xếp: `(department_id, employee_name)` và `(employee_role, employee_id)`.*
> 2. * **Về Phân trang:** Tránh `OFFSET` quá lớn bằng kỹ thuật **Keyset Pagination (Seek Method)** thay cho `LIMIT/OFFSET` truyền thống.*
> 3. * **Về Tìm kiếm văn bản:** Cân nhắc sử dụng **Full-Text Search Index** của MySQL hoặc tích hợp **Elasticsearch** thay cho câu lệnh `LIKE %...%` để tăng tốc độ tìm kiếm văn bản lên hàng chục lần ạ."*

---

### 💡 3 Mẹo Tâm Lý Khi Phỏng Vấn:
1. **Nói có cấu trúc:** Luôn trả lời theo công thức: *Định nghĩa ngắn gọn $\rightarrow$ Áp dụng vào dự án ở đâu $\rightarrow$ Lợi ích mang lại*.
2. **Thành thật & Tự tin:** Nếu gặp câu hỏi chưa biết, hãy trả lời: *"Dạ phần này hiện tại em chưa có dịp tìm hiểu sâu, nhưng theo logic của em thì hướng tiếp cận có thể là... Sau buổi hôm nay em sẽ tìm hiểu kỹ hơn về chủ đề này ạ."*
3. **Nhấn mạnh vào Clean Code & Quy trình:** Nhắc đến việc tuân thủ Checklist, viết Unit Test và kiểm soát mã lỗi để thể hiện tác phong lập trình chuyên nghiệp.
