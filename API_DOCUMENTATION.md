# Quran API Documentation

A comprehensive REST and GraphQL API for accessing Quran data, similar to Quran.com's API structure.

## Base URL
- REST API: `http://localhost:3000/`
- GraphQL: `http://localhost:3000/graphql`

## Table of Contents
- [Chapters/Surahs](#chapterssurahs)
- [Verses/Ayahs](#versesayahs)
- [Translations](#translations)
- [Tafsirs](#tafsirs)
- [Audio & Recitations](#audio--recitations)
- [Juzs](#juzs)
- [Languages](#languages)
- [GraphQL Queries](#graphql-queries)

---

## Chapters/Surahs

### List All Chapters
**REST:** `GET /chapters`

**Query Parameters:**
- `language` (optional): Language code (e.g., 'en', 'ar', 'ur')

**Example:**
```bash
GET /chapters?language=en
```

**Response:**
```json
[
  {
    "id": 1,
    "number": 1,
    "name_ar": "الفاتحة",
    "name_en": "Al-Fatihah",
    "name_simple": "Al-Fatihah",
    "name_complex": "Al-Fātiĥah",
    "transliterated_name": "al-fatihah",
    "revelation": "meccan",
    "revelation_order": 5,
    "total_ayahs": 7,
    "bismillah_pre": true,
    "pages": [1, 2]
  }
]
```

---

### Get Single Chapter
**REST:** `GET /chapters/:id`

**Query Parameters:**
- `language` (optional): Language code

**Example:**
```bash
GET /chapters/1?language=en
```

---

### Get Chapter Info
**REST:** `GET /chapters/:id/info`

**Query Parameters:**
- `language` (optional): Language code

**Example:**
```bash
GET /chapters/1/info?language=en
```

**Response:**
```json
{
  "id": 1,
  "surahId": 1,
  "language_code": "en",
  "short_text": "Brief description of the chapter",
  "text": "Full detailed description of the chapter...",
  "source": "Tafsir source"
}
```

---

## Verses/Ayahs

### Get Verse by Key
**REST:** `GET /verses/by_key/:verse_key`

**Verse Key Format:** `chapter:verse` (e.g., `2:255` for Ayat al-Kursi)

**Query Parameters:**
- `language` (optional): Language code
- `words` (optional): Include word-by-word data (`true`/`false`)
- `translations` (optional): Comma-separated translation resource IDs (e.g., `20,131`)
- `tafsirs` (optional): Comma-separated tafsir resource IDs
- `audio` (optional): Reciter ID for audio

**Example:**
```bash
GET /verses/by_key/2:255?words=true&translations=20,131&audio=7
```

**Response:**
```json
{
  "id": 255,
  "ayah_number": 255,
  "verse_key": "2:255",
  "text_ar": "ٱللَّهُ لَآ إِلَـٰهَ إِلَّا هُوَ...",
  "text_uthmani": "...",
  "juz_number": 3,
  "page_number": 42,
  "sajdah": false,
  "translations": [...],
  "words": [...],
  "audioFiles": [...]
}
```

---

### Get Verses by Chapter
**REST:** `GET /verses/by_chapter/:chapter_number`

**Query Parameters:**
- `language` (optional): Language code
- `words` (optional): Include word-by-word data
- `translations` (optional): Comma-separated translation resource IDs
- `page` (optional, default: 1): Page number
- `per_page` (optional, default: 10): Results per page

**Example:**
```bash
GET /verses/by_chapter/1?translations=20&page=1&per_page=10
```

**Response:**
```json
{
  "ayahs": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "perPage": 10,
    "totalRecords": 7
  }
}
```

---

### Get Verses by Page
**REST:** `GET /verses/by_page/:page_number`

**Query Parameters:**
- `language`, `words`, `translations` (same as above)

**Example:**
```bash
GET /verses/by_page/1?translations=20
```

---

### Get Verses by Juz
**REST:** `GET /verses/by_juz/:juz_number`

**Query Parameters:**
- `language`, `words`, `translations`, `page`, `per_page`

**Example:**
```bash
GET /verses/by_juz/1?page=1&per_page=20
```

---

### Get Verses by Hizb
**REST:** `GET /verses/by_hizb/:hizb_number`

**Example:**
```bash
GET /verses/by_hizb/1?translations=20
```

---

### Get Verses by Rub el Hizb
**REST:** `GET /verses/by_rub/:rub_number`

**Example:**
```bash
GET /verses/by_rub/1
```

---

### Get Random Verse
**REST:** `GET /verses/random`

**Query Parameters:**
- `language`, `words`, `translations`

**Example:**
```bash
GET /verses/random?translations=20&words=true
```

---

## Translations

### List Translation Resources
**REST:** `GET /resources/translations`

**Query Parameters:**
- `language` (optional): Filter by language code

**Example:**
```bash
GET /resources/translations?language=en
```

**Response:**
```json
[
  {
    "id": 20,
    "name": "Sahih International",
    "author_name": "Saheeh International",
    "slug": "sahih-international",
    "language_name": "english",
    "language_code": "en",
    "direction": "ltr"
  }
]
```

---

### Get Translation Resource
**REST:** `GET /resources/translations/:id`

**Example:**
```bash
GET /resources/translations/20
```

---

### Get Verse Translations
**REST:** `GET /surah/:number/ayah/:ayah/translations`

**Query Parameters:**
- `lang` (optional): Language code

**Example:**
```bash
GET /surah/1/ayah/1/translations?lang=en
```

---

## Tafsirs

### List Tafsir Resources
**REST:** `GET /resources/tafsirs`

**Query Parameters:**
- `language` (optional): Filter by language code

**Example:**
```bash
GET /resources/tafsirs?language=en
```

**Response:**
```json
[
  {
    "id": 171,
    "name": "Tafsir Ibn Kathir",
    "author_name": "Ibn Kathir",
    "slug": "ibn-kathir",
    "language_name": "english",
    "language_code": "en"
  }
]
```

---

### Get Tafsir Resource
**REST:** `GET /resources/tafsirs/:id`

---

### Get Verse Tafsirs
**REST:** `GET /surah/:number/ayah/:ayah/tafsirs`

**Query Parameters:**
- `lang` (optional): Language code

---

## Audio & Recitations

### Get Chapter Recitations
**REST:** `GET /chapter_recitations/:chapter_number`

**Query Parameters:**
- `reciter` (optional): Reciter ID

**Example:**
```bash
GET /chapter_recitations/1?reciter=7
```

**Response:**
```json
[
  {
    "id": 1,
    "surah": 1,
    "audio_url": "https://example.com/audio/001.mp3",
    "file_size": 524288,
    "format": "mp3",
    "duration": 180,
    "reciter": {
      "id": 7,
      "name": "Mishary Rashid Alafasy",
      "style": "murattal"
    }
  }
]
```

---

### Get Verse Recitations by Chapter
**REST:** `GET /recitations/:recitation_id/by_chapter/:chapter_number`

**Query Parameters:**
- `page` (optional, default: 1)
- `per_page` (optional, default: 50)

**Example:**
```bash
GET /recitations/7/by_chapter/2?page=1&per_page=20
```

---

### Get Verse Recitation
**REST:** `GET /recitations/:recitation_id/by_ayah/:verse_key`

**Example:**
```bash
GET /recitations/7/by_ayah/2:255
```

---

### List Reciters
**REST:** `GET /resources/recitations`

**Query Parameters:**
- `style` (optional): Recitation style (`murattal`, `mujawwad`, `muallim`)

**Example:**
```bash
GET /resources/recitations?style=murattal
```

**Response:**
```json
[
  {
    "id": 7,
    "name": "Mishary Rashid Alafasy",
    "name_ar": "مشاري بن راشد العفاسي",
    "style": "murattal",
    "qirat": "Hafs",
    "file_formats": ["mp3"]
  }
]
```

---

### Get Reciter Details
**REST:** `GET /resources/recitations/:id`

---

## Juzs

### List All Juzs
**REST:** `GET /juzs`

**Example:**
```bash
GET /juzs
```

**Response:**
```json
[
  {
    "id": 1,
    "juz_number": 1,
    "name_ar": "الجزء الأول",
    "name_en": "Juz 1",
    "first_verse_key": "1:1",
    "last_verse_key": "2:141",
    "verses_count": 148
  }
]
```

---

### Get Single Juz
**REST:** `GET /juzs/:juz_number`

---

## Languages

### List All Languages
**REST:** `GET /resources/languages`

**Example:**
```bash
GET /resources/languages
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "English",
    "native_name": "English",
    "iso_code": "en",
    "direction": "ltr",
    "translations_count": 50
  }
]
```

---

### Get Language
**REST:** `GET /resources/languages/:iso_code`

---

## GraphQL Queries

Access GraphQL playground at: `http://localhost:3000/graphql`

### Example: Get Chapter with Verses
```graphql
query {
  chapter(id: 1, includeAyahs: true, language: "en") {
    number
    name_ar
    name_en
    total_ayahs
    revelation
    ayahs {
      ayah_number
      verse_key
      text_ar
      translations {
        text
        translator
      }
    }
  }
}
```

---

### Example: Get Verse by Key with Translations
```graphql
query {
  verseByKey(
    verseKey: "2:255"
    words: true
    translations: [20, 131]
  ) {
    verse_key
    text_ar
    text_uthmani
    juz_number
    page_number
    translations {
      text
      language_code
      resource {
        name
        author_name
      }
    }
    words {
      position
      text_uthmani
      transliteration
      translation
    }
  }
}
```

---

### Example: Search Verses by Page with Pagination
```graphql
query {
  versesByChapter(
    chapterNumber: 2
    translations: [20]
    page: 1
    perPage: 10
  ) {
    ayahs {
      verse_key
      text_ar
      translations {
        text
      }
    }
    pagination {
      currentPage
      totalPages
      totalRecords
    }
  }
}
```

---

### Example: Get Random Verse
```graphql
query {
  randomVerse(translations: [20], words: true) {
    verse_key
    text_ar
    translations {
      text
    }
    surah {
      name_en
    }
  }
}
```

---

### Example: List Reciters
```graphql
query {
  reciters(style: "murattal") {
    id
    name
    name_ar
    style
    qirat
  }
}
```

---

## Legacy Endpoints (Backward Compatible)

For backward compatibility, these legacy endpoints are still supported:

- `GET /surahs` → List all surahs
- `GET /surah/:number` → Get single surah
- `GET /surah/:number/ayah/:ayah` → Get single ayah
- `GET /surah/:number/ayah/:ayah/translations` → Get verse translations
- `GET /surah/:number/ayah/:ayah/tafsirs` → Get verse tafsirs

---

## Common Query Parameters

### Pagination
- `page`: Page number (default: 1)
- `per_page`: Results per page (default varies by endpoint)

### Filtering
- `language` or `lang`: Language code (ISO 639-1, e.g., 'en', 'ar', 'ur')
- `translations`: Comma-separated translation resource IDs
- `tafsirs`: Comma-separated tafsir resource IDs
- `words`: Include word-by-word data (true/false)
- `audio`: Reciter ID for audio files

---

## Response Formats

### Pagination Response
```json
{
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "perPage": 20,
    "totalRecords": 200
  }
}
```

### Error Response
```json
{
  "statusCode": 404,
  "message": "Resource not found",
  "error": "Not Found"
}
```

---

## Data Models

### Surah/Chapter
- `id`: Database ID
- `number`: Chapter number (1-114)
- `name_ar`: Arabic name
- `name_en`: English name
- `name_simple`: Simple English name
- `name_complex`: Complex transliterated name
- `transliterated_name`: URL-friendly transliteration
- `revelation`: "meccan" or "medinan"
- `revelation_order`: Order of revelation
- `total_ayahs`: Number of verses
- `bismillah_pre`: Has Bismillah prefix
- `pages`: Mushaf page numbers

### Ayah/Verse
- `id`: Database ID
- `ayah_number`: Verse number within chapter
- `verse_key`: Unique key (format: "chapter:verse")
- `text_ar`: Arabic text
- `text_uthmani`: Uthmani script
- `text_uthmani_simple`: Simplified Uthmani
- `text_uthmani_tajweed`: Uthmani with Tajweed
- `text_imlaei`: Imlaei script
- `text_indopak`: IndoPak script
- `juz_number`: Juz number (1-30)
- `hizb_number`: Hizb number (1-60)
- `rub_el_hizb_number`: Rub el Hizb number
- `page_number`: Mushaf page number
- `sajdah`: Has prostration
- `sajdah_type`: "recommended" or "obligatory"

### Word
- `position`: Word position in verse
- `text_uthmani`: Word in Uthmani script
- `transliteration`: Transliterated text
- `translation`: English translation
- `audio_url`: Audio URL for the word
- `char_type`: "word" or "end"

---

## Rate Limiting

Currently no rate limiting is implemented. Consider implementing rate limiting for production use.

---

## Notes

1. **Language Codes**: Use ISO 639-1 codes (e.g., 'en', 'ar', 'ur', 'id')
2. **Verse Keys**: Always format as `chapter:verse` (e.g., "1:1", "2:255")
3. **Translation IDs**: Can be fetched from `/resources/translations`
4. **Reciter IDs**: Can be fetched from `/resources/recitations`
5. **Page Numbers**: Mushaf page numbers (1-604)
6. **Juz Numbers**: 1-30
7. **Hizb Numbers**: 1-60

---

## Setup & Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Install graphql-type-json:
```bash
npm install graphql-type-json
# or
yarn add graphql-type-json
```

3. Set up environment variables:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/quran"
```

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Seed the database:
```bash
npm run prisma:seed
```

6. Start the server:
```bash
npm run start:dev
```

---

## Future Enhancements

- [ ] Search functionality
- [ ] Bookmarks & Reading progress (user features)
- [ ] Advanced audio features (word-by-word timing)
- [ ] Tagging and categorization
- [ ] Multi-lingual support expansion
- [ ] Caching layer (Redis)
- [ ] Rate limiting
- [ ] Authentication & Authorization
- [ ] GraphQL subscriptions for real-time features
