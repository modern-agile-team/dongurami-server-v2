import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Answers } from './Answers.entity';
import { Applicants } from './Applicants.entity';
import { BoardEmotions } from './BoardEmotions.entity';
import { Boards } from './Boards.entity';
import { Clubs } from './Clubs.entity';
import { CommentEmotions } from './CommentEmotions.entity';
import { Comments } from './Comments.entity';
import { Members } from './Members.entity';
import { Notifications } from './Notifications.entity';
import { ReplyCommentEmotions } from './ReplyCommentEmotions.entity';
import { Reviews } from './Reviews.entity';
import { Schedules } from './Schedules.entity';
import { Scraps } from './Scraps.entity';
import { SnsInfo } from './SnsInfo.entity';

@Entity('students', { schema: 'dongurami_local_db' })
export class Students {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', { name: 'password', length: 128 })
  password: string;

  @Column('varchar', { name: 'name', length: 20 })
  name: string;

  @Column('varchar', { name: 'email', length: 128 })
  email: string;

  @Column('datetime', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('varchar', { name: 'password_salt', length: 128 })
  passwordSalt: string;

  @Column('varchar', { name: 'phone_number', nullable: true, length: 20 })
  phoneNumber: string | null;

  @Column('tinyint', { name: 'grade', nullable: true, width: 1 })
  grade: boolean | null;

  @Column('tinyint', { name: 'gender', nullable: true, width: 1 })
  gender: boolean | null;

  @Column('tinyint', { name: 'admin_flag', width: 1, default: () => "'0'" })
  adminFlag: boolean;

  @Column('varchar', { name: 'profile_image_url', nullable: true, length: 255 })
  profileImageUrl: string | null;

  @Column('varchar', { name: 'major', length: 20 })
  major: string;

  @OneToMany(() => Answers, (answers) => answers.student)
  answers: Answers[];

  @OneToMany(() => Applicants, (applicants) => applicants.student)
  applicants: Applicants[];

  @OneToMany(() => BoardEmotions, (boardEmotions) => boardEmotions.student)
  boardEmotions: BoardEmotions[];

  @OneToMany(() => Boards, (boards) => boards.student)
  boards: Boards[];

  @OneToMany(() => Clubs, (clubs) => clubs.leader)
  clubs: Clubs[];

  @OneToMany(
    () => CommentEmotions,
    (commentEmotions) => commentEmotions.student,
  )
  commentEmotions: CommentEmotions[];

  @OneToMany(() => Comments, (comments) => comments.student)
  comments: Comments[];

  @OneToMany(() => Members, (members) => members.student)
  members: Members[];

  @OneToMany(() => Notifications, (notifications) => notifications.recipient)
  notifications: Notifications[];

  @OneToMany(
    () => ReplyCommentEmotions,
    (replyCommentEmotions) => replyCommentEmotions.student,
  )
  replyCommentEmotions: ReplyCommentEmotions[];

  @OneToMany(() => Reviews, (reviews) => reviews.student)
  reviews: Reviews[];

  @OneToMany(() => Schedules, (schedules) => schedules.student)
  schedules: Schedules[];

  @OneToMany(() => Scraps, (scraps) => scraps.student)
  scraps: Scraps[];

  @OneToMany(() => SnsInfo, (snsInfo) => snsInfo.student)
  snsInfos: SnsInfo[];
}
