import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

class UpsertAyahInfoDtoItem {
  @IsInt()
  languageId: number;

  @IsString()
  infoText: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  status?: string;
}

class UpsertAyahTafsirDtoItem {
  @IsInt()
  languageId: number;

  @IsString()
  tafsirText: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  scholar?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  source?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  status?: string;
}

class UpsertAyahTranslationDtoItem {
  @IsInt()
  languageId: number;

  @IsString()
  translationText: string;

  @IsString()
  @MaxLength(255)
  translator: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  status?: string;
}

export class UpsertAyahContentDto {
  @IsInt()
  @Min(1)
  surahId: number;

  @IsInt()
  @Min(1)
  startAyah: number;

  @IsInt()
  @Min(1)
  endAyah: number;

  @IsOptional()
  @IsBoolean()
  isGrouped?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  status?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpsertAyahInfoDtoItem)
  infos?: UpsertAyahInfoDtoItem[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpsertAyahTafsirDtoItem)
  tafsirs?: UpsertAyahTafsirDtoItem[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpsertAyahTranslationDtoItem)
  translations?: UpsertAyahTranslationDtoItem[];
}
