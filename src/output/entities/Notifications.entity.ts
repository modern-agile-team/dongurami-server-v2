import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NotificationCategories } from './NotificationCategories.entity';
import { Students } from './Students.entity';

@Index('notifications_fk1', ['notificationCategoryId'], {})
@Index('notifications_fk2', ['recipientId'], {})
@Entity('notifications', { schema: 'dongurami_local_db' })
export class Notifications {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', { name: 'sender', length: 20 })
  sender: string;

  @Column('varchar', { name: 'recipient', length: 20 })
  recipientName: string;
  // 알람 받는 사람 이름? 추후 로직보고 수정 예정
  @Column('int', { name: 'recipient_id', unsigned: true })
  recipientId: number;

  @Column('varchar', { name: 'url', length: 255 })
  url: string;

  @Column('datetime', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('int', { name: 'notification_category_id', unsigned: true })
  notificationCategoryId: number;

  @Column('varchar', { name: 'content', length: 255 })
  content: string;

  @Column('varchar', { name: 'title', length: 255 })
  title: string;

  @Column('tinyint', { name: 'reading_flag', width: 1, default: () => "'0'" })
  readingFlag: boolean;

  @ManyToOne(
    () => NotificationCategories,
    (notificationCategories) => notificationCategories.notifications,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn([
    { name: 'notification_category_id', referencedColumnName: 'id' },
  ])
  notificationCategory: NotificationCategories;

  @ManyToOne(() => Students, (students) => students.notifications, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'recipient_id', referencedColumnName: 'id' }])
  recipient: Students;
}
