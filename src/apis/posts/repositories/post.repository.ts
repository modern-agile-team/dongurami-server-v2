import { Injectable } from '@nestjs/common';

import { DataSource } from 'typeorm';

import { FreePostRepository } from '@src/apis/free-posts/repositories/free-post.repository';
import { NoticePostRepository } from '@src/apis/notice-posts/repositories/notice-post.repository';
import { PostType } from '@src/apis/posts/constants/post.enum';
import { PostsItemDto } from '@src/apis/posts/dto/posts-item.dto';
import { User } from '@src/entities/User';

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
  }): Promise<[PostsItemDto[], number]> {
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
      .leftJoin(User, 'user', 'user.id = post.userId')
      .select('*')
      .orderBy(order)
      .skip(skip)
      .take(take)
      .getQueryAndParameters();

    const postRaws = await this.dataSource.query(postQuery, [
      ...freePostParams,
      ...noticePostParams,
      ...postParams,
    ]);

    const posts = postRaws.map((postRaw) => {
      const { id, type, userId, title, hit, createdAt, updatedAt } = postRaw;
      const {
        major_id,
        login_type,
        sns_id,
        student_number,
        name,
        nickname,
        phone_number,
        grade,
        gender,
        profile_path,
        role,
        status,
        created_at,
        updated_at,
        deleted_at,
        email,
      } = postRaw;

      return {
        id,
        type,
        userId,
        title,
        hit,
        createdAt,
        updatedAt,
        user: {
          id: userId,
          majorId: major_id,
          loginType: login_type,
          snsId: sns_id,
          studentNumber: student_number,
          name: name,
          nickname: nickname,
          phoneNumber: phone_number,
          grade: grade,
          gender: gender,
          profile_path: profile_path,
          role: role,
          status: status,
          createdAt: created_at,
          updatedAt: updated_at,
          deletedAt: deleted_at,
          email: email,
        },
      };
    });

    const [{ count }] = await this.dataSource.query(
      `SELECT COUNT(1) as count FROM ${virtualTableQuery} as post`,
      [...freePostParams, ...noticePostParams],
    );

    return [posts, Number(count)];
  }
}
