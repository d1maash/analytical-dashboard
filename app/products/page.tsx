"use client"

import { useEffect, useState } from "react"
import { useStore } from "@/store/useStore"
import Link from "next/link"

interface Product {
  id: string
  externalId: string
  title: string
  price: number
  category: string
  image?: string | null
  source: string
  fetchedAt: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<string>("")
  const [sourceFilter, setSourceFilter] = useState<string>("")
  const [categories, setCategories] = useState<string[]>([])
  const [sources, setSources] = useState<string[]>([])

  const fetchProducts = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (categoryFilter) params.append("category", categoryFilter)
      if (sourceFilter) params.append("source", sourceFilter)

      const response = await fetch(`/api/products?${params.toString()}`)
      if (!response.ok) throw new Error("Failed to fetch products")
      const data = await response.json()
      setProducts(data.products)

      // Extract unique categories and sources
      const uniqueCategories = [
        ...new Set(data.products.map((p: Product) => p.category)),
      ] as string[]
      const uniqueSources = [
        ...new Set(data.products.map((p: Product) => p.source)),
      ] as string[]
      setCategories(uniqueCategories)
      setSources(uniqueSources)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [categoryFilter, sourceFilter])

  if (loading && products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Products</h1>

      <div className="flex gap-4 mb-6">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border border-border rounded px-4 py-2 bg-background"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="border border-border rounded px-4 py-2 bg-background"
        >
          <option value="">All Sources</option>
          {sources.map((src) => (
            <option key={src} value={src}>
              {src}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="border border-border rounded-lg p-4 hover:border-foreground/50 transition-colors"
          >
            {product.image && (
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-48 object-cover rounded mb-4"
              />
            )}
            <h2 className="text-lg font-semibold mb-2 line-clamp-2">
              {product.title}
            </h2>
            <p className="text-sm text-muted-foreground mb-2">
              {product.category}
            </p>
            <p className="text-xl font-bold">${product.price.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Source: {product.source}
            </p>
          </Link>
        ))}
      </div>

      {products.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found</p>
        </div>
      )}
    </div>
  )
}

