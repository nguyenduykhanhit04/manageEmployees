# Getting Started

## Development
### Config JAVA_HOME
Add JAVA_HOME in system environment. 
Run `echo %JAVA_HOME%` to check value
(Project use JDK 17)

To start your application in the development profile, simply run:

    > mvnw
* [http://localhost:8085](http://localhost:8085)

Port default config in file [application.yaml]

    server.port: 8085
Or start with production profile, run:

    > mvnw -Pprod

Ctrl + C to stop
### Password encrypt
Password in table encrypted by `new BCryptPasswordEncoder().encode(password)`

    Ex: new BCryptPasswordEncoder().encode("admin")
    Output: $2a$10$r.XIN4K9vTioiuYQwaTop.UVQ5r5FvrKk2V5Orm9Hc6n4i9Tvjthy

## Login with API
    http://localhost:8085/login

Example running on Windows command environment:

    curl -d "{\"username\": \"admin\", \"password\": \"admin\"}" ^
        -H "Content-Type: application/json" ^
        -X POST http://localhost:8085/login

Running on Linux or Git bash command:

    curl -d "{\"username\": \"admin\", \"password\": \"admin\"}" \
        -H "Content-Type: application/json" \
        -X POST http://localhost:8085/login

You can use "Postman" to run the test: `https://www.postman.com`

## Call other API
`Set Authorization: Bearer <token>` when calling request api

    Ex:
    curl -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImlzcyI6InNlbGYiLCJleHAiOjE2NzcwMTI0MTgsImlhdCI6MTY3NjQzNjQxOH0.jlBId03AYp5gRn1aTY2YinWPzTIZzmSgMzXujlvpkIAmseH7TpL4FCfdJLvZFFtlLjN9Pe_AYfcMtdTwJLm_OA" \
        -X POST http://localhost:8085/test-auth
    
    Output: {"msg":"Token is valid"}

## Source code structure

Cấu trúc các tệp mã nguồn phục vụ biên dịch và thực thi ứng dụng Backend:

```text
backend/
├── pom.xml                                           # Quản lý dependencies Maven và cấu hình build
└── src/main/
    ├── java/com/luvina/la/
    │   ├── MainApplication.java                      # Điểm khởi chạy chính ứng dụng Spring Boot
    │   ├── config/                                   # Cấu hình hệ thống & Security
    │   │   ├── Constants.java                        # Hằng số hệ thống, regex và danh mục mã lỗi
    │   │   ├── DefaultProfileUtil.java               # Tiện ích kích hoạt Spring Profile (dev/prod)
    │   │   ├── PersistenceConfiguration.java         # Cấu hình JPA Auditing
    │   │   ├── SecurityConfiguration.java            # Cấu hình Spring Security & CORS filter
    │   │   ├── WebConfiguration.java                 # Cấu hình Web MVC & Resource handlers
    │   │   └── jwt/                                  # Hạ tầng xác thực JWT
    │   │       ├── AuthEntryPoint.java               # Xử lý trả về lỗi 401 Unauthorized
    │   │       ├── AuthUserDetails.java              # Adapter UserDetails cho Spring Security
    │   │       ├── JwtTokenFilter.java               # Filter giải mã và kiểm tra Bearer JWT mỗi request
    │   │       ├── JwtTokenProvider.java             # Tạo và kiểm tra tính hợp lệ của JWT token
    │   │       └── UserDetailsServiceImpl.java       # Truy vấn tài khoản đăng nhập từ database
    │   ├── controller/                               # Tầng REST Controllers tiếp nhận request API
    │   │   ├── AuthController.java                   # API đăng nhập POST /login
    │   │   ├── CertificationController.java          # API danh mục chứng chỉ GET /certifications
    │   │   ├── DepartmentController.java             # API danh mục phòng ban GET /departments
    │   │   ├── EmployeeController.java               # API nhân viên (CRUD & kiểm tra tồn tại)
    │   │   └── HomeController.java                   # API kiểm tra kết nối hệ thống
    │   ├── dto/                                      # Data Transfer Objects
    │   │   ├── CertificationDTO.java                 # DTO thông tin chứng chỉ tiếng Nhật
    │   │   ├── DepartmentDTO.java                    # DTO thông tin phòng ban
    │   │   ├── EmployeeCertificationDetailDTO.java   # DTO chi tiết chứng chỉ của nhân viên
    │   │   ├── EmployeeDTO.java                      # DTO thông tin nhân viên trên bảng danh sách
    │   │   └── EmployeeDetailDTO.java                # DTO đầy đủ thông tin chi tiết nhân viên
    │   ├── entity/                                   # JPA Entities ánh xạ bảng cơ sở dữ liệu
    │   │   ├── CertificationEntity.java              # Ánh xạ bảng certifications
    │   │   ├── DepartmentEntity.java                 # Ánh xạ bảng departments
    │   │   ├── EmployeeEntity.java                   # Ánh xạ bảng employees
    │   │   └── EmployeesCertificationEntity.java     # Ánh xạ bảng employees_certifications
    │   ├── exception/                                # Xử lý ngoại lệ tập trung
    │   │   ├── BusinessException.java                # Ngoại lệ nghiệp vụ chứa mã lỗi parametric
    │   │   └── GlobalExceptionHandler.java           # @RestControllerAdvice chuẩn hóa JSON phản hồi lỗi
    │   ├── mapper/                                   # MapStruct Mappers chuyển đổi dữ liệu
    │   │   ├── CertificationMapper.java              # Chuyển đổi CertificationEntity <-> DTO
    │   │   ├── DepartmentMapper.java                 # Chuyển đổi DepartmentEntity <-> DTO
    │   │   └── EmployeeMapper.java                   # Chuyển đổi EmployeeEntity <-> DTO / Response
    │   ├── payload/                                  # Cấu trúc Request & Response API
    │   │   ├── request/
    │   │   │   ├── EmployeeSaveRequest.java          # Dữ liệu thêm mới / cập nhật nhân viên
    │   │   │   ├── EmployeeSearchRequest.java        # Tham số tìm kiếm, sắp xếp & phân trang
    │   │   │   └── LoginRequest.java                 # Thông tin tài khoản đăng nhập
    │   │   └── response/
    │   │       ├── ApiErrorMessage.java              # Định dạng lỗi parametric {code, params}
    │   │       ├── ApiResponse.java                  # Cấu trúc phản hồi chung {code, message}
    │   │       ├── CertificationListResponse.java    # Phản hồi danh sách chứng chỉ
    │   │       ├── DepartmentListResponse.java       # Phản hồi danh sách phòng ban
    │   │       ├── EmployeeDeleteResponse.java       # Phản hồi thao tác xóa nhân viên
    │   │       ├── EmployeeDetailResponse.java       # Phản hồi chi tiết một nhân viên
    │   │       ├── EmployeeListResponse.java         # Phản hồi danh sách nhân viên kèm phân trang
    │   │       ├── EmployeeUpdateResponse.java       # Phản hồi cập nhật nhân viên
    │   │       └── LoginResponse.java                # Phản hồi đăng nhập thành công kèm Access Token
    │   ├── repository/                               # Tầng truy xuất dữ liệu Spring Data JPA
    │   │   ├── CertificationRepository.java          # Thao tác bảng certifications
    │   │   ├── DepartmentRepository.java             # Thao tác bảng departments
    │   │   ├── EmployeeRepository.java               # JpaRepository thao tác bảng employees
    │   │   ├── EmployeeRepositoryCustom.java         # Interface tìm kiếm động đa điều kiện
    │   │   ├── EmployeesCertificationRepository.java # JpaRepository bảng employees_certifications
    │   │   ├── EmployeesCertificationRepositoryCustom.java # Interface custom thao tác chứng chỉ nhân viên
    │   │   └── impl/
    │   │       ├── EmployeeRepositoryCustomImpl.java # Triển khai JPQL tìm kiếm & sắp xếp động
    │   │       └── EmployeesCertificationRepositoryCustomImpl.java # Triển khai thao tác chứng chỉ
    │   ├── service/                                  # Tầng xử lý nghiệp vụ (Interfaces)
    │   │   ├── CertificationService.java             # Interface nghiệp vụ danh mục chứng chỉ
    │   │   ├── DepartmentService.java                # Interface nghiệp vụ phòng ban
    │   │   ├── EmployeeService.java                  # Interface nghiệp vụ quản lý nhân viên
    │   │   └── impl/
    │   │       ├── CertificationServiceImpl.java     # Cài đặt nghiệp vụ chứng chỉ
    │   │       ├── DepartmentServiceImpl.java        # Cài đặt nghiệp vụ phòng ban
    │   │       └── EmployeeServiceImpl.java          # Cài đặt nghiệp vụ nhân viên & bảo vệ Admin
    │   └── validator/                                # Kiểm tra hợp lệ dữ liệu đầu vào
    │       └── EmployeeValidator.java                # Validate nghiệp vụ doanh nghiệp (ER001 - ER018)
    └── resources/                                    # Tài nguyên cấu hình ứng dụng
        ├── banner.txt                                # Banner hiển thị lúc khởi động ứng dụng
        ├── logback-spring.xml                        # Cấu hình ghi log hệ thống
        ├── config/
        │   ├── application.yaml                      # Cấu hình Spring Boot mặc định
        │   ├── application-dev.yaml                  # Cấu hình môi trường phát triển (dev)
        │   └── application-prod.yaml                 # Cấu hình môi trường triển khai (prod)
        └── db/migration/
            ├── V1__init_schema.sql                   # Flyway migration khởi tạo bảng & dữ liệu mẫu
            └── V2__init_schema.sql                   # Flyway migration tối ưu chỉ mục (indexes)
```

### Flyway database migration enable/disable
    spring
      flyway:
        enabled: true

`enabled: true` auto execute sql script in file resources/db/migration/Vx__<description>.sql
SQL Script version information is managed in the `flyway_schema_history` table

### Reference Documentation

For further reference, please consider the following sections:

* [Official Apache Maven documentation](https://maven.apache.org/guides/index.html)
* [Spring Boot Maven Plugin Reference Guide](https://docs.spring.io/spring-boot/docs/2.7.4/maven-plugin/reference/html/)
* [Spring Boot DevTools](https://docs.spring.io/spring-boot/docs/2.7.4/reference/htmlsingle/#using.devtools)
* [Flyway Migration](https://docs.spring.io/spring-boot/docs/2.7.4/reference/htmlsingle/#howto.data-initialization.migration-tool.flyway)
* [Spring Configuration Processor](https://docs.spring.io/spring-boot/docs/2.7.4/reference/htmlsingle/#appendix.configuration-metadata.annotation-processor)
* [Spring Web](https://docs.spring.io/spring-boot/docs/2.7.4/reference/htmlsingle/#web)
* [Spring Data JPA](https://docs.spring.io/spring-boot/docs/2.7.4/reference/htmlsingle/#data.sql.jpa-and-spring-data)

### Guides

The following guides illustrate how to use some features concretely:

* [Building a RESTful Web Service](https://spring.io/guides/gs/rest-service/)
* [Serving Web Content with Spring MVC](https://spring.io/guides/gs/serving-web-content/)
* [Building REST services with Spring](https://spring.io/guides/tutorials/rest/)
* [Accessing Data with JPA](https://spring.io/guides/gs/accessing-data-jpa/)
* [MapStruct Mapper](https://www.tutorialspoint.com/mapstruct/mapstruct_basic_mapping.htm)

