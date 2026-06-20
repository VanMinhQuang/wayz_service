# Chạy Wayz Service

## Yêu cầu

- Node.js 22+
- Docker Desktop (MongoDB + Redis)

## Thiết lập local

```bash
copy .env.example .env
docker compose up -d mongo redis mongo-init
npm install
npm run start:dev
```

Kiểm tra health thủ công qua Swagger: `http://localhost:3000/docs`.

## Các lệnh

| Lệnh                        | Mục đích                     |
| --------------------------- | ---------------------------- |
| `npm run start:dev`         | Chạy watch mode local        |
| `npm run build`             | Build TypeScript vào `dist/` |
| `npm start`                 | Chạy bản đã build            |
| `npm run lint`              | Kiểm tra ESLint              |
| `npm test`                  | Unit test                    |
| `docker compose up --build` | Chạy full stack trong Docker |

## Cấu hình

Không commit `.env`. Bắt buộc thay `JWT_ACCESS_SECRET` và `JWT_REFRESH_SECRET` bằng chuỗi mạnh ở mọi môi trường ngoài local.

| Biến                                  | Ý nghĩa                                |
| ------------------------------------- | -------------------------------------- |
| `MONGODB_URI`                         | MongoDB replica set URI                |
| `REDIS_HOST`, `REDIS_PORT`            | BullMQ và reminder queue               |
| `MAPVINA_BASE_URL`, `MAPVINA_API_KEY` | Cấu hình adapter MapVina               |
| `S3_ENDPOINT`, `S3_BUCKET`            | Object storage production              |
| `FCM_ENABLED`                         | Bật delivery push sau khi tích hợp FCM |

Mongo phải chạy replica set vì service dùng session/atomic workflow mở rộng được. Docker Compose đã khởi tạo `rs0`.
