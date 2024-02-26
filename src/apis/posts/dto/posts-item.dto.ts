import { OmitType } from '@nestjs/swagger';

import { PostDto } from '@src/apis/posts/dto/post.dto';

export class PostsItemDto extends OmitType(PostDto, ['description']) {}
