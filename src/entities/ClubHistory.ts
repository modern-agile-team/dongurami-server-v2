import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { ClubStatus } from '@src/apis/clubs/constants/club.enum';
import { HistoryAction } from '@src/constants/enum';
import { Club } from '@src/entities/Club';
import { ClubTag } from '@src/entities/ClubTag';

@Index(['userId'], {})
@Entity('club_history')
export class ClubHistory {
  @Column('bigint', {
    primary: true,
    name: 'id',
    comment: '동아리 수정이력 고유 ID',
    unsigned: true,
    nullable: false,
  })
  id: string;

  @Column('bigint', {
    name: 'club_id',
    comment: '동아리 고유 ID',
    unsigned: true,
  })
  clubId: string;

  @Column('bigint', {
    name: 'user_id',
    comment: '동아리 수정 유저 고유 ID',
    unsigned: true,
  })
  userId: string;

  @Column('enum', {
    name: 'action',
    comment: 'history 를 쌓는 action',
    enum: ['insert', 'update', 'delete'],
  })
  action: HistoryAction;

  @Column('varchar', { name: 'name', comment: '동아리 명', length: 255 })
  name: string;

  @Column('text', { name: 'introduce', comment: '동아리 소개', nullable: true })
  introduce: string | null;

  @Column('varchar', {
    name: 'logo_path',
    comment: '동아리 로고 경로',
    nullable: true,
    length: 255,
  })
  logoPath: string | null;

  @Column('enum', {
    name: 'status',
    comment: '동아리 상태',
    enum: ['pending', 'active', 'inactive'],
    default: () => "'pending'",
  })
  status: ClubStatus;

  @Column('json', {
    name: 'tags',
    comment: '동아리 태그',
  })
  tags: Pick<ClubTag, 'id' | 'userId' | 'name' | 'createdAt'>[];

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
