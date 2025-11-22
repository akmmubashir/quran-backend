import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { QuranService } from './quran.service';

@Controller()
export class QuranController {
  constructor(private readonly service: QuranService) {}

  @Get('surah/:number')
  async getSurah(
    @Param('number', ParseIntPipe) number: number,
    @Query('includeAyahs') includeAyahs?: string,
    @Query('lang') lang?: string,
  ) {
    const include = includeAyahs !== 'false';
    return this.service.getSurah(number, include, lang);
  }

  @Get('surah/:number/ayah/:ayah')
  async getAyah(
    @Param('number', ParseIntPipe) surah: number,
    @Param('ayah', ParseIntPipe) ayah: number,
    @Query('lang') lang?: string,
  ) {
    return this.service.getAyah(surah, ayah, lang);
  }

  @Get('surahs')
  async listSurahs() {
    return this.service.listSurahs();
  }

  @Get('surah/:number/ayah/:ayah/translations')
  async getTranslations(
    @Param('number', ParseIntPipe) surah: number,
    @Param('ayah', ParseIntPipe) ayah: number,
    @Query('lang') lang?: string,
  ) {
    return this.service.getTranslations(surah, ayah, lang);
  }

  @Get('surah/:number/ayah/:ayah/tafsirs')
  async getTafsirs(
    @Param('number', ParseIntPipe) surah: number,
    @Param('ayah', ParseIntPipe) ayah: number,
    @Query('lang') lang?: string,
  ) {
    return this.service.getTafsirs(surah, ayah, lang);
  }
}

