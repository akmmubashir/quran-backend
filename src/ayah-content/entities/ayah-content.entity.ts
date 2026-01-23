import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity('ayah_groups')
@Index('idx_ayah_groups_surah_id', ['surahId'])
@Index('idx_ayah_groups_is_grouped', ['isGrouped'])
@Index('idx_ayah_groups_range', ['surahId', 'startAyah', 'endAyah'])
export class AyahGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'surah_id', type: 'integer' })
  surahId: number;

  @Column({ name: 'start_ayah', type: 'integer' })
  startAyah: number;

  @Column({ name: 'end_ayah', type: 'integer' })
  endAyah: number;

  @Column({ name: 'is_grouped', type: 'boolean', default: false })
  isGrouped: boolean;

  @Column({ type: 'varchar', length: 50, default: 'published' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => AyahInfo, (info) => info.ayahGroup)
  ayahInfos: AyahInfo[];

  @OneToMany(() => AyahTranslation, (translation) => translation.ayahGroup)
  translations: AyahTranslation[];

  @OneToMany(() => AyahTafsir, (tafsir) => tafsir.ayahGroup)
  tafsirs: AyahTafsir[];
}

@Entity('ayah_info')
@Index('idx_ayah_info_group_id', ['ayahGroupId'])
@Index('idx_ayah_info_language', ['languageId'])
@Index('idx_ayah_info_status', ['status'])
@Index('IDX_ayah_info_ayah_group_id_language_id', ['ayahGroupId', 'languageId'], { unique: true })
export class AyahInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'ayah_group_id', type: 'uuid' })
  ayahGroupId: string;

  @Column({ name: 'language_id', type: 'integer' })
  languageId: number;

  @Column({ name: 'info_text', type: 'text' })
  infoText: string;

  @Column({ type: 'varchar', length: 50, default: 'published' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => AyahGroup, (group) => group.ayahInfos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ayah_group_id' })
  ayahGroup: AyahGroup;
}

@Entity('ayah_translation')
@Index('idx_ayah_translation_group_id', ['ayahGroupId'])
@Index('idx_ayah_translation_language', ['languageId'])
@Index('idx_ayah_translation_status', ['status'])
@Index('IDX_ayah_translation_ayah_group_id_language_id', ['ayahGroupId', 'languageId', 'translator'], { unique: true })
export class AyahTranslation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'ayah_group_id', type: 'uuid' })
  ayahGroupId: string;

  @Column({ name: 'language_id', type: 'integer' })
  languageId: number;

  @Column({ name: 'translation_text', type: 'text' })
  translationText: string;

  @Column({ type: 'varchar', length: 255 })
  translator: string;

  @Column({ type: 'varchar', length: 50, default: 'published' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => AyahGroup, (group) => group.translations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ayah_group_id' })
  ayahGroup: AyahGroup;
}

@Entity('ayah_tafsir')
@Index('idx_ayah_tafsir_group_id', ['ayahGroupId'])
@Index('idx_ayah_tafsir_language', ['languageId'])
@Index('idx_ayah_tafsir_status', ['status'])
@Index('IDX_ayah_tafsir_ayah_group_id_language_id', ['ayahGroupId', 'languageId', 'source'], { unique: true })
export class AyahTafsir {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'ayah_group_id', type: 'uuid' })
  ayahGroupId: string;

  @Column({ name: 'language_id', type: 'integer' })
  languageId: number;

  @Column({ name: 'tafsir_text', type: 'text' })
  tafsirText: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  scholar: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  source: string;

  @Column({ type: 'varchar', length: 50, default: 'published' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => AyahGroup, (group) => group.tafsirs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ayah_group_id' })
  ayahGroup: AyahGroup;
}
