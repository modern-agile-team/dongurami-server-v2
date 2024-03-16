import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ClubTagLink } from '@src/entities/ClubTagLink';
import { User } from '@src/entities/User';

@Entity('club_tag')
export class ClubTag {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '동아리 태그 고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('int', {
    name: 'user_id',
    comment: '동아리 태그 생성 유저 고유 ID',
    unsigned: true,
  })
  userId: number;

  @Column('varchar', {
    name: 'name',
    comment: '동아리 태그 이름',
    length: 15,
    unique: true,
  })
  name: string;

  @Column('timestamp', {
    name: 'created_at',
    comment: '생성 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.clubTags, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @OneToMany(() => ClubTagLink, (clubTagLink) => clubTagLink.clubTag)
  clubTagLinks: ClubTagLink[];
}
