import { Module } from '@nestjs/common';
import { QuranService } from './quran.service';
import { QuranResolver } from './quran.resolver';

@Module({
  providers: [QuranService, QuranResolver],
})
export class QuranModule {}
