import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity("login_type", { schema: "dongurami_v2" })
export class LoginType {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "id",
    comment: "로그인 타입 고유 ID",
    unsigned: true,
  })
  id: number;

  @Column("varchar", { name: "name", comment: "로그인 타입", length: 20 })
  name: string;

  @Column("varchar", { name: "memo", comment: "메모", length: 255 })
  memo: string;

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

  @OneToMany(() => User, (user) => user.loginType)
  users: User[];
}
