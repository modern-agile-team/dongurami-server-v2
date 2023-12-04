import {
  UserLoginType,
  UserRole,
  UserStatus,
} from '@src/apis/users/constants/user.enum';
import { UserHistory } from '@src/entities/UserHistory';

export class CreateUserHistoryDto
  implements
    Pick<
      UserHistory,
      | 'loginType'
      | 'name'
      | 'password'
      | 'email'
      | 'phoneNumber'
      | 'grade'
      | 'gender'
      | 'profilePath'
      | 'role'
      | 'status'
    >
{
  loginType: UserLoginType;
  name: string;
  password: string | null;
  email: string;
  phoneNumber: string | null;
  grade: boolean | null;
  gender: string | null;
  profilePath: string | null;
  role: UserRole;
  status: UserStatus;

  constructor(createUserHistoryDto: CreateUserHistoryDto) {
    this.loginType = createUserHistoryDto.loginType;
    this.name = createUserHistoryDto.name;
    this.password = createUserHistoryDto.password;
    this.email = createUserHistoryDto.email;
    this.phoneNumber = createUserHistoryDto.phoneNumber;
    this.grade = createUserHistoryDto.grade;
    this.gender = createUserHistoryDto.gender;
    this.profilePath = createUserHistoryDto.profilePath;
    this.role = createUserHistoryDto.role;
    this.status = createUserHistoryDto.status;
  }
}
