const categoryTranslations: Record<string, { ru: string; en: string }> = {
  // Категории кондиционеров
  "сплит-система": { ru: "сплит-система", en: "split-system" },
  "инвертор": { ru: "инвертор", en: "inverter" },
  "мобильный": { ru: "мобильный", en: "portable" },
  "мульти-сплит": { ru: "мульти-сплит", en: "multi-split" },
  "кассетный": { ru: "кассетный", en: "cassette" },

  // Категории фильтров для воды
  "обратный осмос": { ru: "обратный осмос", en: "reverse osmosis" },
  "кувшин": { ru: "кувшин", en: "pitcher" },
  "под мойку": { ru: "под мойку", en: "under-sink" },
  "магистральный": { ru: "магистральный", en: "whole-house" },
  "насадка на кран": { ru: "насадка на кран", en: "faucet-mount" },

  // Категории DummyJSON / FakeStore (англ → рус)
  "beauty": { ru: "красота", en: "beauty" },
  "fragrances": { ru: "парфюмерия", en: "fragrances" },
  "furniture": { ru: "мебель", en: "furniture" },
  "groceries": { ru: "продукты", en: "groceries" },
  "home-decoration": { ru: "декор для дома", en: "home decoration" },
  "kitchen-accessories": { ru: "кухонные аксессуары", en: "kitchen accessories" },
  "laptops": { ru: "ноутбуки", en: "laptops" },
  "mens-shirts": { ru: "мужские рубашки", en: "men's shirts" },
  "mens-shoes": { ru: "мужская обувь", en: "men's shoes" },
  "mens-watches": { ru: "мужские часы", en: "men's watches" },
  "mobile-accessories": { ru: "мобильные аксессуары", en: "mobile accessories" },
  "motorcycle": { ru: "мотоциклы", en: "motorcycle" },
  "skin-care": { ru: "уход за кожей", en: "skin care" },
  "smartphones": { ru: "смартфоны", en: "smartphones" },
  "sports-accessories": { ru: "спортивные аксессуары", en: "sports accessories" },
  "sunglasses": { ru: "солнечные очки", en: "sunglasses" },
  "tablets": { ru: "планшеты", en: "tablets" },
  "tops": { ru: "топы", en: "tops" },
  "vehicle": { ru: "транспорт", en: "vehicle" },
  "womens-bags": { ru: "женские сумки", en: "women's bags" },
  "womens-dresses": { ru: "женские платья", en: "women's dresses" },
  "womens-jewellery": { ru: "женские украшения", en: "women's jewellery" },
  "womens-shoes": { ru: "женская обувь", en: "women's shoes" },
  "womens-watches": { ru: "женские часы", en: "women's watches" },
  "men's clothing": { ru: "мужская одежда", en: "men's clothing" },
  "women's clothing": { ru: "женская одежда", en: "women's clothing" },
  "jewelery": { ru: "ювелирные изделия", en: "jewelery" },
  "electronics": { ru: "электроника", en: "electronics" },
}

const reverseCategoryMap = new Map<string, string>()
for (const [key, val] of Object.entries(categoryTranslations)) {
  if (val.en !== key) {
    reverseCategoryMap.set(val.en, val.ru)
  }
}

export function translateCategory(category: string, locale: string): string {
  const match = categoryTranslations[category]
  if (match) {
    return locale === "en" ? match.en : match.ru
  }
  const fromReverse = reverseCategoryMap.get(category)
  if (fromReverse) {
    return locale === "en" ? category : fromReverse
  }
  return category
}

const sourceTranslations: Record<string, { ru: string; en: string }> = {
  "airconditioners": { ru: "Кондиционеры", en: "Air Conditioners" },
  "waterfilters": { ru: "Фильтры для воды", en: "Water Filters" },
  "dummyjson": { ru: "DummyJSON", en: "DummyJSON" },
  "fakestore": { ru: "FakeStore", en: "FakeStore" },
}

export function translateSource(source: string, locale: string): string {
  const match = sourceTranslations[source]
  if (match) {
    return locale === "en" ? match.en : match.ru
  }
  return source
}
