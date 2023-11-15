import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Boards } from './Boards.entity';

@Entity('board_categories', { schema: 'dongurami_local_db' })
export class BoardCategories {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', { name: 'name', length: 20 })
  name: string;

  @OneToMany(() => Boards, (boards) => boards.boardCategory)
  boards: Boards[];
}
