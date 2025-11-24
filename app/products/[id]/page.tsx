"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface Product {
  id: string
  externalId: string
  title: string
  price: number
  category: string
  image?: string | null
  source: string
  fetchedAt: string
  createdAt: string
  updatedAt: string
}

interface Forecast {
  product: {
    id: string
    title: string
    currentPrice: number
  }
  forecast: {
    forecast: number
    confidence: number
    min: number
    max: number
  }
  history: Array<{
    price: number
    date: string
  }>
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [forecast, setForecast] = useState<Forecast | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const [productRes, forecastRes] = await Promise.all([
          fetch(`/api/products/${params.id}`),
          fetch(`/api/forecast/${params.id}`),
        ])

        if (!productRes.ok) throw new Error("Failed to fetch product")
        const productData = await productRes.json()
        setProduct(productData)

        if (forecastRes.ok) {
          const forecastData = await forecastRes.json()
          setForecast(forecastData)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchData()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded">
          Error: {error || "Product not found"}
        </div>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 border border-border rounded hover:bg-accent"
        >
          Go Back
        </button>
      </div>
    )
  }

  const chartData = forecast?.history.map((h) => ({
    date: new Date(h.date).toLocaleDateString(),
    price: h.price,
  })) || []

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="mb-4 text-muted-foreground hover:text-foreground"
      >
        ← Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div>
          {product.image && (
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-96 object-cover rounded-lg mb-4"
            />
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Category</p>
              <p className="text-lg">{product.category}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Price</p>
              <p className="text-3xl font-bold">${product.price.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Source</p>
              <p className="text-lg">{product.source}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">External ID</p>
              <p className="text-lg font-mono text-sm">{product.externalId}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Fetched At</p>
              <p className="text-lg">
                {new Date(product.fetchedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {forecast && (
        <div className="border border-border rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Price Forecast</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Forecast</p>
              <p className="text-2xl font-bold">
                ${forecast.forecast.forecast.toFixed(2)}
              </p>
            </div>
            <div className="border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Confidence</p>
              <p className="text-2xl font-bold">
                {(forecast.forecast.confidence * 100).toFixed(1)}%
              </p>
            </div>
            <div className="border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Range</p>
              <p className="text-lg">
                ${forecast.forecast.min.toFixed(2)} - $
                {forecast.forecast.max.toFixed(2)}
              </p>
            </div>
          </div>

          {chartData.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Price History</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="hsl(var(--foreground))"
                    name="Price"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

