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
import { FreeBoard } from './FreeBoard';
import { FreeBoardComment } from './FreeBoardComment';
import { FreeBoardCommentReaction } from './FreeBoardCommentReaction';
import { FreeBoardReaction } from './FreeBoardReaction';
import { FreeBoardReplyComment } from './FreeBoardReplyComment';
import { FreeBoardReplyCommentReaction } from './FreeBoardReplyCommentReaction';
import { LoginType } from './LoginType';
import { Major } from './Major';

@Entity('user', { schema: 'dongurami_v2' })
export class User {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '유저 고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('varchar', { name: 'name', comment: '유저 이름', length: 20 })
  name: string;

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
  grade: boolean | null;

  @Column('varchar', {
    name: 'gender',
    nullable: true,
    comment: '성별',
    length: 20,
  })
  gender: string | null;

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
  role: 'admin' | 'student';

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

  @OneToMany(
    () => ClubJoinApplication,
    (clubJoinApplication) => clubJoinApplication.user,
  )
  clubJoinApplications: ClubJoinApplication[];

  @OneToMany(() => ClubMember, (clubMember) => clubMember.user)
  clubMembers: ClubMember[];

  @OneToMany(() => FreeBoard, (freeBoard) => freeBoard.user)
  freeBoards: FreeBoard[];

  @OneToMany(
    () => FreeBoardComment,
    (freeBoardComment) => freeBoardComment.user,
  )
  freeBoardComments: FreeBoardComment[];

  @OneToMany(
    () => FreeBoardCommentReaction,
    (freeBoardCommentReaction) => freeBoardCommentReaction.user,
  )
  freeBoardCommentReactions: FreeBoardCommentReaction[];

  @OneToMany(
    () => FreeBoardReaction,
    (freeBoardReaction) => freeBoardReaction.user,
  )
  freeBoardReactions: FreeBoardReaction[];

  @OneToMany(
    () => FreeBoardReplyComment,
    (freeBoardReplyComment) => freeBoardReplyComment.user,
  )
  freeBoardReplyComments: FreeBoardReplyComment[];

  @OneToMany(
    () => FreeBoardReplyCommentReaction,
    (freeBoardReplyCommentReaction) => freeBoardReplyCommentReaction.user,
  )
  freeBoardReplyCommentReactions: FreeBoardReplyCommentReaction[];

  @ManyToOne(() => Major, (major) => major.users, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'major_id', referencedColumnName: 'id' }])
  major: Major;

  @ManyToOne(() => LoginType, (loginType) => loginType.users, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'login_type_id', referencedColumnName: 'id' }])
  loginType: LoginType;
}
