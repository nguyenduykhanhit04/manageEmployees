# 🧠 PHẦN 4: GIẢI THÍCH CHUYÊN SÂU CÁC KHÁI NIỆM KỸ THUẬT (DEEP-DIVE)

Tài liệu này giải thích tường tận bản chất bên dưới của các công nghệ, annotation và kỹ thuật được sử dụng trong dự án, giúp bạn trả lời các câu hỏi kỹ thuật hóc búa nhất.

---

## 🧩 1. Bản Chất của `Tuple` trong JPA & Quá Trình Mapping DTO

### ❓ `Tuple` là gì?
- **Nguồn gốc:** Trong lý thuyết cơ sở dữ liệu quan hệ, một dòng dữ liệu (Row / Record) được gọi là một **Tuple** (một bộ gồm các cặp `[Tên thuộc tính : Giá trị]`).
- **Trong JPA 2.0+:** `javax.persistence.Tuple` là một interface đại diện cho **một dòng dữ liệu trả về từ câu truy vấn**, cho phép truy xuất dữ liệu bằng **Tên bí danh của cột (Column Alias)** với cơ chế **Type-safe**.

### ❓ So sánh: `Entity` vs `Object[]` vs `Tuple`

| Tiêu chí | `Entity` (@Entity) | `Object[]` (Mảng thô) | `Tuple` (JPA) |
| :--- | :--- | :--- | :--- |
| **Áp dụng khi nào?** | Khi câu query chỉ lấy từ đúng 1 bảng | Khi query JOIN nhiều bảng (Cách cũ JPA 1.0) | **Khi câu query JOIN nhiều bảng (Cách chuẩn)** |
| **Cách lấy dữ liệu** | Qua hàm getter `entity.getName()` | Phải nhớ chỉ số index `row[0]`, `row[1]` | **Lấy bằng tên cột:** `tuple.get("employee_name")` |
| **Độ an toàn (Type-safe)** | Rất cao | Rất kém, dễ crash khi đổi thứ tự cột | **Rất cao:** `tuple.get("name", String.class)` |

### ❓ Tại sao đã SELECT đủ cột giống DTO mà vẫn phải viết `new EmployeeDTO(...)`?
1. **Khác biệt về môi trường:** Database (MySQL) và Java là 2 hệ thống khác nhau. MySQL chỉ trả về các byte thô, JPA bọc vào `Tuple`. Java bắt buộc phải có bước khởi tạo Object Java trong RAM (`new EmployeeDTO`).
2. **Khác biệt về kiểu dữ liệu:** Ngày sinh trong DB là `java.sql.Date`, nhưng DTO cần kiểu chuỗi `String` chuẩn `"yyyy/MM/dd"`. Hàm mapping làm nhiệm vụ chuyển đổi định dạng và chống lỗi `NullPointerException`.
3. **Đặc thù của Native SQL:** JPA **không hỗ trợ** cú pháp `SELECT new com...EmployeeDTO(...)` khi chạy Native SQL, nên việc map thủ công từ `Tuple` sang `EmployeeDTO` là giải pháp an toàn và tối ưu nhất.

---

## 🗄️ 2. `CrudRepository` vs `JpaRepository` vs `JPA Thuần`

### 🌳 Cây kế thừa trong Spring Data:
```text
Repository (Interface đánh dấu rỗng)
   └── CrudRepository (Các hàm CRUD cơ bản: save, findById, delete...)
         └── PagingAndSortingRepository (Bổ sung Phân trang & Sắp xếp)
               └── JpaRepository (Bổ sung: flush, saveAndFlush, deleteInBatch, trả về List)
```

- **JPA Thuần:** Là chuẩn đặc tả (Specification). Nếu dùng thuần, bạn phải tự quản lý `EntityManager`, tự mở/đóng transaction, tự viết JPQL thủ công.
- **`CrudRepository`:** Interface của Spring Data JPA tự động hóa các hàm CRUD cơ bản (trả về kiểu `Iterable<T>`).
- **`JpaRepository`:** Kế thừa toàn bộ `CrudRepository` + `PagingAndSortingRepository`, chuyên biệt cho JPA: trả về `List<T>`, có thêm các hàm đồng bộ bộ đệm (`flush()`, `saveAndFlush()`) và xóa theo lô (`deleteAllInBatch()`).

---

## ⚡ 3. Tại Sao Sử Dụng `StringBuilder` trong Repository Custom?

- **Vấn đề của `String` thông thường:** `String` trong Java là **bất biến (Immutable)**. Mỗi khi dùng toán tử cộng chuỗi `+` hoặc `sql += " WHERE..."`, JVM sẽ cấp phát một vùng nhớ mới trên Heap Memory, sinh ra rất nhiều đối tượng rác (Garbage Collection phải dọn dẹp liên tục).
- **`StringBuilder` (Mutable):** Cho phép nối các mệnh đề SQL (`WHERE`, `ORDER BY`, `LIMIT`) trực tiếp trên cùng một vùng nhớ đệm thông qua `.append()`, **không sinh rác, tối ưu RAM và tăng tốc độ xử lý câu query động**.

---

## 🔄 4. Mối Quan Hệ Giữa Request Payload $\leftrightarrow$ Entity $\leftrightarrow$ DTO & Vai Trò Của MapStruct

```text
       [Request Payload] ──(MapStruct: toEntity)──► [Entity] ──► [Database]
                                                       │
       [Frontend] ◄── [Response Payload] ◄── [DTO] ◄───┘ (MapStruct: toDetailDTO)
```

| Đối tượng | Trách nhiệm |
| :--- | :--- |
| **Request Payload** | Đại diện cho dữ liệu người dùng gửi từ Form lên API (ví dụ: `EmployeeSaveRequest`). |
| **Entity** | Ánh xạ trực tiếp với bảng trong Database, chứa khóa chính, quan hệ `@ManyToOne` (ví dụ: `EmployeeEntity`). |
| **DTO** | Dữ liệu sạch được chọn lọc, format ngày tháng, ẩn trường nhạy cảm để trả về Client (ví dụ: `EmployeeDTO`). |
| **MapStruct** | Thư viện **sinh mã nguồn lúc Biên dịch (Compile-time)** tự động tạo các hàm sao chép trường dữ liệu giữa các Object mà không dùng Reflection, tốc độ thực thi nhanh tương đương code tay. |

---

## 🧱 5. Ứng Dụng 4 Tính Chất OOP Trong Source Code Dự Án

| Tính chất OOP | Ứng dụng cụ thể trong dự án | File minh chứng |
| :--- | :--- | :--- |
| **1. Đóng gói (Encapsulation)** | Toàn bộ thuộc tính trong Entity/DTO đều là `private`, chỉ truy xuất qua `Getter/Setter`. Các hàm xử lý nội bộ trong Repository/Service đều để `private`. | `EmployeeEntity.java`<br>`EmployeeDTO.java` |
| **2. Kế thừa (Inheritance)** | `BusinessException` kế thừa từ `RuntimeException`. Các Repository kế thừa từ `JpaRepository`. | `BusinessException.java`<br>`EmployeeRepository.java` |
| **3. Đa hình (Polymorphism)** | • **Đa hình Exception:** `GlobalExceptionHandler` bắt lớp cha `Exception` để xử lý đa hình mọi lỗi con.<br>• **Interface & Impl:** Controller gọi `EmployeeService`, lúc chạy thật tiêm `EmployeeServiceImpl`, lúc test tiêm `Mock Service`.<br>• **Method Overloading:** Hàm `formatDate()` nhận cả `Date` lẫn `LocalDate`. | `GlobalExceptionHandler.java`<br>`EmployeeServiceImpl.java` |
| **4. Trừu tượng (Abstraction)** | Ẩn chi tiết câu truy vấn SQL phức tạp đằng sau các Interface `EmployeeService` và `EmployeeRepository`. | `EmployeeService.java`<br>`EmployeeRepository.java` |

---

## 🔐 6. Bản Chất JWT (JSON Web Token) & Cơ Chế Xác Thực

### 🔹 Cấu trúc 3 phần: `Header . Payload . Signature`
1. **Header (Base64Url):** Khai báo thuật toán mã hóa (trong dự án dùng **`HMAC-SHA512`**).
2. **Payload (Base64Url):** Chứa thông tin User (`loginId`, `employeeId`, thời hạn `exp`). **Không chứa mật khẩu**.
3. **Signature (Chữ ký điện tử):** 
   $$\text{Signature} = \text{HMAC-SHA512}\Big(\ \text{Header} + "." + \text{Payload}\ ,\ \textbf{Constants.JWT\_SECRET}\ \Big)$$
   * Đảm bảo **chống giả mạo 100%**: Nếu Hacker sửa Payload, Signature sẽ không khớp với Secret Key của Server và bị từ chối ngay.

### 🔹 Phân biệt Server Session và Client `sessionStorage`:
- **Server Stateless:** Server Spring Boot **không lưu Session trong RAM**, giúp hệ thống nhẹ và dễ scale.
- **Client `sessionStorage`:** Nằm trên trình duyệt của người dùng, dùng để cất giữ token tạm thời và truyền dữ liệu form giữa màn hình ADM004 $\rightarrow$ ADM005. Khi đóng tab, `sessionStorage` tự động bị xóa.
