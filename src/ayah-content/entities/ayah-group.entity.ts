import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { AyahTafsir } from './ayah-tafsir.entity';
import { AyahTranslation } from './ayah-translation.entity';
import { AyahInfo } from './ayah-info.entity';

@Entity('ayah_groups')
@Index(['surahId', 'startAyah', 'endAyah'], { unique: true })
@Index(['surahId'])
@Index(['isGrouped'])
export class AyahGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', name: 'surah_id' })
  @Index()
  surahId: number;

  @Column({ type: 'int', name: 'start_ayah' })
  startAyah: number;

  @Column({ type: 'int', name: 'end_ayah' })
  endAyah: number;

  @Column({ type: 'boolean', name: 'is_grouped', default: false })
  isGrouped: boolean;

  @Column({ type: 'varchar', length: 50, default: 'published' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => AyahTafsir, (tafsir) => tafsir.ayahGroup, {
    cascade: true,
    eager: false,
  })
  tafsirs: AyahTafsir[];

  @OneToMany(() => AyahTranslation, (translation) => translation.ayahGroup, {
    cascade: true,
    eager: false,
  })
  translations: AyahTranslation[];

  @OneToMany(() => AyahInfo, (info) => info.ayahGroup, {
    cascade: true,
    eager: false,
  })
  infos: AyahInfo[];
}
