/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
      where: { number: s.surah_number },
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
            ayah_number: a.ayah_number,
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
                const language_code: string = t.language_code;
                const translator: string = t.translator ?? 'Unknown';
                const name = translator;
                const slug = slugify(`${language_code}-${translator}`);
                const language_name = language_code; // fallback; refined via languages table later
                return {
                  ayahId: ayah.id,
                  language_code,
                  name,
                  slug,
                  language_name,
                  direction: 'ltr',
                  text: t.text,
                  info: null,
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
                const language_code: string = t.language_code;
                const name = t.scholar ?? t.source ?? 'Tafsir';
                const slug = slugify(`${language_code}-${name}`);
                const language_name = language_code;
                return {
                  ayahId: ayah.id,
                  language_code,
                  name,
                  slug,
                  language_name,
                  author_name: t.scholar ?? null,
                  text: t.text,
                  info: null,
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
          number: s.surah_number,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          name_ar: s.name_ar,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          name_en: s.name_en ?? null,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          revelation: s.revelation ?? null,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          total_ayahs: s.ayahs.length,
          ayahs: {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
            create: s.ayahs.map((a: any) => ({
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              ayah_number: a.ayah_number,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              text_ar: a.text_ar,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              translations: a.translations
                ? {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
                    create: a.translations.map((t: any) => {
                      const language_code: string = t.language_code;
                      const translator: string = t.translator ?? 'Unknown';
                      const name = translator;
                      const slug = slugify(`${language_code}-${translator}`);
                      const language_name = language_code;
                      return {
                        language_code,
                        name,
                        slug,
                        language_name,
                        direction: 'ltr',
                        text: t.text,
                        info: null,
                      };
                    }),
                  }
                : undefined,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              tafsirs: a.tafsirs
                ? {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
                    create: a.tafsirs.map((t: any) => {
                      const language_code: string = t.language_code;
                      const name = t.scholar ?? t.source ?? 'Tafsir';
                      const slug = slugify(`${language_code}-${name}`);
                      const language_name = language_code;
                      return {
                        language_code,
                        name,
                        slug,
                        language_name,
                        author_name: t.scholar ?? null,
                        text: t.text,
                        info: null,
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
      const iso: string = l.iso_code ?? l.iso ?? l.code;
      const name: string = l.name ?? l.englishName ?? l.label;
      const native_name: string | undefined = l.native_name ?? l.nativeName;
      const direction: string = l.direction ?? (l.rtl ? 'rtl' : 'ltr');

      // Compute translations_count as the number of distinct translation resources (slug) for this language
      const resources = await prisma.translation.groupBy({
        by: ['slug'],
        where: {
          language_code: iso,
          ayahId: null,
        },
        _count: { slug: true },
      });

      const translations_count = resources.length;

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
