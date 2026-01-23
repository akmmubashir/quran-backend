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

@Entity('ayah_translation')
@Index(['ayahGroupId', 'languageId'], { unique: true })
@Index(['languageId'])
@Index(['status'])
export class AyahTranslation {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'uuid', name: 'ayah_group_id' })
  @Index()
  ayahGroupId: string;

  @Column({ type: 'varchar', length: 10, name: 'language_id' })
  languageId: string;

  @Column({ type: 'text', name: 'translation_text' })
  translationText: string;

  @Column({ type: 'varchar', length: 255 })
  translator: string;

  @Column({ type: 'varchar', length: 50, default: 'published' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => AyahGroup, (group) => group.translations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ayah_group_id' })
  ayahGroup: AyahGroup;
}
