import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AyahGroup } from './entities/ayah-group.entity';
import { AyahTafsir } from './entities/ayah-tafsir.entity';
import { AyahTranslation } from './entities/ayah-translation.entity';
import { AyahInfo } from './entities/ayah-info.entity';
import { AyahContentRepository } from './repositories/ayah-content.repository';
import { AyahContentService } from './services/ayah-content.service';
import { AyahContentController } from './controllers/ayah-content.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AyahGroup, AyahTafsir, AyahTranslation, AyahInfo])],
  controllers: [AyahContentController],
  providers: [AyahContentRepository, AyahContentService],
  exports: [AyahContentService],
})
export class AyahContentModule {}
