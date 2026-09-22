# 🎓 TRỌN BỘ TÀI LIỆU ÔN LUYỆN & TRẢ LỜI PHỎNG VẤN DỰ ÁN MANAGE EMPLOYEES

Tập hợp toàn bộ kiến thức, kịch bản "nói mồm", giải thích luồng nghiệp vụ, phân tích chuyên sâu kỹ thuật, từ điển Annotation và các bài toán xử lý thay đổi yêu cầu cho dự án **Quản Lý Nhân Viên (Manage Employees)**.

---

## 📚 Danh Mục Toàn Bộ 7 Tệp Tài Liệu Phỏng Vấn

| STT | File Tài Liệu | Nội Dung Chính |
| :---: | :--- | :--- |
| **01** | [01_PROJECT_INTRODUCTION.md](./01_PROJECT_INTRODUCTION.md) | • Kịch bản mở lời giới thiệu dự án (bản 1-2 phút & 45s)<br>• Tổng hợp Tech Stack (Java 17, Spring Boot, Next.js 16...)<br>• Danh sách và vai trò các màn hình từ ADM001 $\rightarrow$ ADM006 |
| **02** | [02_ARCHITECTURE_AND_CODE_STRUCTURE.md](./02_ARCHITECTURE_AND_CODE_STRUCTURE.md) | • Kiến trúc phân tầng Backend (Controller, Service, Repository...)<br>• Kiến trúc Frontend Next.js (App Router, Components, Custom Hooks, Zod)<br>• Luồng dữ liệu 1 chiều End-to-End thực tế của màn hình ADM002 |
| **03** | [03_BUSINESS_FLOWS_EXPLAINED.md](./03_BUSINESS_FLOWS_EXPLAINED.md) | • Kịch bản nói mồm chức năng Tìm kiếm (Search & Wildcard escape)<br>• Kịch bản nói mồm chức năng Sắp xếp động đa cột (Multi-column sort)<br>• Kịch bản nói mồm chức năng Phân trang & Luồng CRUD (ADM004 $\rightarrow$ ADM005 $\rightarrow$ ADM006) |
| **04** | [04_DEEP_DIVE_TECHNICAL_CONCEPTS.md](./04_DEEP_DIVE_TECHNICAL_CONCEPTS.md) | • Bản chất `Tuple` trong JPA và cơ chế Mapping DTO<br>• Phân biệt `CrudRepository` vs `JpaRepository` vs `JPA thuần`<br>• Tại sao dùng `StringBuilder` trong Native SQL động<br>• Mối quan hệ Request $\leftrightarrow$ Entity $\leftrightarrow$ DTO & MapStruct<br>• 4 tính chất OOP áp dụng cụ thể ở đâu trong Source Code<br>• Bản chất JWT (HMAC-512, Signature) & phân biệt với `sessionStorage` |
| **05** | [05_TOP_INTERVIEW_QA.md](./05_TOP_INTERVIEW_QA.md) | • Top các câu hỏi phỏng vấn hay gặp nhất kèm câu trả lời mẫu "ăn điểm"<br>• Mẹo tâm lý và phương pháp trả lời tự tin, thuyết phục |
| **06** | [06_FEATURE_EXTENSIONS_AND_CHANGE_REQUESTS.md](./06_FEATURE_EXTENSIONS_AND_CHANGE_REQUESTS.md) | • **Xử lý tình huống thay đổi yêu cầu (Change Requests):**<br>  1. Xuất file Excel / CSV (Export Apache POI Streaming)<br>  2. Nhập file Excel (Import & Batch validation)<br>  3. Cơ chế Refresh Token (Silent refresh tự động)<br>  4. Upload Avatar (Lưu cục bộ / Cloud S3)<br>  5. Phân quyền động RBAC (Admin, Manager, User)<br>  6. Gửi Email tự động (Scheduled Cron Job nhắc hạn chứng chỉ)<br>  7. Đa ngôn ngữ (i18n Tiếng Việt / Nhật / Anh)<br>  8. Xóa Mềm (Soft Delete thay vì Hard Delete)<br>  9. Tìm kiếm đa từ khóa & Không phân biệt hoa thường<br>  10. 1 Nhân viên nhiều chứng chỉ (1-to-N Certifications)<br>  11. Đổi quy tắc Sort Ngày hết hạn (`NULL` lên đầu khi DESC)<br>  12. Chính sách Mật khẩu mạnh & Chống trùng mật khẩu cũ<br>  13. Chuyển ADM005 thành Modal Popup xác nhận tại chỗ |
| **07** | [07_SPRING_BOOT_ANNOTATIONS_CHEATSHEET.md](./07_SPRING_BOOT_ANNOTATIONS_CHEATSHEET.md) | • **Từ điển toàn bộ Annotation `@...` trong Backend:**<br>  - Nhóm 1: Spring Core & Stereotype (`@Component`, `@Service`, `@Repository`, `@Bean`...)<br>  - Nhóm 2: Spring Web & REST (`@RestController`, `@GetMapping`, `@RequestParam`, `@RequestBody`...)<br>  - Nhóm 3: JPA & Hibernate (`@Entity`, `@Table`, `@Id`, `@ManyToOne`, `@JoinColumn`...)<br>  - Nhóm 4: Repository & Transaction (`@PersistenceContext`, `@Query`, `@Transactional`...)<br>  - Nhóm 5: Spring Security (`@EnableWebSecurity`, `@PreAuthorize`...)<br>  - Nhóm 6: Lombok (`@Getter`, `@Setter`, `@RequiredArgsConstructor`, `@Builder`...)<br>  - Nhóm 7: MapStruct (`@Mapper`, `@Mapping`...)<br>  - Nhóm 8: Xử lý ngoại lệ (`@RestControllerAdvice`, `@ExceptionHandler`...) |

---

> [!TIP]
> **Lời khuyên ôn luyện:**
> 1. Đọc lướt qua file **01** và **02** để nắm chắc bức tranh tổng thể và từ khóa công nghệ.
> 2. Đọc kỹ kịch bản nói mồm trong file **03** và tập nói to bằng miệng 2-3 lần.
> 3. Đọc file **04** và **07** để hiểu sâu bản chất kỹ thuật và toàn bộ các Annotation trong code.
> 4. Ôn lại các câu hỏi vấn đáp nhanh trong file **05** và tình huống thay đổi yêu cầu ở file **06** trước giờ phỏng vấn!
