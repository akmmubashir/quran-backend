import { PartialType } from '@nestjs/swagger';
import { CreateAyahGroupDto } from './create-ayah-group.dto';

export class UpdateAyahGroupDto extends PartialType(CreateAyahGroupDto) {}
