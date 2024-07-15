import { UserDto } from '@src/apis/users/dto/user.dto';
import { User } from '@src/apis/users/entities/user.entity';
import { User as UserOrmEntity } from '@src/entities/User';

export class UserMap {
  static toEntity(record: UserOrmEntity): User {
    return new User({
      id: record.id,
      props: {
        majorId: record.majorId ?? null,
        loginType: record.loginType,
        snsId: record.snsId ?? null,
        studentNumber: record.studentNumber ?? null,
        name: record.name ?? null,
        nickname: record.nickname ?? null,
        email: record.email ?? null,
        phoneNumber: record.phoneNumber ?? null,
        grade: record.grade ?? null,
        gender: record.gender ?? null,
        profilePath: record.profilePath ?? null,
        role: record.role,
        status: record.status,

        major: record.major ?? null,
      },
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static toPersistence(entity: User): UserOrmEntity {
    throw new Error('Method not implemented.');
  }

  static toDto(entity: User): UserDto {
    const dto = new UserDto();

    dto.majorId = entity.majorId;
    dto.loginType = entity.loginType;
    dto.snsId = entity.snsId;
    dto.studentNumber = entity.studentNumber;
    dto.name = entity.name;
    dto.nickname = entity.nickname;
    dto.email = entity.email;
    dto.phoneNumber = entity.phoneNumber;
    dto.grade = entity.grade;
    dto.gender = entity.gender;
    dto.profilePath = entity.profilePath;
    dto.role = entity.role;
    dto.status = entity.status;

    return dto;
  }
}
