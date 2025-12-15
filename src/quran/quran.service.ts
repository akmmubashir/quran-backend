import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class QuranService {
  // ==================== Chapters/Surahs ====================

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async listSurahs(_lang?: string) {
    const surahs = await prisma.surah.findMany({
      orderBy: { number: 'asc' },
    });
    return surahs;
  }

  async getSurah(
    surahNumber: number,
    includeAyahs: boolean = true,
    lang?: string,
    translationIds?: number[],
    page?: number,
    perPage?: number,
  ) {
    const surah = await prisma.surah.findUnique({
      where: { number: surahNumber },
      include: {
        ...(includeAyahs && {
          ayahs: {
            include: {
              translations: translationIds
                ? { where: { id: { in: translationIds } } }
                : lang
                  ? { where: { language_code: lang } }
                  : false,
              tafsirs: false,
            },
            orderBy: { ayah_number: 'asc' },
            ...(page &&
              perPage && {
                skip: (page - 1) * perPage,
                take: perPage,
              }),
          },
        }),
      },
    });
    return surah;
  }

  // ==================== Verses/Ayahs ====================

  async getAyahByKey(
    verseKey: string,
    options?: {
      translations?: number[];
      tafsirs?: number[];
      lang?: string;
    },
  ) {
    const [surahNum, ayahNum] = verseKey.split(':').map(Number);

    const ayah = await prisma.ayah.findFirst({
      where: {
        surah: { number: surahNum },
        ayah_number: ayahNum,
      },
      include: {
        surah: true,
        translations: options?.translations
          ? { where: { id: { in: options.translations } } }
          : options?.lang
            ? { where: { language_code: options.lang } }
            : false,
        tafsirs: options?.tafsirs
          ? { where: { id: { in: options.tafsirs } } }
          : options?.lang
            ? { where: { language_code: options.lang } }
            : false,
      },
    });
    return ayah;
  }

  async getAyah(
    surahNumber: number,
    ayahNumber: number,
    options?: {
      translations?: number[];
      tafsirs?: number[];
      lang?: string;
    },
  ) {
    const ayah = await prisma.ayah.findFirst({
      where: { surah: { number: surahNumber }, ayah_number: ayahNumber },
      include: {
        surah: true,
        translations: options?.translations
          ? { where: { id: { in: options.translations } } }
          : options?.lang
            ? { where: { language_code: options.lang } }
            : true,
        tafsirs: options?.lang
          ? { where: { language_code: options.lang } }
          : true,
      },
    });
    return ayah;
  }

  async getAyahsByChapter(
    surahNumber: number,
    options?: {
      page?: number;
      perPage?: number;
      translations?: number[];
      lang?: string;
    },
  ) {
    const page = options?.page || 1;
    const perPage = options?.perPage || 10;

    const [ayahs, total] = await Promise.all([
      prisma.ayah.findMany({
        where: { surah: { number: surahNumber } },
        include: {
          translations: options?.translations
            ? { where: { id: { in: options.translations } } }
            : options?.lang
              ? { where: { language_code: options.lang } }
              : false,
        },
        orderBy: { ayah_number: 'asc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.ayah.count({
        where: { surah: { number: surahNumber } },
      }),
    ]);

    return {
      ayahs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / perPage),
        perPage,
        totalRecords: total,
      },
    };
  }

  async getAyahsByPage(
    pageNumber: number,
    options?: {
      translations?: number[];
      lang?: string;
    },
  ) {
    const ayahs = await prisma.ayah.findMany({
      where: { page_number: pageNumber },
      include: {
        surah: true,
        translations: options?.translations
          ? { where: { id: { in: options.translations } } }
          : options?.lang
            ? { where: { language_code: options.lang } }
            : false,
      },
      orderBy: [{ surahId: 'asc' }, { ayah_number: 'asc' }],
    });
    return ayahs;
  }

  async getAyahsByJuz(
    juzNumber: number,
    options?: {
      page?: number;
      perPage?: number;
      translations?: number[];
      lang?: string;
    },
  ) {
    const page = options?.page || 1;
    const perPage = options?.perPage || 10;

    const [ayahs, total] = await Promise.all([
      prisma.ayah.findMany({
        where: { juz_number: juzNumber },
        include: {
          surah: true,
          translations: options?.translations
            ? { where: { id: { in: options.translations } } }
            : options?.lang
              ? { where: { language_code: options.lang } }
              : false,
        },
        orderBy: [{ surahId: 'asc' }, { ayah_number: 'asc' }],
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.ayah.count({ where: { juz_number: juzNumber } }),
    ]);

    return {
      ayahs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / perPage),
        perPage,
        totalRecords: total,
      },
    };
  }

  async getAyahsByHizb(
    hizbNumber: number,
    options?: { translations?: number[]; lang?: string },
  ) {
    const ayahs = await prisma.ayah.findMany({
      where: { hizb_number: hizbNumber },
      include: {
        surah: true,
        translations: options?.translations
          ? { where: { id: { in: options.translations } } }
          : options?.lang
            ? { where: { language_code: options.lang } }
            : false,
      },
      orderBy: [{ surahId: 'asc' }, { ayah_number: 'asc' }],
    });
    return ayahs;
  }

  async getAyahsByRub(
    rubNumber: number,
    options?: { translations?: number[]; lang?: string },
  ) {
    const ayahs = await prisma.ayah.findMany({
      where: { rub_el_hizb_number: rubNumber },
      include: {
        surah: true,
        translations: options?.translations
          ? { where: { id: { in: options.translations } } }
          : options?.lang
            ? { where: { language_code: options.lang } }
            : false,
      },
      orderBy: [{ surahId: 'asc' }, { ayah_number: 'asc' }],
    });
    return ayahs;
  }

  async getRandomAyah(options?: { translations?: number[]; lang?: string }) {
    const count = await prisma.ayah.count();
    const skip = Math.floor(Math.random() * count);

    const ayah = await prisma.ayah.findFirst({
      skip,
      include: {
        surah: true,
        translations: options?.translations
          ? { where: { id: { in: options.translations } } }
          : options?.lang
            ? { where: { language_code: options.lang } }
            : false,
      },
    });
    return ayah;
  }

  // ==================== Translations ====================

  async getTranslations(
    surahNumber: number,
    ayahNumber: number,
    lang?: string,
  ) {
    const ayah = await prisma.ayah.findFirst({
      where: { surah: { number: surahNumber }, ayah_number: ayahNumber },
      include: {
        translations: {
          where: lang ? { language_code: lang } : {},
        },
      },
    });
    return ayah?.translations || [];
  }

  async listTranslations(lang?: string) {
    const translations = await prisma.translation.findMany({
      where: {
        ...(lang && { language_code: lang }),
        ayahId: null, // Only get the template/resource translations
      },
      orderBy: { translator: 'asc' },
    });

    // Manually filter to get distinct translator + language_code combinations
    const seen = new Set<string>();
    return translations.filter((t) => {
      const key = `${t.translator}-${t.language_code}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  async getTranslationById(id: number) {
    return prisma.translation.findFirst({
      where: { id, ayahId: null },
    });
  }

  // ==================== Tafsirs ====================

  async getTafsirs(surahNumber: number, ayahNumber: number, lang?: string) {
    const ayah = await prisma.ayah.findFirst({
      where: { surah: { number: surahNumber }, ayah_number: ayahNumber },
      include: {
        tafsirs: {
          where: lang ? { language_code: lang } : {},
        },
      },
    });
    return ayah?.tafsirs || [];
  }

  async listTafsirs(lang?: string) {
    const tafsirs = await prisma.tafsir.findMany({
      where: {
        ...(lang && { language_code: lang }),
        ayahId: null, // Only get the template/resource tafsirs
      },
      orderBy: { source: 'asc' },
    });

    // Manually filter to get distinct source + language_code combinations
    const seen = new Set<string>();
    return tafsirs.filter((t) => {
      const key = `${t.source}-${t.language_code}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  async getTafsirBySource(source: string) {
    return prisma.tafsir.findFirst({
      where: { source, ayahId: null },
    });
  }

  // ==================== Juzs ====================

  // eslint-disable-next-line @typescript-eslint/require-await
  async listJuzs() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return prisma.juz.findMany({ orderBy: { juz_number: 'asc' } });
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getJuz(juzNumber: number) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return prisma.juz.findUnique({ where: { juz_number: juzNumber } });
  }

  // ==================== Languages ====================

  // eslint-disable-next-line @typescript-eslint/require-await
  async listLanguages() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return prisma.language.findMany({ orderBy: { name: 'asc' } });
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getLanguage(isoCode: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return prisma.language.findUnique({ where: { iso_code: isoCode } });
  }
}
