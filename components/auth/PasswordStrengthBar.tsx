// =============================================================================
// components/auth/PasswordStrengthBar.tsx
// =============================================================================

'use client'

import { cn } from '@/lib/utils'

interface Props {
  password: string
}

function getStrength(password: string): { score: number; label: string; color: string } {
  if (!password) return { score: 0, label: '', color: '' }

  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password)) score++

  if (score <= 1) return { score: 1, label: 'Yếu', color: 'bg-destructive' }
  if (score <= 2) return { score: 2, label: 'Trung bình', color: 'bg-yellow-500' }
  if (score <= 3) return { score: 3, label: 'Khá', color: 'bg-blue-500' }
  return { score: 4, label: 'Mạnh', color: 'bg-green-500' }
}

export function PasswordStrengthBar({ password }: Props) {
  const { score, label, color } = getStrength(password)

  if (!password) return null

  return (
    <div className="space-y-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              'h-1 flex-1 rounded-full transition-all duration-300',
              i <= score ? color : 'bg-muted'
            )}
          />
        ))}
      </div>
      <p className={cn(
        'text-xs',
        score === 1 && 'text-destructive',
        score === 2 && 'text-yellow-500',
        score === 3 && 'text-blue-500',
        score === 4 && 'text-green-500',
      )}>
        Độ mạnh: {label}
      </p>
    </div>
  )
}
