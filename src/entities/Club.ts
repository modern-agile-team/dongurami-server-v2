import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ClubStatus } from '@src/apis/clubs/constants/club.enum';
import { ClubCategoryLink } from '@src/entities/ClubCategoryLink';
import { ClubHistory } from '@src/entities/ClubHistory';
import { ClubTagLink } from '@src/entities/ClubTagLink';
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
  introduce: string | null;

  @Column('varchar', {
    name: 'logo_path',
    comment: '동아리 로고 경로',
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

  @OneToMany(() => ClubHistory, (clubHistory) => clubHistory.club)
  clubHistories: ClubHistory[];

  @OneToMany(() => ClubTagLink, (clubTagLink) => clubTagLink.club)
  clubTagLinks: ClubTagLink[];

  @OneToMany(
    () => ClubCategoryLink,
    (clubCategoryLink) => clubCategoryLink.club,
  )
  clubCategoryLinks: ClubCategoryLink[];
}
