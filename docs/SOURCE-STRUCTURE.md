# Cấu trúc source

```text
src/
├── bootstrap/                         # Khởi động Nest (`main.ts`)
├── app.module.ts                      # Composition root
├── shared/presentation/http/          # Guard, decorator, pagination dùng chung
├── infrastructure/
│   ├── external/                      # MapVina, SMS, storage, notification adapters
│   └── persistence/mongoose/schemas/  # Mongoose schema và registration module
└── modules/
    ├── auth/
    ├── places/
    ├── social/
    ├── events/
    ├── media/
    └── admin/
        ├── application/               # Service/use-case
        ├── domain/                    # Entity, value object, port (thêm khi cần)
        ├── infrastructure/            # Strategy, worker, repository theo feature
        └── presentation/http/         # Controller, DTO
```

Mỗi feature có `<feature>.module.ts` làm điểm lắp ghép. `app.module.ts` chỉ đăng ký module; không chứa business logic.

## Thêm một API mới

1. Xác định feature phù hợp hoặc tạo `src/modules/<feature>`.
2. Viết DTO/controller trong `presentation/http`.
3. Viết use case trong `application`; không đặt logic vào controller.
4. Nếu cần DB/vendor, thêm contract ở `domain` và implementation ở `infrastructure`.
5. Đăng ký provider/controller tại module feature, thêm test và cập nhật `docs/API.md`.
