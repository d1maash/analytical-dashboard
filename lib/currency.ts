export type Currency = "USD" | "KZT"

const USD_TO_KZT_RATE = 450 // Примерный курс обмена

/** Источники, у которых цена в БД хранится в тенге (локальные каталоги KZ). */
const KZT_STORED_SOURCES = new Set(["waterfilters", "airconditioners"])

export function getStoredPriceCurrency(source: string): Currency {
  return KZT_STORED_SOURCES.has(source) ? "KZT" : "USD"
}

export function convertCurrency(amount: number, from: Currency, to: Currency): number {
  if (from === to) return amount
  
  if (from === "USD" && to === "KZT") {
    return amount * USD_TO_KZT_RATE
  }
  
  if (from === "KZT" && to === "USD") {
    return amount / USD_TO_KZT_RATE
  }
  
  return amount
}

export function formatCurrency(amount: number, currency: Currency, locale: string = "ru"): string {
  if (currency === "KZT") {
    return new Intl.NumberFormat(locale === "ru" ? "ru-RU" : "en-US", {
      style: "currency",
      currency: "KZT",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }
  
  return new Intl.NumberFormat(locale === "ru" ? "ru-RU" : "en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function getCurrencyForLocale(locale: string): Currency {
  return locale === "ru" ? "KZT" : "USD"
}

