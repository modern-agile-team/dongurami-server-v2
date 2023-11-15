import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Answers } from "./Answers";
import { Applicants } from "./Applicants";
import { BoardEmotions } from "./BoardEmotions";
import { Boards } from "./Boards";
import { Clubs } from "./Clubs";
import { CommentEmotions } from "./CommentEmotions";
import { Comments } from "./Comments";
import { Letters } from "./Letters";
import { Members } from "./Members";
import { Notifications } from "./Notifications";
import { ReplyCommentEmotions } from "./ReplyCommentEmotions";
import { Reviews } from "./Reviews";
import { Schedules } from "./Schedules";
import { Scraps } from "./Scraps";
import { SnsInfo } from "./SnsInfo";

@Entity("students", { schema: "dongurami_local_db" })
export class Students {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "password", length: 128 })
  password: string;

  @Column("varchar", { name: "name", length: 20 })
  name: string;

  @Column("varchar", { name: "email", length: 128 })
  email: string;

  @Column("datetime", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("varchar", { name: "password_salt", length: 128 })
  passwordSalt: string;

  @Column("varchar", { name: "phone_number", nullable: true, length: 20 })
  phoneNumber: string | null;

  @Column("tinyint", { name: "grade", nullable: true, width: 1 })
  grade: boolean | null;

  @Column("tinyint", { name: "gender", nullable: true, width: 1 })
  gender: boolean | null;

  @Column("tinyint", { name: "admin_flag", width: 1, default: () => "'0'" })
  adminFlag: boolean;

  @Column("varchar", { name: "profile_image_url", nullable: true, length: 255 })
  profileImageUrl: string | null;

  @Column("varchar", { name: "major", length: 20 })
  major: string;

  @OneToMany(() => Answers, (answers) => answers.student)
  answers: Answers[];

  @OneToMany(() => Applicants, (applicants) => applicants.student)
  applicants: Applicants[];

  @OneToMany(() => BoardEmotions, (boardEmotions) => boardEmotions.student)
  boardEmotions: BoardEmotions[];

  @OneToMany(() => Boards, (boards) => boards.student)
  boards: Boards[];

  @OneToMany(() => Clubs, (clubs) => clubs.leader2)
  clubs: Clubs[];

  @OneToMany(
    () => CommentEmotions,
    (commentEmotions) => commentEmotions.student
  )
  commentEmotions: CommentEmotions[];

  @OneToMany(() => Comments, (comments) => comments.student)
  comments: Comments[];

  @OneToMany(() => Letters, (letters) => letters.sender)
  letters: Letters[];

  @OneToMany(() => Letters, (letters) => letters.recipient)
  letters2: Letters[];

  @OneToMany(() => Letters, (letters) => letters.host)
  letters3: Letters[];

  @OneToMany(() => Members, (members) => members.student)
  members: Members[];

  @OneToMany(() => Notifications, (notifications) => notifications.recipient_2)
  notifications: Notifications[];

  @OneToMany(
    () => ReplyCommentEmotions,
    (replyCommentEmotions) => replyCommentEmotions.student
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
