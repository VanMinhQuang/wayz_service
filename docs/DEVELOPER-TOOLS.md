# Công cụ phát triển và snippets

## VS Code cho backend NestJS

Workspace đề xuất cài tự động các extension trong [`.vscode/extensions.json`](../.vscode/extensions.json):

| Extension | Mục đích |
| --- | --- |
| ESLint (`dbaeumer.vscode-eslint`) | Báo lỗi lint ngay khi code |
| Prettier (`esbenp.prettier-vscode`) | Format TypeScript/JSON/Markdown khi lưu |
| NestJS Snippets (`ronanlevesque.vscode-nestjs`) | Snippet NestJS phổ biến |
| Jest Runner (`firsttris.vscode-jest-runner`) | Chạy/debug test từng file |
| Docker (`ms-azuretools.vscode-docker`) | Làm việc với MongoDB/Redis compose |

Project đã bật Prettier làm formatter mặc định trong [`.vscode/settings.json`](../.vscode/settings.json). Dùng `npm run format` để format toàn bộ hoặc `npm run format:check` trong CI.

### Snippet của Wayz

File [`.vscode/wayz-nest.code-snippets`](../.vscode/wayz-nest.code-snippets) cung cấp các prefix sau:

| Prefix | Tạo |
| --- | --- |
| `wayz-controller` | HTTP controller theo presentation layer |
| `wayz-usecase` | Application service/use case |
| `wayz-dto` | Request DTO với class-validator |
| `wayz-module` | NestJS feature module |

Gõ prefix trong file `.ts`, chọn snippet, rồi dùng `Tab` đi qua các placeholder.

## VS Code cho Swift

Swift không thuộc workspace backend này, nên không thêm extension Swift vào recommendations của repo. Nếu làm iOS/Swift ở workspace khác, cài ở mức user:

| Extension | Mục đích |
| --- | --- |
| Swift (`swift-server.swift`) | Language Server, autocomplete, diagnostics và Swift Package Manager |
| CodeLLDB (`vadimcn.vscode-lldb`) | Debug executable và Swift package |
| SwiftFormat (`vknabel.vscode-swiftformat`) | Format Swift theo SwiftFormat |

Với iOS app UIKit/SwiftUI, Xcode vẫn là lựa chọn tốt nhất cho build, simulator và signing; VS Code phù hợp nhất cho Swift Package/back-end Swift hoặc chỉnh sửa nhẹ.
