import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserRequestBodyDto } from '@src/apis/users/dto/create-user-request-body.dto';
import { UserRepository } from '@src/apis/users/repositories/user.repository';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly SALT = 10;

  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserRequestBodyDto: CreateUserRequestBodyDto) {
    console.log(this.userRepository);
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
      newUser.password = await bcrypt.hash(
        createUserRequestBodyDto.password,
        this.SALT,
      );
    }

    await this.userRepository.save(newUser);

    return newUser;
  }
}
