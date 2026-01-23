import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { AyahGroup } from './ayah-group.entity';

@Entity('ayah_tafsir')
@Index(['ayahGroupId', 'languageId'], { unique: true })
@Index(['languageId'])
@Index(['status'])
export class AyahTafsir {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'uuid', name: 'ayah_group_id' })
  @Index()
  ayahGroupId: string;

  @Column({ type: 'int', name: 'language_id' })
  languageId: number;

  @Column({ type: 'text', name: 'tafsir_text' })
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

  @ManyToOne(() => AyahGroup, (group) => group.tafsirs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ayah_group_id' })
  ayahGroup: AyahGroup;
}
