import { IsDefined, IsOptional } from 'class-validator';

import { NOTICE_POST_COMMENT_ORDER_FIELD } from '@src/apis/notice-post-comments/constants/notice-post-comment.constant';
import { NoticePostCommentStatus } from '@src/apis/notice-post-comments/constants/notice-post-comment.enum';
import { NoticePostCommentDto } from '@src/apis/notice-post-comments/dto/notice-post-comment.dto';
import { SortOrder } from '@src/constants/enum';
import { PageDto } from '@src/dto/page.dto';
import { ApiPropertyOrder } from '@src/dto/swagger/api-property-order.decorator';
import { CsvToOrder, Order } from '@src/dto/transformer/csv-to-order.decorator';

export class FindNoticePostCommentListQueryDto
  extends PageDto
  implements Partial<NoticePostCommentDto>
{
  @ApiPropertyOrder(NOTICE_POST_COMMENT_ORDER_FIELD)
  @CsvToOrder<typeof NOTICE_POST_COMMENT_ORDER_FIELD>([
    ...NOTICE_POST_COMMENT_ORDER_FIELD,
  ])
  @IsOptional()
  order: Order<typeof NOTICE_POST_COMMENT_ORDER_FIELD> = { id: SortOrder.Desc };

  /**
   * 대댓글의 깊이가 1인 정책을 우선 백엔드에서 가져가고 변경사항이 있을 경우 처리
   */
  @IsDefined()
  loadDepth: number = 1;

  @IsDefined()
  status: NoticePostCommentStatus = NoticePostCommentStatus.Posting;
}
