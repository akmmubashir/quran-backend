import { PartialType } from '@nestjs/swagger';
import { CreateAyahTranslationDto } from './create-ayah-translation.dto';

export class UpdateAyahTranslationDto extends PartialType(CreateAyahTranslationDto) {}
