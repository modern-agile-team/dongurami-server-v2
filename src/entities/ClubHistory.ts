import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ClubStatus } from '@src/apis/club/enum/club.enum';
import { HistoryAction } from '@src/constants/enum';
import { Club } from '@src/entities/Club';

@Index(['userId'], {})
@Entity('club_history')
export class ClubHistory {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '동아리 수정이력 고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('int', {
    name: 'club_id',
    comment: '동아리 고유 ID',
    unsigned: true,
  })
  clubId: number;

  @Column('int', {
    name: 'user_id',
    comment: '동아리 수정 유저 고유 ID',
    unsigned: true,
  })
  userId: number;

  @Column('enum', {
    name: 'action',
    comment: 'history 를 쌓는 action',
    enum: ['insert', 'update', 'delete'],
  })
  action: HistoryAction;

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

  @ManyToOne(() => Club, (club) => club.clubHistories, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'club_id', referencedColumnName: 'id' }])
  club: Club;
}
