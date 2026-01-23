import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AyahContentRepository } from '../repositories/ayah-content.repository';
import { CreateAyahGroupDto } from '../dto/create-ayah-group.dto';
import { UpdateAyahGroupDto } from '../dto/update-ayah-group.dto';
import { CreateAyahInfoDto } from '../dto/create-ayah-info.dto';
import { CreateAyahTafsirDto } from '../dto/create-ayah-tafsir.dto';
import { CreateAyahTranslationDto } from '../dto/create-ayah-translation.dto';
import { AyahGroup } from '../entities/ayah-group.entity';

@Injectable()
export class AyahContentService {
  constructor(
    private readonly repository: AyahContentRepository,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Validates that the ayah range is continuous and valid
   */
  private validateAyahRange(surahId: number, startAyah: number, endAyah: number): void {
    if (startAyah < 1) {
      throw new BadRequestException('startAyah must be at least 1');
    }
    if (endAyah < startAyah) {
      throw new BadRequestException('endAyah must be greater than or equal to startAyah');
    }
  }

  /**
   * Validates that surah and ayah range exist (checks against read-only Ayah table)
   */
  private async validateSurahAndAyahs(
    surahId: number,
    startAyah: number,
    endAyah: number,
  ): Promise<void> {
    // Query the read-only Surah table (from Prisma schema)
    const surah = await this.dataSource.query(
      'SELECT "ayahCount", "surahId" FROM "Surah" WHERE "surahId" = $1',
      [surahId],
    );

    if (!surah || surah.length === 0) {
      throw new NotFoundException(`Surah ${surahId} not found`);
    }

    const ayahCount = surah[0].ayahCount;
    if (endAyah > ayahCount) {
      throw new BadRequestException(
        `endAyah ${endAyah} exceeds surah ${surahId} ayah count (${ayahCount})`,
      );
    }

    // Verify all ayahs in range exist in read-only Ayah table
    const ayahsInRange = await this.dataSource.query(
      `SELECT COUNT(*) as count FROM "Ayah" 
       WHERE "surahId" = (SELECT id FROM "Surah" WHERE "surahId" = $1) 
       AND "ayahNumber" BETWEEN $2 AND $3`,
      [surahId, startAyah, endAyah],
    );

    const expectedCount = endAyah - startAyah + 1;
    const actualCount = parseInt(ayahsInRange[0].count, 10);

    if (actualCount !== expectedCount) {
      throw new BadRequestException(
        `Not all ayahs in range ${startAyah}-${endAyah} exist for surah ${surahId}. Expected ${expectedCount}, found ${actualCount}`,
      );
    }
  }

  /**
   * Create or reuse an existing ayah group (auto-generates UUID)
   */
  async createOrReuseGroup(dto: CreateAyahGroupDto): Promise<AyahGroup> {
    const { surahId, startAyah, endAyah, isGrouped, infos, tafsirs, translations, status } = dto;

    // Validate range
    this.validateAyahRange(surahId, startAyah, endAyah);
    await this.validateSurahAndAyahs(surahId, startAyah, endAyah);

    // Check if group already exists
    const existingGroup = await this.repository.findByRange(surahId, startAyah, endAyah);
    if (existingGroup) {
      return existingGroup;
    }

    // Determine if this is a group (if not explicitly set)
    const isGroupedValue = isGrouped !== undefined ? isGrouped : startAyah !== endAyah;

    // Create new group with transaction
    return await this.repository.createWithTransaction(
      {
        surahId,
        startAyah,
        endAyah,
        isGrouped: isGroupedValue,
        status: status || 'published',
      },
      tafsirs,
      translations,
      infos,
    );
  }

  /**
   * Upsert an ayah group (create if not found, update if exists)
   * Identifies existing group by surahId, startAyah, endAyah range
   */
  async upsertGroup(dto: UpdateAyahGroupDto): Promise<AyahGroup & { isNew: boolean }> {
    const { surahId, startAyah, endAyah, isGrouped, infos, tafsirs, translations, status } = dto;

    // Validate required fields for upsert
    if (!surahId || !startAyah || !endAyah) {
      throw new BadRequestException(
        'surahId, startAyah, and endAyah are required for upsert operation',
      );
    }

    // Validate range
    this.validateAyahRange(surahId, startAyah, endAyah);
    await this.validateSurahAndAyahs(surahId, startAyah, endAyah);

    // Check if group already exists by range
    const existingGroup = await this.repository.findByRange(surahId, startAyah, endAyah);

    if (existingGroup) {
      // Update existing group
      const updateData: Partial<AyahGroup> = {};
      if (status !== undefined) updateData.status = status;
      if (isGrouped !== undefined) updateData.isGrouped = isGrouped;

      const updated = await this.repository.updateWithTransaction(
        existingGroup.id,
        updateData,
        tafsirs,
        translations,
        infos,
      );

      return { ...updated, isNew: false };
    }

    // Create new group
    const isGroupedValue = isGrouped !== undefined ? isGrouped : startAyah !== endAyah;

    const created = await this.repository.createWithTransaction(
      {
        surahId,
        startAyah,
        endAyah,
        isGrouped: isGroupedValue,
        status: status || 'published',
      },
      tafsirs,
      translations,
      infos,
    );

    return { ...created, isNew: true };
  }

  /**
   * Get content for a specific ayah (resolves grouped content if available)
   */
  async getContentForAyah(
    surahId: number,
    ayahNumber: number,
    languageCode?: string,
  ): Promise<AyahGroup | null> {
    return await this.repository.findForAyah(surahId, ayahNumber, languageCode);
  }

  /**
   * Get all content groups for a surah
   */
  async getGroupsBySurah(surahId: number): Promise<AyahGroup[]> {
    return await this.repository.findBySurah(surahId);
  }

  /**
   * Get a specific group by ID
   */
  async getGroupById(id: string): Promise<AyahGroup> {
    const group = await this.repository.findById(id);
    if (!group) {
      throw new NotFoundException(`Ayah group with ID ${id} not found`);
    }
    return group;
  }

  /**
   * Update an existing group
   */
  async updateGroup(id: string, dto: UpdateAyahGroupDto): Promise<AyahGroup> {
    // Verify group exists
    const existingGroup = await this.repository.findById(id);
    if (!existingGroup) {
      throw new NotFoundException(`Ayah group with ID ${id} not found`);
    }

    // If updating range, validate it
    if (dto.surahId || dto.startAyah || dto.endAyah) {
      const surahId = dto.surahId ?? existingGroup.surahId;
      const startAyah = dto.startAyah ?? existingGroup.startAyah;
      const endAyah = dto.endAyah ?? existingGroup.endAyah;

      this.validateAyahRange(surahId, startAyah, endAyah);
      await this.validateSurahAndAyahs(surahId, startAyah, endAyah);
    }

    // Build update data
    const updateData: Partial<AyahGroup> = {};
    if (dto.surahId !== undefined) updateData.surahId = dto.surahId;
    if (dto.startAyah !== undefined) updateData.startAyah = dto.startAyah;
    if (dto.endAyah !== undefined) updateData.endAyah = dto.endAyah;
    if (dto.isGrouped !== undefined) updateData.isGrouped = dto.isGrouped;
    if (dto.status !== undefined) updateData.status = dto.status;

    // Update with transaction
    return await this.repository.updateWithTransaction(
      id,
      updateData,
      dto.tafsirs,
      dto.translations,
      dto.infos,
    );
  }

  /**
   * Delete a group
   */
  async deleteGroup(id: string): Promise<{ success: boolean; message: string }> {
    const group = await this.repository.findById(id);
    if (!group) {
      throw new NotFoundException(`Ayah group with ID ${id} not found`);
    }

    await this.repository.delete(id);
    return {
      success: true,
      message: `Ayah group ${id} deleted successfully`,
    };
  }

  /**
   * Create or update ayah info for single or grouped ayahs
   */
  async createOrUpdateAyahInfo(
    dto: CreateAyahInfoDto | any,
  ): Promise<{ success: boolean; groupId: string; message: string }> {
    const { surahId, ayahId, ayahGroupId, languageId, infoText, status } = dto;

    // Find or create group
    let group: AyahGroup | null = null;

    if (ayahGroupId) {
      // Use existing group by ID
      group = await this.repository.findById(ayahGroupId);
      if (!group) {
        throw new NotFoundException(`Ayah group with ID ${ayahGroupId} not found`);
      }
    } else {
      // Find or create group for single ayah
      group = await this.repository.findByRange(surahId, ayahId, ayahId);
      if (!group) {
        // Create new group for single ayah
        this.validateAyahRange(surahId, ayahId, ayahId);
        await this.validateSurahAndAyahs(surahId, ayahId, ayahId);
        group = await this.repository.createWithTransaction(
          {
            surahId,
            startAyah: ayahId,
            endAyah: ayahId,
            isGrouped: false,
            status: status || 'published',
          },
          [],
          [],
          [{ languageId, infoText, status: status || 'published' }],
        );
        return {
          success: true,
          groupId: group!.id,
          message: 'Ayah info created successfully',
        };
      }
    }

    // Update existing group with info
    await this.repository.updateWithTransaction(
      group!.id,
      {},
      [],
      [],
      [{ languageId, infoText, status: status || 'published' }],
    );

    return {
      success: true,
      groupId: group!.id,
      message: 'Ayah info updated successfully',
    };
  }

  /**
   * Create or update ayah tafsir for single or grouped ayahs
   */
  async createOrUpdateAyahTafsir(
    dto: CreateAyahTafsirDto | any,
  ): Promise<{ success: boolean; groupId: string; message: string }> {
    const { surahId, ayahId, ayahGroupId, languageId, tafsirText, scholar, source, status } = dto;

    // Find or create group
    let group: AyahGroup | null = null;

    if (ayahGroupId) {
      // Use existing group by ID
      group = await this.repository.findById(ayahGroupId);
      if (!group) {
        throw new NotFoundException(`Ayah group with ID ${ayahGroupId} not found`);
      }
    } else {
      // Find or create group for single ayah
      group = await this.repository.findByRange(surahId, ayahId, ayahId);
      if (!group) {
        // Create new group for single ayah
        this.validateAyahRange(surahId, ayahId, ayahId);
        await this.validateSurahAndAyahs(surahId, ayahId, ayahId);
        group = await this.repository.createWithTransaction(
          {
            surahId,
            startAyah: ayahId,
            endAyah: ayahId,
            isGrouped: false,
            status: status || 'published',
          },
          [{ languageId, tafsirText, scholar, source, status: status || 'published' }],
          [],
          [],
        );
        return {
          success: true,
          groupId: group!.id,
          message: 'Ayah tafsir created successfully',
        };
      }
    }

    // Update existing group with tafsir
    await this.repository.updateWithTransaction(
      group!.id,
      {},
      [{ languageId, tafsirText, scholar, source, status: status || 'published' }],
      [],
      [],
    );

    return {
      success: true,
      groupId: group!.id,
      message: 'Ayah tafsir updated successfully',
    };
  }

  /**
   * Create or update ayah translation for single or grouped ayahs
   */
  async createOrUpdateAyahTranslation(
    dto: CreateAyahTranslationDto | any,
  ): Promise<{ success: boolean; groupId: string; message: string }> {
    const { surahId, ayahId, ayahGroupId, languageId, translationText, translator, status } = dto;

    // Find or create group
    let group: AyahGroup | null = null;

    if (ayahGroupId) {
      // Use existing group by ID
      group = await this.repository.findById(ayahGroupId);
      if (!group) {
        throw new NotFoundException(`Ayah group with ID ${ayahGroupId} not found`);
      }
    } else {
      // Find or create group for single ayah
      group = await this.repository.findByRange(surahId, ayahId, ayahId);
      if (!group) {
        // Create new group for single ayah
        this.validateAyahRange(surahId, ayahId, ayahId);
        await this.validateSurahAndAyahs(surahId, ayahId, ayahId);
        group = await this.repository.createWithTransaction(
          {
            surahId,
            startAyah: ayahId,
            endAyah: ayahId,
            isGrouped: false,
            status: status || 'published',
          },
          [],
          [{ languageId, translationText, translator, status: status || 'published' }],
          [],
        );
        return {
          success: true,
          groupId: group!.id,
          message: 'Ayah translation created successfully',
        };
      }
    }

    // Update existing group with translation
    await this.repository.updateWithTransaction(
      group!.id,
      {},
      [],
      [{ languageId, translationText, translator, status: status || 'published' }],
      [],
    );

    return {
      success: true,
      groupId: group!.id,
      message: 'Ayah translation updated successfully',
    };
  }

  /**
   * Create or update combined content (info, tafsir, translation) for single or grouped ayah
   */
  async createOrUpdateCombinedContent(
    dto: any,
  ): Promise<{ success: boolean; groupId: string; message: string }> {
    const { surahId, ayahId, ayahGroupId, info, tafsir, translation, status } = dto;

    // Find or create group
    let group: AyahGroup | null = null;

    if (ayahGroupId) {
      // Use existing group by ID
      group = await this.repository.findById(ayahGroupId);
      if (!group) {
        throw new NotFoundException(`Ayah group with ID ${ayahGroupId} not found`);
      }
    } else {
      // Find or create group for single ayah
      group = await this.repository.findByRange(surahId, ayahId, ayahId);
      if (!group) {
        // Create new group with all content
        this.validateAyahRange(surahId, ayahId, ayahId);
        await this.validateSurahAndAyahs(surahId, ayahId, ayahId);
        group = await this.repository.createWithTransaction(
          {
            surahId,
            startAyah: ayahId,
            endAyah: ayahId,
            isGrouped: false,
            status: status || 'published',
          },
          tafsir || [],
          translation || [],
          info || [],
        );
        return {
          success: true,
          groupId: group!.id,
          message: 'Ayah content created successfully',
        };
      }
    }

    // Update existing group with all content
    await this.repository.updateWithTransaction(
      group!.id,
      {},
      tafsir || [],
      translation || [],
      info || [],
    );

    return {
      success: true,
      groupId: group!.id,
      message: 'Ayah content updated successfully',
    };
  }
}

