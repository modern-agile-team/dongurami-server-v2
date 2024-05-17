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
import { ClubPostDto } from '@src/apis/club-posts/dto/club-post.dto';
import { ClubReviewDto } from '@src/apis/club-reviews/dto/club-review.dto';
import { ClubTagDto } from '@src/apis/club-tags/dto/club-tag.dto';
import { ApiClub } from '@src/apis/clubs/controllers/clubs.swagger';
import { BulkAppendClubTagDto } from '@src/apis/clubs/dto/bulk-append-club-tag.dto';
import { ClubDto } from '@src/apis/clubs/dto/club.dto';
import { ClubsItemDto } from '@src/apis/clubs/dto/clubs-item.dto';
import { CreateClubApplicationRequestBodyDto } from '@src/apis/clubs/dto/create-club-application-request-body.dto';
import { CreateClubPostRequestBodyDto } from '@src/apis/clubs/dto/create-club-post-request-body.dto';
import { CreateClubReviewRequestBodyDto } from '@src/apis/clubs/dto/create-club-review-request-body.dto';
import { FindClubApplicationListRequestQueryDto } from '@src/apis/clubs/dto/find-club-application-list-request-query.dto';
import { FindClubListQueryDto } from '@src/apis/clubs/dto/find-club-list-query.dto';
import { ClubsService } from '@src/apis/clubs/services/clubs.service';
import { CreateReactionDto } from '@src/apis/reactions/dto/create-reaction.dto';
import { RemoveReactionDto } from '@src/apis/reactions/dto/remove-reaction.dto';
import { UserDto } from '@src/apis/users/dto/user.dto';
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
  @ApiClub.CreateClubApplication({ summary: '동아리 지원서 생성' })
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
    summary: '동아리 지원서 페이지네이션',
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
    summary: '동아리 지원서 상세조회',
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

  @ApiClub.PatchUpdateClubApplication({ summary: '동아리 지원서 업데이트' })
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
    summary: '동아리 지원서 상태 업데이트',
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
