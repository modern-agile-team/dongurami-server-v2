import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Club } from '@src/entities/Club';
import { ClubTag } from '@src/entities/ClubTag';
import { User } from '@src/entities/User';

@Entity('club_tag_link')
export class ClubTagLink {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '동아리 태그 링크 고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('int', {
    name: 'user_id',
    comment: '동아리 태그 링크 생성 유저 고유 ID',
    unsigned: true,
  })
  userId: number;

  @Column('int', {
    name: 'club_id',
    comment: '동아리 고유 ID',
    unsigned: true,
  })
  clubId: number;

  @Column('int', {
    name: 'club_tag_id',
    comment: '동아리 태그 고유 ID',
    unsigned: true,
  })
  clubTagId: number;

  @Column('timestamp', {
    name: 'created_at',
    comment: '생성 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.clubTagLinks, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @ManyToOne(() => Club, (club) => club.clubTagLinks, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'club_id', referencedColumnName: 'id' }])
  club: Club;

  @ManyToOne(() => ClubTag, (clubTag) => clubTag.clubTagLinks, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'club_tag_id', referencedColumnName: 'id' }])
  clubTag: ClubTag;
}
