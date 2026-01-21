import { Injectable } from '@nestjs/common';
import { PrismaClient, Prisma, Tafsir } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class QuranService {
  // ==================== Chapters/Surahs ====================

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async listSurahs(_lang?: string) {
    const surahs = await prisma.surah.findMany({
      orderBy: { surahId: 'asc' },
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
      where: { surahId: surahNumber },
      include: {
        ...(includeAyahs && {
          ayahs: {
            include: {
              translations: translationIds
                ? { where: { id: { in: translationIds } } }
                : lang
                  ? { where: { languageCode: lang } }
                  : false,
              tafsirs: false,
            },
            orderBy: { ayahNumber: 'asc' },
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
        surah: { surahId: surahNum },
        ayahNumber: ayahNum,
      },
      include: {
        surah: true,
        translations: options?.translations
          ? { where: { id: { in: options.translations } } }
          : options?.lang
            ? { where: { languageCode: options.lang } }
            : false,
        tafsirs: options?.tafsirs
          ? { where: { id: { in: options.tafsirs } } }
          : options?.lang
            ? { where: { languageCode: options.lang } }
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
      where: { surah: { surahId: surahNumber }, ayahNumber: ayahNumber },
      include: {
        surah: true,
        translations: options?.translations
          ? { where: { id: { in: options.translations } } }
          : options?.lang
            ? { where: { languageCode: options.lang } }
            : true,
        tafsirs: options?.lang
          ? { where: { languageCode: options.lang } }
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
        where: { surah: { surahId: surahNumber } },
        include: {
          translations: options?.translations
            ? { where: { id: { in: options.translations } } }
            : options?.lang
              ? { where: { languageCode: options.lang } }
              : false,
        },
        orderBy: { ayahNumber: 'asc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.ayah.count({
        where: { surah: { surahId: surahNumber } },
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
      where: { pageNumber: pageNumber },
      include: {
        surah: true,
        translations: options?.translations
          ? { where: { id: { in: options.translations } } }
          : options?.lang
            ? { where: { languageCode: options.lang } }
            : false,
      },
      orderBy: [{ surahId: 'asc' }, { ayahNumber: 'asc' }],
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
        where: { juzNumber: juzNumber },
        include: {
          surah: true,
          translations: options?.translations
            ? { where: { id: { in: options.translations } } }
            : options?.lang
              ? { where: { languageCode: options.lang } }
              : false,
        },
        orderBy: [{ surahId: 'asc' }, { ayahNumber: 'asc' }],
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.ayah.count({ where: { juzNumber: juzNumber } }),
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
      where: { hizbNumber: hizbNumber },
      include: {
        surah: true,
        translations: options?.translations
          ? { where: { id: { in: options.translations } } }
          : options?.lang
            ? { where: { languageCode: options.lang } }
            : false,
      },
      orderBy: [{ surahId: 'asc' }, { ayahNumber: 'asc' }],
    });
    return ayahs;
  }

  async getAyahsByRub(
    rubNumber: number,
    options?: { translations?: number[]; lang?: string },
  ) {
    const ayahs = await prisma.ayah.findMany({
      where: { rubElHizbNumber: rubNumber },
      include: {
        surah: true,
        translations: options?.translations
          ? { where: { id: { in: options.translations } } }
          : options?.lang
            ? { where: { languageCode: options.lang } }
            : false,
      },
      orderBy: [{ surahId: 'asc' }, { ayahNumber: 'asc' }],
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
            ? { where: { languageCode: options.lang } }
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
      where: { surah: { surahId: surahNumber }, ayahNumber: ayahNumber },
      include: {
        translations: {
          where: lang ? { languageCode: lang } : {},
        },
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return ayah?.translations || [];
  }

  async listTranslations(lang?: string) {
    const translations = await prisma.translation.findMany({
      where: {
        ...(lang && { languageCode: lang }),
        ayahId: null, // Only get the template/resource translations
      },
      orderBy: { translator: 'asc' },
    });

    // Manually filter to get distinct translator + languageCode combinations
    const seen = new Set<string>();
    return translations.filter((t) => {
      const key = `${t.translator}-${t.languageCode}`;
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
      where: { surah: { surahId: surahNumber }, ayahNumber: ayahNumber },
      include: {
        tafsirs: {
          where: lang ? { languageCode: lang } : {},
        },
      },
    });
    return (ayah?.tafsirs as Tafsir[]) || [];
  }

  async listTafsirs(lang?: string) {
    const tafsirs = await prisma.tafsir.findMany({
      where: {
        ...(lang && { languageCode: lang }),
        ayahId: null, // Only get the template/resource tafsirs
      },
      orderBy: { source: 'asc' },
    });

    // Manually filter to get distinct source + languageCode combinations
    const seen = new Set<string>();
    return tafsirs.filter((t) => {
      const key = `${t.source}-${t.languageCode}`;
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

  async listJuzs() {
    return prisma.juz.findMany({ orderBy: { juzNumber: 'asc' } });
  }

  async getJuz(juzNumber: number) {
    return prisma.juz.findUnique({ where: { juzNumber } });
  }

  // ==================== Languages ====================

  async listLanguages() {
    return prisma.language.findMany({ orderBy: { name: 'asc' } });
  }

  async getLanguage(isoCode: string) {
    return prisma.language.findFirst({
      where: { iso: isoCode } as unknown as Prisma.LanguageWhereInput,
    });
  }

  // ==================== New Quran Routes ====================

  async getAyahsBySurahId(surahId: number, page?: number, perPage?: number) {
    // If no pagination params provided, return all ayahs
    if (!page && !perPage) {
      return prisma.ayah.findMany({
        where: { surah: { surahId } },
        include: {
          surah: true,
          translations: false,
          tafsirs: false,
        },
        orderBy: { ayahNumber: 'asc' },
      });
    }

    // Otherwise apply pagination
    const pageNum = page || 1;
    const perPageNum = perPage || 10;

    const [ayahs, total] = await Promise.all([
      prisma.ayah.findMany({
        where: { surah: { surahId } },
        include: {
          surah: true,
          translations: false,
          tafsirs: false,
        },
        orderBy: { ayahNumber: 'asc' },
        skip: (pageNum - 1) * perPageNum,
        take: perPageNum,
      }),
      prisma.ayah.count({
        where: { surah: { surahId } },
      }),
    ]);

    return {
      ayahs,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / perPageNum),
        perPage: perPageNum,
        totalRecords: total,
      },
    };
  }

  async getAyahBySurahAndAyahNumber(surahId: number, ayahNumber: number) {
    return prisma.ayah.findFirst({
      where: {
        surah: { surahId },
        ayahNumber,
      },
      include: {
        surah: true,
        translations: true,
        tafsirs: true,
      },
    });
  }

  // ==================== Update Surah Info ====================

  async updateSurahInfo(
    surahId: number,
    languageId: number,
    updateData: {
      surahinfo?: string;
    },
  ) {
    // First, verify the surah exists
    const surah = await prisma.surah.findUnique({
      where: { surahId },
    });

    if (!surah) {
      throw new Error(`Surah with ID ${surahId} not found`);
    }

    // Verify the language exists
    const language = await prisma.language.findUnique({
      where: { id: languageId },
    });

    if (!language) {
      throw new Error(`Language with ID ${languageId} not found`);
    }

    // Upsert the SurahInfo record
    const updatedSurahInfo = await prisma.surahInfo.upsert({
      where: {
        surahId_languageId: {
          surahId,
          languageId,
        },
      },
      update: {
        ...(updateData.surahinfo && { surahinfo: updateData.surahinfo }),
      },
      create: {
        surahId,
        languageId,
        surahinfo: updateData.surahinfo,
      },
      include: {
        surah: true,
        language: true,
      },
    });

    return {
      success: true,
      message: `Surah info updated successfully for language ${language.name}`,
      data: updatedSurahInfo,
    };
  }

  async getSurahInfoByLanguage(surahId: number, languageId: number) {
    return prisma.surahInfo.findUnique({
      where: {
        surahId_languageId: {
          surahId,
          languageId,
        },
      },
      include: {
        surah: true,
        language: true,
      },
    });
  }

  async getSurahInfosByLanguage(surahId: number, languageId?: number) {
    return prisma.surahInfo.findMany({
      where: {
        surahId,
        ...(languageId && { languageId }),
      },
      include: {
        surah: true,
        language: true,
      },
    });
  }
}
