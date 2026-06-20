# Wayz Service

Backend NestJS cho Wayz: khám phá địa điểm tại Việt Nam, đánh giá, bạn bè, nhóm, post ảnh, chia sẻ địa điểm và lịch hẹn.

## Bắt đầu nhanh

```bash
copy .env.example .env
docker compose up -d mongo redis mongo-init
npm install
npm run start:dev
```

API chạy tại `http://localhost:3000`; Swagger ở `http://localhost:3000/docs`.

## Tài liệu

- [Clean Architecture và quy ước code](docs/ARCHITECTURE.md)
- [Cấu trúc source](docs/SOURCE-STRUCTURE.md)
- [Hướng dẫn chạy và cấu hình](docs/RUNBOOK.md)
- [Danh mục API](docs/API.md)

MapVina, SMS, S3 và FCM được cô lập qua adapter. Local dùng SMS logger; MapVina cần URL/key và mapping API thực tế trước khi gọi route/geocode được.
