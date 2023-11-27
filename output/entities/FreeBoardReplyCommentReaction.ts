import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ReactionType } from "./ReactionType";
import { User } from "./User";
import { FreeBoardReplyComment } from "./FreeBoardReplyComment";

@Entity("free_board_reply_comment_reaction", { schema: "dongurami_v2" })
export class FreeBoardReplyCommentReaction {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "id",
    comment: "자유 게시글 대댓글 반응 고유 ID",
    unsigned: true,
  })
  id: number;

  @Column("timestamp", {
    name: "created_at",
    comment: "생성 일자",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @ManyToOne(
    () => ReactionType,
    (reactionType) => reactionType.freeBoardReplyCommentReactions,
    { onDelete: "CASCADE", onUpdate: "CASCADE" }
  )
  @JoinColumn([{ name: "reaction_type_id", referencedColumnName: "id" }])
  reactionType: ReactionType;

  @ManyToOne(() => User, (user) => user.freeBoardReplyCommentReactions, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: User;

  @ManyToOne(
    () => FreeBoardReplyComment,
    (freeBoardReplyComment) =>
      freeBoardReplyComment.freeBoardReplyCommentReactions,
    { onDelete: "CASCADE", onUpdate: "CASCADE" }
  )
  @JoinColumn([
    { name: "free_board_reply_comment_id", referencedColumnName: "id" },
  ])
  freeBoardReplyComment: FreeBoardReplyComment;
}
