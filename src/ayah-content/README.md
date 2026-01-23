# Ayah Content Management Module

## Overview

Production-ready NestJS module for managing Quran ayah content with support for:
- **Single ayah content** (startAyah = endAyah)
- **Grouped ayah content** (continuous ayah ranges)
- **Multi-language support** (tafsir, translation, info)
- **Smart group resolution** (prefers grouped content when fetching by ayah number)

## Architecture

### Clean Architecture Layers

```
Controllers (HTTP/REST)
    ↓
Services (Business Logic)
    ↓
Repositories (Data Access)
    ↓
Entities (TypeORM Models)
```

### Database Schema

#### Tables

1. **ayah_groups** - Container for single or grouped ayahs
   - `id` (UUID, PK)
   - `surah_id`, `start_ayah`, `end_ayah` (unique constraint)
   - `is_grouped` (boolean)
   - `status`, `created_at`, `updated_at`

2. **ayah_tafsir** - Tafsir/commentary content
   - Foreign key to `ayah_groups`
   - Multi-language support via `language_code`
   - Unique per (group, language, source)

3. **ayah_translation** - Translation content
   - Foreign key to `ayah_groups`
   - Unique per (group, language, translator)

4. **ayah_info** - General info/notes
   - Foreign key to `ayah_groups`
   - Unique per (group, language)

All relations use **CASCADE DELETE** for data integrity.

## Installation

### 1. Install Dependencies

```bash
npm install @nestjs/typeorm typeorm pg
```

### 2. Run Migration

```bash
psql -U your_user -d your_database -f src/ayah-content/migrations/001_create_ayah_content_tables.sql
```

Or use your migration tool of choice.

### 3. Configuration

Ensure `DATABASE_URL` is set in `.env`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/quran_db
```

## API Endpoints

### POST /ayah-content

Create or reuse an ayah group with content.

**Request Body:**
```json
{
  "surahId": 1,
  "startAyah": 1,
  "endAyah": 7,
  "isGrouped": true,
  "infos": [
    {
      "languageCode": "en",
      "infoText": "The opening seven verses..."
    }
  ],
  "tafsirs": [
    {
      "languageCode": "en",
      "tafsirText": "According to Ibn Kathir...",
      "scholar": "Ibn Kathir",
      "source": "Tafsir Ibn Kathir"
    }
  ],
  "translations": [
    {
      "languageCode": "en",
      "translationText": "In the name of Allah...",
      "translator": "Sahih International"
    }
  ]
}
```

**Response:** Returns the created/existing group with all relations.

**Validation:**
- Validates surah exists (checks read-only Surah table)
- Validates ayah range exists and is continuous
- Auto-detects `isGrouped` if omitted (true when startAyah ≠ endAyah)
- Returns existing group if exact range already exists

---

### GET /ayah-content/surah/:surahId/ayah/:ayahNumber

Get content for a specific ayah with smart group resolution.

**Query Parameters:**
- `languageCode` (optional): Filter by language (e.g., `en`, `ar`)

**Example:**
```
GET /ayah-content/surah/1/ayah/5?languageCode=en
```

**Resolution Logic:**
1. Looks for grouped content that includes the ayah
2. Prefers `isGrouped=true` over single ayah
3. Prefers smaller ranges (more specific)
4. Falls back to single ayah content if no group found
5. Returns `null` if no content exists

**Response:** AyahGroup with filtered relations

---

### GET /ayah-content/surah/:surahId

List all content groups for a surah (both single and grouped).

**Example:**
```
GET /ayah-content/surah/1
```

**Response:** Array of AyahGroup objects ordered by ayah range

---

### GET /ayah-content/:id

Get a specific group by UUID.

**Example:**
```
GET /ayah-content/550e8400-e29b-41d4-a716-446655440000
```

---

### PUT /ayah-content/:id

Update an existing group and optionally replace its content.

**Request Body:** Partial of CreateAyahGroupDto

**Note:** If `tafsirs`, `translations`, or `infos` are provided, they **replace** all existing content of that type.

---

### DELETE /ayah-content/:id

Delete a group and all associated content (cascade).

---

## Usage Examples

### Example 1: Create Grouped Ayahs (Al-Fatiha)

```typescript
const response = await fetch('/ayah-content', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    surahId: 1,
    startAyah: 1,
    endAyah: 7,
    isGrouped: true,
    infos: [
      {
        languageCode: 'en',
        infoText: 'Al-Fatiha (The Opening) - A complete surah often recited together'
      }
    ],
    translations: [
      {
        languageCode: 'en',
        translationText: 'In the name of Allah, the Most Gracious...',
        translator: 'Sahih International'
      }
    ]
  })
});
```

### Example 2: Create Single Ayah Content

```typescript
const response = await fetch('/ayah-content', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    surahId: 2,
    startAyah: 255,
    endAyah: 255,  // Same as startAyah
    tafsirs: [
      {
        languageCode: 'en',
        tafsirText: 'Ayat al-Kursi is the greatest verse...',
        scholar: 'Multiple scholars',
        source: 'Hadith collections'
      }
    ]
  })
});
```

### Example 3: Fetch Ayah Content (with group resolution)

```typescript
// If ayah 5 is part of a grouped range (1-7), returns the group
const content = await fetch('/ayah-content/surah/1/ayah/5?languageCode=en');

// Response includes:
// - Group metadata (surahId: 1, startAyah: 1, endAyah: 7, isGrouped: true)
// - All content for the group filtered by language
```

### Example 4: Update Group Content

```typescript
const response = await fetch('/ayah-content/550e8400-e29b-41d4-a716-446655440000', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    // Only update translations, leave tafsirs and infos unchanged
    translations: [
      {
        languageCode: 'ur',
        translationText: 'اللہ کے نام سے...',
        translator: 'Maududi'
      }
    ]
  })
});
```

## Features

### ✅ Production-Ready

- **Input validation** with class-validator
- **Transaction support** for data consistency
- **Error handling** with proper HTTP status codes
- **Swagger/OpenAPI** documentation
- **TypeORM indexes** for performance
- **Cascade deletes** for referential integrity

### ✅ Smart Group Resolution

When fetching by ayah number, the system:
1. Prioritizes grouped content over single ayah
2. Selects the smallest matching range
3. Filters by language if specified
4. Returns comprehensive content in one query

### ✅ Flexible Content Model

- Single and grouped ayahs in the **same tables**
- Multi-language support per content type
- Optional status field for draft/published workflow
- Automatic timestamps (created_at, updated_at)

### ✅ Read-Only Validation

- Validates against existing Surah/Ayah tables
- Does NOT modify core Quran data
- Ensures ayah ranges are valid and continuous

## Best Practices

### 1. Use Transactions

The repository automatically wraps create/update operations in transactions to ensure atomicity.

### 2. Language Codes

Use ISO 639-1 codes (2-letter):
- `en` - English
- `ar` - Arabic
- `ur` - Urdu
- `tr` - Turkish

### 3. Status Field

Use consistent status values:
- `published` - Live content (default)
- `draft` - Work in progress
- `archived` - Historical/deprecated

### 4. Source/Scholar Attribution

Always provide `source` and `scholar` for tafsir to maintain academic integrity.

### 5. Group Strategy

- Use **grouped content** for ayahs frequently studied together (e.g., Al-Fatiha 1-7)
- Use **single ayah** for standalone famous verses (e.g., Ayat al-Kursi)
- The system handles both seamlessly

## Testing

Run the backend and test with curl:

```bash
# Create grouped content
curl -X POST http://localhost:3000/ayah-content \
  -H "Content-Type: application/json" \
  -d '{
    "surahId": 1,
    "startAyah": 1,
    "endAyah": 7,
    "infos": [{"languageCode": "en", "infoText": "Al-Fatiha"}]
  }'

# Fetch with group resolution
curl http://localhost:3000/ayah-content/surah/1/ayah/3?languageCode=en

# List all groups for a surah
curl http://localhost:3000/ayah-content/surah/1
```

## Performance Considerations

- **Indexes** on commonly queried fields (surah_id, language_code, ayah ranges)
- **Eager loading** disabled by default (use explicit relations in queries)
- **Cascading deletes** handled at database level
- **Query optimization** with proper WHERE clauses and ordering

## Migration Path

If you need to migrate from Prisma-based implementation:

1. Export existing data to JSON
2. Run the SQL migration to create TypeORM tables
3. Import data using the POST endpoint
4. Verify with GET endpoints

## Troubleshooting

### Issue: "Surah X not found"

**Cause:** The Surah table (Prisma) doesn't have that surah seeded.

**Solution:** Run `npm run prisma:seed` to populate Surah and Ayah tables.

---

### Issue: "Not all ayahs in range X-Y exist"

**Cause:** Some ayahs in the specified range don't exist in the Ayah table.

**Solution:** Verify ayah count for that surah and adjust the range.

---

### Issue: "Duplicate key violation"

**Cause:** Trying to create a group with an existing (surahId, startAyah, endAyah) combination.

**Solution:** The API returns the existing group automatically. This error shouldn't occur through the API.

## Future Enhancements

- [ ] GraphQL resolvers for ayah content
- [ ] Full-text search on content
- [ ] Versioning/revision history
- [ ] Bulk import/export API
- [ ] Content approval workflow
- [ ] Analytics and usage tracking

## License

Proprietary - Quran Backend Project
