import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Minimal shape of the chapters response from quran.com API
interface ApiChapter {
  id: number;
  revelation_place?: string | null;
  revelation_order?: number | null;
  bismillah_pre?: boolean | null;
  name_simple?: string | null;
  name_complex?: string | null;
  name_arabic?: string | null;
  verses_count?: number | null;
  pages?: number[] | null;
  translated_name?: { name?: string | null } | null;
}

interface ApiChapterResponse {
  chapters?: ApiChapter[];
}

async function fetchChapters(language = 'en'): Promise<ApiChapter[]> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const fetchImpl = (globalThis as any).fetch as typeof fetch | undefined;
  if (!fetchImpl) {
    throw new Error(
      'Global fetch is unavailable. Use Node 18+ or install a fetch polyfill.',
    );
  }

  const url = `https://api.quran.com/api/v4/chapters?language=${encodeURIComponent(language)}`;
  const res = await fetchImpl(url);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch chapters: ${res.status} ${res.statusText}`,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const body: ApiChapterResponse = await res.json();
  if (!body.chapters || !Array.isArray(body.chapters)) {
    throw new Error('Unexpected chapters response shape');
  }
  return body.chapters;
}

function mapChapter(chapter: ApiChapter) {
  const pages = Array.isArray(chapter.pages)
    ? chapter.pages.filter((n): n is number => Number.isInteger(n))
    : [];

  return {
    surahId: chapter.id,
    nameArabic:
      chapter.name_arabic ?? chapter.name_simple ?? `Surah ${chapter.id}`,
    nameComplex: chapter.name_complex ?? chapter.name_simple ?? null,
    nameEnglish: chapter.translated_name?.name ?? chapter.name_simple ?? null,
    revelationPlace: chapter.revelation_place ?? null,
    revelationOrder: chapter.revelation_order ?? null,
    ayahCount: chapter.verses_count ?? 0,
    bismillahPre: chapter.bismillah_pre ?? true,
    pages,
    surahinfo: null,
  };
}

async function main() {
  const chapters = await fetchChapters('en');
  console.log(`Fetched ${chapters.length} chapters from quran.com API`);

  for (const chapter of chapters) {
    const data = mapChapter(chapter);
    await prisma.surah.upsert({
      where: { surahId: data.surahId },
      update: data,
      create: data,
    });
    console.log(
      `Upserted surah ${data.surahId} (${data.nameEnglish ?? data.nameArabic})`,
    );
  }

  console.log('Surah import complete.');
}

main()
  .catch((err) => {
    console.error('Import failed:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
