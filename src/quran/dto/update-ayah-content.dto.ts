import { IsInt, IsString, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAyahContentDto {
  @ApiProperty({
    description: 'The language ID for this content',
    example: 1,
  })
  @IsInt()
  @Min(1)
  languageId: number;

  @ApiProperty({
    description: 'Ayah information/notes',
    example: 'This ayah speaks about faith',
    required: false,
  })
  @IsOptional()
  @IsString()
  ayahInfo?: string;

  @ApiProperty({
    description: 'Translation text',
    example: 'In the name of Allah, the Most Gracious, the Most Merciful',
    required: false,
  })
  @IsOptional()
  @IsString()
  translationText?: string;

  @ApiProperty({
    description: 'Translator name',
    example: 'Sahih International',
    required: false,
  })
  @IsOptional()
  @IsString()
  translator?: string;

  @ApiProperty({
    description: 'Tafsir text/commentary',
    example: 'This is the opening verse of the Quran...',
    required: false,
  })
  @IsOptional()
  @IsString()
  tafsirText?: string;

  @ApiProperty({
    description: 'Scholar/source name for tafsir',
    example: 'Ibn Kathir',
    required: false,
  })
  @IsOptional()
  @IsString()
  tafsirScholar?: string;
}
