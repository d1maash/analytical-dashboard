"use client"

import { useEffect, useState } from "react"
import { useStore } from "@/store/useStore"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"
import { TrendingUp, TrendingDown, Package, DollarSign } from "lucide-react"

const COLORS = [
  "hsl(var(--foreground))",
  "hsl(var(--muted-foreground))",
  "hsl(var(--foreground))",
  "hsl(var(--muted-foreground))",
]

export default function DashboardPage() {
  const { analytics, loading, error, setAnalytics, setLoading, setError } =
    useStore()
  const [parsing, setParsing] = useState(false)

  const fetchAnalytics = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/analytics")
      if (!response.ok) throw new Error("Failed to fetch analytics")
      const data = await response.json()
      setAnalytics(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  const handleParse = async () => {
    setParsing(true)
    try {
      const response = await fetch("/api/parse/dummyjson", {
        method: "POST",
      })
      if (!response.ok) throw new Error("Failed to parse data")
      await fetchAnalytics()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setParsing(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  if (loading && !analytics) {
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive analytics overview
          </p>
        </div>
        <button
          onClick={handleParse}
          disabled={parsing}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {parsing ? "Parsing..." : "Parse DummyJSON"}
        </button>
      </div>

      {analytics && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="border border-border rounded-lg p-6 bg-card">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Total Products</p>
                <Package className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold">{analytics.summary.totalProducts}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Across all sources
              </p>
            </div>

            <div className="border border-border rounded-lg p-6 bg-card">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Average Price</p>
                <DollarSign className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold">
                ${analytics.summary.averagePrice?.toFixed(2) || "0.00"}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Price range: ${analytics.summary.minPrice?.toFixed(2) || "0.00"} - ${analytics.summary.maxPrice?.toFixed(2) || "0.00"}
              </p>
            </div>

            <div className="border border-border rounded-lg p-6 bg-card">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Total Value</p>
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold">
                ${analytics.summary.totalValue?.toFixed(2) || "0.00"}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Sum of all products
              </p>
            </div>

            <div className="border border-border rounded-lg p-6 bg-card">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Data Sources</p>
                <TrendingDown className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold">{analytics.summary.totalSources}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Active sources
              </p>
            </div>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Daily Stats */}
            {analytics.dailyStats && analytics.dailyStats.length > 0 && (
              <div className="border border-border rounded-lg p-6 bg-card">
                <h2 className="text-xl font-semibold mb-4">7-Day Price Trends</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.dailyStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="avgPrice"
                      stroke="hsl(var(--foreground))"
                      strokeWidth={2}
                      name="Avg Price"
                    />
                    <Line
                      type="monotone"
                      dataKey="minPrice"
                      stroke="hsl(var(--muted-foreground))"
                      strokeDasharray="5 5"
                      name="Min Price"
                    />
                    <Line
                      type="monotone"
                      dataKey="maxPrice"
                      stroke="hsl(var(--muted-foreground))"
                      strokeDasharray="5 5"
                      name="Max Price"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Price Distribution */}
            {analytics.priceDistribution && analytics.priceDistribution.length > 0 && (
              <div className="border border-border rounded-lg p-6 bg-card">
                <h2 className="text-xl font-semibold mb-4">Price Distribution</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.priceDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ range, percent }) => `${range}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {analytics.priceDistribution.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Products by Source */}
            <div className="border border-border rounded-lg p-6 bg-card">
              <h2 className="text-xl font-semibold mb-4">Products by Source</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.sources}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="source" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="hsl(var(--foreground))" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Average Price by Category */}
            <div className="border border-border rounded-lg p-6 bg-card">
              <h2 className="text-xl font-semibold mb-4">
                Average Price by Category
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.categories}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="category"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="averagePrice"
                    fill="hsl(var(--foreground))"
                    name="Avg Price"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Charts Row 3 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Source Price Statistics */}
            {analytics.sourcePriceStats && analytics.sourcePriceStats.length > 0 && (
              <div className="border border-border rounded-lg p-6 bg-card">
                <h2 className="text-xl font-semibold mb-4">Source Price Analysis</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.sourcePriceStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="source" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="averagePrice" fill="hsl(var(--foreground))" name="Avg Price" />
                    <Bar dataKey="minPrice" fill="hsl(var(--muted-foreground))" name="Min Price" />
                    <Bar dataKey="maxPrice" fill="hsl(var(--muted-foreground))" name="Max Price" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Top Categories */}
            {analytics.topCategories && analytics.topCategories.length > 0 && (
              <div className="border border-border rounded-lg p-6 bg-card">
                <h2 className="text-xl font-semibold mb-4">Top Categories</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.topCategories}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="category"
                      angle={-45}
                      textAnchor="end"
                      height={100}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="hsl(var(--foreground))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Category Details Table */}
          <div className="border border-border rounded-lg p-6 bg-card mb-8">
            <h2 className="text-xl font-semibold mb-4">Category Statistics</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3">Category</th>
                    <th className="text-left p-3">Count</th>
                    <th className="text-left p-3">Avg Price</th>
                    <th className="text-left p-3">Min Price</th>
                    <th className="text-left p-3">Max Price</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.categories.map((cat: any) => (
                    <tr key={cat.category} className="border-b border-border hover:bg-muted/50">
                      <td className="p-3 font-medium">{cat.category}</td>
                      <td className="p-3">{cat.count}</td>
                      <td className="p-3">${cat.averagePrice?.toFixed(2) || "0.00"}</td>
                      <td className="p-3">${cat.minPrice?.toFixed(2) || "0.00"}</td>
                      <td className="p-3">${cat.maxPrice?.toFixed(2) || "0.00"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Products */}
          <div className="border border-border rounded-lg p-6 bg-card">
            <h2 className="text-xl font-semibold mb-4">Recent Products</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3">Title</th>
                    <th className="text-left p-3">Category</th>
                    <th className="text-left p-3">Price</th>
                    <th className="text-left p-3">Source</th>
                    <th className="text-left p-3">Fetched At</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.recentProducts.map((product: any) => (
                    <tr key={product.id} className="border-b border-border hover:bg-muted/50">
                      <td className="p-3">{product.title}</td>
                      <td className="p-3">{product.category}</td>
                      <td className="p-3 font-medium">${product.price.toFixed(2)}</td>
                      <td className="p-3">{product.source}</td>
                      <td className="p-3">
                        {new Date(product.fetchedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
