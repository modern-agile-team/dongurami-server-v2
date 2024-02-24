import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ClubStatus } from '@src/apis/club/enum/club.enum';
import { User } from '@src/entities/User';

@Entity('club')
export class Club {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '동아리 고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('int', {
    name: 'user_id',
    comment: '동아리 생성 유저 고유 ID',
    unsigned: true,
  })
  userId: number;

  @Column('varchar', { name: 'name', comment: '동아리 명', length: 255 })
  name: string;

  @Column('text', { name: 'introduce', comment: '동아리 소개' })
  introduce: string;

  @Column('varchar', {
    name: 'logo_path',
    comment: '동아리 로고 경로',
    length: 255,
  })
  logoPath: string;

  @Column('enum', {
    name: 'status',
    comment: '동아리 상태',
    enum: ['pending', 'active', 'inactive'],
    default: () => "'pending'",
  })
  status: ClubStatus;

  @Column('timestamp', {
    name: 'created_at',
    comment: '생성 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('timestamp', {
    name: 'updated_at',
    comment: '수정 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column('timestamp', {
    name: 'deleted_at',
    nullable: true,
    comment: '삭제 일자',
  })
  deletedAt: Date | null;

  @ManyToOne(() => User, (user) => user.clubs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
