import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { ClubMemberRole } from '@src/apis/club-members/constants/club-member.enum';
import { Club } from '@src/entities/Club';
import { User } from '@src/entities/User';

@Entity('club_member')
export class ClubMember {
  @Column('bigint', {
    primary: true,
    name: 'id',
    comment: '동아리 구성원',
    unsigned: true,
    nullable: false,
  })
  id: string;

  @Column('bigint', {
    name: 'user_id',
    comment: '유저 고유 ID',
    unsigned: true,
  })
  userId: string;

  @Column('bigint', {
    name: 'club_id',
    comment: '동아리 고유 ID',
    unsigned: true,
  })
  clubId: string;

  @Column('json', { name: 'roles', comment: '구성원의 역할 리스트' })
  roles: ClubMemberRole[];

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

  @ManyToOne(() => User, (user) => user.clubMembers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @ManyToOne(() => Club, (club) => club.clubMembers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'club_id', referencedColumnName: 'id' }])
  club: Club;
}
