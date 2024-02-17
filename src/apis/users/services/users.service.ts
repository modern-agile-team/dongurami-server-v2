import { Injectable } from '@nestjs/common';

import * as crypto from 'crypto';
import moment from 'moment';
import { FindOptionsWhere } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { MajorService } from '@src/apis/major/services/major.service';
import { UserStatus } from '@src/apis/users/constants/user.enum';
import { CreateUserDto } from '@src/apis/users/dto/create-user.dto';
import { PutUpdateUserDto } from '@src/apis/users/dto/put-update-user.dto';
import { UserDto } from '@src/apis/users/dto/user.dto';
import { UserRepository } from '@src/apis/users/repositories/user.repository';
import { UserHistoryService } from '@src/apis/users/user-history/services/user-history.service';
import { HistoryAction } from '@src/constants/enum';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { USER_ERROR_CODE } from '@src/constants/error/users/user-error-code.constant';
import { User } from '@src/entities/User';
import { HttpConflictException } from '@src/http-exceptions/exceptions/http-conflict.exception';
import { HttpForbiddenException } from '@src/http-exceptions/exceptions/http-forbidden.exception';
import { HttpNotFoundException } from '@src/http-exceptions/exceptions/http-not-found.exception';

@Injectable()
export class UsersService {
  private readonly SALT = 10;

  constructor(
    private readonly userHistoryService: UserHistoryService,

    private readonly userRepository: UserRepository,
    private readonly majorService: MajorService,
  ) {}

  /**
   * @todo 소셜 회원가입 전용 DTO 생성 후 적용
   */
  @Transactional()
  async create({
    snsId,
    loginType,
  }: Pick<CreateUserDto, 'snsId' | 'loginType'>) {
    const existUser = await this.userRepository.findOne({
      select: {
        snsId: true,
      },
      where: {
        snsId,
      },
    });

    if (existUser?.snsId) {
      throw new HttpConflictException({
        code: USER_ERROR_CODE.ALREADY_EXIST_USER_SNS_ID,
      });
    }

    const nickname = this.generateUniqueNickname();

    const newUser = this.userRepository.create({
      snsId,
      loginType,
      nickname,
      status: UserStatus.Active,
    });

    await this.userRepository.save(newUser);

    await this.userHistoryService.create(newUser.id, HistoryAction.Insert, {
      ...newUser,
    });

    return new UserDto(newUser);
  }

  async findOneById(id: number): Promise<UserDto | null> {
    const user = await this.userRepository.findOneBy({
      id,
    });

    return user ? new UserDto(user) : null;
  }

  async findOneBy(where: FindOptionsWhere<User>): Promise<UserDto | null> {
    const user = await this.userRepository.findOneBy(where);

    return user ? new UserDto(user) : null;
  }

  async findOneUserOrNotFound(userId: number): Promise<UserDto> {
    const existUser = await this.findOneById(userId);

    if (!existUser) {
      throw new HttpNotFoundException({
        code: COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      });
    }

    return existUser;
  }

  @Transactional()
  async putUpdate(
    myId: number,
    userId: number,
    putUpdateUserDto: PutUpdateUserDto,
  ) {
    const existUser = await this.findOneUserOrNotFound(userId);

    if (myId !== existUser.id) {
      throw new HttpForbiddenException({
        code: COMMON_ERROR_CODE.PERMISSION_DENIED,
      });
    }

    const major = await this.majorService.findOneMajor({
      select: ['id'],
      where: { code: '01' },
    });

    putUpdateUserDto.majorId = major.id;

    await this.userRepository.update(
      { id: userId, status: UserStatus.Active },
      { ...putUpdateUserDto },
    );

    const updatedUser = Object.assign(existUser, putUpdateUserDto);

    await this.userHistoryService.create(userId, HistoryAction.Update, {
      ...updatedUser,
    });

    return new UserDto(updatedUser);
  }

  private generateUniqueNickname(): string {
    const timestamp = moment().format('YYMMDDHHmmss');
    const randomString = crypto.randomBytes(2).toString('hex'); // 4자리 랜덤 문자열
    const uniqueNickname = `user_${timestamp}_${randomString}`;

    return uniqueNickname;
  }
}
