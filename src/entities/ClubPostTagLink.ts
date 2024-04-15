import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ClubPost } from '@src/entities/ClubPost';
import { ClubPostTag } from '@src/entities/ClubPostTag';
import { User } from '@src/entities/User';

@Entity('club_post_tag_link')
export class ClubPostTagLink {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '동아리 게시글 태그 링크 고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('timestamp', {
    name: 'created_at',
    comment: '생성 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.clubPostTagLinks, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @ManyToOne(() => ClubPost, (clubPost) => clubPost.clubPostTagLinks, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'club_post_id', referencedColumnName: 'id' }])
  clubPost: ClubPost;

  @ManyToOne(() => ClubPostTag, (clubPostTag) => clubPostTag.clubPostTagLinks, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'club_post_tag_id', referencedColumnName: 'id' }])
  clubPostTag: ClubPostTag;
}
