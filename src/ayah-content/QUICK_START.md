# Quick Start Guide - Ayah Content Management

## Installation Steps

### 1. Install TypeORM Dependencies

```bash
npm install
```

This will install:
- `@nestjs/typeorm@^10.0.2`
- `typeorm@^0.3.20`
- Existing dependencies (pg, class-validator, etc.)

### 2. Run Database Migration

```bash
psql -U your_user -d your_database -f src/ayah-content/migrations/001_create_ayah_content_tables.sql
```

Or if using a different PostgreSQL client:

```bash
# Using psql with DATABASE_URL from .env
psql $DATABASE_URL -f src/ayah-content/migrations/001_create_ayah_content_tables.sql
```

This creates:
- `ayah_groups` table
- `ayah_tafsir` table
- `ayah_translation` table
- `ayah_info` table
- Indexes and triggers

### 3. Start the Server

```bash
npm run start:dev
```

The server will start on `http://localhost:3000`

### 4. Verify Installation

Check Swagger documentation:
```
http://localhost:3000/api
```

(If Swagger is configured in main.ts)

## Testing the API

### Test 1: Create a Grouped Ayah (Al-Fatiha)

```bash
curl -X POST http://localhost:3000/ayah-content \
  -H "Content-Type: application/json" \
  -d '{
    "surahId": 1,
    "startAyah": 1,
    "endAyah": 7,
    "isGrouped": true,
    "infos": [
      {
        "languageCode": "en",
        "infoText": "Al-Fatiha (The Opening) - These seven verses are recited in every unit of prayer."
      }
    ],
    "translations": [
      {
        "languageCode": "en",
        "translationText": "[1:1-7] In the name of Allah, the Most Gracious, the Most Merciful. Praise be to Allah, the Lord of all the worlds...",
        "translator": "Sahih International"
      }
    ],
    "tafsirs": [
      {
        "languageCode": "en",
        "tafsirText": "Al-Fatiha is the greatest surah in the Quran. It contains praise of Allah, declaration of servitude, and a prayer for guidance.",
        "scholar": "Ibn Kathir",
        "source": "Tafsir Ibn Kathir"
      }
    ]
  }'
```

**Expected Response:** 201 Created with the group object

### Test 2: Create Single Ayah (Ayat al-Kursi)

```bash
curl -X POST http://localhost:3000/ayah-content \
  -H "Content-Type: application/json" \
  -d '{
    "surahId": 2,
    "startAyah": 255,
    "endAyah": 255,
    "tafsirs": [
      {
        "languageCode": "en",
        "tafsirText": "This is the greatest ayah in the Quran. The Prophet (ﷺ) said: Whoever recites Ayat al-Kursi after every obligatory prayer, nothing prevents him from entering Paradise except death.",
        "source": "Sahih Hadith"
      }
    ],
    "translations": [
      {
        "languageCode": "en",
        "translationText": "Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence...",
        "translator": "Sahih International"
      }
    ]
  }'
```

### Test 3: Fetch Content with Group Resolution

```bash
# Fetch ayah 3 from surah 1 (will return the grouped content 1-7)
curl http://localhost:3000/ayah-content/surah/1/ayah/3?languageCode=en
```

**Expected:** Returns the group containing ayahs 1-7 (because ayah 3 is part of that group)

```bash
# Fetch ayah 255 from surah 2 (single ayah content)
curl http://localhost:3000/ayah-content/surah/2/ayah/255?languageCode=en
```

### Test 4: List All Groups for a Surah

```bash
curl http://localhost:3000/ayah-content/surah/1
```

**Expected:** Array of all ayah groups for Surah Al-Fatiha

### Test 5: Update Content

```bash
# First, get the group ID from previous responses, then:
curl -X PUT http://localhost:3000/ayah-content/YOUR_GROUP_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{
    "translations": [
      {
        "languageCode": "ur",
        "translationText": "اللہ کے نام سے جو نہایت مہربان رحم کرنے والا ہے...",
        "translator": "Maulana Maududi"
      }
    ]
  }'
```

### Test 6: Delete a Group

```bash
curl -X DELETE http://localhost:3000/ayah-content/YOUR_GROUP_ID_HERE
```

## Common Issues

### Issue: "Cannot find module '@nestjs/typeorm'"

**Solution:**
```bash
npm install
```

### Issue: "relation 'ayah_groups' does not exist"

**Solution:** Run the migration:
```bash
psql $DATABASE_URL -f src/ayah-content/migrations/001_create_ayah_content_tables.sql
```

### Issue: "Surah 1 not found"

**Solution:** Ensure Prisma data is seeded:
```bash
npm run prisma:seed
```

### Issue: TypeORM connection errors

**Solution:** Check your `.env` file has correct `DATABASE_URL`:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/quran_db
```

## Postman Collection

Import this into Postman for easy testing:

```json
{
  "info": {
    "name": "Ayah Content API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Create Grouped Ayah",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "url": "{{baseUrl}}/ayah-content",
        "body": {
          "mode": "raw",
          "raw": "{\n  \"surahId\": 1,\n  \"startAyah\": 1,\n  \"endAyah\": 7,\n  \"isGrouped\": true,\n  \"infos\": [{\n    \"languageCode\": \"en\",\n    \"infoText\": \"Al-Fatiha\"\n  }]\n}"
        }
      }
    },
    {
      "name": "Get Ayah Content",
      "request": {
        "method": "GET",
        "url": {
          "raw": "{{baseUrl}}/ayah-content/surah/1/ayah/3?languageCode=en",
          "host": ["{{baseUrl}}"],
          "path": ["ayah-content", "surah", "1", "ayah", "3"],
          "query": [{"key": "languageCode", "value": "en"}]
        }
      }
    }
  ],
  "variable": [
    {"key": "baseUrl", "value": "http://localhost:3000"}
  ]
}
```

## Next Steps

1. **Add Swagger Configuration** (if not already):
   ```typescript
   // In main.ts
   const config = new DocumentBuilder()
     .setTitle('Quran Backend API')
     .setVersion('1.0')
     .build();
   const document = SwaggerModule.createDocument(app, config);
   SwaggerModule.setup('api', app, document);
   ```

2. **Add Authentication/Authorization** for write operations

3. **Implement GraphQL Resolvers** (optional)

4. **Add Caching** (Redis) for frequently accessed content

5. **Set up Monitoring** (logging, metrics)

## Success Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] Migration run successfully
- [ ] Server starts without errors
- [ ] Can create grouped ayah via POST
- [ ] Can create single ayah via POST
- [ ] Group resolution works correctly
- [ ] Can filter by language code
- [ ] Can update existing groups
- [ ] Can delete groups
- [ ] Swagger docs accessible (if configured)

## Support

For issues or questions, refer to:
- Main README: `src/ayah-content/README.md`
- NestJS Docs: https://docs.nestjs.com/
- TypeORM Docs: https://typeorm.io/
