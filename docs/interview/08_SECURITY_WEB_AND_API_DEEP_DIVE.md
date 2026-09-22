# 🛡️ PHẦN 8: BẢO MẬT WEB, CORS, CSRF, REST API & BỘ CÂU HỎI TƯƠNG TỰ HAY GẶP

Tài liệu này tập hợp các khái niệm về **Bảo mật Web (CORS, CSRF, XSS, SQL Injection)**, **Giao thức HTTP / REST API**, và các câu hỏi phỏng vấn tương tự có tính đào sâu bản chất hệ thống.

---

## 🌐 1. TỔNG QUAN VỀ CORS & PREFLIGHT REQUEST

### ❓ 1. CORS là gì và tại sao cần `@CrossOrigin`?
* **Same-Origin Policy (SOP):** Cơ chế bảo mật mặc định của trình duyệt chặn các request giữa 2 nguồn gốc khác nhau (`Protocol + Domain + Port`).
* **Cross-Origin trong dự án:** Frontend chạy cổng `3000`, Backend chạy cổng `8085` $\rightarrow$ khác cổng (Cross-origin) nên bị chặn nếu không cấu hình CORS.
* **`@CrossOrigin(origins = "*")`:** Báo cho Spring Boot thêm header `Access-Control-Allow-Origin: *` vào HTTP Response, cho phép Frontend gọi API mà không bị trình duyệt chặn.

---

### ❓ 2. Preflight Request (HTTP OPTIONS) là gì?
* **Hiện tượng:** Khi xem tab Network (F12) trên trình duyệt, trước mỗi request `POST`, `PUT`, `DELETE` hoặc request có gắn header `Authorization: Bearer`, bạn sẽ thấy trình duyệt tự động gửi một request **`OPTIONS`** lên server trước.
* **Bản chất:** Đây gọi là **Preflight Request (Request thăm dò)**. Trình duyệt gửi lên để hỏi Server: *"Tôi chuẩn bị gửi request POST/PUT kèm JWT Token này, Server có cho phép không?"*.
* **Xử lý Backend:** Spring Security và CORS Filter phải cấu hình cho phép các request `OPTIONS` này đi qua (`permitAll()`), nếu không request thật sẽ bị chặn ngay từ vòng gửi xe.

---

## 🛡️ 2. PHÂN BIỆT CÁC LỖI BẢO MẬT KINH ĐIỂN: CORS vs CSRF vs XSS vs SQL INJECTION

| Thuật ngữ | Bản chất là gì? | Cơ chế tấn công | Cách dự án phòng chống |
| :--- | :--- | :--- | :--- |
| **CORS** *(Cross-Origin Resource Sharing)* | **Cơ chế chia sẻ tài nguyên** (Không phải lỗi bảo mật, mà là chính sách bảo vệ của Trình duyệt). | Trình duyệt chặn các trang web lạ tự ý đọc dữ liệu từ server khác. | Sử dụng `@CrossOrigin` hoặc cấu hình `WebMvcConfigurer` cho phép domain Frontend. |
| **CSRF** *(Cross-Site Request Forgery)* | **Tấn công mạo danh người dùng** (Lừa người dùng bấm link độc để gửi request mạo danh kèm Cookie Session). | Hacker tạo web giả mạo lợi dụng Cookie tự động gửi kèm của trình duyệt để chuyển tiền / đổi mật khẩu. | **Trong dự án:** Sử dụng **JWT gửi qua Header** (Stateless) thay vì Cookie Session $\rightarrow$ Miễn nhiễm 100% với CSRF $\rightarrow$ Ta có thể tắt an toàn bằng `http.csrf().disable()`. |
| **XSS** *(Cross-Site Scripting)* | **Tấn công chèn mã độc JavaScript**. | Hacker nhập `<script>cắp_token()</script>` vào ô nhập tên nhân viên để lừa trình duyệt người khác chạy. | • **React / Next.js:** Tự động encode/escape toàn bộ ký tự HTML khi render lên UI.<br>• **Zod & Backend Validator:** Kiểm tra định dạng dữ liệu đầu vào. |
| **SQL Injection** | **Tấn công chèn câu lệnh SQL trái phép**. | Hacker nhập `' OR 1=1 --` vào ô tìm kiếm để hack toàn bộ Database. | • Sử dụng **PreparedStatement / Named Parameters (`:param`)** trong Spring Data JPA.<br>• Escape dấu `%` và `_` trong mệnh đề `LIKE BINARY`. |

---

## 📡 3. BỘ CÂU HỎI PHỎNG VẤN TƯƠNG TỰ VỀ REST API & SPRING SECURITY

---

### ❓ Câu 1: Tại sao trong `SecurityConfiguration.java` lại cấu hình `http.csrf().disable()`?
> **Trả lời:**
> *"Dạ, cơ chế bảo vệ CSRF của Spring Security sinh ra để bảo vệ các ứng dụng sử dụng **Session lưu trong Cookie** (vì trình duyệt tự động gửi cookie kèm theo request). Còn dự án của em sử dụng **REST API Stateless kết hợp JWT lưu trong Header `Authorization: Bearer`**. Hacker không thể tự động đính kèm JWT header này từ một trang web giả mạo được, vì thế việc tắt CSRF (`http.csrf().disable()`) là hoàn toàn an toàn và chuẩn mực cho các ứng dụng Stateless JWT ạ."*

---

### ❓ Câu 2: Em phân biệt giúp anh/chị mã lỗi HTTP `401 Unauthorized` và `403 Forbidden`?
> **Trả lời:**
> - **401 Unauthorized (Chưa xác thực danh tính):** Xảy ra khi người dùng **chưa đăng nhập** hoặc gửi kèm **JWT Token không hợp lệ / đã hết hạn**.
> - **403 Forbidden (Không đủ quyền hạn):** Xảy ra khi người dùng **đã đăng nhập thành công** (Token hợp lệ), nhưng tài khoản không có quyền truy cập vào tài nguyên đó (Ví dụ: Tài khoản có role là *User* cố tình gọi API xóa tài khoản của *Admin*).

---

### ❓ Câu 3: Tính chất Idempotent (Bất biến) trong RESTful API là gì?
> **Trả lời:**
> - Một phương thức HTTP được gọi là **Idempotent** nếu bạn gửi request đó 1 lần hay $100$ lần liên tiếp thì **trạng thái dữ liệu trên Server vẫn không thay đổi**.
> - **Các method Idempotent:**
>   - `GET`: Chỉ đọc, gọi bao nhiêu lần dữ liệu vẫn vậy.
>   - `PUT`: Cập nhật toàn bộ, gửi cùng một payload nhiều lần thì dữ liệu trong DB vẫn nhận giá trị đó.
>   - `DELETE`: Xóa bản ghi với ID = 5, xóa 1 lần hay nhiều lần thì bản ghi ID = 5 vẫn đã bị xóa.
> - **Method KHÔNG Idempotent:** `POST` (mỗi lần gửi `POST` là tạo ra 1 bản ghi mới với ID mới).

---

### ❓ Câu 4: Vấn đề N+1 Query trong JPA/Hibernate là gì và trong dự án em phòng tránh thế nào?
> **Trả lời:**
> - **Vấn đề N+1:** Xảy ra khi bạn query 1 danh sách gồm $N$ nhân viên, sau đó trong vòng lặp bạn gọi `employee.getDepartment().getName()`. Hibernate sẽ chạy thêm $N$ câu lệnh `SELECT` phụ để lấy phòng ban của từng nhân viên $\rightarrow$ Tổng cộng chạy $1 + N$ câu query $\rightarrow$ Gây nghẽn Database.
> - **Cách phòng tránh trong dự án:**
>   1. Đặt `@ManyToOne(fetch = FetchType.LAZY)` để tránh Hibernate tự động JOIN ngầm không kiểm soát.
>   2. Khi lấy danh sách ở màn hình ADM002, em sử dụng **Native Query với mệnh đề `INNER JOIN departments d` trong 1 câu SQL duy nhất**, lấy toàn bộ thông tin nhân viên và phòng ban trong 1 lần truy vấn, loại bỏ hoàn toàn vấn đề N+1 ạ.

---

### ❓ Câu 5: Connection Pool là gì và tại sao dự án dùng HikariCP?
> **Trả lời:**
> - Mỗi lần mở một kết nối mới tới MySQL tốn rất nhiều thời gian (bắt tay TCP, xác thực tài khoản).
> - **Connection Pool (Bể chứa kết nối):** Khởi tạo sẵn một số lượng kết nối nhất định (ví dụ 20 kết nối trong `application-dev.yaml`) và giữ sẵn ở đó. Khi có request tới, ứng dụng mượn kết nối từ Pool dùng xong thì trả lại chứ không đóng kết nối.
> - **HikariCP:** Là thư viện Connection Pool mặc định của Spring Boot, có tốc độ xử lý nhanh nhất hiện nay, tiêu tốn ít RAM và có cơ chế kiểm tra kết nối rò rỉ (`leakDetectionThreshold`) rất an toàn ạ.

---

### 🗣️ Kịch Bản Trả Lời "Nói Mồm" Tổng Hợp (Về Bảo Mật & API):

> *"Dạ, về khía cạnh bảo mật và thiết kế API trong dự án:*
> 1. * **Giao tiếp Cross-Origin:** Em sử dụng `@CrossOrigin` để cho phép Frontend Next.js ở port 3000 gọi API ở port 8085 an toàn.*
> 2. * **Chống tấn công:** Em tắt CSRF vì hệ thống sử dụng Stateless JWT Header; sử dụng Prepared Statement trong JPA để chống SQL Injection; và tận dụng cơ chế auto-escape của React kết hợp Zod schema để triệt tiêu nguy cơ XSS.*
> 3. * **Tối ưu Database:** Em sử dụng HikariCP để quản lý Connection Pool hiệu quả và dùng Native Query JOIN 1 lần duy nhất để triệt tiêu vấn đề N+1 Query của Hibernate ạ."*
