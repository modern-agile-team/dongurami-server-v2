import {
  UserGender,
  UserLoginType,
  UserRole,
} from '@src/apis/users/constants/user.enum';
import { User } from '@src/entities/User';
import { Exclude } from 'class-transformer';

export class UserDto
  implements
    Pick<
      User,
      | 'id'
      | 'loginType'
      | 'name'
      | 'password'
      | 'email'
      | 'phoneNumber'
      | 'grade'
      | 'gender'
      | 'profilePath'
      | 'role'
      | 'createdAt'
      | 'updatedAt'
    >
{
  id: number;
  name: string;
  @Exclude()
  password: string | null;
  email: string;
  grade: number | null;
  gender: UserGender | null;
  loginType: UserLoginType;
  phoneNumber: string | null;
  profilePath: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;

  constructor(userDto: Partial<UserDto> = {}) {
    Object.assign(this, userDto);
  }
}
