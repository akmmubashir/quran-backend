import { IsInt, IsArray, ArrayMinSize, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAyahGroupDto {
  @ApiProperty({
    description: 'The surah ID',
    example: 1,
  })
  @IsInt()
  @Min(1)
  surahId: number;

  @ApiProperty({
    description: 'Array of ayah numbers to group/ungroup',
    example: [1, 2, 3],
    type: [Number],
  })
  @IsArray()
  @ArrayMinSize(2)
  ayahNumbers: number[];
}
