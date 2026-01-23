import { PartialType } from '@nestjs/swagger';
import { CreateAyahTafsirDto } from './create-ayah-tafsir.dto';

export class UpdateAyahTafsirDto extends PartialType(CreateAyahTafsirDto) {}
