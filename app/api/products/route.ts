import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth-helpers"

export async function GET(request: Request) {
  try {
    await requireAuth()
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const source = searchParams.get("source")
    const limit = parseInt(searchParams.get("limit") || "50")
    const offset = parseInt(searchParams.get("offset") || "0")

    const where: any = {}
    if (category) where.category = category
    if (source) where.source = source

    const [products, total] = await Promise.all([
      prisma.productExternalData.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { fetchedAt: "desc" },
      }),
      prisma.productExternalData.count({ where }),
    ])

    return NextResponse.json({
      products,
      total,
      limit,
      offset,
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

