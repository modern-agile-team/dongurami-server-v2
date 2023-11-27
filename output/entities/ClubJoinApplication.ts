import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Club } from './Club';
import { User } from './User';

@Entity('club_join_application', { schema: 'dongurami_v2' })
export class ClubJoinApplication {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '동아리 가입 신청 고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('enum', {
    name: 'status',
    comment: '지원서 상태 (pending: 대기, resolve: 승인, reject: 거절)',
    enum: ['pending', 'resolve', 'reject'],
    default: () => "'pending'",
  })
  status: 'pending' | 'resolve' | 'reject';

  @Column('varchar', {
    name: 'reject_reason',
    nullable: true,
    comment: '거절 사유 (사용하지 않을 수 있음)',
    length: 255,
  })
  rejectReason: string | null;

  @Column('timestamp', {
    name: 'created_at',
    comment: '생성 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('timestamp', {
    name: 'updated_at',
    comment: '생성 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToOne(() => Club, (club) => club.clubJoinApplications, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'club_id', referencedColumnName: 'id' }])
  club: Club;

  @ManyToOne(() => User, (user) => user.clubJoinApplications, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
