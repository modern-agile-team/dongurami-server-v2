import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { FreeBoard } from "./FreeBoard";
import { FreeBoardComment } from "./FreeBoardComment";
import { User } from "./User";
import { FreeBoardReplyCommentReaction } from "./FreeBoardReplyCommentReaction";

@Entity("free_board_reply_comment", { schema: "dongurami_v2" })
export class FreeBoardReplyComment {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "id",
    comment: "자유 게시글 대댓글 고유 ID",
    unsigned: true,
  })
  id: number;

  @Column("varchar", {
    name: "description",
    comment: "대댓글 본문",
    length: 255,
  })
  description: string;

  @Column("tinyint", {
    name: "isAnonymous",
    comment: "작성자 익명 여부 (0: 실명, 1: 익명)",
    unsigned: true,
    default: () => "'0'",
  })
  isAnonymous: number;

  @Column("timestamp", {
    name: "created_at",
    comment: "생성 일자",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("timestamp", {
    name: "updated_at",
    comment: "생성 일자",
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;

  @ManyToOne(() => FreeBoard, (freeBoard) => freeBoard.freeBoardReplyComments, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "free_board_id", referencedColumnName: "id" }])
  freeBoard: FreeBoard;

  @ManyToOne(
    () => FreeBoardComment,
    (freeBoardComment) => freeBoardComment.freeBoardReplyComments,
    { onDelete: "CASCADE", onUpdate: "CASCADE" }
  )
  @JoinColumn([{ name: "free_board_comment_id", referencedColumnName: "id" }])
  freeBoardComment: FreeBoardComment;

  @ManyToOne(() => User, (user) => user.freeBoardReplyComments, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: User;

  @OneToMany(
    () => FreeBoardReplyCommentReaction,
    (freeBoardReplyCommentReaction) =>
      freeBoardReplyCommentReaction.freeBoardReplyComment
  )
  freeBoardReplyCommentReactions: FreeBoardReplyCommentReaction[];
}
