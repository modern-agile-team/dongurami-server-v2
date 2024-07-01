import { Column, Entity, OneToMany } from 'typeorm';

import { User } from '@src/entities/User';

@Entity('major')
export class Major {
  @Column('bigint', {
    primary: true,
    name: 'id',
    comment: '전공 고유 ID',
    unsigned: true,
    nullable: false,
  })
  id: string;

  @Column('varchar', { name: 'code', comment: '전공 코드', length: 20 })
  code: string;

  @Column('varchar', { name: 'name', comment: '전공 명', length: 50 })
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
    comment: '수정 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToMany(() => User, (user) => user.major)
  users: User[];
}
