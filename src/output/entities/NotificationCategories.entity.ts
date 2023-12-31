import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Notifications } from './Notifications.entity';

@Entity('notification_categories', { schema: 'dongurami_local_db' })
export class NotificationCategories {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', { name: 'name', length: 20 })
  name: string;

  @OneToMany(
    () => Notifications,
    (notifications) => notifications.notificationCategory,
  )
  notifications: Notifications[];
}
