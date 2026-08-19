# Global Companies Platform

نواة تطبيق Next.js لإدارة قاعدة بيانات شركات عالمية، مصممة للعمل مع Prisma وSupabase PostgreSQL وVercel.

## البنية

```text
Browser
  ↓
Next.js API
  ↓
Prisma
  ↓
Supabase PostgreSQL
```

المتصفح لا يتصل بقاعدة البيانات مباشرة.

## الإعداد المحلي

انسخ `.env.example` إلى `.env` وأدخل بيانات Supabase من زر **Connect**:

```env
DATABASE_URL="postgresql://USER:PASSWORD@POOLER_HOST:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://USER:PASSWORD@MIGRATION_HOST:5432/postgres"
PREVIEW_MODE="false"
```

استخدم Transaction Pooler على المنفذ `6543` لتطبيق Vercel، وConnection URL مباشر أو Session Pooler على المنفذ `5432` لتشغيل migrations.

## أوامر قاعدة البيانات

```bash
npm run db:validate
npm run db:generate
npm run db:deploy
```

`db:deploy` مخصص لتطبيق migrations الموجودة في `prisma/migrations` على قاعدة Supabase جديدة أو متوافقة. لا تستخدمه على قاعدة تحتوي مخططًا مختلفًا قبل فحصها.

## التشغيل

```bash
npm install
npm run dev
```

ثم افتح:

```text
http://localhost:4000/companies
http://localhost:4000/imports
```

إذا لم توجد `DATABASE_URL` في بيئة التطوير، يعمل التطبيق تلقائيًا بوضع المعاينة المؤقتة.

## تحسينات القائمة

- Cursor pagination بدل `OFFSET`.
- استعلام القائمة يعيد حقول الشركة الأساسية فقط.
- العلاقات التفصيلية تُجلب في صفحة الشركة فقط.
- فلاتر `countryId` و`industryId` مدعومة في API.
- Indexes مركبة للفلاتر والترتيب.

## المسارات الأساسية

- `GET /api/companies?limit=20&cursor=...&q=...&countryId=...&industryId=...`
- `GET /api/companies/:id`
- `POST /api/companies`
- `PUT /api/companies/:id`
- `POST /api/imports/preview`
- `POST /api/imports/commit`

## Local TrustMRR importer

The local worker imports one TrustMRR list page (10 companies) and waits 60 seconds before requesting the next page. It stores the next page in `trustmrr_import_state`, so restarting the worker continues from the saved position.

Run the app in one terminal:

```bash
npm run dev
```

Run the importer in a second terminal:

```bash
npm run import:trustmrr:worker
```

Stop it with `Ctrl+C`. The full-detail endpoint is intentionally separate because the standard TrustMRR API limit is 10 requests per minute; use the company details button for one company's full detail request.
