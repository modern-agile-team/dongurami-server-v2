import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Club } from './Club';

@Entity('club_category', { schema: 'dongurami_v2' })
export class ClubCategory {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '동아리 카테고리 고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('varchar', {
    name: 'name',
    comment: '동아리 카테고리 명',
    length: 30,
  })
  name: string;

  @Column('varchar', { name: 'memo', comment: '메모', length: 255 })
  memo: string;

  @Column('timestamp', {
    name: 'created_at',
    comment: '생성 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('timestamp', {
    name: 'updated_at',
    comment: '생성 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToMany(() => Club, (club) => club.clubCategory)
  clubs: Club[];
}
