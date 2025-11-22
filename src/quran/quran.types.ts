import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Translation {
  @Field(() => Int)
  id: number;

  @Field()
  language_code: string;

  @Field({ nullable: true })
  translator?: string;

  @Field()
  text: string;
}

@ObjectType()
export class Tafsir {
  @Field(() => Int)
  id: number;

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
export class Ayah {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  ayah_number: number;

  @Field()
  text_ar: string;

  @Field(() => [Translation], { nullable: true })
  translations?: Translation[];

  @Field(() => [Tafsir], { nullable: true })
  tafsirs?: Tafsir[];
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
  revelation?: string;

  @Field(() => Int)
  total_ayahs: number;

  @Field(() => [Ayah], { nullable: true })
  ayahs?: Ayah[];
}

