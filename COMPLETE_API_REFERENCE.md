# Complete API Reference - All Endpoints

## Base URL
```
http://localhost:3077
```

---

## Quick Links
- [Health Check](#health-check)
- [Quran Chapters/Surahs](#quran-chapterssurahs)
- [Verses/Ayahs](#versesayahs)
- [Translations](#translations)
- [Tafsirs](#tafsirs)
- [Juzs](#juzs)
- [Languages](#languages)
- [Surah Information Management](#surah-information-management)
- [Ayah Content Management](#ayah-content-management)

---

## Health Check

### GET `/`
Get basic health check

```bash
curl http://localhost:3077/
```

**Response:** `"Hello World!"`

---

## Quran Chapters/Surahs

### GET `/chapters`
List all chapters with optional language

```bash
curl http://localhost:3077/chapters?language=en
```

**Query Params:**
- `language` (optional): Language code

---

### GET `/chapters/:id`
Get a specific chapter

```bash
curl http://localhost:3077/chapters/1?language=en
```

**Path Params:**
- `id` (integer): Chapter ID

---

### GET `/surahs`
List all surahs (legacy)

```bash
curl http://localhost:3077/surahs?lang=en
```

**Query Params:**
- `lang` (optional): Language code

---

### GET `/surah/:number`
Get surah with ayahs

```bash
curl "http://localhost:3077/surah/1?includeAyahs=true&lang=en&page=1&perPage=10"
```

**Path Params:**
- `number` (integer): Surah number

**Query Params:**
- `includeAyahs` (optional, default: true): Include ayahs
- `lang` (optional): Language code
- `translations` (optional): Comma-separated translation IDs
- `page` (optional): Page number
- `perPage` (optional): Results per page

---

### GET `/quran/surah`
Get all surahs (new endpoint)

```bash
curl http://localhost:3077/quran/surah?lang=en
```

**Query Params:**
- `lang` (optional): Language code

---

### GET `/quran/surah/:surah_id`
Get ayahs by surah with pagination

```bash
curl "http://localhost:3077/quran/surah/1?page=1&per_page=10"
```

**Path Params:**
- `surah_id` (integer): Surah ID (1-114)

**Query Params:**
- `page` (optional, default: 1): Page number
- `per_page` (optional, default: 10): Results per page

---

### GET `/quran/surah/:surah_id/ayah/:ayah_id`
Get a specific ayah by surah and ayah number

```bash
curl http://localhost:3077/quran/surah/1/ayah/1
```

**Path Params:**
- `surah_id` (integer): Surah ID
- `ayah_id` (integer): Ayah number

---

## Verses/Ayahs

### GET `/verses/by_key/:verse_key`
Get ayah by verse key

```bash
curl "http://localhost:3077/verses/by_key/1:1?language=en&translations=1,2"
```

**Path Params:**
- `verse_key` (string): Format `surah:ayah` (e.g., '1:1')

**Query Params:**
- `language` (optional): Language code
- `translations` (optional): Comma-separated translation IDs
- `tafsirs` (optional): Comma-separated tafsir IDs

---

### GET `/verses/by_chapter/:chapter_number`
Get all ayahs in a chapter (paginated)

```bash
curl "http://localhost:3077/verses/by_chapter/1?page=1&per_page=10&language=en&translations=1"
```

**Path Params:**
- `chapter_number` (integer): Chapter/Surah number (1-114)

**Query Params:**
- `page` (optional, default: 1): Page number
- `per_page` (optional, default: 10): Results per page
- `language` (optional): Language code
- `translations` (optional): Comma-separated translation IDs

---

### GET `/verses/by_page/:page_number`
Get all ayahs in a page

```bash
curl "http://localhost:3077/verses/by_page/1?language=en&translations=1"
```

**Path Params:**
- `page_number` (integer): Page number (1-604)

**Query Params:**
- `language` (optional): Language code
- `translations` (optional): Comma-separated translation IDs

---

### GET `/verses/by_juz/:juz_number`
Get all ayahs in a juz/part (paginated)

```bash
curl "http://localhost:3077/verses/by_juz/1?page=1&per_page=10&language=en&translations=1"
```

**Path Params:**
- `juz_number` (integer): Juz number (1-30)

**Query Params:**
- `page` (optional, default: 1): Page number
- `per_page` (optional, default: 10): Results per page
- `language` (optional): Language code
- `translations` (optional): Comma-separated translation IDs

---

### GET `/verses/by_hizb/:hizb_number`
Get all ayahs in a hizb/quarter

```bash
curl "http://localhost:3077/verses/by_hizb/1?language=en&translations=1"
```

**Path Params:**
- `hizb_number` (integer): Hizb number (1-60)

**Query Params:**
- `language` (optional): Language code
- `translations` (optional): Comma-separated translation IDs

---

### GET `/verses/by_rub/:rub_number`
Get all ayahs in a rub/eighth

```bash
curl "http://localhost:3077/verses/by_rub/1?language=en&translations=1"
```

**Path Params:**
- `rub_number` (integer): Rub number (1-240)

**Query Params:**
- `language` (optional): Language code
- `translations` (optional): Comma-separated translation IDs

---

### GET `/verses/random`
Get a random ayah

```bash
curl "http://localhost:3077/verses/random?language=en&translations=1"
```

**Query Params:**
- `language` (optional): Language code
- `translations` (optional): Comma-separated translation IDs

---

### GET `/surah/:number/ayah/:ayah`
Get a specific ayah (legacy)

```bash
curl "http://localhost:3077/surah/1/ayah/1?lang=en&translations=1"
```

**Path Params:**
- `number` (integer): Surah number
- `ayah` (integer): Ayah number

**Query Params:**
- `lang` (optional): Language code
- `translations` (optional): Comma-separated translation IDs

---

## Translations

### GET `/resources/translations`
List all translations

```bash
curl http://localhost:3077/resources/translations?language=en
```

**Query Params:**
- `language` (optional): Language code

---

### GET `/resources/translations/:id`
Get a specific translation

```bash
curl http://localhost:3077/resources/translations/1
```

**Path Params:**
- `id` (integer): Translation ID

---

### GET `/surah/:number/ayah/:ayah/translations`
Get all translations for an ayah

```bash
curl "http://localhost:3077/surah/1/ayah/1/translations?lang=en"
```

**Path Params:**
- `number` (integer): Surah number
- `ayah` (integer): Ayah number

**Query Params:**
- `lang` (optional): Language code

---

## Tafsirs

### GET `/resources/tafsirs`
List all tafsirs

```bash
curl http://localhost:3077/resources/tafsirs?language=en
```

**Query Params:**
- `language` (optional): Language code

---

### GET `/resources/tafsirs/:source`
Get a specific tafsir by source

```bash
curl http://localhost:3077/resources/tafsirs/ibn-kathir
```

**Path Params:**
- `source` (string): Tafsir source identifier

---

### GET `/surah/:number/ayah/:ayah/tafsirs`
Get all tafsirs for an ayah

```bash
curl "http://localhost:3077/surah/1/ayah/1/tafsirs?lang=en"
```

**Path Params:**
- `number` (integer): Surah number
- `ayah` (integer): Ayah number

**Query Params:**
- `lang` (optional): Language code

---

## Juzs

### GET `/juzs`
List all juzs

```bash
curl http://localhost:3077/juzs
```

---

### GET `/juzs/:juz_number`
Get a specific juz

```bash
curl http://localhost:3077/juzs/1
```

**Path Params:**
- `juz_number` (integer): Juz number (1-30)

---

## Languages

### GET `/resources/languages`
List all languages

```bash
curl http://localhost:3077/resources/languages
```

---

### GET `/resources/languages/:iso_code`
Get a specific language

```bash
curl http://localhost:3077/resources/languages/en
```

**Path Params:**
- `iso_code` (string): ISO language code (e.g., 'en', 'ar', 'ur')

---

## Surah Information Management

### GET `/chapters/:surah_id/info/:language_id`
Get surah info for a specific language

```bash
curl http://localhost:3077/chapters/1/info/1
```

**Path Params:**
- `surah_id` (integer): Surah ID (1-114)
- `language_id` (integer): Language ID

---

### GET `/chapters/:surah_id/info`
Get all surah info in multiple languages

```bash
curl "http://localhost:3077/chapters/1/info?languageId=1"
```

**Path Params:**
- `surah_id` (integer): Surah ID

**Query Params:**
- `languageId` (optional, integer): Filter by language ID

---

### PUT `/chapters/:id/info`
Update surah information

```bash
curl -X PUT http://localhost:3077/chapters/1/info \
  -H "Content-Type: application/json" \
  -d '{
    "surahId": 1,
    "languageId": 1,
    "surahinfo": "Updated information"
  }'
```

**Path Params:**
- `id` (integer): Surah ID

**Request Body:**
```json
{
  "surahId": 1,
  "languageId": 1,
  "surahinfo": "The Opening chapter of the Quran"
}
```

---

### PUT `/surahs/:id/info`
Update surah info (legacy endpoint)

```bash
curl -X PUT http://localhost:3077/surahs/1/info \
  -H "Content-Type: application/json" \
  -d '{
    "surahId": 1,
    "languageId": 1,
    "surahinfo": "Updated information"
  }'
```

Same request body as `/chapters/:id/info`

---

## Ayah Content Management

### PUT `/ayah-content/:id` (Upsert)
Update or create ayah group (Smart Upsert)

**If group exists by ID, updates it. If not found but surahId, startAyah, endAyah provided, creates new group.**

#### Create New Ayah Group:
```bash
curl -X PUT http://localhost:3077/ayah-content/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{
    "surahId": 1,
    "startAyah": 1,
    "endAyah": 7,
    "isGrouped": true,
    "infos": [
      {
        "languageCode": "en",
        "infoText": "This is the opening chapter of the Quran",
        "status": "published"
      }
    ],
    "tafsirs": [
      {
        "languageCode": "en",
        "tafsirText": "Detailed explanation of Al-Fatiha...",
        "scholar": "Ibn Kathir",
        "source": "Tafsir Ibn Kathir",
        "status": "published"
      }
    ],
    "translations": [
      {
        "languageCode": "en",
        "translationText": "In the name of Allah, the Most Gracious, the Most Merciful...",
        "translator": "Sahih International",
        "status": "published"
      }
    ],
    "status": "published"
  }'
```

#### Update Existing Group:
```bash
curl -X PUT http://localhost:3077/ayah-content/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{
    "infos": [
      {
        "languageCode": "ar",
        "infoText": "معلومات محدثة"
      }
    ]
  }'
```

**Path Params:**
- `id` (UUID): Group ID (any UUID for create operation)

**Request Body (All Optional):**
```json
{
  "surahId": 1,
  "startAyah": 1,
  "endAyah": 7,
  "isGrouped": true,
  "status": "published",
  "infos": [
    {
      "languageCode": "en",
      "infoText": "Information text",
      "status": "published"
    }
  ],
  "tafsirs": [
    {
      "languageCode": "en",
      "tafsirText": "Tafsir text",
      "scholar": "Scholar name",
      "source": "Source name",
      "status": "published"
    }
  ],
  "translations": [
    {
      "languageCode": "en",
      "translationText": "Translation text",
      "translator": "Translator name",
      "status": "published"
    }
  ]
}
```

**Response (Create):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "surahId": 1,
  "startAyah": 1,
  "endAyah": 7,
  "isGrouped": true,
  "status": "published",
  "isNew": true,
  "createdAt": "2026-01-23T12:00:00Z",
  "updatedAt": "2026-01-23T12:00:00Z",
  "infos": [...],
  "tafsirs": [...],
  "translations": [...]
}
```

**Response (Update):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "surahId": 1,
  "startAyah": 1,
  "endAyah": 7,
  "isGrouped": true,
  "status": "published",
  "isNew": false,
  "updatedAt": "2026-01-23T12:05:00Z",
  "infos": [...],
  "tafsirs": [...],
  "translations": [...]
}
```

---

### GET `/ayah-content/surah/:surahId/ayah/:ayahNumber`
Get ayah content with smart resolution

```bash
curl "http://localhost:3077/ayah-content/surah/1/ayah/5?languageCode=en"
```

**Path Params:**
- `surahId` (integer): Surah ID (1-114)
- `ayahNumber` (integer): Ayah number

**Query Params:**
- `languageCode` (optional): Language code filter

**Response:**
```json
{
  "id": "uuid",
  "surahId": 1,
  "startAyah": 1,
  "endAyah": 7,
  "isGrouped": true,
  "infos": [...],
  "tafsirs": [...],
  "translations": [...]
}
```

---

### GET `/ayah-content/surah/:surahId`
List all ayah groups for a surah

```bash
curl http://localhost:3077/ayah-content/surah/1
```

**Path Params:**
- `surahId` (integer): Surah ID (1-114)

**Response:**
```json
[
  {
    "id": "uuid-1",
    "surahId": 1,
    "startAyah": 1,
    "endAyah": 7,
    "isGrouped": true,
    "infos": [...],
    "tafsirs": [...],
    "translations": [...]
  }
]
```

---

### GET `/ayah-content/:id`
Get a specific ayah group by UUID

```bash
curl http://localhost:3077/ayah-content/550e8400-e29b-41d4-a716-446655440000
```

**Path Params:**
- `id` (UUID): Ayah group UUID

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "surahId": 1,
  "startAyah": 1,
  "endAyah": 7,
  "isGrouped": true,
  "status": "published",
  "infos": [...],
  "tafsirs": [...],
  "translations": [...],
  "createdAt": "2026-01-23T12:00:00Z",
  "updatedAt": "2026-01-23T12:00:00Z"
}
```

---

### DELETE `/ayah-content/:id`
Delete an ayah group and all associated content

```bash
curl -X DELETE http://localhost:3077/ayah-content/550e8400-e29b-41d4-a716-446655440000
```

**Path Params:**
- `id` (UUID): Ayah group UUID

**Response:**
```json
{
  "success": true,
  "message": "Ayah group 550e8400-e29b-41d4-a716-446655440000 deleted successfully"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Invalid input description",
  "error": "Bad Request"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Resource not found",
  "error": "Not Found"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

---

## Summary Table

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/chapters` | List all chapters |
| GET | `/chapters/:id` | Get chapter by ID |
| GET | `/surahs` | List all surahs (legacy) |
| GET | `/surah/:number` | Get surah with ayahs |
| GET | `/quran/surah` | Get all surahs |
| GET | `/quran/surah/:surah_id` | Get ayahs by surah |
| GET | `/quran/surah/:surah_id/ayah/:ayah_id` | Get specific ayah |
| GET | `/verses/by_key/:verse_key` | Get ayah by key |
| GET | `/verses/by_chapter/:chapter_number` | Get ayahs by chapter |
| GET | `/verses/by_page/:page_number` | Get ayahs by page |
| GET | `/verses/by_juz/:juz_number` | Get ayahs by juz |
| GET | `/verses/by_hizb/:hizb_number` | Get ayahs by hizb |
| GET | `/verses/by_rub/:rub_number` | Get ayahs by rub |
| GET | `/verses/random` | Get random ayah |
| GET | `/surah/:number/ayah/:ayah` | Get ayah (legacy) |
| GET | `/resources/translations` | List translations |
| GET | `/resources/translations/:id` | Get translation |
| GET | `/surah/:number/ayah/:ayah/translations` | Get ayah translations |
| GET | `/resources/tafsirs` | List tafsirs |
| GET | `/resources/tafsirs/:source` | Get tafsir by source |
| GET | `/surah/:number/ayah/:ayah/tafsirs` | Get ayah tafsirs |
| GET | `/juzs` | List juzs |
| GET | `/juzs/:juz_number` | Get juz |
| GET | `/resources/languages` | List languages |
| GET | `/resources/languages/:iso_code` | Get language |
| GET | `/chapters/:surah_id/info/:language_id` | Get surah info |
| GET | `/chapters/:surah_id/info` | Get all surah info |
| PUT | `/chapters/:id/info` | Update surah info |
| PUT | `/surahs/:id/info` | Update surah info (legacy) |
| PUT | `/ayah-content/:id` | Upsert ayah group |
| GET | `/ayah-content/surah/:surahId/ayah/:ayahNumber` | Get ayah content |
| GET | `/ayah-content/surah/:surahId` | List groups by surah |
| GET | `/ayah-content/:id` | Get group by ID |
| DELETE | `/ayah-content/:id` | Delete group |

