# Analytical Dashboard

Минималистичная платформа для аналитики продаж.

## Технологии

- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- PostgreSQL (Docker)
- Prisma ORM
- NextAuth.js (аутентификация)
- Recharts (графики)
- Zustand (state management)
- bcryptjs (хеширование паролей)

## Установка

1. Установите зависимости:
```bash
npm install
```

2. Запустите PostgreSQL через Docker:
```bash
docker-compose up -d
```

3. Создайте файл `.env` в корне проекта:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/analytical_dashboard?schema=public"
NEXTAUTH_SECRET="your-secret-key-here-generate-a-random-string"
NEXTAUTH_URL="http://localhost:3000"
```

4. Инициализируйте базу данных:
```bash
npm run db:generate
npm run db:push
```

5. Запустите приложение:
```bash
npm run dev
```

## Использование

1. Откройте http://localhost:3000
2. Зарегистрируйте новый аккаунт или войдите в существующий
3. Перейдите на Dashboard
4. Нажмите "Parse DummyJSON" или "Parse FakeStore" для загрузки данных
5. Просматривайте расширенную аналитику, продукты и прогнозы

## Функции

- 🔐 Система регистрации и аутентификации (NextAuth.js)
- 📊 Расширенная аналитика с множеством графиков и метрик
- 📈 Прогнозирование цен (moving average)
- 🎨 Минималистичный черно-белый дизайн
- 📱 Адаптивный интерфейс

## API Endpoints

- `POST /api/parse/dummyjson` - Парсинг данных из DummyJSON
- `POST /api/parse/fakestore` - Парсинг данных из FakeStore API
- `GET /api/products` - Список продуктов
- `GET /api/products/[id]` - Детали продукта
- `GET /api/analytics` - Аналитика
- `GET /api/forecast/[id]` - Прогноз для продукта

