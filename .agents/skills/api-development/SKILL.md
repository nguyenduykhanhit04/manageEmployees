---
name: api-development
description: Build robust RESTful APIs in Spring Boot following TKAPI specifications, JPA/Hibernate best practices, MapStruct, and strict layered architecture.
---

# 🚀 Kỹ Năng Xây Dựng Backend API (API Development Skill)

Kỹ năng chuyên biệt dùng để thiết kế và triển khai các API nghiệp vụ phía Spring Boot Backend theo đúng tài liệu thiết kế API (`docs/api/TKAPI_*.md`) và quy chuẩn mã nguồn.

---

## 🏗️ 1. Quy Trình Triển Khai API Mới

1. **Đọc tài liệu thiết kế API**: Xác định HTTP Method, URL path, Request Body/Params, Response DTO, và danh sách mã lỗi validation cần kiểm tra.
2. **Tạo DTO (Request/Response)**:
   - Request DTO: `@Data`, `@NoArgsConstructor`, `@AllArgsConstructor` (sử dụng Lombok).
   - Response DTO: Chuẩn hóa theo DTO chi tiết hoặc DTO danh sách.
3. **Triển khai Mapper (MapStruct)**:
   - Interface mapper kế thừa `@Mapper(componentModel = "spring")`.
4. **Viết Validator (Tầng kiểm tra nghiệp vụ độc lập)**:
   - Tách logic validate vào `EmployeeValidator.java`.
   - Kiểm tra tuần tự theo Ma trận Validation: Bắt buộc $\rightarrow$ Độ dài $\rightarrow$ Format $\rightarrow$ DB logic.
   - Ném `BusinessException(Constants.ERxxx, List.of(...))`.
5. **Triển khai Service & Repository**:
   - `Service Interface` $\rightarrow$ `ServiceImpl` với `@Transactional`.
   - Nếu cần tìm kiếm động hoặc join bảng: triển khai qua `RepositoryCustom` / `RepositoryCustomImpl`.
6. **Triển khai Controller**:
   - Gắn annotation `@RestController`, `@RequestMapping`.
   - Gọi Validator $\rightarrow$ Gọi Service $\rightarrow$ Trả về `ApiResponse<T>`.
7. **Đảm bảo Javadoc Java_BS**:
   - Bổ sung header file, Class Javadoc `@author`, Method Javadoc `@param`, `@return`, `@throws`.
