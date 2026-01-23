import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuranService } from './quran.service';
import { QuranResolver } from './quran.resolver';
import { QuranController } from './quran.controller';
import { AyahContentModule } from '../ayah-content/ayah-content.module';
import { AyahGroup, AyahInfo, AyahTranslation, AyahTafsir } from '../ayah-content/entities/ayah-content.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AyahGroup, AyahInfo, AyahTranslation, AyahTafsir]),
    AyahContentModule,
  ],
  controllers: [QuranController],
  providers: [QuranService, QuranResolver],
  exports: [QuranService],
})
export class QuranModule {}
