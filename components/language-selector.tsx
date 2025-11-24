"use client"

import { useLanguage } from "@/contexts/LanguageContext"
import { Locale, locales } from "@/lib/i18n"
import { Globe } from "lucide-react"

export function LanguageSelector() {
  const { locale, setLocale, t } = useLanguage()

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        className="border border-border rounded px-2 py-1 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {locales.map((loc) => (
          <option key={loc} value={loc}>
            {loc === "ru" ? "Русский" : "English"}
          </option>
        ))}
      </select>
    </div>
  )
}

