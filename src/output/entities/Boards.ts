import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BoardEmotions } from './BoardEmotions';
import { BoardCategories } from './BoardCategories';
import { Students } from './Students';
import { Clubs } from './Clubs';
import { Comments } from './Comments';
import { Images } from './Images';

@Index('club_boards_fk1', ['boardCategoryId'], {})
@Index('club_boards_fk2', ['studentId'], {})
@Index('club_boards_fk3', ['clubId'], {})
@Entity('boards', { schema: 'dongurami_local_db' })
export class Boards {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('int', { name: 'student_id', unsigned: true })
  studentId: number;

  @Column('int', { name: 'club_id', unsigned: true, default: () => "'1'" })
  clubId: number;

  @Column('int', { name: 'board_category_id', unsigned: true })
  boardCategoryId: number;

  @Column('varchar', { name: 'title', length: 255 })
  title: string;

  @Column('mediumtext', { name: 'description' })
  description: string;

  @Column('datetime', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('int', { name: 'hit', default: () => "'0'" })
  hit: number;

  @Column('tinyint', {
    name: 'writer_hidden_flag',
    width: 1,
    default: () => "'0'",
  })
  writerHiddenFlag: boolean;

  @OneToMany(() => BoardEmotions, (boardEmotions) => boardEmotions.board)
  boardEmotions: BoardEmotions[];

  @ManyToOne(
    () => BoardCategories,
    (boardCategories) => boardCategories.boards,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn([{ name: 'board_category_id', referencedColumnName: 'id' }])
  boardCategory: BoardCategories;

  @ManyToOne(() => Students, (students) => students.boards, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'student_id', referencedColumnName: 'id' }])
  student: Students;

  @ManyToOne(() => Clubs, (clubs) => clubs.boards, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'club_id', referencedColumnName: 'id' }])
  club: Clubs;

  @OneToMany(() => Comments, (comments) => comments.boardNo2)
  comments: Comments[];

  @OneToMany(() => Images, (images) => images.boardNo2)
  images: Images[];
}
