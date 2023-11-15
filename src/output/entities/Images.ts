import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Boards } from "./Boards";

@Index("images_fk1", ["boardNo"], {})
@Entity("images", { schema: "dongurami_local_db" })
export class Images {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("int", { name: "board_no", unsigned: true })
  boardNo: number;

  @Column("varchar", { name: "url", length: 255 })
  url: string;

  @ManyToOne(() => Boards, (boards) => boards.images, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "board_no", referencedColumnName: "id" }])
  boardNo2: Boards;
}
