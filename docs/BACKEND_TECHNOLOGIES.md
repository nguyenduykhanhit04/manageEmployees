# 📚 TỔNG HỢP CÔNG NGHỆ & DEPENDENCY TRONG BACKEND (`pom.xml`)

Tài liệu này tổng hợp toàn bộ các công nghệ, thư viện (dependencies) được khai báo trong file [`backend/pom.xml`](file:///c:/LARG05/03.Output/09.Project/03.BaiTapCuoiKhoa/SRC/manageEmployees/backend/pom.xml), vai trò của chúng và danh sách chi tiết các **Annotation / Lớp (Classes) / Tính năng** mà bạn thực tế sử dụng trong dự án.

---

## 📋 BẢNG TỔNG QUAN CÔNG NGHỆ

| STT | Tên Dependency / Công nghệ | GroupId : ArtifactId | Vai trò chính |
| :---: | :--- | :--- | :--- |
| **1** | **Spring Boot Starter Parent** (v2.7.8) | `org.springframework.boot:spring-boot-starter-parent` | Quản lý phiên bản dependencies & cấu hình build chuẩn |
| **2** | **Spring Boot Starter Web** | `org.springframework.boot:spring-boot-starter-web` | Xây dựng RESTful API, nhúng Tomcat & Jackson xử lý JSON |
| **3** | **Spring Boot Starter Data JPA** | `org.springframework.boot:spring-boot-starter-data-jpa` | Tương tác Cơ sở dữ liệu qua Hibernate ORM & JPQL/Native SQL |
| **4** | **Spring Boot Starter Security** | `org.springframework.boot:spring-boot-starter-security` | Xác thực (Authentication), Phân quyền (RBAC) & Mã hóa |
| **5** | **Spring Boot Starter Validation** | `org.springframework.boot:spring-boot-starter-validation` | Kiểm tra tính hợp lệ của dữ liệu đầu vào (Bean Validation) |
| **6** | **Flyway MySQL** | `org.flywaydb:flyway-mysql` | Quản lý phiên bản & tự động cập nhật cấu trúc Database (Migration) |
| **7** | **MySQL Connector/J** (v8.0.32) | `com.mysql:mysql-connector-j` | Trình điều khiển JDBC kết nối Java với MySQL 8 |
| **8** | **HikariCP** (v5.0.1) | `com.zaxxer:HikariCP` | Quản lý hồ bơi kết nối cơ sở dữ liệu (Connection Pool) hiệu năng cao |
| **9** | **Auth0 Java JWT** (v4.0.0) | `com.auth0:java-jwt` | Sinh chuỗi, mã hóa và xác thực chữ ký JWT Token |
| **10** | **MapStruct** (v1.5.3.Final) | `org.mapstruct:mapstruct` | Tự động ánh xạ dữ liệu (mapping) giữa Entity và DTO tại compile-time |
| **11** | **Lombok** | `org.projectlombok:lombok` | Tự sinh Getter, Setter, Constructor... giảm thiểu boilerplate code |
| **12** | **Spring Boot DevTools** | `org.springframework.boot:spring-boot-devtools` | Tự động reload ứng dụng khi thay đổi mã nguồn trong lúc phát triển |
| **13** | **Configuration Processor** | `org.springframework.boot:spring-boot-configuration-processor` | Hỗ trợ gợi ý tự động khi viết cấu hình trong `application.yml` |
| **14** | **Spring Boot Starter Test** | `org.springframework.boot:spring-boot-starter-test` | Kiểm thử tự động với JUnit 5, Mockito & MockMvc |

---

## 🔍 CHI TIẾT TỪNG DEPENDENCY & NHỮNG GÌ BẠN SỬ DỤNG

---

### 1. `spring-boot-starter-web`
> **Mục đích:** Cung cấp hạ tầng phát triển Web RESTful API và nhúng máy chủ Tomcat.

**Những gì bạn dùng trong code khi cài dependency này:**
- **Controller & Endpoints:**
  - `@RestController`: Đánh dấu class là một REST Controller xử lý HTTP request và trả về JSON.
  - `@RequestMapping`, `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping`: Định tuyến URL cho các API.
  - `@PathVariable`: Lấy tham số động trên đường dẫn URL (ví dụ: `/employee/{employeeId}`).
  - `@RequestParam`: Lấy các query params trên URL (ví dụ: `?employee_name=A&offset=0&limit=20`).
  - `@RequestBody`: Tự động map chuỗi JSON từ body HTTP sang đối tượng Java DTO (`EmployeeSaveRequest`).
  - `@CrossOrigin`: Cấu hình cho phép Frontend (CORS) gọi API từ domain khác.
- **Phản hồi HTTP:**
  - `ResponseEntity<T>`: Đóng gói dữ liệu trả về kèm theo HTTP Status Code (ví dụ: `ResponseEntity.ok()`, `HttpStatus.INTERNAL_SERVER_ERROR`).
- **Xử lý JSON (Jackson Core):**
  - `@JsonProperty("tên_truong")`: Định nghĩa ánh xạ tên trường JSON khác với tên biến trong Java.

---

### 2. `spring-boot-starter-data-jpa`
> **Mục đích:** Kết nối và thao tác với Database thông qua ORM (Hibernate) mà không cần viết JDBC thuần phức tạp.

**Những gì bạn dùng trong code khi cài dependency này:**
- **Khai báo Entity (JPA Annotations):**
  - `@Entity`, `@Table(name = "employees")`: Định nghĩa class tương ứng với bảng trong DB.
  - `@Id`, `@GeneratedValue(strategy = GenerationType.IDENTITY)`: Định nghĩa khóa chính tự tăng.
  - `@Column(name = "employee_name", length = 50)`: Ánh xạ thuộc tính Java vào cột DB.
  - `@ManyToOne`, `@JoinColumn(name = "department_id")`: Thiết lập quan hệ khóa ngoại giữa các bảng.
- **Repository Interface:**
  - `CrudRepository<T, ID>`: Cung cấp sẵn các hàm cơ bản: `save()`, `findById()`, `deleteById()`, `existsById()`.
  - `@Repository`: Đánh dấu tầng truy cập dữ liệu (DAO).
  - Derived Query Methods (Spring sinh câu truy vấn tự động theo tên hàm):
    - `existsByEmployeeLoginId(String loginId)`
    - `findByEmployeeLoginId(String loginId)`
  - Custom Query với `@Query(value = "...", nativeQuery = true)` và `@Param("paramName")`.
- **Custom Native Query & EntityManager:**
  - `@PersistenceContext private EntityManager entityManager;`: Dùng để tự build câu truy vấn SQL động bằng `StringBuilder` và map ra `Tuple.class` (như trong [`EmployeeRepositoryCustomImpl`](file:///c:/LARG05/03.Output/09.Project/03.BaiTapCuoiKhoa/SRC/manageEmployees/backend/src/main/java/com/luvina/la/repository/impl/EmployeeRepositoryCustomImpl.java)).
- **Quản lý Giao dịch:**
  - `@Transactional(rollbackFor = Exception.class)`: Đảm bảo toàn bộ thao tác thêm/sửa/xóa liên bảng thành công cùng lúc; tự động rollback nếu xảy ra lỗi.
  - `@Transactional(readOnly = true)`: Tối ưu hiệu năng khi chỉ đọc dữ liệu.

---

### 3. `spring-boot-starter-security`
> **Mục đích:** Bảo vệ hệ thống API, quản lý xác thực tài khoản và phân quyền người dùng.

**Những gì bạn dùng trong code khi cài dependency này:**
- **Cấu hình Bảo mật:**
  - `SecurityFilterChain`: Khai báo chuỗi filter kiểm soát quyền truy cập API.
  - `HttpSecurity`: Cấu hình tắt CSRF (`.csrf().disable()`), đặt chế độ Stateless Session (`SessionCreationPolicy.STATELESS`), cho phép public API login (`/login`) và bắt buộc có Token với các API còn lại.
- **Mã hóa Mật khẩu:**
  - `PasswordEncoder` / `BCryptPasswordEncoder`:
    - `passwordEncoder.encode("123456")`: Băm mật khẩu người dùng trước khi lưu vào DB.
    - `passwordEncoder.matches(rawPassword, encodedPassword)`: Kiểm tra mật khẩu lúc đăng nhập.
- **Xử lý Filter xác thực (JWT Filter):**
  - `OncePerRequestFilter`: Kế thừa để chặn bắt mọi HTTP Request, đọc Header `Authorization: Bearer <token>`.
  - `UsernamePasswordAuthenticationToken`: Đóng gói thông tin người dùng đã xác thực.
  - `SecurityContextHolder.getContext().setAuthentication(auth)`: Lưu thông tin người dùng vào phiên làm việc hiện tại của luồng (thread).

---

### 4. `spring-boot-starter-validation`
> **Mục đích:** Cung cấp bộ quy chuẩn Bean Validation (JSR-380 / Hibernate Validator) kiểm tra dữ liệu đầu vào.

**Những gì bạn dùng trong code khi cài dependency này:**
- Các Annotation kiểm tra dữ liệu:
  - `@NotNull`: Không được phép null.
  - `@NotBlank`: Không được rỗng hoặc chỉ chứa khoảng trắng.
  - `@Size(min = 1, max = 50)`: Kiểm tra độ dài chuỗi.
  - `@Pattern(regexp = "...")`: Kiểm tra khớp biểu thức chính quy (Regex).
  - `@Valid`: Kích hoạt kiểm tra validation cho một object lồng nhau.
- Dùng cho các tầng Validator chuyên biệt (`EmployeeValidator`) để đối soát tham số trước khi chuyển qua Service.

---

### 5. `flyway-mysql`
> **Mục đích:** Công cụ quản lý di chuyển (Migration) và đồng bộ cấu trúc Database theo mã nguồn dự án.

**Những gì bạn dùng trong code khi cài dependency này:**
- Thư mục quản lý migration: `src/main/resources/db/migration/`.
- Quy chuẩn đặt tên file SQL:
  - `V1__init_schema.sql`: Script tạo bảng ban đầu.
  - `V2__init_schema.sql`: Script chèn dữ liệu mẫu hoặc chỉnh sửa schema.
- **Cách thức hoạt động tự động:** Khi bạn gõ `mvn spring-boot:run`, Flyway sẽ tự động đọc bảng `flyway_schema_history` trong MySQL; nếu có file `V_xxx.sql` mới, Flyway tự chạy lệnh SQL đó vào DB mà bạn không cần mở MySQL Workbench hay DBeaver để chạy thủ công.

---

### 6. `mysql-connector-j`
> **Mục đích:** Driver JDBC giúp ứng dụng Java có thể kết nối vật lý với hệ quản trị cơ sở dữ liệu MySQL 8.x.

**Những gì bạn dùng trong code khi cài dependency này:**
- Không gọi class trực tiếp trong code, mà cấu hình trong file `application.yml` / `application.properties`:
  ```yaml
  spring:
    datasource:
      driver-class-name: com.mysql.cj.jdbc.Driver
      url: jdbc:mysql://localhost:3306/manage_employees?useUnicode=true&characterEncoding=UTF-8
      username: root
      password: your_password
  ```

---

### 7. `HikariCP`
> **Mục đích:** Thư viện Connection Pooling nhanh nhất thế giới cho Java, quản lý các kết nối DB tái sử dụng để tránh tạo mới kết nối liên tục gây chậm hệ thống.

**Những gì bạn dùng trong code khi cài dependency này:**
- Cấu hình thông số pool trong `application.yml`:
  ```yaml
  spring:
    datasource:
      hikari:
        maximum-pool-size: 10
        minimum-idle: 5
        idle-timeout: 300000
        connection-timeout: 20000
        max-lifetime: 1200000
  ```

---

### 8. `java-jwt` (Auth0)
> **Mục đích:** Thư viện chuẩn công nghiệp của Auth0 dùng để tạo, ký mã hóa và giải mã JSON Web Token (JWT).

**Những gì bạn dùng trong code khi cài dependency này:**
- **Tạo JWT Token (khi đăng nhập thành công):**
  ```java
  Algorithm algorithm = Algorithm.HMAC256(secretKey);
  String token = JWT.create()
      .withSubject(employeeLoginId)
      .withClaim("employeeId", employeeId)
      .withIssuedAt(new Date())
      .withExpiresAt(new Date(System.currentTimeMillis() + expirationMs))
      .sign(algorithm);
  ```
- **Giải mã & Kiểm tra chữ ký Token (trong JWT Filter):**
  ```java
  JWTVerifier verifier = JWT.require(Algorithm.HMAC256(secretKey)).build();
  DecodedJWT decodedJWT = verifier.verify(token);
  String loginId = decodedJWT.getSubject();
  ```

---

### 9. `mapstruct` & `mapstruct-processor`
> **Mục đích:** Thư viện Code Generation cực nhanh giúp sao chép dữ liệu giữa DTO và Entity tại thời điểm biên dịch (Compile-time), an toàn kiểu dữ liệu và không làm chậm hệ thống như Reflection.

**Những gì bạn dùng trong code khi cài dependency này:**
- `@Mapper(componentModel = "spring")`: Biến interface Mapper thành một Spring Bean để có thể `@Autowired` hoặc inject qua Constructor.
- `@Mapping(target = "tên_đích", source = "tên_nguồn")`: Cấu hình ánh xạ khi tên thuộc tính hoặc kiểu dữ liệu ở 2 bên khác nhau (ví dụ: `departmentId` -> `department.departmentId`).
- Nhờ có MapStruct, bạn chỉ cần viết interface `EmployeeMapper`, MapStruct sẽ tự động sinh code cài đặt `EmployeeMapperImpl.class` trong thư mục `target/generated-sources`.

---

### 10. `lombok`
> **Mục đích:** Tự động sinh mã nguồn Java tại thời điểm biên dịch, giúp code ngắn gọn, sạch sẽ.

**Những gì bạn dùng trong code khi cài dependency này:**
- `@Data`: Tự sinh toàn bộ Getter, Setter, `toString()`, `equals()`, và `hashCode()`.
- `@Getter`, `@Setter`: Tự sinh Getter / Setter cho từng trường hoặc cả class.
- `@NoArgsConstructor`: Tự sinh Constructor không tham số (bắt buộc cho JPA Entity & Jackson DTO).
- `@AllArgsConstructor`: Tự sinh Constructor có đầy đủ tất cả tham số.
- `@Builder`: Cho phép khởi tạo đối tượng theo mẫu thiết kế Builder pattern.
- `@Slf4j`: Tự động tạo biến `log` để ghi log hệ thống (`log.info(...)`, `log.error(...)`).

---

### 11. `spring-boot-starter-test`
> **Mục đích:** Bộ công cụ kiểm thử toàn diện cho ứng dụng Spring Boot.

**Những gì bạn dùng trong code khi cài dependency này:**
- **JUnit 5 (Jupiter):**
  - `@Test`: Đánh dấu hàm kiểm thử.
  - `Assertions.assertEquals()`, `assertNotNull()`, `assertThrows()`: Đối soát kết quả mong đợi.
- **Mockito:**
  - `@Mock`: Giả lập dữ liệu cho Repository hoặc Service phụ thuộc.
  - `@InjectMocks`: Khởi tạo đối tượng cần test và tự động tiêm các Mock vào.
  - `Mockito.when(...).thenReturn(...)`: Định nghĩa hành vi giả lập.
  - `Mockito.verify(...)`: Kiểm tra xem một hàm có được gọi hay không.
- **Spring Test & MockMvc:**
  - `@SpringBootTest`: Chạy kiểm thử có nạp toàn bộ Spring Context.
  - `MockMvc`: Giả lập gửi HTTP Request (`mockMvc.perform(get("/employee"))`) và kiểm tra mã HTTP trả về (`andExpect(status().isOk())`).

---

## 🛠️ CÁCH CÁC CÔNG NGHỆ NÀY KẾT HỢP VỚI NHAU TRONG 1 LUỒNG (FLOW)

Khi người dùng thao tác một chức năng (ví dụ: Tạo mới nhân viên):

```text
1. Client gửi JSON
     │
     ▼
2. [spring-boot-starter-web] (Jackson parse JSON) -> Hứng vào [EmployeeSaveRequest] (có Lombok @Data)
     │
     ▼
3. [spring-boot-starter-security] (JWT Filter xác thực token của người gửi)
     │
     ▼
4. [spring-boot-starter-validation] / EmployeeValidator kiểm tra tính hợp lệ dữ liệu
     │
     ▼
5. [mapstruct] chuyển đổi EmployeeSaveRequest sang [EmployeeEntity]
     │
     ▼
6. [spring-boot-starter-security] mã hóa mật khẩu qua BCryptPasswordEncoder
     │
     ▼
7. [spring-boot-starter-data-jpa] quản lý Transaction @Transactional, gọi employeeRepository.save()
     │
     ▼
8. [HikariCP] lấy 1 kết nối mở sẵn từ Connection Pool
     │
     ▼
9. [mysql-connector-j] truyền câu lệnh SQL INSERT vật lý vào Database MySQL 8
     │
     ▼
10. [spring-boot-starter-web] đóng gói ApiResponse mã 200 trả về Client
```
