# Bruno API collection

Mở thư mục `bruno/wayz-service` bằng Bruno Desktop, chọn environment **local**, rồi chạy request theo số thứ tự.

## Luồng local

1. Chạy API và MongoDB/Redis theo [RUNBOOK](../docs/RUNBOOK.md).
2. Trong `.env`, đặt `SMS_PROVIDER=console` (mặc định).
3. Chạy **01-auth / Request register OTP**; terminal API in OTP sáu số.
4. Thay biến `otp` của environment bằng mã đó, chạy **Register** hoặc **Login**. Request tự lưu `accessToken` và `refreshToken`.
5. Tạo category/place bằng tài khoản đã có role `admin`, rồi điền `_id` vào `categoryId`/`placeId` trước khi chạy review hoặc event.

## Biến environment

Không commit credential thật. `local.bru` chỉ có dữ liệu mẫu; sửa `phone`, `password`, `otp` trong Bruno UI. Các biến token, `groupId`, `eventId` được request ghi tự động.

`06-admin` trả `403` cho user thông thường. Để thử, cập nhật document MongoDB của user có `roles: ["user", "admin"]`, sau đó login lại để nhận JWT chứa role mới.
