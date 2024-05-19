import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ClubPostCommentStatus } from '@src/apis/club-post-comments/constants/club-post-comment.enum';
import { ClubPost } from '@src/entities/ClubPost';
import { ClubPostCommentHistory } from '@src/entities/ClubPostCommentHistory';
import { User } from '@src/entities/User';
import { BooleanTransformer } from '@src/entities/transformers/boolean.transformer';

@Entity('club_post_comment')
export class ClubPostComment {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '동아리 게시글 댓글 고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('int', {
    name: 'user_id',
    comment: '댓글 작성 유저 고유 ID',
    unsigned: true,
  })
  userId: number;

  @Column('int', {
    name: 'club_post_id',
    comment: '게시글 고유 ID',
    unsigned: true,
  })
  clubPostId: number;

  @Column('varchar', { name: 'description', comment: '댓글 본문', length: 255 })
  description: string;

  @Column('tinyint', {
    name: 'is_anonymous',
    comment: '작성자 익명 여부 (0: 실명, 1: 익명)',
    unsigned: true,
    default: () => "'0'",
    transformer: new BooleanTransformer(false),
  })
  isAnonymous: boolean;

  @Column('enum', {
    name: 'status',
    comment: '동아리 게시글 댓글 상태',
    enum: ['posting', 'remove'],
    default: () => "'posting'",
  })
  status: ClubPostCommentStatus;

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

  @Column('int', {
    name: 'parent_id',
    nullable: true,
    comment: '부모 댓글 고유 ID',
    unsigned: true,
  })
  parentId: number | null;

  @Column('tinyint', {
    name: 'depth',
    comment: '댓글 깊이 (0부터 시작)',
    unsigned: true,
    default: () => "'0'",
  })
  depth: number;

  @ManyToOne(() => ClubPost, (clubPost) => clubPost.clubPostComments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'club_post_id', referencedColumnName: 'id' }])
  clubPost: ClubPost;

  @ManyToOne(() => User, (user) => user.clubPostComments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @ManyToOne(
    () => ClubPostComment,
    (clubPostComment) => clubPostComment.children,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn([{ name: 'parent_id', referencedColumnName: 'id' }])
  parent: ClubPostComment;

  @OneToMany(() => ClubPostComment, (clubPostComment) => clubPostComment.parent)
  children: ClubPostComment[];

  @OneToMany(
    () => ClubPostCommentHistory,
    (clubPostCommentHistory) => clubPostCommentHistory.clubPostComment,
  )
  clubPostCommentHistories: ClubPostCommentHistory[];
}
