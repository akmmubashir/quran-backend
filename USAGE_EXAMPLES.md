# API Usage Examples

This guide provides practical examples for using the Quran API.

## Table of Contents
- [Getting Started](#getting-started)
- [REST API Examples](#rest-api-examples)
- [GraphQL Examples](#graphql-examples)
- [Common Use Cases](#common-use-cases)

---

## Getting Started

### Base URLs
- **REST API**: `http://localhost:3000`
- **GraphQL Playground**: `http://localhost:3000/graphql`

### Common Query Parameters
- `language` or `lang`: ISO 639-1 language code (e.g., `en`, `ar`, `ur`)
- `translations`: Comma-separated translation resource IDs
- `words`: Include word-by-word data (`true` or `false`)
- `page`: Page number for pagination
- `per_page`: Results per page

---

## REST API Examples

### 1. Listing and Browsing

#### Get All Chapters
```bash
curl http://localhost:3000/chapters
```

#### Get All Chapters with English Info
```bash
curl http://localhost:3000/chapters?language=en
```

#### Get Chapter Details
```bash
curl http://localhost:3000/chapters/1
```

#### Get Chapter with Description
```bash
curl http://localhost:3000/chapters/1/info?language=en
```

---

### 2. Reading Verses

#### Get Verse by Key (Ayat al-Kursi)
```bash
curl http://localhost:3000/verses/by_key/2:255
```

#### Get Verse with Translations
```bash
curl "http://localhost:3000/verses/by_key/2:255?translations=20,131"
```

#### Get Verse with Words and Translations
```bash
curl "http://localhost:3000/verses/by_key/1:1?words=true&translations=20"
```

#### Get All Verses from Al-Fatihah
```bash
curl http://localhost:3000/verses/by_chapter/1?translations=20
```

#### Get Verses from Surah Al-Baqarah (Paginated)
```bash
curl "http://localhost:3000/verses/by_chapter/2?page=1&per_page=10&translations=20"
```

---

### 3. Browsing by Divisions

#### Get Verses from First Juz
```bash
curl "http://localhost:3000/verses/by_juz/1?page=1&per_page=20&translations=20"
```

#### Get Verses from Specific Mushaf Page
```bash
curl http://localhost:3000/verses/by_page/1?translations=20
```

#### Get Verses from a Hizb
```bash
curl http://localhost:3000/verses/by_hizb/1?translations=20
```

#### Get Verses from a Rub el Hizb
```bash
curl http://localhost:3000/verses/by_rub/1
```

---

### 4. Random Verse (Verse of the Day)

#### Get Random Verse with Translation
```bash
curl "http://localhost:3000/verses/random?translations=20&words=true"
```

---

### 5. Translations and Tafsirs

#### List All Translation Resources
```bash
curl http://localhost:3000/resources/translations
```

#### List English Translations
```bash
curl http://localhost:3000/resources/translations?language=en
```

#### Get Translation Details
```bash
curl http://localhost:3000/resources/translations/20
```

#### Get Verse Translations
```bash
curl http://localhost:3000/surah/2/ayah/255/translations?lang=en
```

#### List Tafsir Resources
```bash
curl http://localhost:3000/resources/tafsirs?language=en
```

#### Get Verse Tafsirs
```bash
curl http://localhost:3000/surah/2/ayah/255/tafsirs?lang=en
```

---

### 6. Audio and Recitations

#### List All Reciters
```bash
curl http://localhost:3000/resources/recitations
```

#### List Murattal Style Reciters
```bash
curl http://localhost:3000/resources/recitations?style=murattal
```

#### Get Chapter Audio
```bash
curl http://localhost:3000/chapter_recitations/1?reciter=7
```

#### Get Verse Audio by Chapter
```bash
curl "http://localhost:3000/recitations/7/by_chapter/1?page=1&per_page=10"
```

#### Get Specific Verse Audio
```bash
curl http://localhost:3000/recitations/7/by_ayah/2:255
```

---

### 7. Juzs and Languages

#### List All Juzs
```bash
curl http://localhost:3000/juzs
```

#### Get Juz Details
```bash
curl http://localhost:3000/juzs/1
```

#### List Supported Languages
```bash
curl http://localhost:3000/resources/languages
```

---

## GraphQL Examples

Access the GraphQL Playground at `http://localhost:3000/graphql` and try these queries:

### 1. Basic Chapter Query

```graphql
query GetChapter {
  chapter(id: 1) {
    number
    name_ar
    name_en
    name_simple
    revelation
    total_ayahs
  }
}
```

---

### 2. Chapter with Verses

```graphql
query GetChapterWithVerses {
  chapter(id: 1, includeAyahs: true, language: "en") {
    number
    name_ar
    name_en
    total_ayahs
    ayahs {
      ayah_number
      verse_key
      text_ar
      text_uthmani
    }
  }
}
```

---

### 3. Verse with Translations

```graphql
query GetVerseWithTranslations {
  verseByKey(
    verseKey: "2:255"
    translations: [20, 131]
  ) {
    verse_key
    text_ar
    juz_number
    page_number
    translations {
      text
      language_code
      resource {
        name
        author_name
        slug
      }
    }
  }
}
```

---

### 4. Verse with Word-by-Word

```graphql
query GetVerseWithWords {
  verseByKey(
    verseKey: "1:1"
    words: true
    translations: [20]
  ) {
    verse_key
    text_ar
    translations {
      text
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

### 5. Verses by Chapter (Paginated)

```graphql
query GetVersesByChapter {
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
      perPage
      totalRecords
    }
  }
}
```

---

### 6. Verses by Juz

```graphql
query GetVersesByJuz {
  versesByJuz(
    juzNumber: 1
    translations: [20]
    page: 1
    perPage: 20
  ) {
    ayahs {
      verse_key
      text_ar
      juz_number
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

### 7. Random Verse

```graphql
query GetRandomVerse {
  randomVerse(
    translations: [20]
    words: true
  ) {
    verse_key
    text_ar
    translations {
      text
      resource {
        name
      }
    }
    surah {
      name_en
      number
    }
  }
}
```

---

### 8. Translation Resources

```graphql
query GetTranslations {
  translationResources(language: "en") {
    id
    name
    author_name
    slug
    language_name
    language_code
  }
}
```

---

### 9. Reciters

```graphql
query GetReciters {
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

### 10. Chapter Info

```graphql
query GetChapterInfo {
  chapterInfo(chapterId: 1, language: "en") {
    short_text
    text
    source
  }
}
```

---

### 11. All Juzs

```graphql
query GetAllJuzs {
  juzs {
    juz_number
    name_ar
    name_en
    first_verse_key
    last_verse_key
    verses_count
  }
}
```

---

## Common Use Cases

### Use Case 1: Building a Quran Reader

**Step 1**: Get all chapters for navigation
```bash
GET /chapters
```

**Step 2**: Get verses for selected chapter
```bash
GET /verses/by_chapter/2?translations=20&page=1&per_page=10
```

**Step 3**: Get next page
```bash
GET /verses/by_chapter/2?translations=20&page=2&per_page=10
```

---

### Use Case 2: Verse of the Day Feature

```bash
GET /verses/random?translations=20&words=true
```

```graphql
query {
  randomVerse(translations: [20]) {
    verse_key
    text_ar
    translations {
      text
      resource {
        name
      }
    }
    surah {
      name_en
      number
    }
  }
}
```

---

### Use Case 3: Multi-Translation Comparison

```bash
GET /verses/by_key/2:255?translations=20,131,84
```

```graphql
query {
  verseByKey(verseKey: "2:255", translations: [20, 131, 84]) {
    verse_key
    text_ar
    translations {
      text
      resource {
        name
        author_name
      }
    }
  }
}
```

---

### Use Case 4: Audio Player

**Step 1**: Get available reciters
```bash
GET /resources/recitations?style=murattal
```

**Step 2**: Get chapter audio
```bash
GET /chapter_recitations/1?reciter=7
```

**Step 3**: Get verse-by-verse audio
```bash
GET /recitations/7/by_chapter/1?page=1&per_page=50
```

---

### Use Case 5: Search by Juz (Reading Schedule)

**Day 1**: Read Juz 1
```bash
GET /verses/by_juz/1?translations=20&page=1&per_page=20
```

**Day 2**: Read Juz 2
```bash
GET /verses/by_juz/2?translations=20&page=1&per_page=20
```

---

### Use Case 6: Learning Tool with Word Analysis

```bash
GET /verses/by_key/1:1?words=true&translations=20
```

This returns:
- Arabic text
- Translation
- Word-by-word breakdown with:
  - Original Arabic word
  - Transliteration
  - Individual word translation

---

### Use Case 7: Mushaf Page Reader

```bash
GET /verses/by_page/1?translations=20
```

Returns all verses that appear on page 1 of the Mushaf.

---

### Use Case 8: Tafsir Study

**Step 1**: Get verse
```bash
GET /verses/by_key/2:255?translations=20
```

**Step 2**: Get available tafsirs
```bash
GET /resources/tafsirs?language=en
```

**Step 3**: Get verse tafsirs
```bash
GET /surah/2/ayah/255/tafsirs?lang=en
```

---

## JavaScript/TypeScript Client Examples

### Using Fetch API

```javascript
// Get verse with translations
async function getVerse(verseKey, translationIds) {
  const params = new URLSearchParams({
    translations: translationIds.join(','),
    words: 'true'
  });
  
  const response = await fetch(
    `http://localhost:3000/verses/by_key/${verseKey}?${params}`
  );
  
  return await response.json();
}

// Usage
const verse = await getVerse('2:255', [20, 131]);
console.log(verse);
```

### Using Apollo Client (GraphQL)

```javascript
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
  cache: new InMemoryCache()
});

const GET_VERSE = gql`
  query GetVerse($verseKey: String!, $translations: [Int!]) {
    verseByKey(verseKey: $verseKey, translations: $translations) {
      verse_key
      text_ar
      translations {
        text
        resource {
          name
        }
      }
    }
  }
`;

// Usage
const { data } = await client.query({
  query: GET_VERSE,
  variables: {
    verseKey: '2:255',
    translations: [20, 131]
  }
});

console.log(data.verseByKey);
```

---

## Python Client Examples

```python
import requests

# Get verse with translations
def get_verse(verse_key, translation_ids):
    params = {
        'translations': ','.join(map(str, translation_ids)),
        'words': 'true'
    }
    
    response = requests.get(
        f'http://localhost:3000/verses/by_key/{verse_key}',
        params=params
    )
    
    return response.json()

# Usage
verse = get_verse('2:255', [20, 131])
print(verse)
```

---

## Tips and Best Practices

1. **Use Pagination**: For large result sets, always use pagination to avoid overwhelming responses
2. **Filter Translations**: Specify translation IDs instead of getting all translations
3. **Cache Results**: Consider caching frequently accessed data (e.g., chapter lists)
4. **Use GraphQL for Complex Queries**: GraphQL allows you to request exactly the data you need
5. **Verse Keys**: Always use the format `chapter:verse` (e.g., "2:255")
6. **Language Codes**: Use ISO 639-1 codes (e.g., "en", "ar", "ur")

---

## Response Time Expectations

- Simple queries (single verse/chapter): < 50ms
- Paginated queries (10-20 items): < 100ms
- Complex queries with translations: < 200ms
- Large datasets (full chapters): < 500ms

---

## Error Handling

### HTTP Status Codes
- `200`: Success
- `400`: Bad Request (invalid parameters)
- `404`: Not Found (resource doesn't exist)
- `500`: Internal Server Error

### Example Error Response
```json
{
  "statusCode": 404,
  "message": "Chapter not found",
  "error": "Not Found"
}
```

---

For more details, see:
- [API Documentation](./API_DOCUMENTATION.md)
- [API Endpoints Reference](./API_ENDPOINTS.md)
