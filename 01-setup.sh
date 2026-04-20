#!/bin/bash
# =============================================================================
# AffKit Frontend — Tuần 5 Setup Script
# Next.js 14 + Tailwind + Shadcn UI
# Chạy từ thư mục gốc project (cùng cấp với affkit-backend/)
# =============================================================================

set -e

echo "🚀 Khởi tạo AffKit Frontend..."

# 1. Tạo Next.js 14 project
npx create-next-app@14 affkit-frontend \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --no-src-dir \
  --import-alias "@/*"

cd affkit-frontend

echo "📦 Cài đặt dependencies..."

# 2. State management + API
npm install \
  @tanstack/react-query@^5.0.0 \
  @tanstack/react-query-devtools@^5.0.0 \
  axios@^1.6.0 \
  zustand@^4.4.0

# 3. Form + Validation
npm install \
  react-hook-form@^7.49.0 \
  zod@^3.22.0 \
  @hookform/resolvers@^3.3.0

# 4. UI + Charts
npm install \
  recharts@^2.10.0 \
  lucide-react \
  sonner@^1.3.0 \
  tailwind-merge@^2.2.0 \
  clsx@^2.1.0 \
  class-variance-authority@^0.7.0

# 5. Radix UI primitives (dùng bởi Shadcn)
npm install \
  @radix-ui/react-dialog \
  @radix-ui/react-dropdown-menu \
  @radix-ui/react-select \
  @radix-ui/react-tooltip \
  @radix-ui/react-slot \
  @radix-ui/react-label \
  @radix-ui/react-separator \
  @radix-ui/react-avatar \
  @radix-ui/react-tabs \
  @radix-ui/react-badge \
  @radix-ui/react-scroll-area

echo "🎨 Khởi tạo Shadcn UI..."

# 6. Init Shadcn
npx shadcn@latest init --yes --defaults

# 7. Add Shadcn components
npx shadcn@latest add button input label card badge \
  dialog table dropdown-menu select tooltip \
  skeleton separator avatar tabs scroll-area \
  alert form textarea --yes

echo "📁 Tạo cấu trúc thư mục..."

# 8. Create directory structure
mkdir -p \
  app/\(auth\)/login \
  app/\(auth\)/register \
  app/\(auth\)/verify-email \
  app/\(auth\)/resend-verification \
  app/\(auth\)/forgot-password \
  app/\(auth\)/reset-password \
  app/\(dashboard\)/links/\[id\] \
  app/\(dashboard\)/campaigns/\[id\] \
  app/\(dashboard\)/analytics \
  app/\(dashboard\)/settings \
  app/go/\[shortCode\] \
  app/link-deleted \
  components/ui \
  components/layout \
  components/auth \
  components/links \
  components/analytics \
  components/campaigns \
  components/common \
  hooks \
  lib/api \
  store \
  types \
  public

echo "✅ Setup hoàn tất! Tiếp theo chạy: cd affkit-frontend && npm run dev"
echo ""
echo "📋 Các bước tiếp theo:"
echo "  1. Copy các file từ affkit-frontend-setup/ vào đúng vị trí"
echo "  2. Tạo file .env.local"
echo "  3. npm run dev"
