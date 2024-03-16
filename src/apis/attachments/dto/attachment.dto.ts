import { ApiProperty } from '@nestjs/swagger';

import { Attachment } from '@src/entities/Attachment';

export class AttachmentDto implements Omit<Attachment, 'user'> {
  @ApiProperty({
    description: '첨부 파일 고유 ID',
    format: 'int64',
  })
  id: string;

  @ApiProperty({
    description: '업로더 고유 ID',
    format: 'integer',
  })
  userId: number;

  @ApiProperty({
    description: 'file url',
  })
  url: string;

  @ApiProperty({
    description: 'domain을 제외한 path',
  })
  path: string;

  @ApiProperty({
    description: 'MIME-Type',
  })
  mimeType: string;

  @ApiProperty({
    description: '파일 용량(byte)',
    format: 'int64',
  })
  capacity: string;

  @ApiProperty({
    description: '생성 일자',
    format: 'timestamp',
  })
  createdAt: Date;

  constructor(attachmentDto: AttachmentDto) {
    Object.assign(this, attachmentDto);
  }
}
