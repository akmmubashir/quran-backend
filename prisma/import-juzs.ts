import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ApiJuz {
  id: number;
  juz_number?: number | null;
  verses_count?: number | null;
  first_verse_id?: number | null;
  last_verse_id?: number | null;
  verse_mapping?: Record<string, string | number> | null;
}

interface ApiJuzResponse {
  juzs?: ApiJuz[];
}

async function fetchJuzs(): Promise<ApiJuz[]> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const fetchImpl = (globalThis as any).fetch as typeof fetch | undefined;
  if (!fetchImpl) {
    throw new Error(
      'Global fetch is unavailable. Use Node 18+ or install a fetch polyfill.',
    );
  }

  const url = 'https://api.quran.com/api/v4/juzs';
  const res = await fetchImpl(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch juzs: ${res.status} ${res.statusText}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const body: ApiJuzResponse = await res.json();
  if (!body.juzs || !Array.isArray(body.juzs)) {
    throw new Error('Unexpected juzs response shape');
  }
  return body.juzs;
}

function mapJuz(juz: ApiJuz) {
  const juzNumber = juz.juz_number ?? juz.id;
  return {
    id: juzNumber,
    juzNumber,
    AyahsCount: juz.verses_count ?? 0,
    firstAyahId: juz.first_verse_id ?? null,
    lastAyahId: juz.last_verse_id ?? null,
    ayahMapping: juz.verse_mapping ?? undefined,
  };
}

async function main() {
  const juzs = await fetchJuzs();
  console.log(`Fetched ${juzs.length} juzs from quran.com API`);

  for (const juz of juzs) {
    const data = mapJuz(juz);
    await prisma.juz.upsert({
      where: { juzNumber: data.juzNumber },
      update: data,
      create: data,
    });
    console.log(`Upserted juz ${data.juzNumber}`);
  }

  console.log('Juz import complete.');
}

main()
  .catch((err) => {
    console.error('Import failed:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
