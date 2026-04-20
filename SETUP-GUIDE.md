# AffKit Frontend — Tuần 5: Hướng dẫn Setup hoàn chỉnh

> Tạo bởi: Claude  
> Ngày: 08/04/2026  
> Stack: Next.js 14 · TypeScript · Tailwind · Shadcn UI · TanStack Query · Zustand · Axios

---

## Bước 1 — Khởi tạo project

```powershell
# Chạy từ thư mục gốc (cùng cấp với affkit-backend/)
cd D:\data-warehouse\project_consumer

npx create-next-app@14 affkit-frontend `
  --typescript --tailwind --eslint --app `
  --no-src-dir --import-alias "@/*"

cd affkit-frontend
```

## Bước 2 — Cài đặt tất cả dependencies

```powershell
# State management + API
npm install @tanstack/react-query@^5.0.0 @tanstack/react-query-devtools@^5.0.0 axios@^1.6.0 zustand@^4.4.0

# Form + Validation
npm install react-hook-form@^7.49.0 zod@^3.22.0 @hookform/resolvers@^3.3.0

# UI + Charts + Icons
npm install recharts@^2.10.0 lucide-react sonner@^1.3.0 tailwind-merge@^2.2.0 clsx@^2.1.0 class-variance-authority@^0.7.0 tailwindcss-animate

# Radix UI primitives
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-select @radix-ui/react-tooltip @radix-ui/react-slot @radix-ui/react-label @radix-ui/react-separator @radix-ui/react-avatar @radix-ui/react-tabs @radix-ui/react-scroll-area
```

## Bước 3 — Khởi tạo Shadcn UI

```powershell
npx shadcn@latest init
# Chọn: Dark theme, CSS variables: yes

# Thêm components
npx shadcn@latest add button input label card badge dialog table dropdown-menu select tooltip skeleton separator avatar tabs scroll-area alert form textarea
```

## Bước 4 — Tạo cấu trúc thư mục

```powershell
# Tạo tất cả folders
New-Item -ItemType Directory -Force -Path `
  "app/(auth)/login", "app/(auth)/register", "app/(auth)/verify-email", `
  "app/(auth)/resend-verification", "app/(auth)/forgot-password", "app/(auth)/reset-password", `
  "app/(dashboard)/links/[id]", "app/(dashboard)/campaigns/[id]", `
  "app/(dashboard)/analytics", "app/(dashboard)/settings", `
  "app/go/[shortCode]", "app/link-deleted", `
  "components/layout", "components/auth", "components/links", `
  "components/analytics", "components/campaigns", "components/common", `
  "hooks", "lib/api", "store", "types", "public"
```

## Bước 5 — Copy các file từ setup package

Đặt từng file vào đúng vị trí theo bảng dưới:

---

## File Placement Map

### Config files (root của project)

| File trong setup | Đặt vào |
|---|---|
| `03-next.config.js` | `next.config.js` |
| `tailwind.config.ts` | `tailwind.config.ts` |
| `middleware.ts` | `middleware.ts` |
| `02-env.local.example` | `.env.local` (đổi tên) |

### app/

| File trong setup | Đặt vào |
|---|---|
| `app/globals.css` | `app/globals.css` (thay file có sẵn) |
| `app/layout.tsx` | `app/layout.tsx` |
| `app/(auth)/layout.tsx` | `app/(auth)/layout.tsx` |
| `app/(auth)/login/page.tsx` | `app/(auth)/login/page.tsx` |
| `app/(dashboard)/layout.tsx` | `app/(dashboard)/layout.tsx` |
| `app/(dashboard)/page.tsx` | `app/(dashboard)/page.tsx` |

### Từ `app/(auth)/verify-forgot-pages.tsx`
File này chứa 2 components — tách ra:
- `VerifyEmailPage` → `app/(auth)/verify-email/page.tsx`
- `ForgotPasswordPage` → `app/(auth)/forgot-password/page.tsx`

### types/

| File trong setup | Đặt vào |
|---|---|
| `types/api.ts` | `types/api.ts` |
| `types/auth.ts` | `types/auth.ts` |
| `types/link.ts` | `types/link.ts` |
| `types/analytics-campaign.ts` | tách thành `types/analytics.ts` + `types/campaign.ts` |

### store/

| File trong setup | Đặt vào |
|---|---|
| `store/authStore.ts` | `store/authStore.ts` |
| `store/uiStore.ts` | `store/uiStore.ts` |

### lib/

| File trong setup | Đặt vào |
|---|---|
| `lib/api.ts` | `lib/api.ts` |
| `lib/api-services.ts` | tách thành `lib/api/auth.ts`, `lib/api/links.ts`, `lib/api/analytics.ts`, `lib/api/campaigns.ts` |
| `lib/queryClient-keys.ts` | tách thành `lib/queryClient.ts` + `lib/queryKeys.ts` |
| `lib/utils-validators.ts` | tách thành `lib/utils.ts` + `lib/constants.ts` + `lib/validators.ts` |

### hooks/

| File trong setup | Đặt vào |
|---|---|
| `hooks/all-hooks.ts` | tách thành `hooks/useAuth.ts`, `hooks/useLinks.ts`, `hooks/useAnalytics.ts`, `hooks/useCampaigns.ts`, `hooks/useCopyToClipboard.ts` |

### components/

| File trong setup | Đặt vào |
|---|---|
| `components/common/Providers.tsx` | `components/common/Providers.tsx` |
| `components/auth/LoginForm.tsx` | `components/auth/LoginForm.tsx` |
| `components/auth/RegisterForm.tsx` | `components/auth/RegisterForm.tsx` |
| `components/auth/PasswordStrengthBar.tsx` | `components/auth/PasswordStrengthBar.tsx` |
| `components/layout/Sidebar.tsx` | `components/layout/Sidebar.tsx` |
| `components/layout/Navbar-Banner.tsx` | tách thành `components/layout/Navbar.tsx` + `components/layout/PlanLimitBanner.tsx` |
| `components/analytics/analytics-components.tsx` | tách thành 4 files riêng trong `components/analytics/` |
| `components/links/links-components.tsx` | tách thành `links/PlatformBadge.tsx`, `links/CopyLinkButton.tsx`, `links/LinkFilters.tsx` + `app/(dashboard)/links/page.tsx` |
| `components/links/LinkTable-Dialogs.tsx` | tách thành `links/LinkTable.tsx`, `links/DeleteLinkDialog.tsx`, `links/EditLinkModal.tsx` |
| `components/links/CreateLinkModal.tsx` | `components/links/CreateLinkModal.tsx` |
| `components/campaigns/campaign-components.tsx` | tách thành 5 files trong `components/campaigns/` + `app/(dashboard)/campaigns/page.tsx` |

---

## Bước 6 — Tạo file .env.local

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SHORT_URL_BASE=http://localhost:8080/go
```

## Bước 7 — Thêm CORS cho backend

Trong Spring Boot (`WebConfig.java` hoặc `SecurityConfig.java`), đảm bảo allow:
```java
.allowedOrigins("http://localhost:3000")
.allowedMethods("GET", "POST", "PATCH", "DELETE", "OPTIONS")
.allowCredentials(true)   // QUAN TRỌNG — cho phép gửi cookie
```

## Bước 8 — Chạy

```powershell
# Đảm bảo backend đang chạy trước
# docker start affkit-postgres affkit-redis
# cd affkit-backend && .\mvnw.cmd spring-boot:run

# Chạy frontend
cd affkit-frontend
npm run dev
# → http://localhost:3000
```

---

## Kiến trúc dữ liệu

```
Browser
│
├── Zustand (in-memory)
│   ├── authStore: { user, accessToken, isAuthenticated }
│   └── uiStore:  { isSidebarOpen, isCreateLinkModalOpen }
│
├── TanStack Query (server cache)
│   ├── links.list(params) → staleTime: 30s
│   ├── analytics.overview(period) → staleTime: 5m
│   └── campaigns.list(params) → staleTime: 30s
│
└── Axios (HTTP)
    ├── Request: Bearer {accessToken} từ Zustand
    ├── Response: unwrap ApiResponse<T>.data
    └── 401 handler: auto refresh → retry → logout nếu fail
```

## Security Notes

- ✅ Access token: Zustand (memory only, không localStorage)  
- ✅ Refresh token: httpOnly cookie (server set, JS không đọc được)
- ✅ Route protection: Next.js middleware kiểm tra refresh_token cookie
- ✅ Auto refresh: Axios interceptor xử lý 401 tự động

---

## Checklist Tuần 5

- [ ] Project khởi tạo thành công (`npm run dev` không lỗi)
- [ ] Shadcn UI components add xong
- [ ] `.env.local` đã tạo
- [ ] Backend CORS đã allow `localhost:3000` với `allowCredentials: true`
- [ ] Đăng ký tài khoản thành công
- [ ] Login/logout hoạt động
- [ ] Verify email qua link trong email hoạt động
- [ ] Dashboard hiển thị stats (có thể là 0 nếu chưa có click)
- [ ] Tạo link mới — nhận short URL
- [ ] Copy short URL
- [ ] Danh sách links hiển thị
- [ ] Xóa link hoạt động
- [ ] Tạo campaign
- [ ] Middleware redirect đúng (unauthenticated → /login)

---

*AffKit Frontend Setup Guide — Tuần 5 — 08/04/2026*
