// @ts-nocheck
// =============================================================================
// components/common/EmptyState.tsx
// =============================================================================

import { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  icon?: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon: Icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Icon size={28} className="text-muted-foreground" />
        </div>
      )}
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mt-1 max-w-xs">{description}</p>
      )}
      {action && (
        <Button className="mt-4" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}

// =============================================================================
// components/common/ErrorState.tsx
// =============================================================================

import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  message?: string
  onRetry?: () => void
}

export function ErrorState({ message, onRetry }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <AlertCircle size={32} className="text-destructive mb-3" />
      <p className="text-sm text-muted-foreground">
        {message ?? 'Không thể tải dữ liệu. Vui lòng thử lại.'}
      </p>
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-3" onClick={onRetry}>
          Thử lại
        </Button>
      )}
    </div>
  )
}

// =============================================================================
// components/layout/PageHeader.tsx
// Tiêu đề trang + action button — dùng trong các pages
// =============================================================================

interface Props {
  title: string
  description?: string
  action?: React.ReactNode
}

export function PageHeader({ title, description, action }: Props) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
