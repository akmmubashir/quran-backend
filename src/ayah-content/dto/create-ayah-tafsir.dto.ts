import { IsInt, IsString, IsOptional, IsUUID, Min, MaxLength, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAyahTafsirDto {
  @ApiProperty({
    description: 'Surah ID (1-114)',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  surahId: number;

  @ApiProperty({
    description: 'Ayah number (for single ayah)',
    example: 5,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  ayahId: number;

  @ApiPropertyOptional({
    description: 'Ayah group ID (optional, for grouped ayahs)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  @IsOptional()
  ayahGroupId?: string;

  @ApiProperty({
    description: 'Language ID',
    example: 'en',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  languageId: string;

  @ApiProperty({
    description: 'Tafsir text content',
    example: 'Ibn Kathir explains...',
  })
  @IsString()
  @IsNotEmpty()
  tafsirText: string;

  @ApiPropertyOptional({
    description: 'Scholar name',
    example: 'Ibn Kathir',
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  scholar?: string;

  @ApiPropertyOptional({
    description: 'Source name',
    example: 'Tafsir Ibn Kathir',
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  source?: string;

  @ApiPropertyOptional({
    description: 'Status',
    default: 'published',
    example: 'published',
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  status?: string;
}
