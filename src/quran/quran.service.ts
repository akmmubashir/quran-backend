import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class QuranService {
  async getAyah(surahNumber: number, ayahNumber: number, lang?: string) {
    const ayah = await prisma.ayah.findFirst({
      where: { surah: { number: surahNumber }, ayah_number: ayahNumber },
      include: { translations: !!lang ? { where: { language_code: lang } } : true,
                 tafsirs: !!lang ? { where: { language_code: lang } } : true,
                 surah: true
      }
    });
    return ayah;
  }

  async listSurahs() {
    return prisma.surah.findMany({ orderBy: { number: 'asc' }});
  }
}
