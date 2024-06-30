import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { ClubPostAttachment } from '@src/entities/ClubPostAttachment';
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

  @Column('bigint', { name: 'user_id', unsigned: true, nullable: false })
  userId: string;

  @Column('varchar', {
    name: 'url',
    comment: 'file url',
    length: 100,
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
    length: 30,
    nullable: false,
  })
  mimeType: string;

  @Column('bigint', {
    name: 'capacity',
    comment: '파일 용량(byte)',
    unsigned: true,
    nullable: false,
  })
  capacity: string;

  @Column('timestamp', {
    name: 'created_at',
    comment: '생성 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.attachments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @OneToMany(
    () => ClubPostAttachment,
    (clubPostAttachments) => clubPostAttachments.attachment,
  )
  clubPostAttachments: ClubPostAttachment[];
}
