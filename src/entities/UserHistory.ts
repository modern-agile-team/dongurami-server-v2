import {
  UserLoginType,
  UserRole,
  UserStatus,
} from '@src/apis/users/constants/user.enum';
import { HistoryAction } from '@src/constants/enum';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';

@Index(['email'], { unique: true })
@Index(['snsId'], { unique: true })
@Index(['studentNumber'], { unique: true })
@Index(['nickname'], { unique: true })
@Index(['majorId'], {})
@Entity('user_history')
export class UserHistory {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '유저 고유 수정이력 ID',
    unsigned: true,
  })
  id: number;

  @Column('int', {
    name: 'major_id',
    nullable: true,
    comment: '전공 고유 ID',
    unsigned: true,
  })
  majorId: number | null;

  @Column('int', {
    name: 'user_id',
    comment: '유저 고유 ID',
    unsigned: true,
  })
  userId: number;

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
  role: UserRole;

  @Column('enum', {
    name: 'action',
    comment: 'history 를 쌓는 action',
    enum: HistoryAction,
  })
  action: HistoryAction;

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

  @ManyToOne(() => User, (user) => user.userHistories, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
