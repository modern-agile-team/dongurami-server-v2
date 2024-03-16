import { Injectable } from '@nestjs/common';

import { DataSource } from 'typeorm';

import { FreePostRepository } from '@src/apis/free-posts/repositories/free-post.repository';
import { NoticePostRepository } from '@src/apis/notice-posts/repositories/notice-post.repository';
import { PostType } from '@src/apis/posts/constants/post.enum';

@Injectable()
export class PostRepository {
  constructor(
    private readonly freePostRepository: FreePostRepository,
    private readonly noticePostRepository: NoticePostRepository,
    private readonly dataSource: DataSource,
  ) {}

  async findAllAndCount(options: {
    where: any;
    order: any;
    skip: number;
    take: number;
  }) {
    const { where, order, skip, take } = options;

    const [freePostQuery, freePostParams] = this.freePostRepository
      .createQueryBuilder()
      .select('id', 'id')
      .addSelect(`"${PostType.Free}"`, 'type')
      .addSelect('user_id', 'userId')
      .addSelect('title', 'title')
      .addSelect('hit', 'hit')
      .addSelect('created_at', 'createdAt')
      .addSelect('updated_at', 'updatedAt')
      .where(where)
      .getQueryAndParameters();

    const [noticePostQuery, noticePostParams] = this.noticePostRepository
      .createQueryBuilder()
      .select('id', 'id')
      .addSelect(`"${PostType.Notice}"`, 'type')
      .addSelect('user_id', 'userId')
      .addSelect('title', 'title')
      .addSelect('hit', 'hit')
      .addSelect('created_at', 'createdAt')
      .addSelect('updated_at', 'updatedAt')
      .where(where)
      .getQueryAndParameters();

    const virtualTableQuery = `((${freePostQuery}) UNION (${noticePostQuery}))`;

    const [postQuery, postParams] = this.dataSource
      .createQueryBuilder()
      .from(virtualTableQuery, 'post')
      .select('*')
      .orderBy(order)
      .skip(skip)
      .take(take)
      .getQueryAndParameters();

    const posts = await this.dataSource.query(postQuery, [
      ...freePostParams,
      ...noticePostParams,
      ...postParams,
    ]);

    const [{ count }] = await this.dataSource.query(
      `SELECT COUNT(1) as count FROM ${virtualTableQuery} as post`,
      [...freePostParams, ...noticePostParams],
    );

    return [posts, Number(count)];
  }
}
