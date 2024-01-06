import { Injectable } from '@nestjs/common';
import { MajorService } from '@src/apis/major/services/major.service';
import { UserStatus } from '@src/apis/users/constants/user.enum';
import { CreateUserRequestBodyDto } from '@src/apis/users/dto/create-user-request-body.dto';
import { UserDto } from '@src/apis/users/dto/user.dto';
import { UserRepository } from '@src/apis/users/repositories/user.repository';
import { UserHistoryService } from '@src/apis/users/user-history/services/user-history.service';
import { HistoryAction } from '@src/constants/enum';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { USER_ERROR_CODE } from '@src/constants/error/users/user-error-code.constant';
import { User } from '@src/entities/User';
import { HttpConflictException } from '@src/http-exceptions/exceptions/http-conflict.exception';
import { HttpInternalServerErrorException } from '@src/http-exceptions/exceptions/http-internal-server-error.exception';
import { HttpNotFoundException } from '@src/http-exceptions/exceptions/http-not-found.exception';
import { EncryptionService } from '@src/libs/encryption/services/encryption.service';
import { DataSource, FindOptionsWhere } from 'typeorm';

@Injectable()
export class UsersService {
  private readonly SALT = 10;

  constructor(
    private readonly userHistoryService: UserHistoryService,
    private readonly encryptionService: EncryptionService,

    private readonly dataSource: DataSource,
    private readonly userRepository: UserRepository,
    private readonly majorService: MajorService,
  ) {}

  async create(createUserRequestBodyDto: CreateUserRequestBodyDto) {
    const existUser = await this.userRepository.findOne({
      select: {
        email: true,
        phoneNumber: true,
      },
      where: [
        {
          email: createUserRequestBodyDto.email,
        },
        createUserRequestBodyDto.phoneNumber && {
          phoneNumber: createUserRequestBodyDto.phoneNumber,
        },
      ],
    });

    if (existUser) {
      if (createUserRequestBodyDto.email === existUser.email) {
        throw new HttpConflictException({
          code: USER_ERROR_CODE.ALREADY_EXIST_USER_EMAIL,
        });
      }

      if (createUserRequestBodyDto.phoneNumber === existUser.phoneNumber) {
        throw new HttpConflictException({
          code: USER_ERROR_CODE.ALREADY_EXIST_USER_PHONE_NUMBER,
        });
      }
    }

    /**
     * @todo client 에게 받게끔 변경
     */
    const major = await this.majorService.findOneMajor({
      select: {
        id: true,
      },
      where: {
        code: '01',
      },
    });
    createUserRequestBodyDto.majorId = major.id;

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const entityManager = queryRunner.manager;

      const newUser = this.userRepository.create({
        ...createUserRequestBodyDto,
        status: UserStatus.Active,
      });

      if (newUser.password) {
        newUser.password = await this.encryptionService.hash(
          createUserRequestBodyDto.password,
          this.SALT,
        );
      }

      await entityManager.withRepository(this.userRepository).save(newUser);

      await this.userHistoryService.create(
        entityManager,
        newUser.id,
        HistoryAction.Insert,
        {
          ...newUser,
        },
      );

      await queryRunner.commitTransaction();

      return new UserDto(newUser);
    } catch (error) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }

      console.error(error);
      throw new HttpInternalServerErrorException({
        code: COMMON_ERROR_CODE.SERVER_ERROR,
        ctx: '유저 생성 중 알 수 없는 에러',
        stack: error.stack,
      });
    } finally {
      if (!queryRunner.isReleased) {
        await queryRunner.release();
      }
    }
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
}
