import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserRequestBodyDto } from '@src/apis/users/dto/create-user-request-body.dto';
import { UserDto } from '@src/apis/users/dto/user.dto';
import { UsersService } from '@src/apis/users/services/users.service';
import { mockUsersService } from '@test/mock/mock.service';
import { UsersController } from './users.controller';

describe(UsersController.name, () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe(UsersController.prototype.create.name, () => {
    let createUserRequestBodyDto: CreateUserRequestBodyDto;
    let newUser: UserDto;

    beforeEach(() => {
      createUserRequestBodyDto = new CreateUserRequestBodyDto();
      newUser = new UserDto();
    });

    it('create user', async () => {
      newUser.id = faker.number.int();

      mockUsersService.create.mockResolvedValue(newUser);

      await expect(
        controller.create(createUserRequestBodyDto),
      ).resolves.toEqual(newUser);
    });
  });
});
