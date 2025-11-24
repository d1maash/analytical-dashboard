"use client"

import { useEffect, useState } from "react"

interface SourceStats {
  source: string
  count: number
  averagePrice: number | null
  minPrice: number | null
  maxPrice: number | null
  categories: string[]
}

export default function SourcesPage() {
  const [sources, setSources] = useState<SourceStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSources = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch("/api/products?limit=1000")
        if (!response.ok) throw new Error("Failed to fetch products")
        const data = await response.json()

        // Group by source
        const sourceMap = new Map<string, SourceStats>()

        data.products.forEach((product: any) => {
          if (!sourceMap.has(product.source)) {
            sourceMap.set(product.source, {
              source: product.source,
              count: 0,
              averagePrice: null,
              minPrice: null,
              maxPrice: null,
              categories: [],
            })
          }

          const stats = sourceMap.get(product.source)!
          stats.count++
          stats.categories.push(product.category)

          if (stats.minPrice === null || product.price < stats.minPrice) {
            stats.minPrice = product.price
          }
          if (stats.maxPrice === null || product.price > stats.maxPrice) {
            stats.maxPrice = product.price
          }
        })

        // Calculate averages
        const sourceStats = Array.from(sourceMap.values()).map((stats) => {
          const prices = data.products
            .filter((p: any) => p.source === stats.source)
            .map((p: any) => p.price)
          const avg =
            prices.length > 0
              ? prices.reduce((a: number, b: number) => a + b, 0) /
                prices.length
              : null

          return {
            ...stats,
            averagePrice: avg,
            categories: [...new Set(stats.categories)],
          }
        })

        setSources(sourceStats)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchSources()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Data Sources</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sources.map((source) => (
          <div
            key={source.source}
            className="border border-border rounded-lg p-6"
          >
            <h2 className="text-2xl font-semibold mb-4 capitalize">
              {source.source}
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-xl font-bold">{source.count}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Average Price</p>
                <p className="text-xl font-bold">
                  ${source.averagePrice?.toFixed(2) || "N/A"}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-muted-foreground">Min Price</p>
                  <p className="text-lg">
                    ${source.minPrice?.toFixed(2) || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Max Price</p>
                  <p className="text-lg">
                    ${source.maxPrice?.toFixed(2) || "N/A"}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Categories ({source.categories.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {source.categories.slice(0, 5).map((cat) => (
                    <span
                      key={cat}
                      className="px-2 py-1 bg-muted rounded text-xs"
                    >
                      {cat}
                    </span>
                  ))}
                  {source.categories.length > 5 && (
                    <span className="px-2 py-1 text-xs text-muted-foreground">
                      +{source.categories.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sources.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No sources found</p>
        </div>
      )}
    </div>
  )
}

