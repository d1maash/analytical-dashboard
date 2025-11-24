"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useLanguage } from "@/contexts/LanguageContext"
import { LanguageSelector } from "@/components/language-selector"

export default function LoginPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isLogin) {
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        })

        if (result?.error) {
          setError(t.auth.invalidCredentials)
        } else {
          router.push("/dashboard")
          router.refresh()
        }
      } else {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name }),
        })

        const data = await response.json()

        if (!response.ok) {
          setError(data.error || t.auth.registrationFailed)
        } else {
          // Auto login after registration
          const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
          })

          if (result?.ok) {
            router.push("/dashboard")
            router.refresh()
          }
        }
      }
    } catch (err) {
      setError(t.common.error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="border border-border rounded-lg p-8 bg-card">
          <div className="flex justify-end mb-4">
            <LanguageSelector />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-center">
            {isLogin ? t.auth.signIn : t.auth.signUp}
          </h1>
          <p className="text-muted-foreground text-center mb-8">
            {isLogin ? t.auth.signInToAccount : t.auth.createAccount}
          </p>

          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-2"
                >
                  {t.auth.nameOptional}
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2"
              >
                {t.auth.email}
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
              >
                {t.auth.password}
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? t.common.loading
                : isLogin
                ? t.auth.signIn
                : t.auth.signUp}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin)
                setError(null)
              }}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {isLogin ? t.auth.dontHaveAccount : t.auth.alreadyHaveAccount}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

