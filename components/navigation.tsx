"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/LanguageContext"
import { LanguageSelector } from "@/components/language-selector"

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const { t } = useLanguage()

  const navItems = [
    { href: "/dashboard", label: t.common.dashboard },
    { href: "/products", label: t.common.products },
    { href: "/sources", label: t.common.sources },
  ]

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push("/login")
    router.refresh()
  }

  return (
    <nav className="border-b border-border bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/dashboard" className="text-xl font-semibold">
            Analytical Dashboard
          </Link>
          <div className="flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-foreground/80",
                  pathname === item.href
                    ? "text-foreground"
                    : "text-foreground/60"
                )}
              >
                {item.label}
              </Link>
            ))}
            <LanguageSelector />
            {session && (
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {session.user?.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t.common.signOut}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

