/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/**
 * Database Seeding Script for Quran Backend
 *
 * PURPOSE:
 * Populates the database with:
 * - All 114 Surahs (Quran chapters)
 * - All Ayahs (Quran verses) with Arabic text
 * - Translations in multiple languages
 * - Tafsirs (interpretations/commentaries)
 * - Language metadata with translation counts
 *
 * USAGE:
 * npm run prisma:seed
 * OR
 * ts-node prisma/seed.ts
 *
 * PREREQUISITES:
 * 1. Database must exist and migrations must be applied (npx prisma migrate deploy)
 * 2. Files must exist in project root:
 *    - quran.json: Contains surahs, ayahs, translations, and tafsirs
 *    - languages.json: Contains language metadata
 *
 * PROCESS:
 * 1. Reads quran.json and languages.json from parent directory
 * 2. For each surah:
 *    - Creates or updates surah record
 *    - Creates ayahs with verse numbers and Arabic text
 *    - Attaches translations to each ayah
 *    - Attaches tafsirs to each ayah
 * 3. For each language:
 *    - Computes translations_count (distinct translation resources)
 *    - Upserts language record with metadata
 *
 * NOTES:
 * - Safe to run multiple times (uses upsert and deleteMany)
 * - Generates slugs automatically from translator/scholar names
 * - Handles missing/null values with sensible defaults
 */
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function main() {
  const dataPath = path.resolve(__dirname, '../quran.json');
  const languagesPath = path.resolve(__dirname, '../languages.json');
  if (!fs.existsSync(dataPath)) {
    console.error('quran.json not found at:', dataPath);
    process.exit(1);
  }
  if (!fs.existsSync(languagesPath)) {
    console.error('languages.json not found at:', languagesPath);
    process.exit(1);
  }
  const raw = fs.readFileSync(dataPath, 'utf-8');
  const rawLang = fs.readFileSync(languagesPath, 'utf-8');

  const surahList = JSON.parse(raw);
  const languagesList = JSON.parse(rawLang);

  for (const s of surahList) {
    const exists = await prisma.surah.findUnique({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      where: { surahId: s.surah_number },
      include: { ayahs: true },
    });

    if (exists) {
      console.log(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `Surah ${s.surah_number} exists — updating translations and tafsirs`,
      );

      // Update each ayah with translations and tafsirs
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      for (const a of s.ayahs) {
        const ayah = await prisma.ayah.findFirst({
          where: {
            surahId: exists.id,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            ayahNumber: a.ayah_number,
          },
        });

        if (ayah) {
          // Delete existing translations and tafsirs for this ayah
          await prisma.translation.deleteMany({ where: { ayahId: ayah.id } });
          await prisma.tafsir.deleteMany({ where: { ayahId: ayah.id } });

          // Add new translations
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          if (a.translations && a.translations.length > 0) {
            await prisma.translation.createMany({
              // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
              data: a.translations.map((t: any) => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                const language_code: string = t.language_code;
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                const translator: string = t.translator ?? 'Unknown';
                return {
                  ayahId: ayah.id,
                  surahId: exists.id,
                  language_code,
                  translator,
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                  text: t.text,
                };
              }),
            });
          }

          // Add new tafsirs
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          if (a.tafsirs && a.tafsirs.length > 0) {
            await prisma.tafsir.createMany({
              // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
              data: a.tafsirs.map((t: any) => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                const language_code: string = t.language_code;
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                const scholar: string | null = t.scholar ?? null;
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                const source: string | null = t.source ?? null;
                return {
                  ayahId: ayah.id,
                  surahId: exists.id,
                  language_code,
                  scholar,
                  source,
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                  text: t.text,
                };
              }),
            });
          }
        }
      }
      console.log(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `Updated Surah ${s.surah_number} with translations and tafsirs`,
      );
    } else {
      await prisma.surah.create({
        data: {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          surahId: s.surah_number,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          nameArabic: s.name_ar,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          nameEnglish: s.name_en ?? null,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          nameComplex: s.name_complex ?? s.name_simple ?? null,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          revelationPlace: s.revelation ?? null,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          revelationOrder: s.revelation_order ?? null,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          ayahCount: s.ayahs.length,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          bismillahPre: s.bismillah_pre ?? true,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          pages: Array.isArray(s.pages) ? s.pages : [],
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          surahinfo: s.surah_info ?? null,
          ayahs: {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
            create: s.ayahs.map((a: any) => ({
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              ayahNumber: a.ayah_number,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              ayahKey: `${s.surah_number}:${a.ayah_number}`,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              textUthmani: a.text_uthmani ?? a.text_ar,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              textImlaei: a.text_imlaei ?? null,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              ayahInfo: a.ayah_info ?? null,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              pageNumber: a.page_number ?? null,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              juzNumber: a.juz_number ?? null,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              hizbNumber: a.hizb_number ?? null,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              rubElHizbNumber: a.rub_el_hizb_number ?? null,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              translations: a.translations
                ? {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
                    create: a.translations.map((t: any) => {
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                      const language_code: string = t.language_code;
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                      const translator: string = t.translator ?? 'Unknown';
                      return {
                        language_code,
                        translator,
                        surahId: s.surah_number,
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                        text: t.text,
                      };
                    }),
                  }
                : undefined,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              tafsirs: a.tafsirs
                ? {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
                    create: a.tafsirs.map((t: any) => {
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                      const language_code: string = t.language_code;
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                      const scholar: string | null = t.scholar ?? null;
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                      const source: string | null = t.source ?? null;
                      return {
                        language_code,
                        scholar,
                        source,
                        surahId: s.surah_number,
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                        text: t.text,
                      };
                    }),
                  }
                : undefined,
            })),
          },
        },
      });
      console.log(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `Inserted Surah ${s.surah_number} with ${s.ayahs.length} ayahs`,
      );
    }
  }
  console.log('Seeding finished.');

  // Seed languages from languages.json and compute translations_count
  if (Array.isArray(languagesList)) {
    for (const l of languagesList) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const iso: string = l.iso_code ?? l.iso ?? l.code;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const name: string = l.name ?? l.englishName ?? l.label;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const native_name: string | undefined = l.native_name ?? l.nativeName;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const direction: string = l.direction ?? (l.rtl ? 'rtl' : 'ltr');

      // Compute translations_count as the number of distinct translation resources (translator) for this language
      const resources = await prisma.translation.groupBy({
        by: ['translator'],
        where: {
          language_code: iso,
          ayahId: null,
        },
        _count: { translator: true },
      });

      const translations_count = resources.length;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      await prisma.language.upsert({
        where: { iso_code: iso },
        update: { name, native_name, direction, translations_count },
        create: {
          name,
          native_name,
          iso_code: iso,
          direction,
          translations_count,
        },
      });
      console.log(
        `Upserted language ${iso} (${name}) with ${translations_count} translations`,
      );
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
