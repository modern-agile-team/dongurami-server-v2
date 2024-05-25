import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiNoContentResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

import { ClubApplicationFormDto } from '@src/apis/club-application-form/dto/club-application-form.dto';
import { ClubApplicationDto } from '@src/apis/club-applications/dto/club-application.dto';
import { ClubApplicationsItemDto } from '@src/apis/club-applications/dto/club-applications-item.dto';
import { ClubCategoryDto } from '@src/apis/club-categories/dto/club-category.dto';
import { ClubMemberItemDto } from '@src/apis/club-members/dto/club-member-item.dto';
import { ClubPostCommentDto } from '@src/apis/club-post-comments/dto/club-post-comment.dto';
import { ClubPostDto } from '@src/apis/club-posts/dto/club-post.dto';
import { ClubPostsItemDto } from '@src/apis/club-posts/dto/club-posts-item.dto';
import { ClubReviewDto } from '@src/apis/club-reviews/dto/club-review.dto';
import { ClubReviewsItemDto } from '@src/apis/club-reviews/dto/club-reviews-item.dto';
import { ScoreDto } from '@src/apis/club-reviews/dto/score.dto';
import { ClubTagDto } from '@src/apis/club-tags/dto/club-tag.dto';
import { ClubsController } from '@src/apis/clubs/controllers/clubs.controller';
import { ClubDto } from '@src/apis/clubs/dto/club.dto';
import { ClubsItemDto } from '@src/apis/clubs/dto/clubs-item.dto';
import { CLUB_APPLICATION_ERROR_CODE } from '@src/constants/error/club-application/club-application-error-code.constant';
import { CLUB_MEMBER_ERROR_CODE } from '@src/constants/error/club-member/club-member-error-code.constant';
import { CLUB_REVIEW_ERROR_CODE } from '@src/constants/error/club-review/club-review-error-code.constant';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { REACTION_ERROR_CODE } from '@src/constants/error/reaction/reaction-error-code.constant';
import { HttpException } from '@src/http-exceptions/exceptions/http.exception';
import { CommonResponseDto } from '@src/interceptors/success-interceptor/dto/common-response.dto';
import { DeleteResponseDto } from '@src/interceptors/success-interceptor/dto/delete-response.dto';
import { DetailResponseDto } from '@src/interceptors/success-interceptor/dto/detail-response.dto';
import { PaginationResponseDto } from '@src/interceptors/success-interceptor/dto/pagination-response.dto';
import { CustomValidationError } from '@src/types/custom-validation-errors.type';
import { ApiOperator } from '@src/types/type';

export const ApiClub: ApiOperator<keyof ClubsController> = {
  FindAllAndCount: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation({
        ...apiOperationOptions,
      }),
      PaginationResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'clubs',
        ClubsItemDto,
      ),
      HttpException.swaggerBuilder(
        HttpStatus.BAD_REQUEST,
        [COMMON_ERROR_CODE.INVALID_REQUEST_PARAMETER],
        {
          description:
            '해당 필드는 request parameter 가 잘못된 경우에만 리턴됩니다.',
          type: CustomValidationError,
        },
      ),
    );
  },

  FindOneOrNotFound: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    return applyDecorators(
      ApiOperation({
        ...apiOperationOptions,
      }),
      DetailResponseDto.swaggerBuilder(HttpStatus.OK, 'club', ClubDto),
      HttpException.swaggerBuilder(
        HttpStatus.BAD_REQUEST,
        [COMMON_ERROR_CODE.INVALID_REQUEST_PARAMETER],
        {
          description:
            '해당 필드는 request parameter 가 잘못된 경우에만 리턴됩니다.',
          type: CustomValidationError,
        },
      ),
      HttpException.swaggerBuilder(HttpStatus.NOT_FOUND, [
        COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      ]),
    );
  },

  FindAllMembers: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    return applyDecorators(
      ApiOperation({
        ...apiOperationOptions,
      }),
      CommonResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'clubMembers',
        ClubMemberItemDto,
        { isArray: true },
      ),
      HttpException.swaggerBuilder(
        HttpStatus.BAD_REQUEST,
        [COMMON_ERROR_CODE.INVALID_REQUEST_PARAMETER],
        {
          description:
            '해당 필드는 request parameter 가 잘못된 경우에만 리턴됩니다.',
          type: CustomValidationError,
        },
      ),
      HttpException.swaggerBuilder(HttpStatus.NOT_FOUND, [
        COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      ]),
    );
  },

  FindAllTags: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    return applyDecorators(
      ApiOperation({
        ...apiOperationOptions,
      }),
      CommonResponseDto.swaggerBuilder(HttpStatus.OK, 'clubTags', ClubTagDto, {
        isArray: true,
      }),
      HttpException.swaggerBuilder(
        HttpStatus.BAD_REQUEST,
        [COMMON_ERROR_CODE.INVALID_REQUEST_PARAMETER],
        {
          description:
            '해당 필드는 request parameter 가 잘못된 경우에만 리턴됩니다.',
          type: CustomValidationError,
        },
      ),
      HttpException.swaggerBuilder(HttpStatus.NOT_FOUND, [
        COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      ]),
    );
  },

  AppendTags: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    return applyDecorators(
      ApiOperation({
        ...apiOperationOptions,
      }),
      CommonResponseDto.swaggerBuilder(
        HttpStatus.CREATED,
        'clubTags',
        ClubTagDto,
        { isArray: true },
      ),
      HttpException.swaggerBuilder(
        HttpStatus.BAD_REQUEST,
        [COMMON_ERROR_CODE.INVALID_REQUEST_PARAMETER],
        {
          description:
            '해당 필드는 request parameter 가 잘못된 경우에만 리턴됩니다.',
          type: CustomValidationError,
        },
      ),
      HttpException.swaggerBuilder(HttpStatus.NOT_FOUND, [
        COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      ]),
    );
  },
  RemoveTags: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    return applyDecorators(
      ApiOperation({
        ...apiOperationOptions,
      }),
      ApiParam({
        name: 'tagIds',
        description: '","로 구분된 tagId',
        type: String,
      }),
      DeleteResponseDto.swaggerBuilder(HttpStatus.OK, 'clubTag'),
      HttpException.swaggerBuilder(
        HttpStatus.BAD_REQUEST,
        [COMMON_ERROR_CODE.INVALID_REQUEST_PARAMETER],
        {
          description:
            '해당 필드는 request parameter 가 잘못된 경우에만 리턴됩니다.',
          type: CustomValidationError,
        },
      ),
      HttpException.swaggerBuilder(HttpStatus.NOT_FOUND, [
        COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      ]),
    );
  },

  FindAllCategories: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    return applyDecorators(
      ApiOperation({
        ...apiOperationOptions,
      }),
      CommonResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'clubCategories',
        ClubCategoryDto,
        { isArray: true },
      ),
      HttpException.swaggerBuilder(
        HttpStatus.BAD_REQUEST,
        [COMMON_ERROR_CODE.INVALID_REQUEST_PARAMETER],
        {
          description:
            '해당 필드는 request parameter 가 잘못된 경우에만 리턴됩니다.',
          type: CustomValidationError,
        },
      ),
      HttpException.swaggerBuilder(HttpStatus.NOT_FOUND, [
        COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      ]),
    );
  },

  CreateClubPost: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    return applyDecorators(
      ApiOperation({
        ...apiOperationOptions,
      }),
      CommonResponseDto.swaggerBuilder(
        HttpStatus.CREATED,
        'clubPost',
        ClubPostDto,
      ),
      HttpException.swaggerBuilder(
        HttpStatus.BAD_REQUEST,
        [COMMON_ERROR_CODE.INVALID_REQUEST_PARAMETER],
        {
          description:
            '해당 필드는 request parameter 가 잘못된 경우에만 리턴됩니다.',
          type: CustomValidationError,
        },
      ),
      HttpException.swaggerBuilder(HttpStatus.NOT_FOUND, [
        COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      ]),
    );
  },

  FindAllAndCountClubPosts: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ) {
    return applyDecorators(
      ApiOperation({
        ...apiOperationOptions,
      }),
      PaginationResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'clubPosts',
        ClubPostsItemDto,
      ),
      HttpException.swaggerBuilder(
        HttpStatus.BAD_REQUEST,
        [COMMON_ERROR_CODE.INVALID_REQUEST_PARAMETER],
        {
          description:
            '해당 필드는 request parameter 가 잘못된 경우에만 리턴됩니다.',
          type: CustomValidationError,
        },
      ),
      HttpException.swaggerBuilder(HttpStatus.NOT_FOUND, [
        COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      ]),
    );
  },

  CreateClubPostReaction: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    return applyDecorators(
      ApiOperation({
        ...apiOperationOptions,
      }),
      ApiNoContentResponse(),
      HttpException.swaggerBuilder(
        HttpStatus.BAD_REQUEST,
        [COMMON_ERROR_CODE.INVALID_REQUEST_PARAMETER],
        {
          description:
            '해당 필드는 request parameter 가 잘못된 경우에만 리턴됩니다.',
          type: CustomValidationError,
        },
      ),
      HttpException.swaggerBuilder(HttpStatus.NOT_FOUND, [
        COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      ]),
      HttpException.swaggerBuilder(HttpStatus.CONFLICT, [
        REACTION_ERROR_CODE.ALREADY_LIKED,
      ]),
    );
  },

  RemoveClubPostReaction: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    return applyDecorators(
      ApiOperation({
        ...apiOperationOptions,
      }),
      ApiNoContentResponse(),
      HttpException.swaggerBuilder(
        HttpStatus.BAD_REQUEST,
        [COMMON_ERROR_CODE.INVALID_REQUEST_PARAMETER],
        {
          description:
            '해당 필드는 request parameter 가 잘못된 경우에만 리턴됩니다.',
          type: CustomValidationError,
        },
      ),
      HttpException.swaggerBuilder(HttpStatus.NOT_FOUND, [
        COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      ]),
      HttpException.swaggerBuilder(HttpStatus.CONFLICT, [
        REACTION_ERROR_CODE.NOT_LIKED,
      ]),
    );
  },

  CreateClubPostComment: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    return applyDecorators(
      ApiOperation({
        ...apiOperationOptions,
      }),
      DetailResponseDto.swaggerBuilder(
        HttpStatus.CREATED,
        'clubPostComment',
        ClubPostCommentDto,
      ),
      HttpException.swaggerBuilder(
        HttpStatus.BAD_REQUEST,
        [COMMON_ERROR_CODE.INVALID_REQUEST_PARAMETER],
        {
          description:
            '해당 필드는 request parameter 가 잘못된 경우에만 리턴됩니다.',
          type: CustomValidationError,
        },
      ),
      HttpException.swaggerBuilder(HttpStatus.NOT_FOUND, [
        COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      ]),
    );
  },

  FindLatestApplicationForm: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    return applyDecorators(
      ApiOperation({
        ...apiOperationOptions,
      }),
      DetailResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'clubApplicationForm',
        ClubApplicationFormDto,
      ),
      HttpException.swaggerBuilder(
        HttpStatus.BAD_REQUEST,
        [COMMON_ERROR_CODE.INVALID_REQUEST_PARAMETER],
        {
          description:
            '해당 필드는 request parameter 가 잘못된 경우에만 리턴됩니다.',
          type: CustomValidationError,
        },
      ),
      HttpException.swaggerBuilder(HttpStatus.NOT_FOUND, [
        COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      ]),
    );
  },

  PutUpdateApplicationForm: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    return applyDecorators(
      ApiOperation({
        ...apiOperationOptions,
      }),
      DetailResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'clubApplicationForm',
        ClubApplicationFormDto,
      ),
      HttpException.swaggerBuilder(
        HttpStatus.BAD_REQUEST,
        [COMMON_ERROR_CODE.INVALID_REQUEST_PARAMETER],
        {
          description:
            '해당 필드는 request parameter 가 잘못된 경우에만 리턴됩니다.',
          type: CustomValidationError,
        },
      ),
      HttpException.swaggerBuilder(HttpStatus.NOT_FOUND, [
        COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      ]),
    );
  },

  CreateClubReview: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    return applyDecorators(
      ApiOperation({
        ...apiOperationOptions,
      }),
      DetailResponseDto.swaggerBuilder(
        HttpStatus.CREATED,
        'clubReview',
        ClubReviewDto,
      ),
      HttpException.swaggerBuilder(
        HttpStatus.BAD_REQUEST,
        [COMMON_ERROR_CODE.INVALID_REQUEST_PARAMETER],
        {
          description:
            '해당 필드는 request parameter 가 잘못된 경우에만 리턴됩니다.',
          type: CustomValidationError,
        },
      ),
      HttpException.swaggerBuilder(HttpStatus.NOT_FOUND, [
        COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      ]),
      HttpException.swaggerBuilder(HttpStatus.CONFLICT, [
        CLUB_REVIEW_ERROR_CODE.ALREADY_EXIST_REVIEWED,
      ]),
    );
  },

  FindAllAndCountClubReviews: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    return applyDecorators(
      ApiOperation({
        ...apiOperationOptions,
      }),
      PaginationResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'clubReviews',
        ClubReviewsItemDto,
      ),
      HttpException.swaggerBuilder(
        HttpStatus.BAD_REQUEST,
        [COMMON_ERROR_CODE.INVALID_REQUEST_PARAMETER],
        {
          description:
            '해당 필드는 request parameter 가 잘못된 경우에만 리턴됩니다.',
          type: CustomValidationError,
        },
      ),
      HttpException.swaggerBuilder(HttpStatus.NOT_FOUND, [
        COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      ]),
    );
  },

  GetClubReviewsScore: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    return applyDecorators(
      ApiOperation({
        ...apiOperationOptions,
      }),
      DetailResponseDto.swaggerBuilder(HttpStatus.OK, 'score', ScoreDto),
      HttpException.swaggerBuilder(
        HttpStatus.BAD_REQUEST,
        [COMMON_ERROR_CODE.INVALID_REQUEST_PARAMETER],
        {
          description:
            '해당 필드는 request parameter 가 잘못된 경우에만 리턴됩니다.',
          type: CustomValidationError,
        },
      ),
      HttpException.swaggerBuilder(HttpStatus.NOT_FOUND, [
        COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      ]),
    );
  },

  CreateClubReviewReaction: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    return applyDecorators(
      ApiOperation({
        ...apiOperationOptions,
      }),
      ApiNoContentResponse(),
      HttpException.swaggerBuilder(
        HttpStatus.BAD_REQUEST,
        [COMMON_ERROR_CODE.INVALID_REQUEST_PARAMETER],
        {
          description:
            '해당 필드는 request parameter 가 잘못된 경우에만 리턴됩니다.',
          type: CustomValidationError,
        },
      ),
      HttpException.swaggerBuilder(HttpStatus.NOT_FOUND, [
        COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      ]),
      HttpException.swaggerBuilder(HttpStatus.CONFLICT, [
        REACTION_ERROR_CODE.ALREADY_LIKED,
      ]),
    );
  },

  RemoveClubReviewReaction: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation({
        ...apiOperationOptions,
      }),
      ApiNoContentResponse(),
      HttpException.swaggerBuilder(
        HttpStatus.BAD_REQUEST,
        [COMMON_ERROR_CODE.INVALID_REQUEST_PARAMETER],
        {
          description:
            '해당 필드는 request parameter 가 잘못된 경우에만 리턴됩니다.',
          type: CustomValidationError,
        },
      ),
      HttpException.swaggerBuilder(HttpStatus.NOT_FOUND, [
        COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      ]),
      HttpException.swaggerBuilder(HttpStatus.CONFLICT, [
        REACTION_ERROR_CODE.NOT_LIKED,
      ]),
    );
  },

  CreateClubApplication: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    return applyDecorators(
      ApiOperation({
        ...apiOperationOptions,
      }),
      DetailResponseDto.swaggerBuilder(
        HttpStatus.CREATED,
        'clubApplication',
        ClubApplicationDto,
      ),
      HttpException.swaggerBuilder(
        HttpStatus.BAD_REQUEST,
        [
          COMMON_ERROR_CODE.INVALID_REQUEST_PARAMETER,
          CLUB_APPLICATION_ERROR_CODE.NOT_APPLICATION_PERIOD,
          CLUB_APPLICATION_ERROR_CODE.INVALID_APPLICATION_FORM,
          CLUB_APPLICATION_ERROR_CODE.MISSING_REQUIRED_QUESTION,
          CLUB_APPLICATION_ERROR_CODE.NOT_ALLOWED_ANSWER,
        ],
        {
          description:
            '해당 필드는 request parameter 가 잘못된 경우에만 리턴됩니다.',
          type: CustomValidationError,
        },
      ),
      HttpException.swaggerBuilder(HttpStatus.NOT_FOUND, [
        COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      ]),
      HttpException.swaggerBuilder(HttpStatus.CONFLICT, [
        CLUB_APPLICATION_ERROR_CODE.ALREADY_CLUB_MEMBER,
        CLUB_APPLICATION_ERROR_CODE.PROCESSING_APPLICATION,
      ]),
    );
  },

  FindAllAndCountClubApplications: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    return applyDecorators(
      ApiOperation({
        ...apiOperationOptions,
      }),
      PaginationResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'clubApplications',
        ClubApplicationsItemDto,
      ),
      HttpException.swaggerBuilder(
        HttpStatus.BAD_REQUEST,
        [COMMON_ERROR_CODE.INVALID_REQUEST_PARAMETER],
        {
          description:
            '해당 필드는 request parameter 가 잘못된 경우에만 리턴됩니다.',
          type: CustomValidationError,
        },
      ),
      HttpException.swaggerBuilder(HttpStatus.NOT_FOUND, [
        COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      ]),
    );
  },

  FindOneClubApplication: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    return applyDecorators(
      ApiOperation({
        ...apiOperationOptions,
      }),
      DetailResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'clubApplication',
        ClubApplicationDto,
      ),
      HttpException.swaggerBuilder(
        HttpStatus.BAD_REQUEST,
        [
          COMMON_ERROR_CODE.INVALID_REQUEST_PARAMETER,
          CLUB_APPLICATION_ERROR_CODE.PROCESSED_APPLICATION,
        ],
        {
          description:
            '해당 필드는 request parameter 가 잘못된 경우에만 리턴됩니다.',
          type: CustomValidationError,
        },
      ),
      HttpException.swaggerBuilder(HttpStatus.NOT_FOUND, [
        COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      ]),
    );
  },

  PatchUpdateClubApplication: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    return applyDecorators(
      ApiOperation({
        ...apiOperationOptions,
      }),
      DetailResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'clubApplication',
        ClubApplicationDto,
      ),
      HttpException.swaggerBuilder(
        HttpStatus.BAD_REQUEST,
        [
          COMMON_ERROR_CODE.INVALID_REQUEST_PARAMETER,
          CLUB_APPLICATION_ERROR_CODE.PROCESSED_APPLICATION,
          CLUB_APPLICATION_ERROR_CODE.INVALID_APPLICATION_FORM,
          CLUB_APPLICATION_ERROR_CODE.MISSING_REQUIRED_QUESTION,
          CLUB_APPLICATION_ERROR_CODE.NOT_ALLOWED_ANSWER,
        ],
        {
          description:
            '해당 필드는 request parameter 가 잘못된 경우에만 리턴됩니다.',
          type: CustomValidationError,
        },
      ),
      HttpException.swaggerBuilder(HttpStatus.NOT_FOUND, [
        COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      ]),
    );
  },

  UpdateClubApplicationStatus: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    return applyDecorators(
      ApiOperation({
        ...apiOperationOptions,
      }),
      DetailResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'clubApplication',
        ClubApplicationDto,
      ),
      HttpException.swaggerBuilder(
        HttpStatus.BAD_REQUEST,
        [
          COMMON_ERROR_CODE.INVALID_REQUEST_PARAMETER,
          CLUB_APPLICATION_ERROR_CODE.PROCESSED_APPLICATION,
        ],
        {
          description:
            '해당 필드는 request parameter 가 잘못된 경우에만 리턴됩니다.',
          type: CustomValidationError,
        },
      ),
      HttpException.swaggerBuilder(HttpStatus.NOT_FOUND, [
        COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      ]),
      HttpException.swaggerBuilder(HttpStatus.CONFLICT, [
        CLUB_MEMBER_ERROR_CODE.ALREADY_EXIST_CLUB_MEMBER,
      ]),
    );
  },
};
