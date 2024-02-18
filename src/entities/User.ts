import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import {
  UserGender,
  UserLoginType,
  UserRole,
  UserStatus,
} from '@src/apis/users/constants/user.enum';
import { FreePost } from '@src/entities/FreePost';
import { FreePostComment } from '@src/entities/FreePostComment';
import { FreePostCommentReaction } from '@src/entities/FreePostCommentReaction';
import { FreePostReaction } from '@src/entities/FreePostReaction';
import { Major } from '@src/entities/Major';
import { NoticePost } from '@src/entities/NoticePost';
import { NoticePostComment } from '@src/entities/NoticePostComment';
import { NoticePostCommentReaction } from '@src/entities/NoticePostCommentReaction';
import { NoticePostReaction } from '@src/entities/NoticePostReaction';
import { UserHistory } from '@src/entities/UserHistory';

@Index(['email'], { unique: true })
@Index(['snsId'], { unique: true })
@Index(['studentNumber'], { unique: true })
@Index(['nickname'], { unique: true })
@Entity('user')
export class User {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '유저 고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('int', {
    name: 'major_id',
    comment: '전공 고유 ID',
    unsigned: true,
  })
  majorId: number | null;

  @Column('enum', {
    name: 'login_type',
    comment: '로그인 타입',
    enum: ['KAKAO', 'GOOGLE', 'NAVER'],
  })
  loginType: UserLoginType;

  @Column('varchar', {
    name: 'sns_id',
    nullable: true,
    unique: true,
    comment: '소셜 아이디',
    length: 255,
  })
  snsId: string | null;

  @Column('varchar', {
    name: 'student_number',
    nullable: true,
    unique: true,
    comment: '유저 학번',
    length: 20,
  })
  studentNumber: string | null;

  @Column('varchar', {
    name: 'name',
    nullable: true,
    comment: '본명을 기대하는 유저 이름',
    length: 20,
  })
  name: string | null;

  @Column('varchar', {
    name: 'nickname',
    nullable: true,
    unique: true,
    comment: '유저 닉네임',
    length: 255,
  })
  nickname: string | null;

  @Column('varchar', {
    name: 'email',
    nullable: true,
    unique: true,
    comment: '이메일',
    length: 255,
  })
  email: string | null;

  @Column('varchar', {
    name: 'phone_number',
    nullable: true,
    comment: '전화번호',
    length: 20,
  })
  phoneNumber: string | null;

  @Column('tinyint', {
    name: 'grade',
    nullable: true,
    comment: '학년 (0이면 졸업생)',
    width: 1,
  })
  grade: number | null;

  @Column('varchar', {
    name: 'gender',
    nullable: true,
    comment: '성별',
    length: 20,
  })
  gender: UserGender | null;

  @Column('varchar', {
    name: 'profile_path',
    nullable: true,
    comment: '프로필 이미지 path',
    length: 255,
  })
  profilePath: string | null;

  @Column('enum', {
    name: 'role',
    comment: '역할 (admin: service admin, student: 학생)',
    enum: ['admin', 'student'],
    default: () => "'student'",
  })
  role: UserRole;

  @Column('enum', {
    name: 'status',
    comment: '유저 상태',
    enum: ['active', 'inactive'],
    default: () => "'active'",
  })
  status: UserStatus;

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

  @OneToMany(() => FreePost, (freePost) => freePost.user)
  freePosts: FreePost[];

  @OneToMany(() => FreePostComment, (freePostComment) => freePostComment.user)
  freePostComments: FreePostComment[];

  @OneToMany(
    () => FreePostCommentReaction,
    (freePostCommentReaction) => freePostCommentReaction.user,
  )
  freePostCommentReactions: FreePostCommentReaction[];

  @OneToMany(
    () => FreePostReaction,
    (freePostReaction) => freePostReaction.user,
  )
  freePostReactions: FreePostReaction[];

  @OneToMany(() => NoticePost, (noticePost) => noticePost.user)
  noticePosts: NoticePost[];

  @OneToMany(
    () => NoticePostComment,
    (noticePostComment) => noticePostComment.user,
  )
  noticePostComments: NoticePostComment[];

  @OneToMany(
    () => NoticePostCommentReaction,
    (noticePostCommentReaction) => noticePostCommentReaction.user,
  )
  noticePostCommentReactions: NoticePostCommentReaction[];

  @OneToMany(
    () => NoticePostReaction,
    (noticePostReaction) => noticePostReaction.user,
  )
  noticePostReactions: NoticePostReaction[];

  @ManyToOne(() => Major, (major) => major.users, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'major_id', referencedColumnName: 'id' }])
  major: Major;

  @OneToMany(() => UserHistory, (userHistory) => userHistory.user)
  userHistories: UserHistory[];
}
