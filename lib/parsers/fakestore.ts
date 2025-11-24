import { NormalizedProduct } from "@/lib/parsers/dummyjson"

interface FakeStoreProduct {
  id: number
  title: string
  price: number
  category: string
  image: string
}

type FakeStoreResponse = FakeStoreProduct[]

export async function parseFakeStore(): Promise<NormalizedProduct[]> {
  const response = await fetch("https://fakestoreapi.com/products")

  if (!response.ok) {
    throw new Error(`Failed to fetch FakeStore: ${response.statusText}`)
  }

  const products: FakeStoreResponse = await response.json()

  return products.map((product) => ({
    externalId: `fakestore-${product.id}`,
    title: product.title,
    price: product.price,
    category: product.category,
    image: product.image,
    source: "fakestore",
    fetchedAt: new Date(),
  }))
}

