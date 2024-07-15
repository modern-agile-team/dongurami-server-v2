import { Injectable } from '@nestjs/common';

@Injectable()
export class FreePostReactionsService {
  async createReaction(dto: CreateFreePostReactionDto): Promise<void> {
    await this.isExistOrNotFound(dto.postId);

    return this.reactionsService.create(
      dto.reactionName,
      dto.userId,
      dto.postId,
    );
  }

  async findAllAndCountReactions(
    dto: FindAllFreePostReactionDto,
  ): Promise<[FreePostReaction[], number]> {
    const { page, pageSize, order, reactionName, ...filter } = dto;

    await this.isExistOrNotFound(dto.postId);

    const where = this.queryHelper.buildWherePropForFind(filter);

    return this.reactionsService.findAllAndCount({
      where: {
        ...where,
        parentId: dto.postId,
        reactionType: { name: reactionName },
      },
      skip: page * pageSize,
      take: pageSize,
      order: order.reduce((acc, cur) => Object.assign(acc, cur), {}),
      relations: {
        reactionType: true,
      },
    });
  }

  async removeReaction(dto: RemoveFreePostReactionDto): Promise<void> {
    await this.isExistOrNotFound(dto.postId);

    return this.reactionsService.remove(
      dto.reactionName,
      dto.userId,
      dto.postId,
    );
  }
}
