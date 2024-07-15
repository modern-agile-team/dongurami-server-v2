import { Controller, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiCommonResponse } from '@src/decorators/swagger/api-common-response.swagger';

@ApiTags('free-post-reaction')
@Controller('free-posts/:postId/reactions')
@ApiCommonResponse([HttpStatus.INTERNAL_SERVER_ERROR])
export class FreePostReactionsController {
  create() {}

  findAllAndCount() {}

  remove() {}
}
