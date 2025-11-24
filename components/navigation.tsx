"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/products", label: "Products" },
  { href: "/sources", label: "Sources" },
]

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()

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
            {session && (
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {session.user?.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

