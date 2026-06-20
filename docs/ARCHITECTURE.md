# Clean Architecture

Wayz tổ chức source theo **feature-first Clean Architecture**. Dependency chỉ đi từ lớp ngoài vào lớp trong:

```text
HTTP controller / DTO / Swagger       presentation
              ↓
Use-case services                     application
              ↓
Business rules, types, contracts      domain
              ↑
MongoDB, MapVina, SMS, S3, FCM, Redis infrastructure
```

## Quy tắc

- `presentation` nhận HTTP, validate DTO, lấy current user và gọi application service; không truy vấn database hay gọi vendor trực tiếp.
- `application` điều phối use case, phân quyền và transaction/atomic update. Đây là nơi đặt service hiện tại; use case mới nên tách thành class riêng khi đủ lớn.
- `domain` không phụ thuộc NestJS, Mongoose hoặc vendor. Khi bổ sung business rule phức tạp, đặt entity/value object/interface repository ở đây.
- `infrastructure` triển khai chi tiết kỹ thuật: Mongoose schemas, BullMQ jobs và adapter vendor. Chỉ composition root/module được phép wire dependency cụ thể.
- Không import controller/DTO vào `infrastructure`. DTO chỉ được dùng ở HTTP boundary; use case lớn nên chuyển sang input type thuộc application/domain.

## Ranh giới hiện tại

Mongo schemas vẫn nằm trong `infrastructure/persistence/mongoose` và application service inject model qua NestJS. Đây là pragmatic clean architecture cho MVP. Bước tiếp theo khi domain lớn hơn là tạo repository interface trong `modules/<feature>/domain` và Mongoose repository implementation trong `infrastructure/persistence`.

## Adapter bên ngoài

- `MapVinaService`: cổng geocode và routing; không để URL/key rò vào controller.
- `SmsService`: cổng OTP; local chỉ log OTP.
- `MediaStorageService`: cổng pre-signed upload/read URL.
- `NotificationService`: lưu inbox trước, sau đó có thể thêm FCM delivery.

Thay vendor bằng cách đổi adapter/provider trong `InfraModule`, không thay API nghiệp vụ.
