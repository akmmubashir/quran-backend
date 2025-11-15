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
    const exists = await prisma.surah.findUnique({ where: { number: s.surah_number } });
    if (exists) {
      console.log(`Surah ${s.surah_number} exists — skipping`);
      continue;
    }
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
            text_ar: a.text_ar
          }))
        }
      }
    });
    console.log(`Inserted Surah ${s.surah_number}`);
  }
  console.log('Seeding finished.');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
