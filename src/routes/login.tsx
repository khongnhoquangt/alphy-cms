import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { setAuth, isAuthenticated, validateKey } from '@/lib/auth'

export const Route = createFileRoute('/login')({
  beforeLoad: () => {
    if (isAuthenticated()) {
      throw { redirect: { to: '/dashboard' } }
    }
  },
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const [key, setKey] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!key.trim()) {
      setError('Key is required')
      return
    }

    // Validate the key against the secret key
    if (!validateKey(key.trim())) {
      setError('Invalid authentication key')
      return
    }

    // Save to cookies
    setAuth(key.trim())
    
    // Navigate to dashboard
    navigate({ to: '/dashboard' })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Wallet Tracker
          </CardTitle>
          <CardDescription className="text-center">
            Enter your authentication key to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="key">Authentication Key</Label>
              <Input
                id="key"
                type="password"
                placeholder="Enter your key"
                value={key}
                onChange={(e) => setKey(e.target.value)}
              />
            </div>
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}