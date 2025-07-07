import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@src/apis/auth/jwt/jwt.guard';
import { ApiPostTag } from '@src/apis/post-tags/controllers/post-tags.swagger';
import { CreatePostTagDto } from '@src/apis/post-tags/dto/create-post-tag.dto';
import { PostTagsService } from '@src/apis/post-tags/services/post-tags.service';
import { UserDto } from '@src/apis/users/dto/user.dto';
import { ApiCommonResponse } from '@src/decorators/swagger/api-common-response.swagger';
import { User } from '@src/decorators/user.decorator';
import { ResponseType } from '@src/interceptors/success-interceptor/constants/success-interceptor.enum';
import { SetResponse } from '@src/interceptors/success-interceptor/decorators/success-response.decorator';

@ApiTags('post-tag')
@ApiCommonResponse([HttpStatus.INTERNAL_SERVER_ERROR])
@Controller('post-tags')
export class PostTagsController {
  constructor(private readonly postTagsService: PostTagsService) {}

  @ApiPostTag.Create({
    summary: '게시글 태그 생성',
    description:
      '태그만 생성하고 게시글에 추가되진 않음 </br> 동일한 태그명이 존재한다면 존재하는 태그를 반환함',
  })
  @UseGuards(JwtAuthGuard)
  @SetResponse({ key: 'postTag', type: ResponseType.Detail })
  @Post()
  create(@User() user: UserDto, @Body() createPostTagDto: CreatePostTagDto) {
    return this.postTagsService.create(user.id, createPostTagDto);
  }
}
