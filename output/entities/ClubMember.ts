import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { Club } from "./Club";

@Entity("club_member", { schema: "dongurami_v2" })
export class ClubMember {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "id",
    comment: "동아리 구성원 고유 ID",
    unsigned: true,
  })
  id: number;

  @Column("varchar", { name: "role", comment: "동아리 멤버 역할", length: 20 })
  role: string;

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

  @ManyToOne(() => User, (user) => user.clubMembers, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: User;

  @ManyToOne(() => Club, (club) => club.clubMembers, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "club_id", referencedColumnName: "id" }])
  club: Club;
}
