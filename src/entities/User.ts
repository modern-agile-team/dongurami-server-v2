import {
  UserGender,
  UserLoginType,
  UserRole,
  UserStatus,
} from '@src/apis/users/constants/user.enum';
import { FreePost } from '@src/entities/FreePost';
import { FreePostComment } from '@src/entities/FreePostComment';
import { FreePostCommentHistory } from '@src/entities/FreePostCommentHistory';
import { FreePostCommentReaction } from '@src/entities/FreePostCommentReaction';
import { FreePostHistory } from '@src/entities/FreePostHistory';
import { FreePostReaction } from '@src/entities/FreePostReaction';
import { FreePostReplyComment } from '@src/entities/FreePostReplyComment';
import { FreePostReplyCommentHistory } from '@src/entities/FreePostReplyCommentHistory';
import { FreePostReplyCommentReaction } from '@src/entities/FreePostReplyCommentReaction';
import { NoticePost } from '@src/entities/NoticePost';
import { NoticePostComment } from '@src/entities/NoticePostComment';
import { UserHistory } from '@src/entities/UserHistory';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ClubJoinApplication } from './ClubJoinApplication';
import { ClubMember } from './ClubMember';
import { Major } from './Major';
import { NoticePostCommentReaction } from './NoticePostCommentReaction';
import { NoticePostReaction } from './NoticePostReaction';
import { NoticePostReplyComment } from './NoticePostReplyComment';
import { NoticePostReplyCommentReaction } from './NoticePostReplyCommentReaction';
import { NoticePostHistory } from './NoticePostHistory';
import { NoticePostCommentHistory } from './NoticePostCommentHistory';
import { NoticePostReplyCommentHistory } from './NoticePostReplyCommentHistory';

@Entity('user', { schema: 'dongurami_v2' })
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
  majorId: number;

  @Column('varchar', {
    name: 'student_number',
    comment: '유저 학번',
    nullable: true,
    length: 20,
  })
  studentNumber: string | null;

  @Column('varchar', {
    name: 'sns_id',
    comment: '소셜 고유 ID',
    nullable: true,
    length: 255,
  })
  snsId: string | null;

  @Column('enum', {
    name: 'login_type',
    comment: '로그인 타입',
    enum: UserLoginType,
  })
  loginType: UserLoginType;

  @Column('varchar', { 
    name: 'name', 
    nullable: true,
    comment: '유저 이름', 
    length: 20 
  })
  name: string | null;

  @Column('varchar', {
    name: 'password',
    nullable: true,
    comment: '비밀번호',
    length: 128,
  })
  password: string | null;

  @Column('varchar', { name: 'email', comment: '이메일', length: 255 })
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
    enum: UserRole,
    default: () => "'student'",
  })
  role: UserRole;

  @Column('enum', {
    name: 'status',
    comment: '유저 상태',
    enum: UserStatus,
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
    comment: '생성 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column('timestamp', {
    name: 'deleted_at',
    nullable: true,
    comment: '삭제 일자',
  })
  deletedAt: Date | null;

  @OneToMany(
    () => ClubJoinApplication,
    (clubJoinApplication) => clubJoinApplication.user,
  )
  clubJoinApplications: ClubJoinApplication[];

  @OneToMany(() => ClubMember, (clubMember) => clubMember.user)
  clubMembers: ClubMember[];

  @OneToMany(() => FreePost, (freePost) => freePost.user)
  freePosts: FreePost[];

  @OneToMany(() => FreePostComment, (freePostComment) => freePostComment.user)
  freePostComments: FreePostComment[];

  @OneToMany(
    () => FreePostCommentHistory,
    (freePostCommentHistory) => freePostCommentHistory.user,
  )
  freePostCommentHistories: FreePostCommentHistory[];

  @OneToMany(
    () => FreePostCommentReaction,
    (freePostCommentReaction) => freePostCommentReaction.user,
  )
  freePostCommentReactions: FreePostCommentReaction[];

  @OneToMany(() => FreePostHistory, (freePostHistory) => freePostHistory.user)
  freePostHistories: FreePostHistory[];

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
    () => FreePostReplyCommentHistory,
    (freePostReplyCommentHistory) => freePostReplyCommentHistory.user,
  )
  freePostReplyCommentHistories: FreePostReplyCommentHistory[];

  @OneToMany(
    () => FreePostReplyCommentReaction,
    (freePostReplyCommentReaction) => freePostReplyCommentReaction.user,
  )
  freePostReplyCommentReactions: FreePostReplyCommentReaction[];

  @OneToMany(() => NoticePost, (noticePost) => noticePost.user)
  noticePosts: NoticePost[];

  @OneToMany(
    () => NoticePostHistory,
    (noticePostHistories) => noticePostHistories.user,
  )
  noticePostHistories: NoticePostHistory[];

  @OneToMany(
    () => NoticePostComment,
    (noticePostComment) => noticePostComment.user,
  )
  noticePostComments: NoticePostComment[];

  @OneToMany(
    () => NoticePostCommentHistory,
    (noticePostCommentHistories) => noticePostCommentHistories.user,
  )
  noticePostCommentHistories: NoticePostCommentHistory[];

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
    () => NoticePostReplyCommentHistory,
    (noticePostReplyCommentHistories) => noticePostReplyCommentHistories.user,
  )
  noticePostReplyCommentHistories: NoticePostReplyCommentHistory[];

  @OneToMany(
    () => NoticePostReplyCommentReaction,
    (noticePostReplyCommentReaction) => noticePostReplyCommentReaction.user,
  )
  noticePostReplyCommentReactions: NoticePostReplyCommentReaction[];

  @ManyToOne(() => Major, (major) => major.users, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'major_id', referencedColumnName: 'id' }])
  major: Major;

  @OneToMany(() => UserHistory, (userHistory) => userHistory.user)
  userHistories: UserHistory[];
}
