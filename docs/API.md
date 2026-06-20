# Danh mục API v1

Base URL: `/api/v1`. Route cần đăng nhập dùng header `Authorization: Bearer <accessToken>`. Schema request/response đầy đủ có tại `/docs`.

| Nhóm          | Endpoint chính                                                                        | Mục đích                                |
| ------------- | ------------------------------------------------------------------------------------- | --------------------------------------- |
| Auth          | `POST /auth/otp`, `/auth/register`, `/auth/login`, `/auth/refresh`                    | OTP, đăng ký, login, refresh token      |
| Profile       | `GET/PATCH /auth/me`, `POST /auth/password/change`                                    | Hồ sơ và mật khẩu                       |
| Places        | `GET /places/categories`, `/places/nearby`, `/places/search`, `/places/:id`           | Danh mục, tìm kiếm, địa điểm            |
| Reviews/map   | `GET/POST /places/:id/reviews`, `GET /places/:id/route`, `GET /map/geocode`           | Đánh giá và MapVina                     |
| Social        | `/social/users`, `/social/friends`, `/social/groups`, `/social/feed`, `/social/posts` | Bạn bè, nhóm và post ảnh                |
| Events        | `GET/POST /events`, `PATCH /events/:id`, `/events/:id/accept`, `/events/shares`       | Lịch hẹn và chia sẻ địa điểm            |
| Notifications | `GET /notifications`, `PATCH /notifications/:id/read`                                 | Inbox thông báo                         |
| Media         | `POST /media/uploads`, `/media/uploads/confirm`                                       | Xin URL upload và xác nhận media        |
| Admin         | `POST /admin/categories`, `/admin/places`; `PATCH /admin/places/:id`                  | Quản trị curated content (role `admin`) |

## Quy ước response

- List cursor trả `{ data, nextCursor }`; truyền `cursor` để tải trang kế tiếp.
- Lỗi validation và quyền dùng HTTP status chuẩn từ NestJS (`400`, `401`, `403`, `404`, `429`).
- API chấp nhận số điện thoại Việt Nam dạng `0...`, `84...` hoặc `+84...`; backend lưu chuẩn `+84...`.
