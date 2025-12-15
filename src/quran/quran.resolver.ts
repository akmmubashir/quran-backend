import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { QuranService } from './quran.service';
import {
  Ayah,
  Surah,
  PaginatedAyahs,
  Translation,
  Tafsir,
  Juz,
  Language,
} from './quran.types';

@Resolver()
export class QuranResolver {
  constructor(private readonly service: QuranService) {}

  @Query(() => String)
  // eslint-disable-next-line @typescript-eslint/require-await
  async ping() {
    return 'pong';
  }

  // ==================== Chapters/Surahs ====================

  @Query(() => [Surah])
  async chapters(
    @Args('language', { type: () => String, nullable: true }) lang?: string,
  ) {
    return this.service.listSurahs(lang);
  }

  @Query(() => Surah, { nullable: true })
  async chapter(
    @Args('id', { type: () => Int }) id: number,
    @Args('language', { type: () => String, nullable: true }) lang?: string,
    @Args('includeAyahs', {
      type: () => Boolean,
      nullable: true,
      defaultValue: false,
    })
    includeAyahs?: boolean,
  ) {
    return this.service.getSurah(id, includeAyahs, lang);
  }

  // Legacy queries
  @Query(() => [Surah])
  async surahs(
    @Args('lang', { type: () => String, nullable: true }) lang?: string,
  ) {
    return this.service.listSurahs(lang);
  }

  @Query(() => Surah, { nullable: true })
  async surah(
    @Args('number', { type: () => Int }) number: number,
    @Args('includeAyahs', {
      type: () => Boolean,
      nullable: true,
      defaultValue: true,
    })
    includeAyahs?: boolean,
    @Args('lang', { type: () => String, nullable: true }) lang?: string,
  ) {
    return this.service.getSurah(number, includeAyahs, lang);
  }

  // ==================== Verses/Ayahs ====================

  @Query(() => Ayah, { nullable: true })
  async verseByKey(
    @Args('verseKey', { type: () => String }) verseKey: string,
    @Args('language', { type: () => String, nullable: true }) lang?: string,
    @Args('translations', { type: () => [Int], nullable: true })
    translations?: number[],
    @Args('tafsirs', { type: () => [Int], nullable: true }) tafsirs?: number[],
  ) {
    return this.service.getAyahByKey(verseKey, {
      translations,
      tafsirs,
      lang,
    });
  }

  @Query(() => PaginatedAyahs)
  async versesByChapter(
    @Args('chapterNumber', { type: () => Int }) chapterNumber: number,
    @Args('language', { type: () => String, nullable: true }) lang?: string,
    @Args('translations', { type: () => [Int], nullable: true })
    translations?: number[],
    @Args('page', { type: () => Int, nullable: true, defaultValue: 1 })
    page?: number,
    @Args('perPage', { type: () => Int, nullable: true, defaultValue: 10 })
    perPage?: number,
  ) {
    return this.service.getAyahsByChapter(chapterNumber, {
      page,
      perPage,
      translations,
      lang,
    });
  }

  @Query(() => [Ayah])
  async versesByPage(
    @Args('pageNumber', { type: () => Int }) pageNumber: number,
    @Args('language', { type: () => String, nullable: true }) lang?: string,
    @Args('translations', { type: () => [Int], nullable: true })
    translations?: number[],
  ) {
    return this.service.getAyahsByPage(pageNumber, {
      translations,
      lang,
    });
  }

  @Query(() => PaginatedAyahs)
  async versesByJuz(
    @Args('juzNumber', { type: () => Int }) juzNumber: number,
    @Args('language', { type: () => String, nullable: true }) lang?: string,
    @Args('translations', { type: () => [Int], nullable: true })
    translations?: number[],
    @Args('page', { type: () => Int, nullable: true, defaultValue: 1 })
    page?: number,
    @Args('perPage', { type: () => Int, nullable: true, defaultValue: 10 })
    perPage?: number,
  ) {
    return this.service.getAyahsByJuz(juzNumber, {
      page,
      perPage,
      translations,
      lang,
    });
  }

  @Query(() => [Ayah])
  async versesByHizb(
    @Args('hizbNumber', { type: () => Int }) hizbNumber: number,
    @Args('language', { type: () => String, nullable: true }) lang?: string,
    @Args('translations', { type: () => [Int], nullable: true })
    translations?: number[],
  ) {
    return this.service.getAyahsByHizb(hizbNumber, {
      translations,
      lang,
    });
  }

  @Query(() => [Ayah])
  async versesByRub(
    @Args('rubNumber', { type: () => Int }) rubNumber: number,
    @Args('language', { type: () => String, nullable: true }) lang?: string,
    @Args('translations', { type: () => [Int], nullable: true })
    translations?: number[],
  ) {
    return this.service.getAyahsByRub(rubNumber, {
      translations,
      lang,
    });
  }

  @Query(() => Ayah, { nullable: true })
  async randomVerse(
    @Args('language', { type: () => String, nullable: true }) lang?: string,
    @Args('translations', { type: () => [Int], nullable: true })
    translations?: number[],
  ) {
    return this.service.getRandomAyah({ translations, lang });
  }

  // Legacy queries
  @Query(() => Ayah, { nullable: true })
  async ayah(
    @Args('surah', { type: () => Int }) surah: number,
    @Args('ayah', { type: () => Int }) ayah: number,
    @Args('lang', { type: () => String, nullable: true }) lang?: string,
  ) {
    return this.service.getAyah(surah, ayah, { lang });
  }

  // ==================== Translations ====================

  @Query(() => [Translation])
  async translationResources(
    @Args('language', { type: () => String, nullable: true }) lang?: string,
  ) {
    return this.service.listTranslations(lang);
  }

  @Query(() => Translation, { nullable: true })
  async translationResource(
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.service.getTranslationById(id);
  }

  @Query(() => [Translation])
  async translations(
    @Args('surah', { type: () => Int }) surah: number,
    @Args('ayah', { type: () => Int }) ayah: number,
    @Args('lang', { type: () => String, nullable: true }) lang?: string,
  ) {
    return this.service.getTranslations(surah, ayah, lang);
  }

  // ==================== Tafsirs ====================

  @Query(() => [Tafsir])
  async tafsirResources(
    @Args('language', { type: () => String, nullable: true }) lang?: string,
  ) {
    return this.service.listTafsirs(lang);
  }

  @Query(() => Tafsir, { nullable: true })
  async tafsirResource(@Args('source', { type: () => String }) source: string) {
    return this.service.getTafsirBySource(source);
  }

  @Query(() => [Tafsir])
  async tafsirs(
    @Args('surah', { type: () => Int }) surah: number,
    @Args('ayah', { type: () => Int }) ayah: number,
    @Args('lang', { type: () => String, nullable: true }) lang?: string,
  ) {
    return this.service.getTafsirs(surah, ayah, lang);
  }

  // ==================== Juzs ====================

  @Query(() => [Juz])
  async juzs() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.service.listJuzs();
  }

  @Query(() => Juz, { nullable: true })
  async juz(@Args('juzNumber', { type: () => Int }) juzNumber: number) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.service.getJuz(juzNumber);
  }

  // ==================== Languages ====================

  @Query(() => [Language])
  async languages() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.service.listLanguages();
  }

  @Query(() => Language, { nullable: true })
  async language(@Args('isoCode', { type: () => String }) isoCode: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.service.getLanguage(isoCode);
  }
}
