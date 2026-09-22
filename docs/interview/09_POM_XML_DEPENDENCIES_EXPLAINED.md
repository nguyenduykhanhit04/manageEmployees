# 📦 PHẦN 9: GIẢI THÍCH CHI TIẾT FILE `POM.XML` (DEPENDENCIES & PLUGINS)

Tài liệu này bóc tách toàn bộ các thành phần trong file [**`backend/pom.xml`**](file:///d:/Project/manageEmployees/backend/pom.xml), giải thích bản chất từng thư viện (Dependencies), Profile môi trường (`dev`/`prod`), và cơ chế hoạt động của các Plugin biên dịch (Maven Compiler & Annotation Processors).

---

## 🏗️ 1. CẤU TRÚC GỐC & SPRING BOOT STARTER PARENT

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.7.8</version>
</parent>
```
* **Ý nghĩa:** Đây là **Parent POM** do Spring Boot cung cấp.
* **Tác dụng:**
  1. **Quản lý phiên bản tập trung (Dependency Management):** Bạn không cần phải khai báo thủ công `<version>` cho hầu hết các thư viện của Spring (như JPA, Security, Web, Test), tránh xung đột phiên bản (Jar Hell).
  2. **Cung cấp cấu hình biên dịch mặc định:** Thiết lập mã hóa UTF-8, cấu hình plugin đóng gói JAR, và quản lý các profile.

---

## 📚 2. BẢNG GIẢI THÍCH TOÀN BỘ CÁC DEPENDENCY (THƯ VIỆN)

| Tên Dependency / ArtifactId | Phiên bản | Mục đích & Bản chất hoạt động trong dự án |
| :--- | :---: | :--- |
| **`spring-boot-starter-data-jpa`** | Spring 2.7 | Tích hợp **Spring Data JPA & Hibernate**. Cung cấp `JpaRepository`, `EntityManager`, quản lý vòng đời Entity và tự động tạo bảng/câu lệnh SQL. |
| **`spring-boot-starter-security`** | Spring 2.7 | Tích hợp **Spring Security**. Cung cấp bộ lọc bảo mật (Security Filter Chain), mã hóa mật khẩu `BCryptPasswordEncoder` và chặn phân quyền endpoint. |
| **`spring-boot-starter-web`** | Spring 2.7 | Xây dựng **RESTful API**. Tự động nhúng máy chủ **Tomcat Web Server** và tích hợp thư viện **Jackson** để chuyển đổi Java Object $\leftrightarrow$ chuỗi JSON. |
| **`spring-boot-starter-validation`** | Spring 2.7 | Tích hợp **Hibernate Validator (JSR-380)**. Hỗ trợ các annotation kiểm tra dữ liệu đầu vào như `@NotNull`, `@NotBlank`, `@Size`, `@Email`. |
| **`spring-boot-configuration-processor`** | Spring 2.7 | Tự động sinh metadata hỗ trợ IDE (IntelliJ, VS Code) tự động gợi ý code (IntelliSense) khi bạn cấu hình file `application.yaml`. |
| **`flyway-mysql`** | 8.5.13 | Thư viện **Flyway Migration**. Tự động quét và thực thi các file script SQL (`V1__...sql`, `V2__...sql`) khi khởi động để tạo bảng và dữ liệu mẫu mà không cần import DB thủ công. |
| **`mysql-connector-j`** | 8.0.32 | **JDBC Driver chính thức của MySQL**. Đóng vai trò là cầu nối giao tiếp ở mức mạng/socket giữa ứng dụng Java và hệ quản trị cơ sở dữ liệu MySQL 8.0. |
| **`HikariCP`** | 5.0.1 | Quản lý **Connection Pool (Bể chứa kết nối)** hiệu năng cao nhất hiện nay. Khởi tạo sẵn các kết nối tới MySQL để tái sử dụng, tránh tốn chi phí mở kết nối mới. |
| **`java-jwt`** *(com.auth0)* | 4.0.0 | Thư viện của hãng Auth0 dùng để **tạo, ký số (Sign với HMAC-512) và giải mã (Verify) chuỗi JSON Web Token (JWT)** trong `JwtTokenProvider.java`. |
| **`spring-boot-devtools`** | - | Công cụ hỗ trợ lập trình viên: **Hot Reload** và tự động khởi động lại server khi lưu file code, giúp tăng tốc độ phát triển. |
| **`lombok`** | 1.18.24 | Tự động sinh `Getter`, `Setter`, `Constructor`, `Builder` lúc biên dịch (Compile-time) giúp loại bỏ hàng trăm dòng code thừa. |
| **`mapstruct`** | 1.5.3.Final | Tự động sinh mã nguồn Java thuần để **chuyển đổi dữ liệu giữa Entity $\leftrightarrow$ DTO** lúc biên dịch, tốc độ cực nhanh và an toàn kiểu dữ liệu. |
| **`spring-boot-starter-test`** | Spring 2.7 | Bộ công cụ viết Unit Test và Integration Test toàn diện gồm: **JUnit 5 (Jupiter)**, **Mockito** (giả lập service/repository), AssertJ, và `MockMvc`. |

---

## ⚙️ 3. PROFILES MÔI TRƯỜNG (`dev` vs `prod`)

```xml
<profiles>
    <profile>
        <id>dev</id>
        <activation><activeByDefault>true</activeByDefault></activation>
        <properties><spring-boot.run.profiles>dev</spring-boot.run.profiles></properties>
    </profile>
    <profile>
        <id>prod</id>
        <properties><spring-boot.run.profiles>prod</spring-boot.run.profiles></properties>
    </profile>
</profiles>
```
* **Môi trường `dev` (Mặc định):** Đọc cấu hình từ file `application-dev.yaml` (bật log SQL Hibernate, in chi tiết lỗi, kết nối MySQL localhost).
* **Môi trường `prod`:** Đọc cấu hình từ `application-prod.yaml` (tắt log chi tiết, tối ưu bảo mật và hiệu năng khi triển khai lên máy chủ thật).

---

## 🛠️ 4. CƠ CHẾ HOẠT ĐỘNG CỦA CÁC BUILD PLUGINS

### 🔹 1. `maven-compiler-plugin` & `annotationProcessorPaths` (Bản chất cực kỳ quan trọng)

```xml
<annotationProcessorPaths>
    <path>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <version>${lombok.version}</version>
    </path>
    <path>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok-mapstruct-binding</artifactId>
        <version>0.2.0</version>
    </path>
    <path>
        <groupId>org.mapstruct</groupId>
        <artifactId>mapstruct-processor</artifactId>
        <version>${mapstruct.version}</version>
    </path>
</annotationProcessorPaths>
```

#### ❓ Tại sao phải cấu hình cả 3 gói theo đúng thứ tự này?
1. **Lombok chạy trước:** Sinh ra các hàm `get...()` và `set...()` cho các Entity và DTO.
2. **`lombok-mapstruct-binding` làm cầu nối:** Đảm bảo Lombok hoàn tất việc sinh getter/setter trước khi MapStruct bắt đầu đọc class.
3. **MapStruct chạy sau cùng:** Nhìn thấy các getter/setter do Lombok vừa sinh ra để tự động viết file `EmployeeMapperImpl.java`.
👉 *Nếu thiếu `lombok-mapstruct-binding`, MapStruct sẽ báo lỗi đỏ vì không tìm thấy hàm getter/setter của các thuộc tính!*

---

### 🔹 2. `spring-boot-maven-plugin`

```xml
<plugin>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-maven-plugin</artifactId>
    <configuration>
        <excludes>
            <exclude>
                <groupId>org.projectlombok</groupId>
                <artifactId>lombok</artifactId>
            </exclude>
        </excludes>
    </configuration>
</plugin>
```
* **Tác dụng:** Đóng gói toàn bộ mã nguồn và tất cả các file `.jar` phụ thuộc thành **một file JAR duy nhất (Fat JAR / Executable JAR)**. Nhờ đó, ứng dụng có thể chạy trên bất kỳ máy chủ nào chỉ với lệnh:
  ```bash
  java -jar target/user-manage-0.0.1.jar
  ```
* **`excludes lombok`:** Loại bỏ thư viện Lombok ra khỏi file JAR thành phẩm vì Lombok chỉ cần lúc biên dịch code, giúp **giảm dung lượng file JAR**.

---

### 🗣️ KỊCH BẢN TRẢ LỜI PHỎNG VẤN VỀ `POM.XML`:

> *"Dạ, file `pom.xml` của dự án được em cấu hình tinh gọn và chuẩn mực:*
>
> 1. * **Quản lý phụ thuộc:** Sử dụng `spring-boot-starter-parent 2.7.8` để đồng bộ phiên bản cho các starter core (Data JPA, Security, Web, Validation).*
> 2. * **Cơ sở dữ liệu & Di chuyển dữ liệu:** Tích hợp `mysql-connector-j`, `HikariCP` tối ưu Connection Pool và `Flyway` để tự động hóa migration schema database.*
> 3. * **Xác thực & Mapping:** Sử dụng `java-jwt (Auth0)` cho xác thực Stateless và `MapStruct` kết hợp `Lombok` thông qua `annotationProcessorPaths` để sinh mã nguồn tự động lúc biên dịch, đảm bảo hiệu năng cao nhất.*
> 4. * **Đóng gói & Profile:** Cấu hình sẵn 2 profile `dev`/`prod` và dùng `spring-boot-maven-plugin` đóng gói thành Executable Fat JAR giúp triển khai độc lập dễ dàng ạ."*
