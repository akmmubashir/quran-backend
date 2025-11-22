import { Module } from '@nestjs/common';
import { QuranService } from './quran.service';
import { QuranResolver } from './quran.resolver';
import { QuranController } from './quran.controller';

@Module({
  controllers: [QuranController],
  providers: [QuranService, QuranResolver],
})
export class QuranModule {}
