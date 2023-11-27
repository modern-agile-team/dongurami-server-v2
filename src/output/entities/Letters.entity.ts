import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Students } from './Students.entity';

@Index('letters_fk1', ['senderId'], {})
@Index('letters_fk2', ['recipientId'], {})
@Index('letters_fk3', ['hostId'], {})
@Entity('letters', { schema: 'dongurami_local_db' })
export class Letters {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('int', { name: 'sender_id', unsigned: true })
  senderId: number;

  @Column('int', { name: 'recipient_id', unsigned: true })
  recipientId: number;

  @Column('int', { name: 'host_id', unsigned: true })
  hostId: number;

  @Column('varchar', { name: 'description', length: 255 })
  description: string;

  @Column('int', { name: 'group_id', default: () => "'0'" })
  groupId: number;

  @Column('datetime', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('tinyint', { name: 'writer_hidden_flag', width: 1 })
  writerHiddenFlag: boolean;

  @Column('tinyint', { name: 'recipient_hidden_flag', width: 1 })
  recipientHiddenFlag: boolean;

  @Column('tinyint', { name: 'reading_flag', width: 1, default: () => "'0'" })
  readingFlag: boolean;

  @Column('tinyint', { name: 'delete_flag', width: 1, default: () => "'0'" })
  deleteFlag: boolean;

  @ManyToOne(() => Students, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'sender_id', referencedColumnName: 'id' }])
  sender: Students;

  @ManyToOne(() => Students, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'recipient_id', referencedColumnName: 'id' }])
  recipient: Students;

  @ManyToOne(() => Students, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'host_id', referencedColumnName: 'id' }])
  host: Students;
}
