import {
  UserGender,
  UserLoginType,
  UserRole,
  UserStatus,
} from '@src/apis/users/constants/user.enum';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FreePost } from './FreePost';
import { FreePostComment } from './FreePostComment';
import { FreePostCommentReaction } from './FreePostCommentReaction';
import { FreePostReaction } from './FreePostReaction';
import { FreePostReplyComment } from './FreePostReplyComment';
import { FreePostReplyCommentReaction } from './FreePostReplyCommentReaction';
import { NoticePost } from './NoticePost';
import { NoticePostComment } from './NoticePostComment';
import { NoticePostCommentReaction } from './NoticePostCommentReaction';
import { NoticePostReaction } from './NoticePostReaction';
import { NoticePostReplyComment } from './NoticePostReplyComment';
import { NoticePostReplyCommentReaction } from './NoticePostReplyCommentReaction';
import { UserHistory } from './UserHistory';
import { UserMajor } from './UserMajor';

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
    name: 'user_major_id',
    comment: '전공 고유 ID',
    unsigned: true,
  })
  userMajorId: number | null;

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
    unique: true,
    comment: '이메일',
    length: 255,
  })
  email: string;

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

  @OneToMany(
    () => FreePostReplyComment,
    (freePostReplyComment) => freePostReplyComment.user,
  )
  freePostReplyComments: FreePostReplyComment[];

  @OneToMany(
    () => FreePostReplyCommentReaction,
    (freePostReplyCommentReaction) => freePostReplyCommentReaction.user,
  )
  freePostReplyCommentReactions: FreePostReplyCommentReaction[];

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

  @OneToMany(
    () => NoticePostReplyComment,
    (noticePostReplyComment) => noticePostReplyComment.user,
  )
  noticePostReplyComments: NoticePostReplyComment[];

  @OneToMany(
    () => NoticePostReplyCommentReaction,
    (noticePostReplyCommentReaction) => noticePostReplyCommentReaction.user,
  )
  noticePostReplyCommentReactions: NoticePostReplyCommentReaction[];

  @ManyToOne(() => UserMajor, (userMajor) => userMajor.users, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_major_id', referencedColumnName: 'id' }])
  userMajor: UserMajor;

  @OneToMany(() => UserHistory, (userHistory) => userHistory.user)
  userHistories: UserHistory[];
}
