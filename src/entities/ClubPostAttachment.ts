import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Attachment } from '@src/entities/Attachment';
import { ClubPost } from '@src/entities/ClubPost';

@Entity('club_post_attachment')
export class ClubPostAttachment {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '동아리 게시글 첨부 파일 고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('bigint', {
    name: 'attachment_id',
    unsigned: true,
    comment: '첨부 파일 고유 ID',
  })
  attachmentId: string;

  @Column('int', {
    name: 'club_post_id',
    unsigned: true,
    comment: '동아리 게시글 고유 ID',
  })
  clubPostId: number;

  @Column('timestamp', {
    name: 'created_at',
    comment: '생성 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => ClubPost, (clubPost) => clubPost.clubPostAttachments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'club_post_id', referencedColumnName: 'id' }])
  clubPost: ClubPost;

  @ManyToOne(() => Attachment, (attachment) => attachment.clubPostAttachments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'attachment_id', referencedColumnName: 'id' }])
  attachment: Attachment;
}
