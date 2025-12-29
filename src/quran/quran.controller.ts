import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { QuranService } from './quran.service';

@Controller()
export class QuranController {
  constructor(private readonly service: QuranService) {}

  // ==================== Chapters/Surahs ====================

  @Get('chapters')
  async listChapters(@Query('language') lang?: string) {
    return this.service.listSurahs(lang);
  }

  @Get('chapters/:id')
  async getChapter(
    @Param('id', ParseIntPipe) id: number,
    @Query('language') lang?: string,
  ) {
    return this.service.getSurah(id, false, lang);
  }

  // Legacy endpoints
  @Get('surahs')
  async listSurahs(@Query('lang') lang?: string) {
    return this.service.listSurahs(lang);
  }

  @Get('surah/:number')
  async getSurah(
    @Param('number', ParseIntPipe) number: number,
    @Query('includeAyahs') includeAyahs?: string,
    @Query('lang') lang?: string,
    @Query('translations') translations?: string,
    @Query('page') page?: string,
    @Query('perPage') perPage?: string,
  ) {
    const include = includeAyahs !== 'false';
    const translationIds = translations
      ? translations.split(',').map(Number)
      : undefined;
    const pageNum = page ? parseInt(page) : undefined;
    const perPageNum = perPage ? parseInt(perPage) : undefined;

    return this.service.getSurah(
      number,
      include,
      lang,
      translationIds,
      pageNum,
      perPageNum,
    );
  }

  // ==================== Verses/Ayahs ====================

  @Get('verses/by_key/:verse_key')
  async getVerseByKey(
    @Param('verse_key') verseKey: string,
    @Query('language') lang?: string,
    @Query('translations') translations?: string,
    @Query('tafsirs') tafsirs?: string,
  ) {
    const translationIds = translations
      ? translations.split(',').map(Number)
      : undefined;
    const tafsirIds = tafsirs ? tafsirs.split(',').map(Number) : undefined;

    return this.service.getAyahByKey(verseKey, {
      translations: translationIds,
      tafsirs: tafsirIds,
      lang,
    });
  }

  @Get('verses/by_chapter/:chapter_number')
  async getVersesByChapter(
    @Param('chapter_number', ParseIntPipe) chapterNumber: number,
    @Query('language') lang?: string,
    @Query('translations') translations?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('per_page', new DefaultValuePipe(10), ParseIntPipe) perPage?: number,
  ) {
    const translationIds = translations
      ? translations.split(',').map(Number)
      : undefined;

    return this.service.getAyahsByChapter(chapterNumber, {
      page,
      perPage,
      translations: translationIds,
      lang,
    });
  }

  @Get('verses/by_page/:page_number')
  async getVersesByPage(
    @Param('page_number', ParseIntPipe) pageNumber: number,
    @Query('language') lang?: string,
    @Query('translations') translations?: string,
  ) {
    const translationIds = translations
      ? translations.split(',').map(Number)
      : undefined;

    return this.service.getAyahsByPage(pageNumber, {
      translations: translationIds,
      lang,
    });
  }

  @Get('verses/by_juz/:juz_number')
  async getVersesByJuz(
    @Param('juz_number', ParseIntPipe) juzNumber: number,
    @Query('language') lang?: string,
    @Query('translations') translations?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('per_page', new DefaultValuePipe(10), ParseIntPipe) perPage?: number,
  ) {
    const translationIds = translations
      ? translations.split(',').map(Number)
      : undefined;

    return this.service.getAyahsByJuz(juzNumber, {
      page,
      perPage,
      translations: translationIds,
      lang,
    });
  }

  @Get('verses/by_hizb/:hizb_number')
  async getVersesByHizb(
    @Param('hizb_number', ParseIntPipe) hizbNumber: number,
    @Query('language') lang?: string,
    @Query('translations') translations?: string,
  ) {
    const translationIds = translations
      ? translations.split(',').map(Number)
      : undefined;

    return this.service.getAyahsByHizb(hizbNumber, {
      translations: translationIds,
      lang,
    });
  }

  @Get('verses/by_rub/:rub_number')
  async getVersesByRub(
    @Param('rub_number', ParseIntPipe) rubNumber: number,
    @Query('language') lang?: string,
    @Query('translations') translations?: string,
  ) {
    const translationIds = translations
      ? translations.split(',').map(Number)
      : undefined;

    return this.service.getAyahsByRub(rubNumber, {
      translations: translationIds,
      lang,
    });
  }

  @Get('verses/random')
  async getRandomVerse(
    @Query('language') lang?: string,
    @Query('translations') translations?: string,
  ) {
    const translationIds = translations
      ? translations.split(',').map(Number)
      : undefined;

    return this.service.getRandomAyah({
      translations: translationIds,
      lang,
    });
  }

  // Legacy endpoints
  @Get('surah/:number/ayah/:ayah')
  async getAyah(
    @Param('number', ParseIntPipe) surah: number,
    @Param('ayah', ParseIntPipe) ayah: number,
    @Query('lang') lang?: string,
    @Query('translations') translations?: string,
  ) {
    const translationIds = translations
      ? translations.split(',').map(Number)
      : undefined;

    return this.service.getAyah(surah, ayah, {
      translations: translationIds,
      lang,
    });
  }

  // ==================== Translations ====================

  @Get('resources/translations')
  async listTranslations(@Query('language') lang?: string) {
    return this.service.listTranslations(lang);
  }

  @Get('resources/translations/:id')
  async getTranslation(@Param('id', ParseIntPipe) id: number) {
    return this.service.getTranslationById(id);
  }

  @Get('surah/:number/ayah/:ayah/translations')
  async getTranslations(
    @Param('number', ParseIntPipe) surah: number,
    @Param('ayah', ParseIntPipe) ayah: number,
    @Query('lang') lang?: string,
  ) {
    return this.service.getTranslations(surah, ayah, lang);
  }

  // ==================== Tafsirs ====================

  @Get('resources/tafsirs')
  async listTafsirs(@Query('language') lang?: string) {
    return this.service.listTafsirs(lang);
  }

  @Get('resources/tafsirs/:source')
  async getTafsir(@Param('source') source: string) {
    return this.service.getTafsirBySource(source);
  }

  @Get('surah/:number/ayah/:ayah/tafsirs')
  async getTafsirs(
    @Param('number', ParseIntPipe) surah: number,
    @Param('ayah', ParseIntPipe) ayah: number,
    @Query('lang') lang?: string,
  ) {
    return this.service.getTafsirs(surah, ayah, lang);
  }

  // ==================== Juzs ====================

  @Get('juzs')
  async listJuzs() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.service.listJuzs();
  }

  @Get('juzs/:juz_number')
  async getJuz(@Param('juz_number', ParseIntPipe) juzNumber: number) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.service.getJuz(juzNumber);
  }

  // ==================== Languages ====================

  @Get('resources/languages')
  async listLanguages() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.service.listLanguages();
  }

  @Get('resources/languages/:iso_code')
  async getLanguage(@Param('iso_code') isoCode: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.service.getLanguage(isoCode);
  }

  // ==================== New Quran Routes ====================

  @Get('quran/surah')
  async getAllSurahs(@Query('lang') lang?: string) {
    return this.service.listSurahs(lang);
  }

  @Get('quran/surah/:surah_id')
  async getAyahsBySurah(
    @Param('surah_id', ParseIntPipe) surahId: number,
    @Query('page') page?: string,
    @Query('per_page') perPage?: string,
  ) {
    const pageNum = page ? parseInt(page) : undefined;
    const perPageNum = perPage ? parseInt(perPage) : undefined;

    return this.service.getAyahsBySurahId(surahId, pageNum, perPageNum);
  }

  @Get('quran/surah/:surah_id/ayah/:ayah_id')
  async getAyahBySurahAndAyah(
    @Param('surah_id', ParseIntPipe) surahId: number,
    @Param('ayah_id', ParseIntPipe) ayahId: number,
  ) {
    return this.service.getAyahBySurahAndAyahNumber(surahId, ayahId);
  }
}
