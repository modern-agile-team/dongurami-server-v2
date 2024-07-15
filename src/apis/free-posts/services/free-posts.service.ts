import { Inject, Injectable } from '@nestjs/common';

import { isNotEmptyObject } from 'class-validator';
import { Transactional } from 'typeorm-transactional';

import { CommonPostsService } from '@src/apis/common-posts/services/common-posts.service';
import { FreePost } from '@src/apis/free-posts/entities/free-post.entity';
import { FREE_POST_REPOSITORY_TOKEN } from '@src/apis/free-posts/repositories/free-post.repository';
import { IFreePostRepository } from '@src/apis/free-posts/repositories/free-post.repository.interface';
import {
  CreateFreePostDto,
  FindAllFreePostDto,
  IFreePostsService,
  PatchUpdateFreePostDto,
  PutUpdateFreePostDto,
  RemoveFreePostDto,
} from '@src/apis/free-posts/services/free-posts.service.interface';
import { ReactionsService } from '@src/apis/reactions/services/reactions.service';
import { USER_REPOSITORY_TOKEN } from '@src/apis/users/repositories/user.repository';
import { IUserRepository } from '@src/apis/users/repositories/user.repository.interface';
import { EntityId } from '@src/common/base.entity';
import { isNil } from '@src/common/common';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { ERROR_CODE } from '@src/constants/error/error-code.constant';
import { FreePost as FreePostOrmEntity } from '@src/entities/FreePost';
import { FreePostReaction } from '@src/entities/FreePostReaction';
import { QueryHelper } from '@src/helpers/query.helper';
import { HttpBadRequestException } from '@src/http-exceptions/exceptions/http-bad-request.exception';
import { HttpForbiddenException } from '@src/http-exceptions/exceptions/http-forbidden.exception';
import { HttpNotFoundException } from '@src/http-exceptions/exceptions/http-not-found.exception';

@Injectable()
export class FreePostsService implements IFreePostsService {
  constructor(
    private readonly commonPostsService: CommonPostsService<FreePostOrmEntity>,
    private readonly reactionsService: ReactionsService<FreePostReaction>,

    @Inject(FREE_POST_REPOSITORY_TOKEN)
    private readonly freePostRepository: IFreePostRepository,
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,

    private readonly queryHelper: QueryHelper,
  ) {}

  @Transactional()
  async create(dto: CreateFreePostDto): Promise<FreePost> {
    const newPost = FreePost.create(dto);

    await this.freePostRepository.insert(newPost);

    newPost.user = await this.userRepository.findOne(dto.userId);

    return newPost;
  }

  async findAllAndCount(
    dto: FindAllFreePostDto,
  ): Promise<[readonly FreePost[], number]> {
    const { page, pageSize, order, ...filter } = dto;

    const { data, count } =
      await this.freePostRepository.findAllPageBasePaginated({
        limit: pageSize,
        page: page,
        orderBy: order,
        filter,
      });

    return [data, count];
  }

  async findOneOrNotFound(id: EntityId): Promise<FreePost> {
    const freePost = await this.freePostRepository.findOne(id);

    if (isNil(freePost)) {
      throw new HttpNotFoundException({
        code: COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      });
    }

    freePost.user = await this.userRepository.findOne(freePost.userId);

    return freePost;
  }

  /**
   * @deprecated 타 서비스에서 repository를 불러 사용하게할것이기떄문에 의존성이 없어지면 제거 예정
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async findOne(id: EntityId): Promise<FreePost> {
    throw new Error();
  }

  @Transactional()
  async putUpdate(dto: PutUpdateFreePostDto): Promise<FreePost> {
    const freePost = await this.freePostRepository.findOne(dto.id);

    if (dto.userId !== freePost.userId) {
      throw new HttpForbiddenException({
        code: COMMON_ERROR_CODE.PERMISSION_DENIED,
      });
    }

    freePost.update({
      title: dto.title,
      description: dto.description,
      isAnonymous: dto.isAnonymous,
      tagNames: dto.tagNames,
    });

    await this.freePostRepository.update(freePost);

    return freePost;
  }

  @Transactional()
  async patchUpdate(dto: PatchUpdateFreePostDto): Promise<FreePost> {
    if (!isNotEmptyObject(dto)) {
      throw new HttpBadRequestException({
        code: ERROR_CODE.MISSING_UPDATE_FIELD,
      });
    }

    const freePost = await this.findOneOrNotFound(dto.id);

    if (dto.userId !== freePost.userId) {
      throw new HttpForbiddenException({
        code: COMMON_ERROR_CODE.PERMISSION_DENIED,
      });
    }

    freePost.update({
      title: dto.title,
      description: dto.description,
      isAnonymous: dto.isAnonymous,
      tagNames: dto.tagNames,
    });

    await this.freePostRepository.update(freePost);

    return freePost;
  }

  @Transactional()
  async remove(dto: RemoveFreePostDto): Promise<number> {
    const freePost = await this.freePostRepository.findOne(dto.id);

    if (!freePost) {
      throw new HttpNotFoundException({
        code: COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      });
    }

    if (dto.userId !== freePost.userId) {
      throw new HttpForbiddenException({
        code: COMMON_ERROR_CODE.PERMISSION_DENIED,
      });
    }

    await this.freePostRepository.delete(dto.id);

    return 1;
  }

  incrementHit(id: string): Promise<void> {
    return this.commonPostsService.incrementHit(id);
  }

  private async isExistOrNotFound(postId: string): Promise<true> {
    const isExistPost = await this.freePostRepository.exist(postId);

    if (!isExistPost) {
      throw new HttpNotFoundException({
        code: COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      });
    }

    return isExistPost;
  }
}

export const FREE_POSTS_SERVICE_TOKEN = Symbol(FreePostsService.name);
