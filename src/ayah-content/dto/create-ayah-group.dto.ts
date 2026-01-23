import {
  IsInt,
  IsString,
  IsBoolean,
  IsOptional,
  IsArray,
  ValidateNested,
  Min,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAyahInfoDto {
  @ApiProperty({ description: 'ISO language code (e.g., en, ar, ur)', example: 'en' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  languageCode: string;

  @ApiProperty({ description: 'Info text content', example: 'This ayah explains...' })
  @IsString()
  @IsNotEmpty()
  infoText: string;

  @ApiPropertyOptional({ description: 'Status', default: 'published', example: 'published' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  status?: string;
}

export class CreateAyahTafsirDto {
  @ApiProperty({ description: 'ISO language code', example: 'en' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  languageCode: string;

  @ApiProperty({ description: 'Tafsir text content', example: 'Ibn Kathir explains...' })
  @IsString()
  @IsNotEmpty()
  tafsirText: string;

  @ApiPropertyOptional({ description: 'Scholar name', example: 'Ibn Kathir' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  scholar?: string;

  @ApiPropertyOptional({ description: 'Source name', example: 'Tafsir Ibn Kathir' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  source?: string;

  @ApiPropertyOptional({ description: 'Status', default: 'published' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  status?: string;
}

export class CreateAyahTranslationDto {
  @ApiProperty({ description: 'ISO language code', example: 'en' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  languageCode: string;

  @ApiProperty({
    description: 'Translation text content',
    example: 'In the name of Allah, the Most Gracious...',
  })
  @IsString()
  @IsNotEmpty()
  translationText: string;

  @ApiProperty({ description: 'Translator name', example: 'Sahih International' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  translator: string;

  @ApiPropertyOptional({ description: 'Status', default: 'published' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  status?: string;
}

export class CreateAyahGroupDto {
  @ApiProperty({ description: 'Surah ID (1-114)', example: 1, minimum: 1 })
  @IsInt()
  @Min(1)
  surahId: number;

  @ApiProperty({ description: 'Starting ayah number', example: 1, minimum: 1 })
  @IsInt()
  @Min(1)
  startAyah: number;

  @ApiProperty({ description: 'Ending ayah number', example: 7, minimum: 1 })
  @IsInt()
  @Min(1)
  endAyah: number;

  @ApiPropertyOptional({
    description: 'Whether this is a grouped range (auto-detected if omitted)',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isGrouped?: boolean;

  @ApiPropertyOptional({
    description: 'Array of ayah info entries',
    type: [CreateAyahInfoDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAyahInfoDto)
  @IsOptional()
  infos?: CreateAyahInfoDto[];

  @ApiPropertyOptional({
    description: 'Array of ayah tafsir entries',
    type: [CreateAyahTafsirDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAyahTafsirDto)
  @IsOptional()
  tafsirs?: CreateAyahTafsirDto[];

  @ApiPropertyOptional({
    description: 'Array of ayah translation entries',
    type: [CreateAyahTranslationDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAyahTranslationDto)
  @IsOptional()
  translations?: CreateAyahTranslationDto[];

  @ApiPropertyOptional({ description: 'Status', default: 'published' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  status?: string;
}
