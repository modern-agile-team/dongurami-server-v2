import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserRequestBodyDto } from '@src/apis/users/dto/create-user-request-body.dto';
import { UserDto } from '@src/apis/users/dto/user.dto';
import { UserRepository } from '@src/apis/users/repositories/user.repository';
import { User } from '@src/entities/User';
import { EncryptionService } from '@src/libs/encryption/services/encryption.service';
import { FindOptionsWhere } from 'typeorm';

@Injectable()
export class UsersService {
  private readonly SALT = 10;

  constructor(
    private readonly encryptionService: EncryptionService,
    private readonly userRepository: UserRepository,
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
        throw new ConflictException('already exist user email');
      }

      if (createUserRequestBodyDto.phoneNumber === existUser.phoneNumber) {
        throw new ConflictException('already exist user phone number');
      }
    }

    const newUser = this.userRepository.create(createUserRequestBodyDto);

    if (newUser.password) {
      newUser.password = await this.encryptionService.hash(
        createUserRequestBodyDto.password,
        this.SALT,
      );
    }

    await this.userRepository.save(newUser);

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
}
