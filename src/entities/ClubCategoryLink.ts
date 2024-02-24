import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Club } from '@src/entities/Club';
import { ClubCategory } from '@src/entities/ClubCategory';
import { User } from '@src/entities/User';

@Entity('club_category_link')
export class ClubCategoryLink {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '동아리 카테고리 링크 고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('int', {
    name: 'user_id',
    comment: '동아리 카테고리 링크 생성 유저 고유 ID',
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
    name: 'club_category_id',
    comment: '동아리 카테고리 고유 ID',
    unsigned: true,
  })
  clubCategoryId: number;

  @Column('timestamp', {
    name: 'created_at',
    comment: '생성 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.clubCategoryLinks, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @ManyToOne(() => Club, (club) => club.clubCategoryLinks, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'club_id', referencedColumnName: 'id' }])
  club: Club;

  @ManyToOne(
    () => ClubCategory,
    (clubCategory) => clubCategory.clubCategoryLinks,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn([{ name: 'club_tag_id', referencedColumnName: 'id' }])
  clubCategory: ClubCategory;
}
