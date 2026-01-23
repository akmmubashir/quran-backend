import { PartialType } from '@nestjs/swagger';
import { CreateAyahInfoDto } from './create-ayah-info.dto';

export class UpdateAyahInfoDto extends PartialType(CreateAyahInfoDto) {}
