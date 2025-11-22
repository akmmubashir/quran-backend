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
      where: { number: s.surah_number },
      include: { ayahs: true }
    });
    
    if (exists) {
      console.log(`Surah ${s.surah_number} exists — updating translations and tafsirs`);
      
      // Update each ayah with translations and tafsirs
      for (const a of s.ayahs) {
        const ayah = await prisma.ayah.findFirst({
          where: { 
            surahId: exists.id, 
            ayah_number: a.ayah_number 
          }
        });

        if (ayah) {
          // Delete existing translations and tafsirs for this ayah
          await prisma.translation.deleteMany({ where: { ayahId: ayah.id } });
          await prisma.tafsir.deleteMany({ where: { ayahId: ayah.id } });

          // Add new translations
          if (a.translations && a.translations.length > 0) {
            await prisma.translation.createMany({
              data: a.translations.map((t: any) => ({
                ayahId: ayah.id,
                language_code: t.language_code,
                translator: t.translator ?? null,
                text: t.text,
              })),
            });
          }

          // Add new tafsirs
          if (a.tafsirs && a.tafsirs.length > 0) {
            await prisma.tafsir.createMany({
              data: a.tafsirs.map((t: any) => ({
                ayahId: ayah.id,
                language_code: t.language_code,
                scholar: t.scholar ?? null,
                source: t.source ?? null,
                text: t.text,
              })),
            });
          }
        }
      }
      console.log(`Updated Surah ${s.surah_number} with translations and tafsirs`);
    } else {
      await prisma.surah.create({
        data: {
          number: s.surah_number,
          name_ar: s.name_ar,
          name_en: s.name_en ?? null,
          revelation: s.revelation ?? null,
          total_ayahs: s.ayahs.length,
          ayahs: {
            create: s.ayahs.map((a: any) => ({
              ayah_number: a.ayah_number,
              text_ar: a.text_ar,
              translations: a.translations
                ? {
                    create: a.translations.map((t: any) => ({
                      language_code: t.language_code,
                      translator: t.translator ?? null,
                      text: t.text,
                    })),
                  }
                : undefined,
              tafsirs: a.tafsirs
                ? {
                    create: a.tafsirs.map((t: any) => ({
                      language_code: t.language_code,
                      scholar: t.scholar ?? null,
                      source: t.source ?? null,
                      text: t.text,
                    })),
                  }
                : undefined,
            })),
          },
        },
      });
      console.log(`Inserted Surah ${s.surah_number} with ${s.ayahs.length} ayahs`);
    }
  }
  console.log('Seeding finished.');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
