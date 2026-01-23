import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  ValidationPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { AyahContentService } from '../services/ayah-content.service';
import { UpdateAyahGroupDto } from '../dto/update-ayah-group.dto';
import { CreateAyahGroupDto } from '../dto/create-ayah-group.dto';
import { CreateAyahInfoDto } from '../dto/create-ayah-info.dto';
import { UpdateAyahInfoDto } from '../dto/update-ayah-info.dto';
import { CreateAyahTafsirDto } from '../dto/create-ayah-tafsir.dto';
import { UpdateAyahTafsirDto } from '../dto/update-ayah-tafsir.dto';
import { CreateAyahTranslationDto } from '../dto/create-ayah-translation.dto';
import { UpdateAyahTranslationDto } from '../dto/update-ayah-translation.dto';
import { CreateAyahCombinedContentDto } from '../dto/create-ayah-combined-content.dto';

@ApiTags('Ayah Content Management')
@Controller('ayah-content')
export class AyahContentController {
  constructor(private readonly ayahContentService: AyahContentService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new ayah group (auto-generates UUID)',
    description:
      'Creates a new ayah group with auto-generated UUID. Only requires surahId, startAyah, endAyah, isGrouped. No need to pass UUID.',
  })
  @ApiCreatedResponse({
    description: 'Ayah group created successfully with auto-generated UUID',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input: ayah range validation failed or surah not found',
  })
  async createAyahGroup(
    @Body(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    createDto: CreateAyahGroupDto,
  ) {
    return await this.ayahContentService.createOrReuseGroup(createDto);
  }

  @Get('surah/:surahId/ayah/:ayahNumber')
  @ApiOperation({
    summary: 'Get content for a specific ayah',
    description:
      'Resolves and returns the best matching content for an ayah. Prefers grouped content over single ayah content.',
  })
  @ApiParam({
    name: 'surahId',
    description: 'Surah ID (1-114)',
    type: Number,
    example: 1,
  })
  @ApiParam({
    name: 'ayahNumber',
    description: 'Ayah number',
    type: Number,
    example: 5,
  })
  @ApiQuery({
    name: 'languageCode',
    description: 'Filter by language code (e.g., en, ar, ur)',
    required: false,
    type: String,
    example: 'en',
  })
  @ApiOkResponse({
    description: 'Returns ayah group content if found, null otherwise',
  })
  async getAyahContent(
    @Param('surahId', ParseIntPipe) surahId: number,
    @Param('ayahNumber', ParseIntPipe) ayahNumber: number,
    @Query('languageCode') languageCode?: string,
  ) {
    return await this.ayahContentService.getContentForAyah(
      surahId,
      ayahNumber,
      languageCode,
    );
  }

  @Get('surah/:surahId')
  @ApiOperation({
    summary: 'List all content groups for a surah',
    description:
      'Returns all ayah groups (single and grouped) for a specific surah',
  })
  @ApiParam({
    name: 'surahId',
    description: 'Surah ID (1-114)',
    type: Number,
    example: 1,
  })
  @ApiOkResponse({
    description: 'Returns array of ayah groups',
  })
  async listGroupsBySurah(@Param('surahId', ParseIntPipe) surahId: number) {
    return await this.ayahContentService.getGroupsBySurah(surahId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a specific ayah group by ID',
    description: 'Returns a single ayah group with all its content',
  })
  @ApiParam({ name: 'id', description: 'Ayah group UUID', type: String })
  @ApiOkResponse({
    description: 'Returns ayah group',
  })
  @ApiNotFoundResponse({
    description: 'Ayah group not found',
  })
  async getGroupById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.ayahContentService.getGroupById(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update or create an ayah group (Upsert)',
    description:
      'Smart upsert: If group with id exists, updates it. If not found by ID but surahId, startAyah, endAyah exist in request, creates new group. Returns isNew=true for created groups, isNew=false for updated ones.',
  })
  @ApiParam({ name: 'id', description: 'Ayah group UUID', type: String })
  @ApiOkResponse({
    description: 'Ayah group updated or created successfully with isNew flag',
  })
  @ApiNotFoundResponse({
    description: 'Ayah group not found and insufficient data to create',
  })
  @ApiBadRequestResponse({
    description: 'Invalid update data or ayah range validation failed',
  })
  async upsertGroup(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    updateDto: UpdateAyahGroupDto,
  ) {
    // First try to update existing by ID
    try {
      const updated = await this.ayahContentService.updateGroup(id, updateDto);
      return { ...updated, isNew: false };
    } catch (error) {
      // If not found by ID and have range fields, try upsert
      if (
        error?.getStatus?.() === 404 &&
        updateDto.surahId &&
        updateDto.startAyah &&
        updateDto.endAyah
      ) {
        return await this.ayahContentService.upsertGroup(updateDto);
      }
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete an ayah group',
    description:
      'Deletes an ayah group and all its associated content (cascading delete)',
  })
  @ApiParam({ name: 'id', description: 'Ayah group UUID', type: String })
  @ApiOkResponse({
    description: 'Ayah group deleted successfully',
  })
  @ApiNotFoundResponse({
    description: 'Ayah group not found',
  })
  async deleteGroup(@Param('id', ParseUUIDPipe) id: string) {
    return await this.ayahContentService.deleteGroup(id);
  }

  // ==================== Ayah Info Management ====================

  @Post('info')
  @ApiOperation({
    summary: 'Create ayah info (for single or grouped ayahs)',
    description:
      'Creates info for a single ayah or grouped ayahs. Auto-creates group if needed.',
  })
  @ApiCreatedResponse({
    description: 'Ayah info created successfully',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input or validation failed',
  })
  async createAyahInfo(
    @Body(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    createInfoDto: CreateAyahInfoDto,
  ) {
    return await this.ayahContentService.createOrUpdateAyahInfo(createInfoDto);
  }

  @Put('info')
  @ApiOperation({
    summary: 'Update ayah info',
    description: 'Updates info for a single ayah or grouped ayahs',
  })
  @ApiOkResponse({
    description: 'Ayah info updated successfully',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input or validation failed',
  })
  async updateAyahInfo(
    @Body(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    updateInfoDto: UpdateAyahInfoDto,
  ) {
    return await this.ayahContentService.createOrUpdateAyahInfo(updateInfoDto);
  }

  // ==================== Ayah Tafsir Management ====================

  @Post('tafsir')
  @ApiOperation({
    summary: 'Create ayah tafsir (for single or grouped ayahs)',
    description:
      'Creates tafsir for a single ayah or grouped ayahs. Auto-creates group if needed.',
  })
  @ApiCreatedResponse({
    description: 'Ayah tafsir created successfully',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input or validation failed',
  })
  async createAyahTafsir(
    @Body(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    createTafsirDto: CreateAyahTafsirDto,
  ) {
    return await this.ayahContentService.createOrUpdateAyahTafsir(createTafsirDto);
  }

  @Put('tafsir')
  @ApiOperation({
    summary: 'Update ayah tafsir',
    description: 'Updates tafsir for a single ayah or grouped ayahs',
  })
  @ApiOkResponse({
    description: 'Ayah tafsir updated successfully',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input or validation failed',
  })
  async updateAyahTafsir(
    @Body(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    updateTafsirDto: UpdateAyahTafsirDto,
  ) {
    return await this.ayahContentService.createOrUpdateAyahTafsir(updateTafsirDto);
  }

  // ==================== Ayah Translation Management ====================

  @Post('translation')
  @ApiOperation({
    summary: 'Create ayah translation (for single or grouped ayahs)',
    description:
      'Creates translation for a single ayah or grouped ayahs. Auto-creates group if needed.',
  })
  @ApiCreatedResponse({
    description: 'Ayah translation created successfully',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input or validation failed',
  })
  async createAyahTranslation(
    @Body(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    createTranslationDto: CreateAyahTranslationDto,
  ) {
    return await this.ayahContentService.createOrUpdateAyahTranslation(createTranslationDto);
  }

  @Put('translation')
  @ApiOperation({
    summary: 'Update ayah translation',
    description: 'Updates translation for a single ayah or grouped ayahs',
  })
  @ApiOkResponse({
    description: 'Ayah translation updated successfully',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input or validation failed',
  })
  async updateAyahTranslation(
    @Body(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    updateTranslationDto: UpdateAyahTranslationDto,
  ) {
    return await this.ayahContentService.createOrUpdateAyahTranslation(updateTranslationDto);
  }

  /**
   * Create or update combined content (info, tafsir, translation) for single or grouped ayah
   */
  @Post('combined')
  @ApiOperation({
    summary: 'Create or update combined ayah content (info, tafsir, translation)',
    description: 'Submit all content types at once for a single or grouped ayah',
  })
  @ApiCreatedResponse({
    description: 'Combined ayah content created/updated successfully',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input or validation failed',
  })
  async createCombinedContent(
    @Body(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    combinedDto: CreateAyahCombinedContentDto,
  ) {
    return await this.ayahContentService.createOrUpdateCombinedContent(combinedDto);
  }
}
