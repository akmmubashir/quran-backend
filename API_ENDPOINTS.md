# API Endpoints Quick Reference

## REST API Endpoints

### Chapters/Surahs
```
GET /chapters                               - List all chapters
GET /chapters/:id                           - Get single chapter
GET /chapters/:id/info                      - Get chapter information
GET /surahs                                 - List all surahs (legacy)
GET /surah/:number                          - Get single surah (legacy)
```

### Verses/Ayahs
```
GET /verses/by_key/:verse_key               - Get verse by key (e.g., "2:255")
GET /verses/by_chapter/:chapter_number      - Get verses by chapter (paginated)
GET /verses/by_page/:page_number            - Get verses by Mushaf page
GET /verses/by_juz/:juz_number              - Get verses by Juz (paginated)
GET /verses/by_hizb/:hizb_number            - Get verses by Hizb
GET /verses/by_rub/:rub_number              - Get verses by Rub el Hizb
GET /verses/random                          - Get random verse
GET /surah/:number/ayah/:ayah               - Get single ayah (legacy)
```

### Translations
```
GET /resources/translations                 - List all translation resources
GET /resources/translations/:id             - Get translation resource details
GET /surah/:number/ayah/:ayah/translations  - Get verse translations (legacy)
```

### Tafsirs
```
GET /resources/tafsirs                      - List all tafsir resources
GET /resources/tafsirs/:id                  - Get tafsir resource details
GET /surah/:number/ayah/:ayah/tafsirs       - Get verse tafsirs (legacy)
```

### Audio & Recitations
```
GET /chapter_recitations/:chapter_number    - Get chapter audio
GET /recitations/:id/by_chapter/:chapter    - Get verse audio by chapter
GET /recitations/:id/by_ayah/:verse_key     - Get verse audio by key
GET /resources/recitations                  - List all reciters
GET /resources/recitations/:id              - Get reciter details
```

### Juzs
```
GET /juzs                                   - List all Juzs
GET /juzs/:juz_number                       - Get Juz details
```

### Languages
```
GET /resources/languages                    - List all languages
GET /resources/languages/:iso_code          - Get language details
```

## GraphQL Queries

### Chapters
```graphql
chapters(language: String)
chapter(id: Int!, language: String, includeAyahs: Boolean)
chapterInfo(chapterId: Int!, language: String)
surahs(lang: String)                        # Legacy
surah(number: Int!, includeAyahs: Boolean, lang: String)  # Legacy
```

### Verses
```graphql
verseByKey(verseKey: String!, language: String, words: Boolean, translations: [Int], tafsirs: [Int], audio: Int)
versesByChapter(chapterNumber: Int!, language: String, words: Boolean, translations: [Int], page: Int, perPage: Int)
versesByPage(pageNumber: Int!, language: String, words: Boolean, translations: [Int])
versesByJuz(juzNumber: Int!, language: String, words: Boolean, translations: [Int], page: Int, perPage: Int)
versesByHizb(hizbNumber: Int!, language: String, words: Boolean, translations: [Int])
versesByRub(rubNumber: Int!, language: String, words: Boolean, translations: [Int])
randomVerse(language: String, words: Boolean, translations: [Int])
ayah(surah: Int!, ayah: Int!, lang: String, words: Boolean)  # Legacy
```

### Translations
```graphql
translationResources(language: String)
translationResource(id: Int!)
translations(surah: Int!, ayah: Int!, lang: String)
```

### Tafsirs
```graphql
tafsirResources(language: String)
tafsirResource(id: Int!)
tafsirs(surah: Int!, ayah: Int!, lang: String)
```

### Audio
```graphql
chapterRecitations(chapterNumber: Int!, reciterId: Int)
```

### Reciters
```graphql
reciters(style: String)
reciter(id: Int!)
```

### Juzs
```graphql
juzs
juz(juzNumber: Int!)
```

### Languages
```graphql
languages
language(isoCode: String!)
```

## Common Query Parameters

### Pagination
- `page` - Page number (default: 1)
- `per_page` or `perPage` - Results per page (varies by endpoint)

### Filtering
- `language` or `lang` - Language code (e.g., 'en', 'ar', 'ur')
- `translations` - Comma-separated translation resource IDs
- `tafsirs` - Comma-separated tafsir resource IDs
- `words` - Include word-by-word data (true/false)
- `audio` - Reciter ID for audio
- `style` - Recitation style (murattal, mujawwad, muallim)
- `reciter` - Reciter ID

## Response Examples

### Chapter List
```json
[
  {
    "id": 1,
    "number": 1,
    "name_ar": "الفاتحة",
    "name_en": "Al-Fatihah",
    "total_ayahs": 7,
    "revelation": "meccan"
  }
]
```

### Verse with Translations
```json
{
  "id": 255,
  "verse_key": "2:255",
  "text_ar": "ٱللَّهُ لَآ إِلَـٰهَ إِلَّا هُوَ...",
  "translations": [
    {
      "text": "Allah - there is no deity except Him...",
      "language_code": "en",
      "resource": {
        "name": "Sahih International"
      }
    }
  ]
}
```

### Paginated Response
```json
{
  "ayahs": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 29,
    "perPage": 10,
    "totalRecords": 286
  }
}
```
