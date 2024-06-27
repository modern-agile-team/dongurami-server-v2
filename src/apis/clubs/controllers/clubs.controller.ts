import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { plainToInstance } from 'class-transformer';

import { JwtAuthGuard } from '@src/apis/auth/jwt/jwt.guard';
import { ClubApplicationFormDto } from '@src/apis/club-application-form/dto/club-application-form.dto';
import { PutUpdateClubApplicationFormDto } from '@src/apis/club-application-form/dto/put-update-club-application-form.dto';
import { ClubApplicationDto } from '@src/apis/club-applications/dto/club-application.dto';
import { ClubApplicationsItemDto } from '@src/apis/club-applications/dto/club-applications-item.dto';
import { PatchUpdateClubApplicationDto } from '@src/apis/club-applications/dto/patch-update-club-application.dto';
import { UpdateClubApplicationStatusDto } from '@src/apis/club-applications/dto/update-club-application-status.dto';
import { ClubCategoryDto } from '@src/apis/club-categories/dto/club-category.dto';
import { ClubMemberItemDto } from '@src/apis/club-members/dto/club-member-item.dto';
import { ClubPostCommentDto } from '@src/apis/club-post-comments/dto/club-post-comment.dto';
import { ClubPostCommentsItemDto } from '@src/apis/club-post-comments/dto/club-post-comments-item.dto';
import { ClubPostDto } from '@src/apis/club-posts/dto/club-post.dto';
import { ClubPostsItemDto } from '@src/apis/club-posts/dto/club-posts-item.dto';
import { ClubReviewDto } from '@src/apis/club-reviews/dto/club-review.dto';
import { ClubReviewsItemDto } from '@src/apis/club-reviews/dto/club-reviews-item.dto';
import { ClubTagDto } from '@src/apis/club-tags/dto/club-tag.dto';
import { ApiClub } from '@src/apis/clubs/controllers/clubs.swagger';
import { BulkAppendClubTagDto } from '@src/apis/clubs/dto/bulk-append-club-tag.dto';
import { ClubDto } from '@src/apis/clubs/dto/club.dto';
import { ClubsItemDto } from '@src/apis/clubs/dto/clubs-item.dto';
import { CreateClubApplicationRequestBodyDto } from '@src/apis/clubs/dto/create-club-application-request-body.dto';
import { CreateClubPostCommentRequestBodyDto } from '@src/apis/clubs/dto/create-club-post-comment-request-body.dto';
import { CreateClubPostRequestBodyDto } from '@src/apis/clubs/dto/create-club-post-request-body.dto';
import { CreateClubReviewRequestBodyDto } from '@src/apis/clubs/dto/create-club-review-request-body.dto';
import { FindClubApplicationListRequestQueryDto } from '@src/apis/clubs/dto/find-club-application-list-request-query.dto';
import { FindClubListQueryDto } from '@src/apis/clubs/dto/find-club-list-query.dto';
import { FindClubPostCommentsListRequestQueryDto } from '@src/apis/clubs/dto/find-club-post-comments-list-request-query.dto';
import { FindClubPostListRequestQueryDto } from '@src/apis/clubs/dto/find-club-post-list-request-query.dto';
import { FindClubReviewListRequestQueryDto } from '@src/apis/clubs/dto/find-club-review-list-request-query.dto';
import { PatchUpdateClubPostCommentRequestBodyDto } from '@src/apis/clubs/dto/patch-update-club-post-comment-request-body.dto';
import { PatchUpdateClubPostRequestBodyDto } from '@src/apis/clubs/dto/patch-update-club-post-request-body.dto';
import { ClubsService } from '@src/apis/clubs/services/clubs.service';
import { CreateReactionDto } from '@src/apis/reactions/dto/create-reaction.dto';
import { RemoveReactionDto } from '@src/apis/reactions/dto/remove-reaction.dto';
import { UserDto } from '@src/apis/users/dto/user.dto';
import { anonymize } from '@src/common/common';
import { ApiCommonResponse } from '@src/decorators/swagger/api-common-response.swagger';
import { User } from '@src/decorators/user.decorator';
import { ResponseType } from '@src/interceptors/success-interceptor/constants/success-interceptor.enum';
import { SetResponse } from '@src/interceptors/success-interceptor/decorators/success-response.decorator';
import { ParsePositiveIntPipe } from '@src/pipes/parse-positive-int.pipe';
import { ParseSeparablePositiveIntPipe } from '@src/pipes/parse-separable-positive-int.pipe';

@ApiTags('club')
@ApiCommonResponse([HttpStatus.INTERNAL_SERVER_ERROR])
@Controller('clubs')
export class ClubsController {
  constructor(private readonly clubsService: ClubsService) {}

  @ApiClub.FindAllAndCount({ summary: '동아리 리스트 조회' })
  @SetResponse({ key: 'clubs', type: ResponseType.Pagination })
  @Get()
  async findAllAndCount(@Query() findClubListQueryDto: FindClubListQueryDto) {
    const [clubs, count] =
      await this.clubsService.findAllAndCount(findClubListQueryDto);

    return [plainToInstance(ClubsItemDto, clubs), count];
  }

  @ApiClub.FindOneOrNotFound({ summary: '동아리 상세 조회' })
  @SetResponse({ key: 'club', type: ResponseType.Detail })
  @Get(':clubId')
  findOneOrNotFound(
    @Param('clubId', ParsePositiveIntPipe) clubId: number,
  ): Promise<ClubDto> {
    return this.clubsService.findOneOrNotFound(clubId);
  }

  @ApiClub.FindAllMembers({ summary: '동아리 구성원 리스트 조회' })
  @SetResponse({ key: 'clubMembers', type: ResponseType.Common })
  @Get(':clubId/members')
  findAllMembers(
    @Param('clubId', ParsePositiveIntPipe) clubId: number,
  ): Promise<ClubMemberItemDto[]> {
    return this.clubsService.findAllMembers(clubId);
  }

  @ApiClub.FindAllTags({ summary: '동아리 태그 리스트 조회' })
  @SetResponse({ key: 'clubTags', type: ResponseType.Common })
  @Get(':clubId/tags')
  async findAllTags(
    @Param('clubId', ParsePositiveIntPipe) clubId: number,
  ): Promise<ClubTagDto[]> {
    return this.clubsService.findAllTags(clubId);
  }

  @ApiClub.AppendTags({ summary: '동아리에 태그 추가' })
  @ApiCommonResponse([HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN])
  @UseGuards(JwtAuthGuard)
  @SetResponse({ key: 'clubTags', type: ResponseType.Common })
  @Post(':clubId/tags')
  appendTags(
    @User() user: UserDto,
    @Param('clubId', ParsePositiveIntPipe) clubId: number,
    @Body() bulkAppendClubTagDto: BulkAppendClubTagDto,
  ): Promise<ClubTagDto[]> {
    return this.clubsService.bulkAppendTags(
      user.id,
      clubId,
      bulkAppendClubTagDto,
    );
  }

  @ApiClub.RemoveTags({ summary: '동아리 태그 제거' })
  @UseGuards(JwtAuthGuard)
  @ApiCommonResponse([HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN])
  @SetResponse({ type: ResponseType.Delete })
  @Delete(':clubId/tags/:tagIds')
  removeTags(
    @Param('clubId', ParsePositiveIntPipe) clubId: number,
    @Param('tagIds', ParseSeparablePositiveIntPipe) tagIds: number[],
  ): Promise<number> {
    return this.clubsService.bulkRemoveClubTagLinks(clubId, tagIds);
  }

  @ApiClub.FindAllCategories({ summary: '동아리 카테고리 리스트 조회' })
  @SetResponse({ key: 'clubCategories', type: ResponseType.Common })
  @Get(':clubId/categories')
  findAllCategories(
    @Param('clubId', ParsePositiveIntPipe) clubId: number,
  ): Promise<ClubCategoryDto[]> {
    return this.clubsService.findAllCategoryByClubId(clubId);
  }

  @ApiClub.CreateClubPost({ summary: '동아리 게시글 생성' })
  @ApiCommonResponse([HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN])
  @SetResponse({ key: 'clubPost', type: ResponseType.Detail })
  @Post(':clubId/posts')
  @UseGuards(JwtAuthGuard)
  createClubPost(
    @User() user: UserDto,
    @Param('clubId', ParsePositiveIntPipe) clubId: number,
    @Body() createClubPostRequestBodyDto: CreateClubPostRequestBodyDto,
  ): Promise<ClubPostDto> {
    return this.clubsService.createClubPost(
      user.id,
      clubId,
      createClubPostRequestBodyDto,
    );
  }

  @ApiClub.FindAllAndCountClubPosts({
    summary: '동아리 게시글 Pagination 조회',
  })
  @SetResponse({ key: 'clubPosts', type: ResponseType.Pagination })
  @Get(':clubId/posts')
  async findAllAndCountClubPosts(
    @Param('clubId') clubId: number,
    @Query() findClubPostListRequestQueryDto: FindClubPostListRequestQueryDto,
  ): Promise<[ClubPostsItemDto[], number]> {
    const [clubPosts, count] = await this.clubsService.findAllAndCountClubPosts(
      clubId,
      findClubPostListRequestQueryDto,
    );

    return [plainToInstance(ClubPostsItemDto, clubPosts), count];
  }

  @ApiClub.PatchUpdateClubPost({ summary: '특정 동아리 게시글 Patch 업데이트' })
  @ApiCommonResponse([HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN])
  @SetResponse({ key: 'clubPost', type: ResponseType.Detail })
  @UseGuards(JwtAuthGuard)
  @Patch(':clubId/posts/:postId')
  patchUpdateClubPost(
    @User() user: UserDto,
    @Param('clubId', ParsePositiveIntPipe) clubId: number,
    @Param('postId', ParsePositiveIntPipe) postId: number,
    @Body()
    patchUpdateCLubPostRequestBodyDto: PatchUpdateClubPostRequestBodyDto,
  ): Promise<ClubPostDto> {
    return this.clubsService.patchUpdateClubPost(
      user.id,
      clubId,
      postId,
      patchUpdateCLubPostRequestBodyDto,
    );
  }

  @ApiClub.RemoveClubPost({ summary: '특정 동아리 게시글 삭제' })
  @ApiCommonResponse([HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN])
  @SetResponse({ type: ResponseType.Delete })
  @UseGuards(JwtAuthGuard)
  @Delete(':clubId/posts/:postId')
  removeClubPost(
    @User() user: UserDto,
    @Param('clubId', ParsePositiveIntPipe) clubId: number,
    @Param('postId', ParsePositiveIntPipe) postId: number,
  ): Promise<number> {
    return this.clubsService.removeClubPost(user.id, clubId, postId);
  }

  @ApiClub.CreateClubPostReaction({ summary: '특정 동아리 게시글 리액션 생성' })
  @ApiCommonResponse([HttpStatus.UNAUTHORIZED])
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @Post(':clubId/posts/:postId/reaction')
  createClubPostReaction(
    @User() user: UserDto,
    @Param('clubId', ParsePositiveIntPipe) clubId: number,
    @Param('postId', ParsePositiveIntPipe) postId: number,
    @Body() createReactionDto: CreateReactionDto,
  ) {
    return this.clubsService.createClubPostReaction(
      user.id,
      clubId,
      postId,
      createReactionDto,
    );
  }

  @ApiClub.RemoveClubPostReaction({ summary: '특정 동아리 게시글 리액션 제거' })
  @ApiCommonResponse([HttpStatus.UNAUTHORIZED])
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @Delete(':clubId/posts/:postId/reaction')
  removeClubPostReaction(
    @User() user: UserDto,
    @Param('clubId', ParsePositiveIntPipe) clubId: number,
    @Param('postId', ParsePositiveIntPipe) postId: number,
    @Body() removeReactionDto: RemoveReactionDto,
  ) {
    return this.clubsService.removeClubPostReaction(
      user.id,
      clubId,
      postId,
      removeReactionDto,
    );
  }

  @ApiClub.CreateClubPostComment({ summary: '동아리 게시글 댓글 생성' })
  @ApiCommonResponse([HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN])
  @SetResponse({ key: 'clubPostComment', type: ResponseType.Detail })
  @Post(':clubId/posts/:postId/comments')
  @UseGuards(JwtAuthGuard)
  async createClubPostComment(
    @User() user: UserDto,
    @Param('clubId', ParsePositiveIntPipe) clubId: number,
    @Param('postId', ParsePositiveIntPipe) postId: number,
    @Body()
    createClubPostCommentRequestBodyDto: CreateClubPostCommentRequestBodyDto,
  ): Promise<ClubPostCommentDto> {
    return this.clubsService.createClubPostComment(
      user.id,
      clubId,
      postId,
      createClubPostCommentRequestBodyDto,
    );
  }

  @ApiClub.FindAllAndCountClubPostComments({
    summary: '동아리 게시글 댓글 Pagination 조회',
  })
  @SetResponse({ key: 'clubPostComments', type: ResponseType.Pagination })
  @Get(':clubId/posts/:postId/comments')
  async findAllAndCountClubPostComments(
    @Param('clubId', ParsePositiveIntPipe) clubId: number,
    @Param('postId', ParsePositiveIntPipe) postId: number,
    @Query()
    findClubPostCommentsListRequestQueryDto: FindClubPostCommentsListRequestQueryDto,
  ): Promise<[ClubPostCommentsItemDto[], number]> {
    const [clubPostComments, count] =
      await this.clubsService.findAllAndCountClubPostComments(
        clubId,
        postId,
        findClubPostCommentsListRequestQueryDto,
      );

    return [
      plainToInstance(ClubPostCommentsItemDto, clubPostComments).map(anonymize),
      count,
    ];
  }

  @ApiClub.PatchUpdateClubPostComment({
    summary: '특정 동아리 게시글 댓글 Patch 업데이트',
  })
  @ApiCommonResponse([HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN])
  @SetResponse({ key: 'clubPostComment', type: ResponseType.Detail })
  @UseGuards(JwtAuthGuard)
  @Patch(':clubId/posts/:postId/comments/:commentId')
  async patchUpdateClubPostComment(
    @User() user: UserDto,
    @Param('clubId', ParsePositiveIntPipe) clubId: number,
    @Param('postId', ParsePositiveIntPipe) postId: number,
    @Param('commentId', ParsePositiveIntPipe) commentId: number,
    @Body()
    patchUpdateClubPostCommentRequestBodyDto: PatchUpdateClubPostCommentRequestBodyDto,
  ): Promise<ClubPostCommentDto> {
    const newComment = await this.clubsService.patchUpdateClubPostComment(
      user.id,
      clubId,
      postId,
      commentId,
      patchUpdateClubPostCommentRequestBodyDto,
    );

    return anonymize(newComment);
  }

  @ApiClub.RemoveClubPostComment({
    summary: '특정 동아리 게시글 댓글 삭제',
  })
  @ApiCommonResponse([HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN])
  @SetResponse({ type: ResponseType.Delete })
  @UseGuards(JwtAuthGuard)
  @Delete(':clubId/posts/:postId/comments/:commentId')
  removeClubPostComment(
    @User() user: UserDto,
    @Param('clubId', ParsePositiveIntPipe) clubId: number,
    @Param('postId', ParsePositiveIntPipe) postId: number,
    @Param('commentId', ParsePositiveIntPipe) commentId: number,
  ): Promise<number> {
    return this.clubsService.removeClubPostComment(
      user.id,
      clubId,
      postId,
      commentId,
    );
  }

  @ApiClub.FindLatestApplicationForm({
    summary: '최신 동아리 지원서 폼 조회',
  })
  @SetResponse({ key: 'clubApplicationForm', type: ResponseType.Detail })
  @Get(':clubId/application-forms/latest')
  findLatestApplicationForm(
    @Param('clubId', ParsePositiveIntPipe) clubId: number,
  ): Promise<ClubApplicationFormDto> {
    return this.clubsService.findLatestApplicationForm(clubId);
  }

  @ApiCommonResponse([HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN])
  @ApiClub.PutUpdateApplicationForm({ summary: '동아리 지원서 폼 수정' })
  @UseGuards(JwtAuthGuard)
  @SetResponse({ key: 'clubApplicationForm', type: ResponseType.Detail })
  @Put(':clubId/application-forms/:formId')
  putUpdateApplicationForm(
    @User() user: UserDto,
    @Param('clubId', ParsePositiveIntPipe) clubId: number,
    @Param('formId', ParsePositiveIntPipe) formId: number,
    @Body() putUpdateClubApplicationFormDto: PutUpdateClubApplicationFormDto,
  ): Promise<ClubApplicationFormDto> {
    return this.clubsService.putUpdateClubApplicationForm(
      user.id,
      clubId,
      formId,
      putUpdateClubApplicationFormDto,
    );
  }

  @ApiCommonResponse([HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN])
  @ApiClub.CreateClubReview({ summary: '동아리 후기 생성' })
  @UseGuards(JwtAuthGuard)
  @SetResponse({ key: 'clubReview', type: ResponseType.Detail })
  @Post(':clubId/reviews')
  createClubReview(
    @User() user: UserDto,
    @Param('clubId', ParsePositiveIntPipe) clubId: number,
    @Body() createClubReviewRequestBodyDto: CreateClubReviewRequestBodyDto,
  ): Promise<ClubReviewDto> {
    return this.clubsService.createClubReview(
      user.id,
      clubId,
      createClubReviewRequestBodyDto,
    );
  }

  @ApiClub.FindAllAndCountClubReviews({
    summary: '동아리 후기 페이지네이션',
  })
  @SetResponse({ key: 'clubReviews', type: ResponseType.Pagination })
  @Get(':clubId/reviews')
  async findAllAndCountClubReviews(
    @Param('clubId', ParsePositiveIntPipe) clubId: number,
    @Query()
    findClubReviewListRequestQueryDto: FindClubReviewListRequestQueryDto,
  ): Promise<[Omit<ClubReviewsItemDto, 'status' | 'deletedAt'>[], number]> {
    const [clubReviews, count] =
      await this.clubsService.findAllAndCountClubReview(
        clubId,
        findClubReviewListRequestQueryDto,
      );

    return [plainToInstance(ClubReviewsItemDto, clubReviews), count];
  }

  @ApiClub.GetClubReviewsScore({
    summary: '특정 동아리에 대한 전체 별점 및 평균 조회',
  })
  @SetResponse({ key: 'score', type: ResponseType.Detail })
  @Get(':clubId/reviews/score')
  getClubReviewsScore(@Param('clubId') clubId: number) {
    return this.clubsService.getClubReviewsScore(clubId);
  }

  @ApiCommonResponse([HttpStatus.UNAUTHORIZED])
  @ApiClub.CreateClubReviewReaction({ summary: '동아리 후기 reaction 생성' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post(':clubId/reviews/:reviewId/reaction')
  createClubReviewReaction(
    @User() user: UserDto,
    @Param('clubId', ParsePositiveIntPipe) clubId: number,
    @Param('reviewId', ParsePositiveIntPipe) reviewId: number,
    @Body() createReactionDto: CreateReactionDto,
  ): Promise<void> {
    return this.clubsService.createClubReviewReaction(
      user.id,
      clubId,
      reviewId,
      createReactionDto,
    );
  }

  @ApiCommonResponse([HttpStatus.UNAUTHORIZED])
  @ApiClub.RemoveClubReviewReaction({ summary: '동아리 후기 reaction 삭제' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @Delete(':clubId/reviews/:reviewId/reaction')
  removeClubReviewReaction(
    @User() user: UserDto,
    @Param('clubId', ParsePositiveIntPipe) clubId: number,
    @Param('reviewId', ParsePositiveIntPipe) reviewId: number,
    @Body() removeReactionDto: RemoveReactionDto,
  ): Promise<void> {
    return this.clubsService.removeClubReviewReaction(
      user.id,
      clubId,
      reviewId,
      removeReactionDto,
    );
  }

  /**
   * @todo 지원 유저가 필수 정보를 모두 가지고있는지 체크돼야함
   * 이름, 나이, 학과, 학번, 성별
   */
  @ApiClub.CreateClubApplication({ summary: '동아리 지원내역 생성' })
  @ApiCommonResponse([HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN])
  @SetResponse({ key: 'clubApplication', type: ResponseType.Detail })
  @UseGuards(JwtAuthGuard)
  @Post(':clubId/applications')
  createClubApplication(
    @User() user: UserDto,
    @Param('clubId', ParsePositiveIntPipe) clubId: number,
    @Body()
    createClubApplicationRequestBodyDto: CreateClubApplicationRequestBodyDto,
  ): Promise<ClubApplicationDto> {
    return this.clubsService.createClubApplication(
      user.id,
      clubId,
      createClubApplicationRequestBodyDto,
    );
  }

  /**
   * @todo 동아리장 엑세스컨트롤
   */
  @ApiClub.FindAllAndCountClubApplications({
    summary: '동아리 지원내역 페이지네이션',
  })
  @ApiCommonResponse([HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN])
  @SetResponse({ key: 'clubApplications', type: ResponseType.Pagination })
  @UseGuards(JwtAuthGuard)
  @Get(':clubId/applications')
  async findAllAndCountClubApplications(
    @Param('clubId', ParsePositiveIntPipe) clubId: number,
    @Query()
    findClubApplicationListRequestQueryDto: FindClubApplicationListRequestQueryDto,
  ): Promise<[ClubApplicationsItemDto[], number]> {
    const [clubAPplications, count] =
      await this.clubsService.findAllAndCountClubApplications(
        clubId,
        findClubApplicationListRequestQueryDto,
      );

    return [plainToInstance(ClubApplicationsItemDto, clubAPplications), count];
  }

  /**
   * @todo 동아리장 엑세스컨트롤
   */
  @ApiClub.FindOneClubApplication({
    summary: '동아리 지원내역 상세조회',
    description: '지원서 상태가 submit이라면 viewed로 변경됨',
  })
  @ApiCommonResponse([HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN])
  @SetResponse({ key: 'clubApplication', type: ResponseType.Detail })
  @UseGuards(JwtAuthGuard)
  @Get(':clubId/applications/:applicationId')
  findOneClubApplication(
    @Param('clubId', ParsePositiveIntPipe) clubId: number,
    @Param('applicationId', ParsePositiveIntPipe) applicationId: number,
  ): Promise<ClubApplicationDto> {
    return this.clubsService.findOneClubApplication(clubId, applicationId);
  }

  @ApiClub.PatchUpdateClubApplication({ summary: '동아리 지원내역 업데이트' })
  @ApiCommonResponse([HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN])
  @SetResponse({ key: 'clubApplication', type: ResponseType.Detail })
  @UseGuards(JwtAuthGuard)
  @Patch(':clubId/applications/:applicationId')
  patchUpdateClubApplication(
    @User() user: UserDto,
    @Param('clubId', ParsePositiveIntPipe) clubId: number,
    @Param('applicationId', ParsePositiveIntPipe) applicationId: number,
    @Body() patchUpdateClubApplicationDto: PatchUpdateClubApplicationDto,
  ): Promise<ClubApplicationDto> {
    return this.clubsService.patchUpdateClubApplication(
      user.id,
      clubId,
      applicationId,
      patchUpdateClubApplicationDto,
    );
  }

  @ApiClub.UpdateClubApplicationStatus({
    summary: '동아리 지원내역 상태 업데이트',
    description: '승인으로 업데이트하면 동아리원으로 자동 추가됨',
  })
  @ApiCommonResponse([HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN])
  @SetResponse({ key: 'clubApplication', type: ResponseType.Detail })
  @UseGuards(JwtAuthGuard)
  @Put(':clubId/applications/:applicationId/status')
  updateClubApplicationStatus(
    @User() user: UserDto,
    @Param('clubId', ParsePositiveIntPipe) clubId: number,
    @Param('applicationId', ParsePositiveIntPipe) applicationId: number,
    @Body() updateClubApplicationStatusDto: UpdateClubApplicationStatusDto,
  ): Promise<ClubApplicationDto> {
    return this.clubsService.updateClubApplicationStatus(
      user.id,
      clubId,
      applicationId,
      updateClubApplicationStatusDto,
    );
  }
}
