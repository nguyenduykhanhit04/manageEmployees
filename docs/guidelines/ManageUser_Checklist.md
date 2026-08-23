# Checklist Coding_Rule_ManageUser

**Tên UC:** …………………………………………………………………...
**Tên PM:** ………………………
**Tên người tạo:** ………………………….

**Người nhận task:** ………………………
**Ngày nhận:** ……………………...
**Người giao:** …………………….
**Ngày nhận sản phẩm:** …………………..

---

## Mục lục

1. [Checklist Coding Rule](#1-checklist-coding-rule)
2. [Checklist FrontEnd (Next.js) Basic](#2-checklist-frontend-nextjs-basic)
3. [Coding Convention Java_BS](#3-coding-convention-java_bs)
4. [Coding Convention Next.js (FrontEnd)](#4-coding-convention-nextjs-frontend)

---

## 1. Checklist Coding Rule

| No | Items | File name checking |
|----|-------|---------------------|
| 1 | Code đã đúng theo thiết kế chưa? | OK / NG / NA |
| 1.1 | Màn hình phải đúng thiết kế về bố cục, tông màu | OK / NG / NA |
| 1.2 | Dữ liệu hiển thị đúng định dạng | OK / NG / NA |
| 1.3 | Có Validate dữ liệu đúng theo mô tả trong thiết kế | OK / NG / NA |
| 1.4 | Bắt và xử lỗi đầy đủ theo thiết kế | OK / NG / NA |
| **2** | **File Controller** | |
| 2.1 | Tên class phải có hậu tố là Controller | OK / NG / NA |
| 2.2 | Đặt trong package riêng biệt | OK / NG / NA |
| 2.3 | Các message cấu hình, mô tả lỗi động phải được để trong file properties | OK / NG / NA |
| 2.4 | Không access trực tiếp vào Repository | OK / NG / NA |
| 2.5 | Không được trả về cho FrontEnd là các đoạn mã HTML | OK / NG / NA |
| 2.6 | Gọi Service thông qua Interface | OK / NG / NA |
| 2.6 | Sử dụng đúng các phương thức GET, POST, PUT, OPTION… | OK / NG / NA |
| **3** | **File logic (Service)** | |
| 3.1 | Tên class phải có hậu tố là Service | OK / NG / NA |
| 3.1 | Viết các xử lý nghiệp vụ chức năng ở đây | OK / NG / NA |
| 3.2 | Các message cấu hình, mô tả lỗi động phải được để trong file properties | OK / NG / NA |
| 3.3 | Các hằng số, chuỗi được đặt trong 1 file khai báo hằng số chung | OK / NG / NA |
| 3.4 | Gọi Repository thông qua 1 Interface | OK / NG / NA |
| **4** | **File Repository** | |
| 4.1 | Implement JPA JpaRepository hoặc CrudRepository | OK / NG / NA |
| 4.2 | Trường hợp tăng chức năng cơ bản thì sẽ customize Repository, và tạo class CustomImpl và add thêm vào | OK / NG / NA |
| 4.3 | Trường hợp liên kết table thì sẽ viết xử lý trong Repository Custom | OK / NG / NA |
| 4.4 | Không access vào Controller | OK / NG / NA |
| 4.5 | Không access vào Service | OK / NG / NA |
| 4.6 | Trường hợp SQL phức tạp thì sử dụng SQL Native | OK / NG / NA |
| **5** | **Entity, DTO** | |
| 5.1 | Entity để giao tiếp với bảng dữ liệu trong Repository | |
| 5.2 | DTO sử dụng cho các mục đích khác mapping, request… | |
| 5.3 | Chỉ chứa getter và setter cho các thuộc tính (có thể sử dụng thư viện Lombok cho việc này) | |
| **6** | **SQL Native** | |
| 6.1 | Khi sử dụng Subquery phải hạn chế data thu được trong subquery. | |
| 6.2 | Khi sử dụng LEFT JOIN và RIGHT JOIN phải lấy bảng có data ít join với bảng có data nhiều. | |
| 6.3 | SQL tương tự phải viết giống nhau (xuống hàng, tab,…) để DB có thể cache được SQL. | |
| 6.4 | Các điều kiện sử dụng LIKE hoặc OR cần phải được sử dụng sau cùng sau khi thu hẹp tối đa các điều kiện (AND, EXISTS, IN,..) | |
| 6.0 | Sử dụng bao nhiêu trường thì select bấy nhiêu trường, không dùng select *. | |
| **7** | **FrontEnd** *(Ví dụ đúng và sai xem trong sheet CheckListFrontEndBasic)* | |
| 7.1 | UI không chứa axios/fetch | |
| 7.2 | Data flow 1 chiều | |
| 7.3 | Logic không nằm trong UI | |
| 7.4 | API không nằm trong component | |
| 7.5 | Có type/interface rõ ràng | |
| 7.6 | Flow đúng kiến trúc | |
| 7.7 | Validate form đúng chuẩn | |
| 7.8 | Code dễ đọc, không viết tắt | |
| 7.9 | Hook bắt buộc có `use` | |
| 7.10 | Component luôn viết PascalCase | |
| 7.11 | action + entity | |
| 7.12 | Một concept chỉ 1 kiểu tên | |
| 7.13 | Function phải là động từ | |
| 7.14 | Handler prefix | |
| 7.15 | Các hằng số, chuỗi được đặt trong 1 file khai báo hằng số chung | |
| 7.16 | Các cấu hình chung được đặt trong file environment | |

**Ghi chú:** *(ghi nội dung mô tả cho những mục check cho kết quả NG)*

&nbsp;

**Người tạo**
*(Ký và ghi rõ họ tên)*

---

## 2. Checklist FrontEnd(Next.js) Basic

| STT | MUST HAVE ITEM | Tiêu chí kiểm tra | Ví dụ SAI | Ví dụ ĐÚNG |
|-----|-----------------|--------------------|-----------|------------|
| 1 | Không gọi API trong UI | UI không chứa axios/fetch | `axios.get()` trong `page.tsx` | UI gọi qua `useEmployee()` → `employee.api.ts` |
| 2 | Data flow 1 chiều | Data flow 1 chiều | UI gọi backend trực tiếp | UI → Hook → API → Axios |
| 3 | Có Custom Hook cho logic | Logic không nằm trong UI | Page chứa fetch + state + sort + paging | `useEmployee()` xử lý toàn bộ logic |
| 4 | API layer tách riêng | API không nằm trong component | gọi axios trực tiếp trong UI | `employee.api.ts` chỉ chứa function API |
| 5 | Type Safety (không any) | Có type/interface rõ ràng | `data: any` | `Employee[]`, `interface Employee` |
| 6 | Data Flow rõ ràng | Flow đúng kiến trúc | UI gọi API trực tiếp | UI → Hook → API → Axios → Backend |
| 7 | Form handling chuẩn (RHF + Zod) | Validate form đúng chuẩn | `if (!email)` thủ công | schema Zod |
| 8 | Naming & code readability | Code dễ đọc, không viết tắt | `empDt`, `dta`, `fn1` | `employeeData`, `fetchEmployees` |
| 9 | HOOK NAMING | Hook bắt buộc có `use` | `employeeLogic` | `useEmployee` |
| 10 | COMPONENT NAMING | Component luôn viết PascalCase | `employeeTable` | `EmployeeTable` |
| 11 | API NAMING | action + entity | `employeeApi()` | `getEmployees()` |
| 12 | Consistent naming | Một concept chỉ 1 kiểu tên | `getEmp`, `fetchEmployee`, `loadEmp` | `fetchEmployees` thống nhất |
| 13 | Verb for functions | Function phải là động từ | `employee()` | `getEmployee()`, `createEmployee()` |
| 14 | Naming | Handler prefix | `submit()` | `handleSubmit()` |

---

## 3. Coding convention Java_BS

**Tên UC:** …………………………………………………………………...
**Tên PM:** ………………………
**Tên người tạo:** ………………………….

**Người nhận task:** ………………………
**Ngày nhận:** ……………………...
**Người giao:** …………………….
**Ngày nhận sản phẩm:** …………………..

| No | Items | File name checking |
|----|-------|---------------------|
| 1 | Đầu file, class, method bắt buộc phải có comment theo kiểu java doc. Tham khảo bên dưới.<br>Ghi chú cho comment(class), param, return, exception(method) theo cách dưới đây:<br>**【hình thức của Javadoc comment】**<br>・bắt đầu bằng `/**`<br>・từ hàng thứ 2 trở đi bắt đầu bằng `*` ghi body bằng Javadoc tag dưới đây<br>・kết thúc bằng `*/`<br><br>Cụ thể:<br>Comment cho đầu file:<br>`Copyright(C) [năm hiện tại] [tên công ty]`<br>`[Tên file.java], [dd/mm/yyyy] [tên người tạo]`<br><br>Comment cho đầu class:<br>Description của class là làm gì<br>`@author [tên người làm]`<br><br>Comment cho method:<br>Description của method là làm gì<br>`@param [name] [giải thích]` — mô tả ý nghĩa và cách dùng của biến trong method.<br>`@return [giải thích]` — mô tả giá trị trả về nếu trong method tồn tại giá trị trả về. | OK / NG / NA |
| 2 | Tên Method:<br>- Chữ cái đầu tiên của method phải viết thường<br>- Tên các từ trong một method được ghép với nhau bằng cách viết hoa chữ cái ghép nối. | OK / NG / NA |
| 3 | Cách đặt tên biến<br>Tên các từ trong một biến được ghép với nhau bằng cách viết hoa chữ cái ghép nối.<br>Chú ý việc đặt tên không được trùng với các từ khóa của java. | OK / NG / NA |
| 4 | Nội dung tên biến<br>Nội dung của tên biến phải nói lên được vai trò, chức năng của biến đó | OK / NG / NA |
| 5 | Cách đặt tên hằng số<br>Hằng số phải được khai báo với từ khóa `static final`.<br>Tên hằng số phải được viết hoa toàn bộ các kí tự.<br>Các từ trong tên được kết nối với nhau bằng dấu gạch nối `_` | OK / NG / NA |
| 6 | Đưa ký tự space vào trước và sau các toán tử sau:<br>1. Toán tử thay đổi (`=`, `+=`, `-=`, …)<br>2. Toán tử liên quan (`<`, `>`, `>=`, `<=`, `==`, `!=`)<br>3. Toán tử logic (`\|\|`, `&&`)<br>4. Toán tử Arithmetic (`+`, `-`, `*`, `/`, `%`)<br>Mục đích đưa ký tự space vào trước và sau toán tử trên nhằm tăng mức độ dễ đọc của code. | OK / NG / NA |
| 7 | Đưa ký tự space vào sau Semicolon `;` trong câu for<br>==> Mục đích đưa ký tự space vào sau Semicolon trong câu for là để tăng mức độ dễ đọc của code | OK / NG / NA |
| 8 | Cho ký tự space vào đằng sau dấu phẩy `,`<br>Cho ký tự space vào đằng sau dấu phẩy `,` để tăng mức độ dễ đọc của code. | OK / NG / NA |
| 9 | Không đưa ký tự space vào trước các toán tử `++` và `--`<br>Việc cho thêm kí tự space giữa các toán tử `++` và `--` không những có thể làm người đọc hiểu sai vấn đề mà còn có thể làm cho chương trình chạy không đúng. | OK / NG / NA |
| 10 | Trình tự khai báo field là `public (+)`, `protected (#)`, `default (~)`, `private (-)`<br>Việc khai báo đúng trình tự sẽ giúp việc đọc code được dễ dàng hơn. | OK / NG / NA |
| 11 | Sử dụng method `equals()` để so sánh xâu với biến số<br>Việc sử dụng `"xâu".equals(obj)` không những là một hình thức so sánh tốt mà còn tiết kiệm được 1 bước check null cho obj. | OK / NG / NA |
| 12 | Sử dụng `StringBuilder` class cho dãy ký tự được update<br>Xâu là một mảng cố định các ký tự, vì vậy khi thay đổi giá trị của xâu, mảng đó sẽ bị khởi tạo lại. Vì vậy việc sửa trực tiếp giá trị vào xâu sẽ tốn nhiều tài nguyên hệ thống.<br>Để tránh điều trên hãy dùng `StringBuilder`. | OK / NG / NA |
| 13 | Dấu ngoặc nhọn:<br>- Dấu ngoặc nhọn mở `{` của khai báo class/method và các khối lệnh khác nên đặt tại cuối của dòng lệnh đầu tiên trong khối lệnh đó.<br>- Trước dấu ngoặc nhọn mở `{` phải có 1 dấu space | OK / NG / NA |
| 14 | Các câu lệnh if-else phải theo các định dạng sau:<br><pre>if (condition) {\n    statements;\n}</pre>Trường hợp có if và else:<br><pre>if (condition) {\n    statements;\n} else {\n    statements;\n}</pre>Trường hợp có if và else if:<br><pre>if (condition) {\n    statements;\n} else if (condition) {\n    statements;\n} else {\n    statements;\n}</pre>Chú ý: Câu lệnh if luôn sử dụng cặp dấu `{}`. Tránh sử dụng kiểu viết như sau – dễ gây ra lỗi khi ta thêm các câu lệnh khác:<br><pre>if (condition) //AVOID! THIS OMITS THE BRACES {}!\n    statement;</pre> | OK / NG / NA |
| 15 | Không so sánh `==` hoặc `!=` với `true`/`false` mà sử dụng `if(isOK)` hoặc `(!isOK)` | OK / NG / NA |
| 16 | Sử dụng for mở rộng:<br>Trường hợp không cần sử dụng biến chỉ số vòng lặp thì nên dùng for mở rộng:<br>**Sai:**<pre>for (int i = 0; i < listUser.size; i++) {\n    TblUser user = listUser.get(i);\n    ....\n}</pre>**Đúng:**<pre>for (TblUser user : listUser) {\n    ...\n}</pre> | OK / NG / NA |
| 17 | Sử dụng biến chỉ số không linh hoạt:<br>Trường hợp sử dụng biến index 1 cách linh hoạt tuần tự thì nên dùng biến đếm để thay thế, sẽ dễ dàng maintain khi phải thêm param vào vị trí giữa thì không phải sửa lại các giá trị chỉ số:<br>**Sai:**<pre>query.setInteger(0, param0);\nquery.setInteger(1, param1);\nquery.setInteger(2, param2);</pre>**Đúng:**<pre>int i = 0;\nquery.setInteger(i++, param0);\nquery.setInteger(i++, param1);\nquery.setInteger(i++, param2);</pre> | OK / NG / NA |
| 18 | Không nên gọi hàm lặp lại nhiều lần. Chỉ gọi 1 lần rồi lưu vào biến tạm và tái sử dụng lại<br>**Sai:**<pre>if (request.getParameter("index") != null) {\n    String indexParam = request.getParameter("index");\n}</pre>**Đúng:**<pre>String indexParam = request.getParameter("index");\nif (indexParam != null) {\n    indexParam = indexParam.trim();\n}</pre> | OK / NG / NA |
| 19 | Cần bắt đúng loại Exception đã throw ra:<br>**Sai:**<pre>try {\n    index = Integer.parseInt(indexParam);\n} catch (Exception ex) {\n    ex.printStackTrace();\n}</pre>**Đúng:**<pre>try {\n    index = Integer.parseInt(indexParam);\n} catch (NumberFormatException nfe) {\n    // Ghi lại log\n    // Set giá trị default\n    index = 0;\n}</pre> | OK / NG / NA |
| 20 | Phải xử lý trong trường hợp catch được exception<br>Khi catch được exception, phải đưa ra hướng xử lý thích hợp hoặc log lại trường hợp gây ra lỗi đó.<br>Tuyệt đối không được để trống catch block. | OK / NG / NA |

**Ghi chú:** *(ghi nội dung mô tả cho những mục check cho kết quả NG)*

| Người tạo | Người phê duyệt |
|-----------|------------------|
| *(Ký và ghi rõ họ tên)* | *(Ký và ghi rõ họ tên)* |

---

## 4. Coding Convention Next.js (FrontEnd)

**Tên UC:** …………………………………………………………………...
**Tên PM:** ………………………
**Tên người tạo:** ………………………….

**Người nhận task:** ………………………
**Ngày nhận:** ……………………...
**Người giao:** …………………….
**Ngày nhận sản phẩm:** …………………..

| No | Items |
|----|-------|
| **7** | **FrontEnd** |
| 7.1 | Kiến trúc layout rõ ràng (Header / Home / Footer) |
| | - Sử dụng `layout.tsx` (App Router) hoặc layout pattern để định nghĩa cấu trúc chung |
| | - Tách riêng Header, Footer, Main Content |
| | - Không hardcode layout trong từng page |
| 7.2 | Tạo component Header và tái sử dụng |
| | - Tạo component Header trong `/components` |
| | - Import vào `layout.tsx` để dùng chung toàn app |
| | - Không duplicate logic UI giữa các page |
| 5.3 | Tạo component Footer và tái sử dụng |
| | - Tạo component Footer |
| | - Include vào layout chung |
| | - Đảm bảo responsive + consistency |
| 7.4 | Tận dụng hệ sinh thái React / Next.js |
| | - Sử dụng built-in của Next: `next/image` (optimize image); `next/link` (routing); `next/font` (font optimization) |
| | - `next/image` (optimize image) |
| | - Áp dụng Server Components / Client Components hợp lý |
| | - Sử dụng thư viện phổ biến; UI: MUI / Antd / Tailwind; Data fetching: React Query / SWR |
| 7.5 | Sử dụng hooks, custom hooks, reusable logic |
| | - Tách logic ra custom hooks (`useAuth`, `useFetch`, v.v.) |
| | - Không viết logic lớn trực tiếp trong component |
| | - Tránh duplicate logic giữa các component |
| 7.6 | Tách UI và logic (clean code) |
| | - JSX UI nằm trong component file (`.tsx`) |
| | - Logic xử lý (API, transform data) tách riêng: `/services`; `/hooks`; `/utils` |
| | - Component chỉ chịu trách nhiệm render + interaction |
| 7.7 | Data modeling (TypeScript) |
| | - Tạo types hoặc interfaces cho tất cả data |
| | - Không dùng `any` |
| | - Tách model vào `/types` hoặc `/models` |
| | - Reuse type giữa API và UI |
| 7.8 | Validate dữ liệu trước khi gọi API |
| | - Validate input bằng: `zod` / `react-hook-form` |
| 7.9 | Tạo Service layer để gọi API |
| | - Không gọi API trực tiếp trong component |
| | - Tạo `/lib/api/...` hoặc chia theo domain: |
| 7.10 | Quản lý state hợp lý |
| | - Dùng: Local state (`useState`) cho UI nhỏ; Global state: Context API / Zustand / Redux |
| | - Không lạm dụng global state |
| | - Tránh prop drilling sâu |
| 7.11 | Data fetching đúng chuẩn Next.js |
| | - Sử dụng: Server Components (fetch trực tiếp) |
| | - Không fetch data dư thừa |

**Ghi chú:** *(ghi nội dung mô tả cho những mục check cho kết quả NG)*

| Người tạo | Người phê duyệt |
|-----------|------------------|
| *(Ký và ghi rõ họ tên)* | *(Ký và ghi rõ họ tên)* |
