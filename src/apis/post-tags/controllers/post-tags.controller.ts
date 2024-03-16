import { Controller } from '@nestjs/common';

import { PostTagsService } from '@src/apis/post-tags/services/post-tags.service';

@Controller('post-tags')
export class PostTagsController {
  constructor(private readonly postTagsService: PostTagsService) {}
}
