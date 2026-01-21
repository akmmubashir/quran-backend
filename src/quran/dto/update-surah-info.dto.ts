import { IsInt, IsString, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSurahInfoDto {
  @ApiProperty({
    description: 'The ID of the surah to update',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  surahId: number;

  @ApiProperty({
    description: 'The ID of the language for this information',
    example: 1,
  })
  @IsInt()
  @Min(1)
  languageId: number;

  @ApiProperty({
    description: 'Additional information about the surah in the specified language',
    example: 'The Opening chapter of the Quran',
    required: false,
  })
  @IsOptional()
  @IsString()
  surahinfo?: string;
}
