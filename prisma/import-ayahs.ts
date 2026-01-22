import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ApiVerse {
  id: number;
  verse_key?: string | null;
  verse_number?: number | null;
  juz_number?: number | null;
  hizb_number?: number | null;
  rub_el_hizb_number?: number | null;
  page_number?: number | null;
  text_uthmani?: string | null;
  text_imlaei?: string | null;
}

interface ApiPagination {
  total_pages?: number | null;
}

interface ApiVersesResponse {
  verses?: ApiVerse[];
  pagination?: ApiPagination;
}

const PER_PAGE = 50;

async function fetchVersesByChapter(
  chapter: number,
  page = 1,
): Promise<ApiVersesResponse> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const fetchImpl = (globalThis as any).fetch as typeof fetch | undefined;
  if (!fetchImpl) {
    throw new Error(
      'Global fetch is unavailable. Use Node 18+ or install a fetch polyfill.',
    );
  }

  const params = new URLSearchParams({
    language: 'ar',
    page: String(page),
    per_page: String(PER_PAGE),
    fields: 'text_uthmani,text_imlaei',
    words: 'false',
  });
  const url = `https://api.quran.com/api/v4/verses/by_chapter/${chapter}?${params.toString()}`;
  const res = await fetchImpl(url);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch verses for chapter ${chapter} page ${page}: ${res.status} ${res.statusText}`,
    );
  }

  return (await res.json()) as ApiVersesResponse;
}

function mapVerse(chapter: number, surahPk: number, verse: ApiVerse) {
  const ayahNumber = verse.verse_number ?? 0;
  return {
    surahId: surahPk,
    ayahNumber,
    ayahKey: verse.verse_key ?? `${chapter}:${ayahNumber}`,
    textUthmani: verse.text_uthmani ?? null,
    textImlaei: verse.text_imlaei ?? null,
    pageNumber: verse.page_number ?? null,
    juzNumber: verse.juz_number ?? null,
    hizbNumber: verse.hizb_number ?? null,
    rubElHizbNumber: verse.rub_el_hizb_number ?? null,
  };
}

async function importChapter(chapter: number) {
  const surah = await prisma.surah.findUnique({ where: { surahId: chapter } });
  if (!surah) {
    console.warn(
      `Skipping chapter ${chapter}: surah not found in DB (run import:surahs first).`,
    );
    return;
  }

  const allVerses: ApiVerse[] = [];
  let page = 1;

  while (true) {
    const resp = await fetchVersesByChapter(chapter, page);
    const verses = resp.verses ?? [];
    allVerses.push(...verses);

    const totalPages = resp.pagination?.total_pages ?? 1;
    if (page >= totalPages) break;
    page += 1;
  }

  if (allVerses.length === 0) {
    console.warn(`No verses returned for chapter ${chapter}`);
    return;
  }

  await prisma.$transaction([
    prisma.ayah.deleteMany({ where: { surahId: surah.id } }),
    prisma.ayah.createMany({
      data: allVerses.map((v) => mapVerse(chapter, surah.id, v)),
      skipDuplicates: true,
    }),
  ]);

  console.log(`Imported ${allVerses.length} ayahs for surah ${chapter}`);
}

async function main() {
  for (let chapter = 1; chapter <= 114; chapter += 1) {
    await importChapter(chapter);
  }

  console.log('Ayah import complete.');
}

main()
  .catch((err) => {
    console.error('Import failed:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
