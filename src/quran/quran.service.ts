/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { PrismaClient, Prisma, Tafsir } from '@prisma/client';
import {
  AyahGroup,
  AyahInfo,
  AyahTranslation,
  AyahTafsir,
} from '../ayah-content/entities/ayah-content.entity';

const prisma = new PrismaClient();

@Injectable()
export class QuranService {
  constructor(
    @InjectRepository(AyahGroup)
    private ayahGroupRepository: Repository<AyahGroup>,
    @InjectRepository(AyahInfo)
    private ayahInfoRepository: Repository<AyahInfo>,
    @InjectRepository(AyahTranslation)
    private ayahTranslationRepository: Repository<AyahTranslation>,
    @InjectRepository(AyahTafsir)
    private ayahTafsirRepository: Repository<AyahTafsir>,
  ) {}

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

  // ==================== Ayah Grouping ====================

  async createAyahGroup(surahId: number, ayahNumbers: number[]) {
    // Validate ayahNumbers array
    if (!ayahNumbers || ayahNumbers.length < 2) {
      throw new Error('At least 2 ayahs are required to create a group');
    }

    // Sort the ayah numbers
    const sortedAyahNumbers = ayahNumbers.sort((a, b) => a - b);
    const groupStart = sortedAyahNumbers[0];
    const groupEnd = sortedAyahNumbers[sortedAyahNumbers.length - 1];

    // Check if ayahs exist
    const ayahs = await prisma.ayah.findMany({
      where: {
        surahId,
        ayahNumber: { in: sortedAyahNumbers },
      },
    });

    if (ayahs.length !== sortedAyahNumbers.length) {
      throw new Error('One or more ayahs not found');
    }

    // Create or update ayah group in TypeORM
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    let ayahGroup = await this.ayahGroupRepository.findOne({
      where: {
        surahId,
        startAyah: groupStart,
        endAyah: groupEnd,
      },
    });

    if (!ayahGroup) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      ayahGroup = this.ayahGroupRepository.create({
        surahId,
        startAyah: groupStart,
        endAyah: groupEnd,
        isGrouped: true,
      });
      await this.ayahGroupRepository.save(ayahGroup);
    }

    // Update all ayahs in the group (for backward compatibility)
    await prisma.$executeRaw`
      UPDATE "Ayah"
      SET "ayahGroupStart" = ${groupStart}, "ayahGroupEnd" = ${groupEnd}
      WHERE "surahId" = ${surahId}
        AND "ayahNumber" = ANY(${sortedAyahNumbers})
    `;

    return {
      success: true,
      message: `Successfully grouped ayahs ${groupStart}-${groupEnd} in surah ${surahId}`,
      data: {
        surahId,
        ayahGroupStart: groupStart,
        ayahGroupEnd: groupEnd,
        ayahCount: sortedAyahNumbers.length,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        groupId: ayahGroup.id,
      },
    };
  }

  async removeAyahGroup(surahId: number, ayahNumbers: number[]) {
    // Validate ayahNumbers array
    if (!ayahNumbers || ayahNumbers.length === 0) {
      throw new Error('At least 1 ayah is required to remove group');
    }

    // First, find all groups that contain any of the selected ayahs
    // by checking the Ayah table for their ayahGroupStart/ayahGroupEnd
    const ayahsWithGroupInfo = await prisma.ayah.findMany({
      where: {
        surahId,
        ayahNumber: { in: ayahNumbers },
        ayahGroupStart: { not: null },
        ayahGroupEnd: { not: null },
      },
      select: {
        ayahNumber: true,
        ayahGroupStart: true,
        ayahGroupEnd: true,
      },
    });

    // Collect unique groups to delete
    const groupsToDelete = new Set<string>();
    const allAyahsToUngroup = new Set<number>();

    for (const ayah of ayahsWithGroupInfo) {
      if (ayah.ayahGroupStart && ayah.ayahGroupEnd) {
        groupsToDelete.add(`${ayah.ayahGroupStart}-${ayah.ayahGroupEnd}`);
        
        // Also need to ungroup ALL ayahs in each affected group, not just selected ones
        for (let i = ayah.ayahGroupStart; i <= ayah.ayahGroupEnd; i++) {
          allAyahsToUngroup.add(i);
        }
      }
    }

    // Delete each group from ayah_groups table
    const deletedGroups: string[] = [];
    for (const groupKey of groupsToDelete) {
      const [start, end] = groupKey.split('-').map(Number);
      
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const ayahGroup = await this.ayahGroupRepository.findOne({
        where: { surahId, startAyah: start, endAyah: end },
      });

      if (ayahGroup) {
        await this.ayahGroupRepository.remove(ayahGroup);
        deletedGroups.push(groupKey);
      }
    }

    // Update all ayahs in all affected groups to remove grouping
    const ayahsToUpdate = Array.from(allAyahsToUngroup);
    if (ayahsToUpdate.length > 0) {
      await prisma.$executeRaw`
        UPDATE "Ayah"
        SET "ayahGroupStart" = NULL, "ayahGroupEnd" = NULL
        WHERE "surahId" = ${surahId}
          AND "ayahNumber" = ANY(${ayahsToUpdate})
      `;
    }

    return {
      success: true,
      message: `Successfully ungrouped ${deletedGroups.length} group(s) in surah ${surahId}`,
      data: {
        surahId,
        selectedAyahs: ayahNumbers,
        deletedGroups,
        ungroupedAyahCount: ayahsToUpdate.length,
      },
    };
  }

  // ==================== Combined Ayah Content ====================

  async updateAyahContent(
    surahId: number,
    ayahNumber: number,
    updateData: {
      languageId: number;
      ayahInfo?: string;
      translationText?: string;
      translator?: string;
      tafsirText?: string;
      tafsirScholar?: string;
    },
  ) {
    // Delegate to grouped content updater (handles single as group of one)
    return this.updateGroupedAyahContent(surahId, ayahNumber, updateData);
  }

  async getAyahWithContent(
    surahId: number,
    ayahNumber: number,
    languageId?: number,
  ) {
    // Verify the requested ayah exists
    const requestedAyah = await prisma.ayah.findFirst({
      where: { surahId, ayahNumber },
      include: { surah: true },
    });

    if (!requestedAyah) {
      throw new Error(`Ayah ${ayahNumber} not found in surah ${surahId}`);
    }

    // Find the ayah group containing this ayah (grouped or single)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const ayahGroup = await this.ayahGroupRepository.findOne({
      where: {
        surahId,
        startAyah: LessThanOrEqual(ayahNumber),
        endAyah: MoreThanOrEqual(ayahNumber),
      },
    });

    // Fetch all ayahs in the group with Arabic text
    const groupedAyahs = ayahGroup
      ? await prisma.ayah.findMany({
          where: {
            surahId,
            ayahNumber: {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              gte: ayahGroup.startAyah,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
              lte: ayahGroup.endAyah,
            },
          },
          include: { surah: true },
          orderBy: { ayahNumber: 'asc' },
        })
      : [requestedAyah];

    // Fetch ayah content from TypeORM tables if group exists
    let ayahInfo: any = null;
    let ayahTranslation: any = null;
    let ayahTafsir: any = null;

    if (ayahGroup) {
      if (languageId) {
        // Fetch content for specific language
        ayahInfo = await this.ayahInfoRepository.findOne({
          where: {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            ayahGroupId: ayahGroup.id,
            languageId: languageId,
          },
        });

        ayahTranslation = await this.ayahTranslationRepository.findOne({
          where: {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            ayahGroupId: ayahGroup.id,
            languageId: languageId,
          },
        });

        ayahTafsir = await this.ayahTafsirRepository.findOne({
          where: {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            ayahGroupId: ayahGroup.id,
            languageId: languageId,
          },
        });
      } else {
        // Fetch all languages
        ayahInfo = await this.ayahInfoRepository.find({
          where: {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            ayahGroupId: ayahGroup.id,
          },
        });

        ayahTranslation = await this.ayahTranslationRepository.find({
          where: {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            ayahGroupId: ayahGroup.id,
          },
        });

        ayahTafsir = await this.ayahTafsirRepository.find({
          where: {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            ayahGroupId: ayahGroup.id,
          },
        });
      }
    }

    return {
      success: true,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      isGrouped: !!ayahGroup && ayahGroup.startAyah !== ayahGroup.endAyah,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      groupId: ayahGroup?.id,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      groupStart: ayahGroup?.startAyah ?? ayahNumber,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      groupEnd: ayahGroup?.endAyah ?? ayahNumber,
      data: groupedAyahs,
      ayahInfo,
      ayahTranslation,
      ayahTafsir,
    };
  }

  async getAyahContentByGroup(
    surahId: number,
    startAyah: number,
    endAyah: number,
    languageId?: number,
  ) {
    // Find the exact group
    const ayahGroup = await this.ayahGroupRepository.findOne({
      where: { surahId, startAyah, endAyah },
    });

    if (!ayahGroup) {
      return {
        success: true,
        groupId: null,
        surahId,
        startAyah,
        endAyah,
        ayahInfo: languageId ? null : [],
        ayahTranslation: languageId ? null : [],
        ayahTafsir: languageId ? null : [],
      };
    }

    if (languageId) {
      const [info, translation, tafsir] = await Promise.all([
        this.ayahInfoRepository.findOne({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          where: { ayahGroupId: ayahGroup.id, languageId },
        }),
        this.ayahTranslationRepository.findOne({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          where: { ayahGroupId: ayahGroup.id, languageId },
        }),
        this.ayahTafsirRepository.findOne({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          where: { ayahGroupId: ayahGroup.id, languageId },
        }),
      ]);

      return {
        success: true,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        groupId: ayahGroup.id,
        surahId,
        startAyah,
        endAyah,
        ayahInfo: info,
        ayahTranslation: translation,
        ayahTafsir: tafsir,
      };
    }

    const [infos, translations, tafsirs] = await Promise.all([
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.ayahInfoRepository.find({ where: { ayahGroupId: ayahGroup.id } }),
      this.ayahTranslationRepository.find({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        where: { ayahGroupId: ayahGroup.id },
      }),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.ayahTafsirRepository.find({ where: { ayahGroupId: ayahGroup.id } }),
    ]);

    return {
      success: true,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      groupId: ayahGroup.id,
      surahId,
      startAyah,
      endAyah,
      ayahInfo: infos,
      ayahTranslation: translations,
      ayahTafsir: tafsirs,
    };
  }

  async updateGroupedAyahContent(
    surahId: number,
    ayahNumber: number,
    updateData: {
      languageId: number;
      ayahInfo?: string;
      translationText?: string;
      translator?: string;
      tafsirText?: string;
      tafsirScholar?: string;
      tafsirSource?: string;
    },
  ) {
    // Verify ayah exists
    const ayahExists = await prisma.ayah.findFirst({
      where: { surahId, ayahNumber },
    });
    if (!ayahExists) {
      throw new Error(`Ayah ${ayahNumber} not found in surah ${surahId}`);
    }

    // Verify language exists
    const language = await prisma.language.findUnique({
      where: { id: updateData.languageId },
    });

    if (!language) {
      throw new Error(`Language with ID ${updateData.languageId} not found`);
    }

    // Find or create the ayah group via TypeORM containment
    let ayahGroup = await this.ayahGroupRepository.findOne({
      where: {
        surahId,
        startAyah: LessThanOrEqual(ayahNumber),
        endAyah: MoreThanOrEqual(ayahNumber),
      },
    });

    if (!ayahGroup) {
      // Create a single-ayah group if none exists
      ayahGroup = await this.ayahGroupRepository.save({
        surahId,
        startAyah: ayahNumber,
        endAyah: ayahNumber,
        isGrouped: false,
        status: 'active',
      });
    }

    // Update or create ayah info
    if (updateData.ayahInfo !== undefined) {
      const existingInfo = await this.ayahInfoRepository.findOne({
        where: {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          ayahGroupId: ayahGroup.id,
          languageId: updateData.languageId,
        },
      });

      if (existingInfo) {
        await this.ayahInfoRepository.update(
          {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            ayahGroupId: ayahGroup.id,
            languageId: updateData.languageId,
          },
          {
            infoText: updateData.ayahInfo,
          },
        );
      } else {
        await this.ayahInfoRepository.save({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          ayahGroupId: ayahGroup.id,
          languageId: updateData.languageId,
          infoText: updateData.ayahInfo,
          status: 'active',
        });
      }
    }

    // Update or create translation
    if (
      updateData.translationText !== undefined ||
      updateData.translator !== undefined
    ) {
      const existingTranslation = await this.ayahTranslationRepository.findOne({
        where: {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          ayahGroupId: ayahGroup.id,
          languageId: updateData.languageId,
        },
      });

      if (existingTranslation) {
        await this.ayahTranslationRepository.update(
          {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            ayahGroupId: ayahGroup.id,
            languageId: updateData.languageId,
          },
          {
            ...(updateData.translationText !== undefined && {
              translationText: updateData.translationText,
            }),
            ...(updateData.translator !== undefined && {
              translator: updateData.translator,
            }),
          },
        );
      } else {
        await this.ayahTranslationRepository.save({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          ayahGroupId: ayahGroup.id,
          languageId: updateData.languageId,
          translationText: updateData.translationText || '',
          translator: updateData.translator || '',
          status: 'active',
        });
      }
    }

    // Update or create tafsir
    if (
      updateData.tafsirText !== undefined ||
      updateData.tafsirScholar !== undefined
    ) {
      const existingTafsir = await this.ayahTafsirRepository.findOne({
        where: {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          ayahGroupId: ayahGroup.id,
          languageId: updateData.languageId,
        },
      });

      if (existingTafsir) {
        await this.ayahTafsirRepository.update(
          {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            ayahGroupId: ayahGroup.id,
            languageId: updateData.languageId,
          },
          {
            ...(updateData.tafsirText !== undefined && {
              tafsirText: updateData.tafsirText,
            }),
            ...(updateData.tafsirScholar !== undefined && {
              scholar: updateData.tafsirScholar,
            }),
            ...(updateData.tafsirSource !== undefined && {
              source: updateData.tafsirSource,
            }),
          },
        );
      } else {
        await this.ayahTafsirRepository.save({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          ayahGroupId: ayahGroup.id,
          languageId: updateData.languageId,
          tafsirText: updateData.tafsirText || '',
          scholar: updateData.tafsirScholar || '',
          source: updateData.tafsirSource || '',
          status: 'active',
        });
      }
    }

    // Return updated content for the ayah group (single or multi)
    return this.getAyahWithContent(surahId, ayahNumber, updateData.languageId);
  }
}
