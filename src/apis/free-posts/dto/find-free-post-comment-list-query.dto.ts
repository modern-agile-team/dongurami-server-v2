import { FreePostCommentStatus } from '@src/apis/free-posts/constants/free-post-comment.enum';
import { FREE_POST_ORDER_FIELD } from '@src/apis/free-posts/constants/free-post.constant';
import { FreePostCommentDto } from '@src/apis/free-posts/dto/free-post-comment.dto';
import { SortOrder } from '@src/constants/enum';
import { PageDto } from '@src/dto/page.dto';
import { ApiPropertyOrder } from '@src/dto/swagger/api-property-order.decorator';
import { CsvToOrder, Order } from '@src/dto/transformer/csv-to-order.decorator';
import { IsDefined, IsOptional } from 'class-validator';

export class FindFreePostCommentListQueryDto
  extends PageDto
  implements Partial<FreePostCommentDto>
{
  @ApiPropertyOrder(FREE_POST_ORDER_FIELD)
  @CsvToOrder<typeof FREE_POST_ORDER_FIELD>([...FREE_POST_ORDER_FIELD])
  @IsOptional()
  order: Order<typeof FREE_POST_ORDER_FIELD> = { id: SortOrder.Desc };

  @IsDefined()
  status: FreePostCommentStatus = FreePostCommentStatus.Posting;
}
