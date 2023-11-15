import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CommentEmotions } from "./CommentEmotions";
import { Boards } from "./Boards";
import { Students } from "./Students";
import { ReplyCommentEmotions } from "./ReplyCommentEmotions";

@Index("comments_fk1", ["boardNo"], {})
@Index("comments_fk2", ["studentId"], {})
@Entity("comments", { schema: "dongurami_local_db" })
export class Comments {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("int", { name: "board_no", unsigned: true })
  boardNo: number;

  @Column("int", { name: "student_id", unsigned: true })
  studentId: number;

  @Column("varchar", { name: "description", length: 255 })
  description: string;

  @Column("datetime", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("tinyint", { name: "depth", width: 1, default: () => "'0'" })
  depth: boolean;

  @Column("int", { name: "group_no", default: () => "'0'" })
  groupNo: number;

  @Column("tinyint", { name: "reply_flag", width: 1, default: () => "'0'" })
  replyFlag: boolean;

  @Column("tinyint", {
    name: "writer_hidden_flag",
    width: 1,
    default: () => "'0'",
  })
  writerHiddenFlag: boolean;

  @Column("int", { name: "emotion_hit", default: () => "'0'" })
  emotionHit: number;

  @OneToMany(
    () => CommentEmotions,
    (commentEmotions) => commentEmotions.commentNo2
  )
  commentEmotions: CommentEmotions[];

  @ManyToOne(() => Boards, (boards) => boards.comments, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "board_no", referencedColumnName: "id" }])
  boardNo2: Boards;

  @ManyToOne(() => Students, (students) => students.comments, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "student_id", referencedColumnName: "id" }])
  student: Students;

  @OneToMany(
    () => ReplyCommentEmotions,
    (replyCommentEmotions) => replyCommentEmotions.replyCommentNo2
  )
  replyCommentEmotions: ReplyCommentEmotions[];
}
