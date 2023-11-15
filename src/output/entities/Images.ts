import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Boards } from './Boards';

@Index('images_fk1', ['boardId'], {})
@Entity('images', { schema: 'dongurami_local_db' })
export class Images {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('int', { name: 'board_id', unsigned: true })
  boardId: number;

  @Column('varchar', { name: 'url', length: 255 })
  url: string;

  @ManyToOne(() => Boards, (boards) => boards.images, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'board_no', referencedColumnName: 'id' }])
  board: Boards;
}
