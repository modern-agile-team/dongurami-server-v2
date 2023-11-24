import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ClubCategory } from './ClubCategory';
import { ClubJoinApplication } from './ClubJoinApplication';
import { ClubMember } from './ClubMember';

@Entity('club', { schema: 'dongurami_v2' })
export class Club {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('varchar', { name: 'name', comment: '동아리 명', length: 30 })
  name: string;

  @Column('varchar', {
    name: 'logo_path',
    nullable: true,
    comment: '동아리 로고 path',
    length: 255,
  })
  logoPath: string | null;

  @Column('text', { name: 'introduce', nullable: true, comment: '동아리 소개' })
  introduce: string | null;

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

  @ManyToOne(() => ClubCategory, (clubCategory) => clubCategory.clubs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'club_category_id', referencedColumnName: 'id' }])
  clubCategory: ClubCategory;

  @OneToMany(
    () => ClubJoinApplication,
    (clubJoinApplication) => clubJoinApplication.club,
  )
  clubJoinApplications: ClubJoinApplication[];

  @OneToMany(() => ClubMember, (clubMember) => clubMember.club)
  clubMembers: ClubMember[];
}
