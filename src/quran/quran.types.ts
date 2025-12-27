import { ObjectType, Field, Int } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@ObjectType()
export class Translation {
  @Field(() => Int)
  id: number;

  @Field(() => Int, { nullable: true })
  surahId?: number;

  @Field(() => Int, { nullable: true })
  ayahId?: number;

  @Field()
  language_code: string;

  @Field()
  translator: string;

  @Field()
  text: string;
}

@ObjectType()
export class Tafsir {
  @Field(() => Int)
  id: number;

  @Field(() => Int, { nullable: true })
  surahId?: number;

  @Field(() => Int, { nullable: true })
  ayahId?: number;

  @Field()
  language_code: string;

  @Field({ nullable: true })
  scholar?: string;

  @Field({ nullable: true })
  source?: string;

  @Field()
  text: string;
}

@ObjectType()
export class Surah {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  surahId: number;

  @Field({ nullable: true })
  nameComplex?: string;

  @Field()
  nameArabic: string;

  @Field({ nullable: true })
  nameEnglish?: string;

  @Field({ nullable: true })
  surahinfo?: string;

  @Field(() => Int, { nullable: true })
  revelationOrder?: number;

  @Field({ nullable: true })
  revelationPlace?: string;

  @Field(() => Int)
  ayahCount: number;

  @Field()
  bismillahPre: boolean;

  @Field(() => [Int], { nullable: true })
  pages?: number[];

  @Field(() => [Ayah], { nullable: true })
  ayahs?: Ayah[];
}

@ObjectType()
export class Ayah {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  ayahNumber: number;

  @Field()
  ayahKey: string;

  @Field(() => Int)
  surahId: number;

  @Field(() => Int, { nullable: true })
  pageNumber?: number;

  @Field(() => Int, { nullable: true })
  juzNumber?: number;

  @Field(() => Int, { nullable: true })
  hizbNumber?: number;

  @Field(() => Int, { nullable: true })
  rubElHizbNumber?: number;

  @Field({ nullable: true })
  textUthmani?: string;

  @Field({ nullable: true })
  textImlaei?: string;

  @Field({ nullable: true })
  ayahInfo?: string;

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
  juzNumber: number;

  @Field(() => GraphQLJSON, { nullable: true })
  ayahMapping?: Record<string, string>;

  @Field(() => Int, { nullable: true })
  firstAyahId?: number;

  @Field(() => Int, { nullable: true })
  lastAyahId?: number;

  @Field(() => Int)
  AyahsCount: number;
}

@ObjectType()
export class Language {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  nativeName?: string;

  @Field()
  iso: string;

  @Field()
  direction: string;
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
