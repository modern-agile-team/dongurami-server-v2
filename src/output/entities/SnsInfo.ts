import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Students } from "./Students";

@Index("sns_info_fk1", ["studentId"], {})
@Entity("sns_info", { schema: "dongurami_local_db" })
export class SnsInfo {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("int", { name: "student_id", unsigned: true })
  studentId: number;

  @Column("varchar", { name: "sns_id", length: 255 })
  snsId: string;

  @ManyToOne(() => Students, (students) => students.snsInfos, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "student_id", referencedColumnName: "id" }])
  student: Students;
}
