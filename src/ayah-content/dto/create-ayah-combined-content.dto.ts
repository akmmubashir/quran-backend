import { IsInt, IsUUID, IsOptional, IsArray, ValidateNested, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

class AyahInfoItemDto {
  @IsString()
  languageId: string;

  @IsString()
  infoText: string;

  @IsOptional()
  @IsString()
  status?: string;
}

class AyahTafsirItemDto {
  @IsString()
  languageId: string;

  @IsString()
  tafsirText: string;

  @IsOptional()
  @IsString()
  scholar?: string;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsString()
  status?: string;
}

class AyahTranslationItemDto {
  @IsString()
  languageId: string;

  @IsString()
  translationText: string;

  @IsString()
  translator: string;

  @IsOptional()
  @IsString()
  status?: string;
}

export class CreateAyahCombinedContentDto {
  @IsInt()
  @Min(1)
  surahId: number;

  @IsInt()
  @Min(1)
  ayahId: number;

  @IsOptional()
  @IsUUID()
  ayahGroupId?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AyahInfoItemDto)
  info?: AyahInfoItemDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AyahTafsirItemDto)
  tafsir?: AyahTafsirItemDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AyahTranslationItemDto)
  translation?: AyahTranslationItemDto[];

  @IsOptional()
  @IsString()
  status?: string;
}
