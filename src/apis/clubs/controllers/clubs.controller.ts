import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
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
import { ClubCategoryDto } from '@src/apis/club-categories/dto/club-category.dto';
import { ClubMemberItemDto } from '@src/apis/club-members/dto/club-member-item.dto';
import { ClubTagDto } from '@src/apis/club-tags/dto/club-tag.dto';
import { ApiClub } from '@src/apis/clubs/controllers/clubs.swagger';
import { BulkAppendClubTagDto } from '@src/apis/clubs/dto/bulk-append-club-tag.dto';
import { ClubDto } from '@src/apis/clubs/dto/club.dto';
import { ClubsItemDto } from '@src/apis/clubs/dto/clubs-item.dto';
import { FindClubListQueryDto } from '@src/apis/clubs/dto/find-club-list-query.dto';
import { ClubsService } from '@src/apis/clubs/services/clubs.service';
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

  @ApiClub.FindLatestApplicationForm({
    summary: '최신 동아리 지원서 폼 조회',
  })
  @SetResponse({ key: 'clubApplicationForm', type: ResponseType.Detail })
  @Get(':clubId/application-form/latest')
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
}
