import { OmitType } from '@nestjs/swagger';
import { FreePostDto } from '@src/apis/free-posts/dto/free-post.dto';

export class FreePostsItemDto extends OmitType(FreePostDto, [
  'description',
] as const) {}
