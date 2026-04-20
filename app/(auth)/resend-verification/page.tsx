'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'

export default function ResendVerificationPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit() {
    if (!email) return
    setLoading(true)
    setError('')
    try {
      await api.post('/auth/resend-verification', { email })
      setSent(true)
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="bg-card border border-border rounded-xl p-8 w-full max-w-md text-center space-y-4">
          <div className="text-5xl">📧</div>
          <h1 className="text-2xl font-bold">Check your email</h1>
          <p className="text-muted-foreground">
            If <strong>{email}</strong> exists and is not verified, we sent a new verification link.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="w-full bg-primary text-primary-foreground rounded-lg py-2 font-medium hover:opacity-90 transition"
          >
            Back to login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="bg-card border border-border rounded-xl p-8 w-full max-w-md space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold">Resend verification email</h1>
          <p className="text-muted-foreground text-sm">
            Enter your email and we will send a new verification link.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="you@example.com"
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {error && (
          <p className="text-destructive text-sm">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || !email}
          className="w-full bg-primary text-primary-foreground rounded-lg py-2 font-medium hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send verification email'}
        </button>

        <p className="text-center text-sm text-muted-foreground">
          Already verified?{' '}
          <button onClick={() => router.push('/login')} className="text-primary hover:underline">
            Login
          </button>
        </p>
      </div>
    </div>
  )
}