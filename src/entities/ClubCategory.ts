import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '@src/entities/User';

@Entity('club_category')
export class ClubCategory {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '동아리 카테고리 고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('int', {
    name: 'user_id',
    comment: '동아리 카테고리 생성 유저 고유 ID',
    unsigned: true,
  })
  userId: number;

  @Column('varchar', {
    name: 'name',
    comment: '동아리 카테고리 이름',
    length: 20,
    unique: true,
  })
  name: string;

  @Column('varchar', {
    name: 'name',
    comment: '메모',
    length: 255,
    unique: true,
  })
  memo: string;

  @Column('timestamp', {
    name: 'created_at',
    comment: '생성 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.clubTagCategories, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
