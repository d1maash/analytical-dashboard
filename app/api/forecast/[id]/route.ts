import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { forecastWithConfidence } from "@/lib/forecast/forecastEngine"
import { requireAuth } from "@/lib/auth-helpers"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth()
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const product = await prisma.productExternalData.findUnique({
      where: { id: params.id },
    })

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    // Get historical data for this product (by externalId)
    const history = await prisma.productExternalData.findMany({
      where: {
        externalId: product.externalId,
      },
      orderBy: {
        fetchedAt: "asc",
      },
      select: {
        price: true,
        fetchedAt: true,
      },
    })

    if (history.length === 0) {
      return NextResponse.json(
        { error: "No historical data available" },
        { status: 404 }
      )
    }

    const forecast = forecastWithConfidence(history)

    return NextResponse.json({
      product: {
        id: product.id,
        title: product.title,
        currentPrice: product.price,
      },
      forecast,
      history: history.map((h) => ({
        price: h.price,
        date: h.fetchedAt,
      })),
    })
  } catch (error) {
    console.error("Error generating forecast:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

