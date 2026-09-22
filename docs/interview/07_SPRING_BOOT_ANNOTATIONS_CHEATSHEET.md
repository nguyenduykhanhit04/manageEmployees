# 🏷️ PHẦN 7: TỪ ĐIỂN & GIẢI THÍCH TOÀN BỘ CÁC ANNOTATION (@) TRONG BACKEND

Tài liệu này hệ thống hóa toàn bộ các Annotation (`@...`) được sử dụng trong Backend **Spring Boot (Java 17)** của dự án, phân loại theo từng nhóm chức năng, kèm bản chất hoạt động và ví dụ thực tế trong source code.

---

## 📑 MỤC LỤC CÁC NHÓM ANNOTATION

1. [Nhóm 1: Spring Core & Stereotype (Quản lý Bean & Tiêm phụ thuộc)](#-nhóm-1-spring-core--stereotype)
2. [Nhóm 2: Spring Web & REST Controller (Giao tiếp HTTP & Routing)](#-nhóm-2-spring-web--rest-controller)
3. [Nhóm 3: JPA & Hibernate (Ánh xạ Cơ sở dữ liệu & Entity)](#-nhóm-3-jpa--hibernate)
4. [Nhóm 4: Spring Data Repository & Transaction](#-nhóm-4-spring-data-repository--transaction)
5. [Nhóm 5: Spring Security & Bảo mật](#-nhóm-5-spring-security--bảo-mật)
6. [Nhóm 6: Lombok (Giảm thiểu Boilerplate Code)](#-nhóm-6-lombok)
7. [Nhóm 7: MapStruct (Mapping dữ liệu tự động)](#-nhóm-7-mapstruct)
8. [Nhóm 8: Xử lý Ngoại lệ tập trung (Exception Handling)](#-nhóm-8-xử-lý-ngoại-lệ-tập-trung)

---

## 🏛️ NHÓM 1: SPRING CORE & STEREOTYPE

Các annotation dùng để khai báo **Spring Bean** và đưa vào **Spring IoC Container (ApplicationContext)** quản lý:

### 1. `@SpringBootApplication`
* **Vị trí:** Đặt trên class chạy chính `MainApplication.java`.
* **Bản chất:** Là annotation tổ hợp gồm 3 annotation:
  - `@Configuration`: Đánh dấu class cấu hình.
  - `@EnableAutoConfiguration`: Tự động cấu hình các thư viện (Hibernate, Tomcat, DataSource) dựa trên file `pom.xml`.
  - `@ComponentScan`: Tự động quét và phát hiện các Bean từ package hiện tại trở xuống.

### 2. `@Component`
* **Ý nghĩa:** Đánh dấu một class là Spring Bean chung (tổng quát).
* **Trong dự án:** Đặt trên `EmployeeValidator.java`, `JwtTokenProvider.java`.

### 3. `@Service`
* **Ý nghĩa:** Đánh dấu class thuộc **tầng Nghiệp vụ (Business Layer)**. Về bản chất nó là một `@Component` chuyên biệt cho Service.
* **Trong dự án:** Đặt trên `EmployeeServiceImpl.java`, `DepartmentServiceImpl.java`.

### 4. `@Repository`
* **Ý nghĩa:** Đánh dấu class/interface thuộc **tầng Truy xuất dữ liệu (Data Access Layer - DAO)**.
* **Tác dụng đặc biệt:** Tự động bắt và chuyển đổi các ngoại lệ cấp thấp của JDBC/Hibernate (`SQLException`) sang ngoại lệ chuẩn của Spring (`DataAccessException`).
* **Trong dự án:** Đặt trên `EmployeeRepository.java`, `EmployeeRepositoryCustomImpl.java`.

### 5. `@Configuration` và `@Bean`
* **`@Configuration`:** Đánh dấu một class chứa các phương thức định nghĩa cấu hình Bean (như `SecurityConfiguration.java`).
* **`@Bean`:** Đặt trên một phương thức để bảo Spring: *"Hãy chạy hàm này và lấy đối tượng trả về đăng ký thành 1 Bean trong IoC Container"*.
  - Ví dụ: `@Bean public PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }`.

### 6. `@Autowired`
* **Ý nghĩa:** Dùng để **tiêm phụ thuộc (Dependency Injection - DI)** một Bean khác vào class hiện tại.
* **Lưu ý chuẩn Clean Code:** Trong dự án, ta ưu tiên dùng **Constructor Injection** kết hợp `@RequiredArgsConstructor` thay vì `@Autowired` trực tiếp trên field để dễ viết Unit Test và đảm bảo tính bất biến (Immutability).

---

## 🌐 NHÓM 2: SPRING WEB & REST CONTROLLER

Dùng để xây dựng các RESTful API và tiếp nhận request từ Frontend:

### 1. `@RestController`
* **Bản chất:** Tổ hợp của `@Controller` + `@ResponseBody`.
* **Tác dụng:** Mọi phương thức trong Controller này sẽ **tự động trả về dữ liệu thuần (JSON/XML)** qua HTTP Response Body chứ không trả về trang giao diện HTML (JSP/Thymeleaf).
* **Trong dự án:** Đặt trên `EmployeeController.java`, `AuthController.java`.

### 2. `@RequestMapping("/api")`
* **Ý nghĩa:** Định nghĩa tiền tố đường dẫn URL chung cho tất cả các endpoint trong Controller đó.

### 3. `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping`
* **Ý nghĩa:** Ánh xạ các phương thức HTTP tương ứng:
  - `@GetMapping("/employees")`: Lấy dữ liệu (Read).
  - `@PostMapping("/employee")`: Tạo mới dữ liệu (Create).
  - `@PutMapping("/employee/{id}")`: Cập nhật toàn bộ dữ liệu (Update).
  - `@DeleteMapping("/employee/{id}")`: Xóa dữ liệu (Delete).

### 4. `@RequestParam`
* **Ý nghĩa:** Lấy tham số truyền qua **Query String** trên URL (sau dấu `?`).
* **Ví dụ:** `/api/employees?employee_name=Nam&offset=0&limit=5`
  $\rightarrow$ `@RequestParam(name = "employee_name", required = false) String employeeName`.

### 5. `@PathVariable`
* **Ý nghĩa:** Rút trích biến nằm trực tiếp trên **đường dẫn URL (Path Parameter)**.
* **Ví dụ:** `/api/employee/15`
  $\rightarrow$ `@PathVariable("employeeId") Long employeeId`.

### 6. `@RequestBody`
* **Ý nghĩa:** Đọc chuỗi JSON trong **HTTP Request Body** do Frontend gửi lên và tự động chuyển đổi (Deserialize) thành đối tượng Java.
* **Ví dụ:** `@RequestBody EmployeeSaveRequest request`.

---

## 🗄️ NHÓM 3: JPA & HIBERNATE (ENTITY & ORM)

Dùng để ánh xạ các bảng cơ sở dữ liệu MySQL thành Java Class:

### 1. `@Entity`
* **Ý nghĩa:** Báo cho JPA/Hibernate biết class này là một **thực thể ánh xạ với một bảng trong Database**.
* **Trong dự án:** `EmployeeEntity.java`, `DepartmentEntity.java`.

### 2. `@Table(name = "employees")`
* **Ý nghĩa:** Chỉ định chính xác tên bảng vật lý trong MySQL mà Entity này đại diện.

### 3. `@Id` và `@GeneratedValue`
* **`@Id`:** Đánh dấu trường này là **Khóa chính (Primary Key)** của bảng.
* **`@GeneratedValue(strategy = GenerationType.IDENTITY)`:** Khóa chính được cơ sở dữ liệu tự động tăng (`AUTO_INCREMENT` trong MySQL).

### 4. `@Column`
* **Ý nghĩa:** Cấu hình chi tiết cho cột trong bảng:
  - `name`: Tên cột trong DB (`employee_name`).
  - `nullable = false`: Ràng buộc `NOT NULL`.
  - `unique = true`: Ràng buộc `UNIQUE` (không được trùng lặp).
  - `length = 255`: Độ dài tối đa của chuỗi `VARCHAR`.

### 5. `@ManyToOne(fetch = FetchType.LAZY)` & `@JoinColumn`
* **`@ManyToOne`:** Thiết lập quan hệ **Nhiều - Một** (Nhiều nhân viên thuộc về 1 phòng ban).
* **`fetch = FetchType.LAZY`:** Cơ chế tải lười — chỉ khi nào bạn gọi `employee.getDepartment()` thì Hibernate mới thực sự chạy câu SQL lấy phòng ban, giúp tối ưu hiệu năng.
* **`@JoinColumn(name = "department_id")`:** Chỉ định tên cột khóa ngoại (Foreign Key) trong bảng `employees`.

---

## 📊 NHÓM 4: SPRING DATA REPOSITORY & TRANSACTION

### 1. `@PersistenceContext`
* **Ý nghĩa:** Dùng để tiêm đối tượng **`EntityManager`** chuẩn của JPA vào Repository Custom.
* **Đặc tính:** Đảm bảo an toàn đa luồng (Thread-safe) bằng cách cấp phát một EntityManager Proxy riêng cho từng Transaction.
* **Trong dự án:** `EmployeeRepositoryCustomImpl.java`.

### 2. `@Query(value = "...", nativeQuery = true)`
* **Ý nghĩa:** Định nghĩa câu truy vấn tùy biến gắn trực tiếp trên Interface.
* **`nativeQuery = true`:** Cho phép viết câu lệnh SQL thuần của MySQL thay vì JPQL.
* **Trong dự án:** Hàm `countEmployees()` trong `EmployeeRepository.java`.

### 3. `@Param("name")`
* **Ý nghĩa:** Gán tên tham số trong hàm Java tương ứng với biến `:name` trong câu SQL của `@Query`, chống tấn công SQL Injection.

### 4. `@Transactional`
* **Ý nghĩa:** Đánh dấu phương thức phải được thực thi trong một **Giao dịch Cơ sở dữ liệu (Transaction)**.
* **Bản chất (ACID):** Đảm bảo tính toàn vẹn. Nếu trong hàm có 3 câu lệnh lưu DB mà câu số 3 bị lỗi $\rightarrow$ Spring sẽ **tự động Rollback** 2 câu lệnh trước đó về trạng thái ban đầu.
* **Trong dự án:** Áp dụng ở các hàm Thêm/Sửa/Xóa nhân viên và chứng chỉ trong `EmployeeServiceImpl.java`.

---

## 🔒 NHÓM 5: SPRING SECURITY & BẢO MẬT

### 1. `@EnableWebSecurity`
* **Ý nghĩa:** Kích hoạt tính năng bảo mật phân quyền của Spring Security trên toàn bộ ứng dụng Web.

### 2. `@PreAuthorize("hasRole('ADMIN')")`
* **Ý nghĩa:** Kiểm tra quyền hạn của người dùng trước khi cho phép thực thi method (phương thức bảo mật mức method-level).

---

## ☕ NHÓM 6: LOMBOK (GIẢM BOILERPLATE CODE)

Lombok sinh mã nguồn tự động lúc biên dịch (Compile-time) giúp code cực kỳ ngắn gọn:

| Annotation | Ý nghĩa |
| :--- | :--- |
| **`@Getter` / `@Setter`** | Tự động sinh toàn bộ hàm `getXxx()` và `setXxx()` cho các thuộc tính `private`. |
| **`@NoArgsConstructor`** | Tự động sinh hàm khởi tạo (Constructor) không tham số rỗng. Bắt buộc cần cho JPA Entity. |
| **`@AllArgsConstructor`** | Tự động sinh Constructor nhận đầy đủ tất cả các tham số. |
| **`@RequiredArgsConstructor`** | Tự động sinh Constructor cho các thuộc tính được khai báo `final`. Dùng cho Dependency Injection. |
| **`@Data`** | Tổ hợp của `@Getter`, `@Setter`, `@ToString`, `@EqualsAndHashCode`, và `@RequiredArgsConstructor`. |
| **`@Builder`** | Áp dụng Design Pattern Builder, cho phép khởi tạo object linh hoạt dạng chuỗi: `EmployeeDTO.builder().name("A").build()`. |

---

## 🗺️ NHÓM 7: MAPSTRUCT (MAPPING DỮ LIỆU)

### 1. `@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)`
* **`componentModel = "spring"`:** Tự động đăng ký Interface Mapper thành một **Spring Bean** để có thể inject vào Service.
* **`unmappedTargetPolicy = ReportingPolicy.IGNORE`:** Bỏ qua các trường không map được mà không báo lỗi biên dịch.

### 2. `@Mapping(target = "...", source = "...", dateFormat = "...")`
* **`target` / `source`:** Ánh xạ trường nguồn sang trường đích (ví dụ: gán `departmentId` vào `department.departmentId`).
* **`dateFormat = "yyyy/MM/dd"`:** Tự động chuyển đổi kiểu `String` sang `LocalDate/Date` theo đúng định dạng.
* **`ignore = true`:** Bỏ qua không map trường này (ví dụ bỏ qua danh sách `certifications`).

---

## 🚨 NHÓM 8: XỬ LÝ NGOẠI LỆ TẬP TRUNG (EXCEPTION HANDLING)

### 1. `@RestControllerAdvice`
* **Bản chất:** Tổ hợp của `@ControllerAdvice` + `@ResponseBody`.
* **Tác dụng:** Đóng vai trò như một **"Lưới bắt lỗi toàn cầu" (Global Interceptor)**. Bất kỳ Exception nào bị ném ra từ tất cả các Controller trong hệ thống đều sẽ rơi vào đây để xử lý tập trung, không để lỗi 500 sập app lộ ra cho người dùng.

### 2. `@ExceptionHandler(BusinessException.class)`
* **Ý nghĩa:** Chỉ định phương thức bên dưới sẽ chuyên bắt và xử lý loại ngoại lệ cụ thể (ví dụ `BusinessException`).

---

### 🗣️ Kịch Bản Trả Lời Phỏng Vấn (Tóm Tắt Về Annotation):

> *"Dạ, trong dự án Backend Spring Boot, em sử dụng các nhóm Annotation chuẩn mực:*
> 1. * **Tầng Kiến trúc & IoC:** `@RestController`, `@Service`, `@Repository` để phân tầng rõ ràng và đăng ký Spring Bean.*
> 2. * **Tầng ORM & DB:** `@Entity`, `@Table`, `@Id`, `@ManyToOne(LAZY)` để ánh xạ quan hệ bảng và `@Transactional` để đảm bảo tính toàn vẹn giao dịch.*
> 3. * **Tầng Xử lý lỗi:** `@RestControllerAdvice` và `@ExceptionHandler` để bắt lỗi tập trung toàn hệ thống.*
> 4. * **Tối ưu mã nguồn:** Sử dụng **Lombok** (`@Getter`, `@Setter`, `@RequiredArgsConstructor`) và **MapStruct** (`@Mapper`) để sinh mã nguồn tự động lúc biên dịch, giúp code sạch và đạt hiệu năng cao nhất ạ."*
