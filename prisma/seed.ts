/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  const dataPath = path.resolve(__dirname, '../quran.json');
  if (!fs.existsSync(dataPath)) {
    console.error('quran.json not found at:', dataPath);
    process.exit(1);
  }
  const raw = fs.readFileSync(dataPath, 'utf-8');

  const surahList = JSON.parse(raw);

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
              data: a.translations.map((t: any) => ({
                ayahId: ayah.id,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                language_code: t.language_code,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                translator: t.translator ?? null,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                text: t.text,
              })),
            });
          }

          // Add new tafsirs
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          if (a.tafsirs && a.tafsirs.length > 0) {
            await prisma.tafsir.createMany({
              // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
              data: a.tafsirs.map((t: any) => ({
                ayahId: ayah.id,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                language_code: t.language_code,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                scholar: t.scholar ?? null,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                source: t.source ?? null,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                text: t.text,
              })),
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
                    create: a.translations.map((t: any) => ({
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                      language_code: t.language_code,
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                      translator: t.translator ?? null,
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                      text: t.text,
                    })),
                  }
                : undefined,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              tafsirs: a.tafsirs
                ? {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
                    create: a.tafsirs.map((t: any) => ({
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                      language_code: t.language_code,
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                      scholar: t.scholar ?? null,
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                      source: t.source ?? null,
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                      text: t.text,
                    })),
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
