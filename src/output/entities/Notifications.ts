import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NotificationCategories } from './NotificationCategories';
import { Students } from './Students';

@Index('notifications_fk1', ['notificationCategoryNo'], {})
@Index('notifications_fk2', ['recipientId'], {})
@Entity('notifications', { schema: 'dongurami_local_db' })
export class Notifications {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', { name: 'sender', length: 20 })
  sender: string;

  @Column('varchar', { name: 'recipient', length: 20 })
  recipient: string;

  @Column('int', { name: 'recipient_id', unsigned: true })
  recipientId: number;

  @Column('varchar', { name: 'url', length: 255 })
  url: string;

  @Column('datetime', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('int', { name: 'notification_category_no', unsigned: true })
  notificationCategoryNo: number;

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
    { name: 'notification_category_no', referencedColumnName: 'id' },
  ])
  notificationCategoryNo2: NotificationCategories;

  @ManyToOne(() => Students, (students) => students.notifications, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'recipient_id', referencedColumnName: 'id' }])
  recipient_2: Students;
}
