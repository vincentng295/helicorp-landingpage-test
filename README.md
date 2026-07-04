# HELICORP LANDING PAGE TEST
<img width="1024" height="506" alt="healring-banner" src="https://github.com/user-attachments/assets/2819634c-e4a8-4728-bd5c-7166682b6247" />

Hệ thống bao gồm một trang giới thiệu sản phẩm nhẫn thông minh HealRing Smart tích hợp AI (Frontend) và một hệ thống theo dõi hành vi người dùng kèm trang quản trị dữ liệu (Backend).

## Công nghệ sử dụng

### Frontend
- HTML5, Javascript (ES6+) thuần.
- CSS Framework: Tailwind CSS v4.
- Thư viện biểu đồ: Chart.js.

### Backend
- Framework: NestJS (v11.x).
- Xác thực: JWT (JSON Web Token), Passport JS.
- Kiểm chuẩn dữ liệu: Class-validator, Class-transformer.

### Hạ tầng và triển khai
- Môi trường chạy: Docker, Docker Compose.
- Máy chủ Web/Proxy: Nginx.

## Kiến trúc và Các tính năng cốt lõi

### 1. Thu thập dữ liệu và Tracking hành vi
Hệ thống tự động khởi tạo mã phiên (Session ID) không trùng lặp cho mỗi lượt truy cập và nhận diện loại thiết bị (Desktop/Mobile). Dữ liệu được âm thầm gửi về Backend theo thời gian thực qua các sự kiện:
- Khởi tạo phiên truy cập (session_start).
- Duy trì kết nối (session_ping định kỳ mỗi 10 giây để tính chính xác thời gian ở lại trang).
- Hành vi tương tác: Bấm vào các tính năng nổi bật (click_feature), bấm vào nút kêu gọi hành động (click_cta).
- Đo lường độ cuộn trang: Ghi nhận tự động tại các mốc cuộn 25%, 50%, 75%, 100% và khi người dùng xem đến phân đoạn thông số kỹ thuật (technical_specs_section).

### 2. Quản lý Đăng ký nhận thông tin (Subscriptions)
Biểu mẫu điền thông tin đăng ký tư vấn/đặt trước được bảo vệ bằng tầng lọc dữ liệu chặt chẽ ở cả hai đầu:
- Frontend: Kiểm tra tính hợp lệ của định dạng đầu vào trước khi phát lệnh gửi.
- Backend: Áp dụng ValidationPipe toàn cục để bóc tách, chuẩn hóa dữ liệu dựa trên mô hình định sẵn (CreateSubscriptionDto), ngăn chặn các lỗ hổng chèn dữ liệu lạ.

### 3. Trang quản trị Dashboard Admin
Hệ thống quản trị biệt lập được bảo vệ bằng cơ chế xác thực JWT Guard. Giao diện tổng hợp dữ liệu cung cấp các thông số trực quan:
- Thống kê tổng số phiên truy cập, tổng lượt tương tác, tỷ lệ cuộn trung bình và thời gian onsite trung bình.
- Biểu đồ phân rã tỷ lệ thiết bị (Mobile vs Desktop) và biểu đồ cột xếp hạng các thành phần thu hút nhiều lượt click nhất.
- Bảng nhật ký chi tiết hành vi người dùng cập nhật theo thời gian thực.
- Bảng tổng hợp danh sách khách hàng đăng ký đặt trước sản phẩm (Họ tên, Email, Thời gian ghi nhận).

### 4. Tối ưu hóa hiệu năng và SEO Technical
- Tốc độ tải trang được tối ưu hóa cấu trúc mã nguồn để đáp ứng tiêu chuẩn nghiêm ngặt của Google PageSpeed Insights.
- Tích hợp chế độ giao diện tối (Dark Mode) tự động dựa trên cấu hình hệ thống hoặc chuyển đổi thủ công.
- Cấu hình đầy đủ hệ thống Meta Tags chuẩn SEO và Open Graph (OG Tags) cho việc chia sẻ liên kết hiển thị tối ưu trên các nền tảng mạng xã hội.

## Hướng dẫn cài đặt và khởi chạy

### Yêu cầu hệ thống
- Docker và Docker Compose đã được cài đặt trên máy.

### Khởi chạy local web bằng Docker
1. Sao chép tệp cấu hình môi trường từ tệp mẫu:
```bash
cp backend/.env.example backend/.env
```

2. Khởi chạy toàn bộ hệ thống (Backend, Frontend, Nginx) thông qua Docker Compose:
```bash
docker compose up -d --build

```

3. Sau khi các container khởi chạy thành công:
* Giao diện Landing Page: Truy cập tại địa chỉ http://127.254.99.100
* Giao diện Admin Dashboard: Truy cập tại địa chỉ http://127.254.99.100/admin.html
* Thông tin tài khoản quản trị mặc định: Tài khoản admin / Mật khẩu helicorp2026.



## Cấu trúc thư mục dự án

```text
├── backend/
│   ├── src/
│   │   ├── analytics/        # Module quản lý tracking và xác thực admin
│   │   ├── dto/              # Định nghĩa cấu trúc dữ liệu validation (landing-page.dto.ts)
│   │   ├── main.ts           # Điểm khởi chạy cấu hình NestJS
│   │   └── app.module.ts     # Module tổng của ứng dụng
│   ├── Dockerfile            # Cấu hình đóng gói ứng dụng Backend
│   └── .env.example          # Tệp mẫu cấu hình biến môi trường
├── frontend/
│   ├── js/
│   │   ├── main.js           # Xử lý tương tác landing page và gửi tracking
│   │   └── admin.js          # Xử lý xác thực JWT và kết nối biểu đồ dashboard
│   ├── index.html            # Giao diện Landing Page HealRing Smart
│   ├── admin.html            # Giao diện Trang quản trị Admin
│   └── nginx.conf            # Cấu hình điều hướng Proxy ngược và Web Server
└── docker-compose.yml        # Tệp điều phối các container hệ thống

```
