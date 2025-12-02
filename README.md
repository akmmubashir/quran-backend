# Quran Backend API

A comprehensive REST and GraphQL API for accessing Quran data, built with NestJS, Prisma, and PostgreSQL. This API provides a similar structure to Quran.com's API, offering access to chapters, verses, translations, tafsirs, audio recitations, and more.

## Features

✨ **Comprehensive Quran Data**
- 114 Chapters (Surahs) with detailed metadata
- 6,236+ Verses (Ayahs) with multiple text formats
- Word-by-word translations and transliterations
- Multiple Mushaf page layouts support

📖 **Rich Content**
- Multiple translation resources in various languages
- Tafsir (commentary) resources from renowned scholars
- Chapter information and context
- Juz, Hizb, and Rub el Hizb divisions

🎵 **Audio Support**
- Multiple reciters with different recitation styles
- Chapter-level audio
- Verse-by-verse audio with timing segments
- Word-by-word audio support

🌍 **Multi-Language Support**
- Support for multiple languages
- Language-specific translations and tafsirs
- RTL and LTR text direction support

🚀 **Dual API Access**
- RESTful API endpoints
- GraphQL API with comprehensive queries
- Pagination support for large datasets
- Flexible filtering and query options

## Tech Stack

- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **GraphQL**: Apollo Server
- **Language**: TypeScript

## Description

Built with the [NestJS](https://github.com/nestjs/nest) framework, this API provides a robust and scalable solution for accessing Quran data programmatically.

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd quran-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/quran?schema=public"
```

4. **Run database migrations**
```bash
npx prisma migrate dev
```

5. **Seed the database** (optional)
```bash
npm run prisma:seed
```

6. **Start the development server**
```bash
npm run start:dev
```

The API will be available at:
- REST API: `http://localhost:3000`
- GraphQL Playground: `http://localhost:3000/graphql`

## API Documentation

For comprehensive API documentation, see:
- [API Documentation](./API_DOCUMENTATION.md) - Full documentation with examples
- [API Endpoints Quick Reference](./API_ENDPOINTS.md) - Quick reference guide

### Quick Examples

**Get a chapter:**
```bash
GET http://localhost:3000/chapters/1
```

**Get a verse with translations:**
```bash
GET http://localhost:3000/verses/by_key/2:255?translations=20,131&words=true
```

**GraphQL Query:**
```graphql
query {
  verseByKey(verseKey: "2:255", translations: [20]) {
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
```

## Available Scripts

```bash
# Development
npm run start              # Start the application
npm run start:dev          # Start with watch mode
npm run start:debug        # Start with debug mode

# Production
npm run build              # Build the application
npm run start:prod         # Start in production mode

# Database
npm run prisma:seed        # Seed the database
npx prisma studio          # Open Prisma Studio
npx prisma migrate dev     # Run migrations

# Testing
npm run test               # Run unit tests
npm run test:watch         # Run tests in watch mode
npm run test:e2e           # Run e2e tests
npm run test:cov           # Run tests with coverage

# Code Quality
npm run lint               # Run ESLint
npm run format             # Format code with Prettier
```

## Database Schema

The database includes the following main models:

- **Surah** - Chapters of the Quran
- **Ayah** - Verses with multiple text formats
- **Word** - Word-by-word data
- **Translation** - Verse translations
- **TranslationResource** - Translation metadata
- **Tafsir** - Verse commentaries
- **TafsirResource** - Tafsir metadata
- **Reciter** - Audio reciters
- **AudioFile** - Verse-level audio
- **ChapterAudio** - Chapter-level audio
- **ChapterInfo** - Chapter descriptions
- **Juz** - Quran divisions (1-30)
- **Language** - Supported languages

See [DATABASE_DIAGRAM.md](./DATABASE_DIAGRAM.md) for the complete schema.

## Project Structure

```
quran-backend/
├── src/
│   ├── quran/
│   │   ├── quran.controller.ts    # REST API endpoints
│   │   ├── quran.resolver.ts      # GraphQL resolvers
│   │   ├── quran.service.ts       # Business logic
│   │   ├── quran.types.ts         # GraphQL types
│   │   └── quran.module.ts        # Module definition
│   ├── app.module.ts              # Root module
│   └── main.ts                    # Application entry point
├── prisma/
│   ├── schema.prisma              # Database schema
│   ├── seed.ts                    # Database seeding
│   └── migrations/                # Database migrations
├── API_DOCUMENTATION.md           # Full API documentation
├── API_ENDPOINTS.md               # Quick reference
└── README.md                      # This file
```

## API Endpoints Overview

### Chapters
- `GET /chapters` - List all chapters
- `GET /chapters/:id` - Get chapter details
- `GET /chapters/:id/info` - Get chapter information

### Verses
- `GET /verses/by_key/:verse_key` - Get verse by key (e.g., "2:255")
- `GET /verses/by_chapter/:chapter` - Get verses by chapter
- `GET /verses/by_page/:page` - Get verses by Mushaf page
- `GET /verses/by_juz/:juz` - Get verses by Juz
- `GET /verses/random` - Get random verse

### Resources
- `GET /resources/translations` - List translations
- `GET /resources/tafsirs` - List tafsirs
- `GET /resources/recitations` - List reciters
- `GET /resources/languages` - List languages

### Audio
- `GET /chapter_recitations/:chapter` - Chapter audio
- `GET /recitations/:id/by_chapter/:chapter` - Verse audio

See [API_ENDPOINTS.md](./API_ENDPOINTS.md) for complete list.

## GraphQL API

Access the GraphQL Playground at `http://localhost:3000/graphql`

Example queries:

```graphql
# Get chapter with verses
query {
  chapter(id: 1, includeAyahs: true) {
    number
    name_ar
    name_en
    total_ayahs
    ayahs {
      verse_key
      text_ar
    }
  }
}

# Get verse with translations
query {
  verseByKey(
    verseKey: "2:255"
    translations: [20, 131]
    words: true
  ) {
    verse_key
    text_ar
    translations {
      text
      resource {
        name
        author_name
      }
    }
    words {
      text_uthmani
      transliteration
      translation
    }
  }
}
```

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/quran"

# Server (optional)
PORT=3000
NODE_ENV=development
```

## Development

### Database Management

```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Reset database
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio

# Generate Prisma Client
npx prisma generate
```

### Code Quality

The project uses ESLint and Prettier for code quality:

```bash
npm run lint          # Check for linting errors
npm run format        # Format code with Prettier
```

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Deployment

For production deployment:

1. Set environment variables
2. Build the application: `npm run build`
3. Run migrations: `npx prisma migrate deploy`
4. Start the server: `npm run start:prod`

See [NestJS deployment documentation](https://docs.nestjs.com/deployment) for more details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [GraphQL Documentation](https://graphql.org/learn/)
- [Quran.com API](https://api-docs.quran.foundation/)

## License

This project is licensed under the MIT License.
#   q u r a n - b a c k e n d  
 