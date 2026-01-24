import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { AyahGroup } from '../entities/ayah-group.entity';
import { AyahTafsir } from '../entities/ayah-tafsir.entity';
import { AyahTranslation } from '../entities/ayah-translation.entity';
import { AyahInfo } from '../entities/ayah-info.entity';

@Injectable()
export class AyahContentRepository {
  constructor(
    @InjectRepository(AyahGroup)
    private readonly ayahGroupRepo: Repository<AyahGroup>,
    @InjectRepository(AyahTafsir)
    private readonly tafsirRepo: Repository<AyahTafsir>,
    @InjectRepository(AyahTranslation)
    private readonly translationRepo: Repository<AyahTranslation>,
    @InjectRepository(AyahInfo)
    private readonly infoRepo: Repository<AyahInfo>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Find an ayah group by unique combination of surahId, startAyah, endAyah
   */
  async findByRange(
    surahId: number,
    startAyah: number,
    endAyah: number,
  ): Promise<AyahGroup | null> {
    return await this.ayahGroupRepo.findOne({
      where: { surahId, startAyah, endAyah },
        relations: ['tafsirs', 'translations', 'ayahInfos'],
    });
  }

  /**
   * Find the best matching group for a specific ayah number
   * Priority: Grouped content > Single ayah content
   */
  async findForAyah(
    surahId: number,
    ayahNumber: number,
      languageId?: number,
  ): Promise<AyahGroup | null> {
    const queryBuilder = this.ayahGroupRepo
      .createQueryBuilder('group')
      .where('group.surah_id = :surahId', { surahId })
      .andWhere('group.start_ayah <= :ayahNumber', { ayahNumber })
      .andWhere('group.end_ayah >= :ayahNumber', { ayahNumber })
      .andWhere('group.status = :status', { status: 'published' });

    // Prefer grouped content (isGrouped = true), then prefer smaller ranges
    queryBuilder
      .orderBy('group.is_grouped', 'DESC')
      .addOrderBy('(group.end_ayah - group.start_ayah)', 'ASC')
      .addOrderBy('group.created_at', 'DESC');

    if (languageId) {
      queryBuilder
        .leftJoinAndSelect(
          'group.tafsirs',
          'tafsir',
          'tafsir.language_id = :languageId',
          { languageId },
        )
        .leftJoinAndSelect(
          'group.translations',
          'translation',
          'translation.language_id = :languageId',
          { languageId },
        )
          .leftJoinAndSelect('group.ayahInfos', 'info', 'info.language_id = :languageId', {
          languageId,
        });
    } else {
      queryBuilder
        .leftJoinAndSelect('group.tafsirs', 'tafsir')
        .leftJoinAndSelect('group.translations', 'translation')
          .leftJoinAndSelect('group.ayahInfos', 'info');
    }

    return await queryBuilder.getOne();
  }

  /**
   * Find all groups for a specific surah
   */
  async findBySurah(surahId: number): Promise<AyahGroup[]> {
    return await this.ayahGroupRepo.find({
      where: { surahId },
        relations: ['tafsirs', 'translations', 'ayahInfos'],
      order: {
        startAyah: 'ASC',
        endAyah: 'ASC',
      },
    });
  }

  /**
   * Find a group by ID with all relations
   */
  async findById(id: string): Promise<AyahGroup | null> {
    return await this.ayahGroupRepo.findOne({
      where: { id },
        relations: ['tafsirs', 'translations', 'ayahInfos'],
    });
  }

  /**
   * Create a new ayah group with related content in a transaction
   */
  async createWithTransaction(
    groupData: Partial<AyahGroup>,
    tafsirs?: Partial<AyahTafsir>[],
    translations?: Partial<AyahTranslation>[],
    infos?: Partial<AyahInfo>[],
  ): Promise<AyahGroup> {
    return await this.dataSource.transaction(async (manager) => {
      // Create the group
      const group = manager.create(AyahGroup, groupData);
      const savedGroup = await manager.save(group);

      // Create tafsirs
      if (tafsirs && tafsirs.length > 0) {
        const tafsirEntities = tafsirs.map((t) =>
          manager.create(AyahTafsir, {
            ...t,
            ayahGroupId: savedGroup.id,
          }),
        );
        await manager.save(tafsirEntities);
      }

      // Create translations
      if (translations && translations.length > 0) {
        const translationEntities = translations.map((t) =>
          manager.create(AyahTranslation, {
            ...t,
            ayahGroupId: savedGroup.id,
          }),
        );
        await manager.save(translationEntities);
      }

      // Create infos
      if (infos && infos.length > 0) {
        const infoEntities = infos.map((i) =>
          manager.create(AyahInfo, {
            ...i,
            ayahGroupId: savedGroup.id,
          }),
        );
        await manager.save(infoEntities);
      }

      // Fetch complete entity with relations
      const result = await manager.findOne(AyahGroup, {
        where: { id: savedGroup.id },
          relations: ['tafsirs', 'translations', 'ayahInfos'],
      });
      if (!result) {
        throw new Error('Failed to create ayah group');
      }
      return result;
    });
  }

  /**
   * Update a group and its related content in a transaction
   */
  async updateWithTransaction(
    id: string,
    groupData: Partial<AyahGroup>,
    tafsirs?: Partial<AyahTafsir>[],
    translations?: Partial<AyahTranslation>[],
    infos?: Partial<AyahInfo>[],
  ): Promise<AyahGroup> {
    return await this.dataSource.transaction(async (manager) => {
      // Update the group
      await manager.update(AyahGroup, { id }, groupData);

      // If tafsirs provided, replace all
      if (tafsirs !== undefined) {
        await manager.delete(AyahTafsir, { ayahGroupId: id });
        if (tafsirs.length > 0) {
          const tafsirEntities = tafsirs.map((t) =>
            manager.create(AyahTafsir, {
              ...t,
              ayahGroupId: id,
            }),
          );
          await manager.save(tafsirEntities);
        }
      }

      // If translations provided, replace all
      if (translations !== undefined) {
        await manager.delete(AyahTranslation, { ayahGroupId: id });
        if (translations.length > 0) {
          const translationEntities = translations.map((t) =>
            manager.create(AyahTranslation, {
              ...t,
              ayahGroupId: id,
            }),
          );
          await manager.save(translationEntities);
        }
      }

      // If infos provided, replace all
      if (infos !== undefined) {
        await manager.delete(AyahInfo, { ayahGroupId: id });
        if (infos.length > 0) {
          const infoEntities = infos.map((i) =>
            manager.create(AyahInfo, {
              ...i,
              ayahGroupId: id,
            }),
          );
          await manager.save(infoEntities);
        }
      }

      // Fetch updated entity with relations
      const result = await manager.findOne(AyahGroup, {
        where: { id },
        relations: ['tafsirs', 'translations', 'infos'],
      });
      if (!result) {
        throw new Error(`Failed to update ayah group ${id}`);
      }
      return result;
    });
  }

  /**
   * Delete a group (cascades to related content)
   */
  async delete(id: string): Promise<void> {
    await this.ayahGroupRepo.delete({ id });
  }
}
