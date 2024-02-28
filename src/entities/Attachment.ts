import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { User } from '@src/entities/User';

@Entity('attachment')
export class Attachment {
  @Column('bigint', {
    primary: true,
    name: 'id',
    comment: '첨부 파일 고유 ID',
    unsigned: true,
    nullable: false,
  })
  id: string;

  @Column({ name: 'user_id', unsigned: true, nullable: false })
  userId: number;

  @Column('varchar', {
    name: 'url',
    comment: 'file url',
    length: 255,
    nullable: false,
  })
  url: string;

  @Column('varchar', {
    name: 'path',
    comment: 'domain을 제외한 path',
    length: 255,
    nullable: false,
  })
  path: string;

  @Column('varchar', {
    name: 'mime_type',
    comment: 'MIME-Type',
    length: 255,
    nullable: false,
  })
  mimeType: string;

  @Column('varchar', {
    name: 'capacity',
    comment: '파일 용량(byte)',
    length: 255,
    nullable: false,
  })
  capacity: string;

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

  @ManyToOne(() => User, (user) => user.attachments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
