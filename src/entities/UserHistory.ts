import {
  UserLoginType,
  UserRole,
  UserStatus,
} from '@src/apis/users/constants/user.enum';
import { HistoryAction } from '@src/constants/enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserMajor } from './UserMajor';
import { User } from './User';

@Entity('user_history', { schema: 'dongurami_v2' })
export class UserHistory {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '유저 히스토리 고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('int', {
    name: 'major_id',
    comment: '전공 고유 ID',
    unsigned: true,
  })
  majorId: number;

  @Column('int', {
    name: 'user_id',
    comment: '유저 고유 ID',
    unsigned: true,
  })
  userId: number;

  @Column('enum', {
    name: 'action',
    comment: 'history 를 쌓는 action',
    enum: HistoryAction,
  })
  action: HistoryAction;

  @Column('enum', {
    name: 'login_type',
    comment: '로그인 타입',
    enum: UserLoginType,
  })
  loginType: UserLoginType;

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

  @ManyToOne(() => UserMajor, (major) => major.userHistories, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'major_id', referencedColumnName: 'id' }])
  major: UserMajor;

  @ManyToOne(() => User, (user) => user.userHistories, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
