import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Translation {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  author_name?: string;

  @Field()
  slug: string;

  @Field()
  language_name: string;

  @Field()
  language_code: string;

  @Field()
  direction: string;

  @Field()
  text: string;

  @Field({ nullable: true })
  info?: string;
}

@ObjectType()
export class Tafsir {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  author_name?: string;

  @Field()
  slug: string;

  @Field()
  language_name: string;

  @Field()
  language_code: string;

  @Field()
  text: string;

  @Field({ nullable: true })
  info?: string;
}

@ObjectType()
export class Surah {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  number: number;

  @Field()
  name_ar: string;

  @Field({ nullable: true })
  name_en?: string;

  @Field({ nullable: true })
  name_simple?: string;

  @Field({ nullable: true })
  name_complex?: string;

  @Field({ nullable: true })
  transliterated_name?: string;

  @Field({ nullable: true })
  revelation?: string;

  @Field(() => Int, { nullable: true })
  revelation_order?: number;

  @Field(() => Int)
  total_ayahs: number;

  @Field()
  bismillah_pre: boolean;

  @Field(() => [Int], { nullable: true })
  pages?: number[];

  @Field({ nullable: true })
  surah_info?: string;

  @Field(() => [Ayah], { nullable: true })
  ayahs?: Ayah[];
}

@ObjectType()
export class Ayah {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  ayah_number: number;

  @Field()
  verse_key: string;

  @Field()
  text_ar: string;

  @Field({ nullable: true })
  text_uthmani?: string;

  @Field({ nullable: true })
  text_uthmani_simple?: string;

  @Field({ nullable: true })
  text_uthmani_tajweed?: string;

  @Field({ nullable: true })
  text_imlaei?: string;

  @Field({ nullable: true })
  text_indopak?: string;

  @Field(() => Int, { nullable: true })
  juz_number?: number;

  @Field(() => Int, { nullable: true })
  hizb_number?: number;

  @Field(() => Int, { nullable: true })
  rub_el_hizb_number?: number;

  @Field(() => Int, { nullable: true })
  page_number?: number;

  @Field()
  sajdah: boolean;

  @Field({ nullable: true })
  sajdah_type?: string;

  @Field(() => [Translation], { nullable: true })
  translations?: Translation[];

  @Field(() => [Tafsir], { nullable: true })
  tafsirs?: Tafsir[];

  @Field(() => Surah, { nullable: true })
  surah?: Surah;
}

@ObjectType()
export class Juz {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  juz_number: number;

  @Field({ nullable: true })
  name_ar?: string;

  @Field({ nullable: true })
  name_en?: string;

  @Field()
  first_verse_key: string;

  @Field()
  last_verse_key: string;

  @Field(() => Int)
  verses_count: number;
}

@ObjectType()
export class Language {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  native_name?: string;

  @Field()
  iso_code: string;

  @Field()
  direction: string;

  @Field(() => Int)
  translations_count: number;
}

@ObjectType()
export class PaginationMeta {
  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  totalPages: number;

  @Field(() => Int)
  perPage: number;

  @Field(() => Int)
  totalRecords: number;
}

@ObjectType()
export class PaginatedAyahs {
  @Field(() => [Ayah])
  ayahs: Ayah[];

  @Field(() => PaginationMeta)
  pagination: PaginationMeta;
}

@ObjectType()
export class PaginatedSurahs {
  @Field(() => [Surah])
  surahs: Surah[];

  @Field(() => PaginationMeta)
  pagination: PaginationMeta;
}
