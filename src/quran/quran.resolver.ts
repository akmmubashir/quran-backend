import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { QuranService } from './quran.service';
import { Ayah, Surah } from './quran.types';

@Resolver()
export class QuranResolver {
  constructor(private readonly service: QuranService) {}

  @Query(() => String)
  async ping() {
    return 'pong';
  }

  @Query(() => Ayah, { nullable: true })
  async ayah(
    @Args('surah', { type: () => Int }) surah: number,
    @Args('ayah', { type: () => Int }) ayah: number,
    @Args('lang', { type: () => String, nullable: true }) lang?: string,
  ) {
    return this.service.getAyah(surah, ayah, lang);
  }

  @Query(() => Surah, { nullable: true })
  async surah(
    @Args('number', { type: () => Int }) number: number,
    @Args('includeAyahs', { type: () => Boolean, nullable: true, defaultValue: true })
    includeAyahs?: boolean,
    @Args('lang', { type: () => String, nullable: true }) lang?: string,
  ) {
    return this.service.getSurah(number, includeAyahs, lang);
  }

  @Query(() => [Surah])
  async surahs() {
    return this.service.listSurahs();
  }
}
