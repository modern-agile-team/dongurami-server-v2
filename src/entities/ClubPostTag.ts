import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ClubPostTagLink } from '@src/entities/ClubPostTagLink';
import { User } from '@src/entities/User';

@Index('UQ_760f21193a629b0149baa0b2706', ['name'], { unique: true })
@Entity('club_post_tag')
export class ClubPostTag {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '동아리 게시글 태그',
    unsigned: true,
  })
  id: number;

  @Column('int', {
    name: 'user_id',
    comment: '동아리 게시글 태그 생성 유저 고유 ID',
    unsigned: true,
  })
  userId: number;

  @Column('varchar', {
    name: 'name',
    unique: true,
    comment: '동아리 게시글 태그 명',
    length: 15,
  })
  name: string;

  @Column('timestamp', {
    name: 'created_at',
    comment: '생성 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.clubPostTags, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @OneToMany(
    () => ClubPostTagLink,
    (clubPostTagLink) => clubPostTagLink.clubPostTag,
  )
  clubPostTagLinks: ClubPostTagLink[];
}
