import { IsInt, IsString, IsOptional, IsUUID, Min, MaxLength, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAyahInfoDto {
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
    description: 'Language ID (e.g., en, ar, ur)',
    example: 'en',
  })
  @IsInt()
  @IsNotEmpty()
  languageId: number;

  @ApiProperty({
    description: 'Info text content',
    example: 'This ayah explains the importance of faith',
  })
  @IsString()
  @IsNotEmpty()
  infoText: string;

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
