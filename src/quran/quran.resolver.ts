import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { QuranService } from './quran.service';

@Resolver()
export class QuranResolver {
  constructor(private readonly service: QuranService) {}

  @Query(() => String)
  async ping() {
    return 'pong';
  }

  @Query(() => String)
  async ayah(
    @Args('surah', { type: () => Int }) surah: number,
    @Args('ayah', { type: () => Int }) ayah: number,
    @Args('lang', { type: () => String, nullable: true }) lang?: string
  ) {
    const res = await this.service.getAyah(surah, ayah, lang);
    // Return JSON string for now (you'll create GraphQL types next)
    return JSON.stringify(res);
  }

  @Query(() => String)
  async surahs() {
    const s = await this.service.listSurahs();
    return JSON.stringify(s);
  }
}
