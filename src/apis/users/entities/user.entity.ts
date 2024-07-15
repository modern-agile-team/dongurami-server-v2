import {
  UserGender,
  UserLoginType,
  UserRole,
  UserStatus,
} from '@src/apis/users/constants/user.enum';
import { BaseEntity, CreateEntityProps } from '@src/common/base.entity';
import { Major } from '@src/entities/Major';

interface UserProps {
  majorId: string | null;

  loginType: UserLoginType;
  snsId: string | null;
  studentNumber: string | null;
  name: string | null;
  nickname: string | null;
  email: string | null;
  phoneNumber: string | null;
  grade: number | null;
  gender: UserGender | null;
  profilePath: string | null;
  role: UserRole;
  status: UserStatus;

  major: Major | null;
}

export class User extends BaseEntity<UserProps> {
  constructor(props: CreateEntityProps<UserProps>) {
    super(props);
  }

  get majorId(): string | null {
    return this.props.majorId;
  }

  get loginType(): UserLoginType {
    return this.props.loginType;
  }

  get snsId(): string | null {
    return this.props.snsId;
  }

  get studentNumber(): string | null {
    return this.props.studentNumber;
  }

  get name(): string | null {
    return this.props.name;
  }

  get nickname(): string | null {
    return this.props.nickname;
  }

  get email(): string | null {
    return this.props.email;
  }

  get phoneNumber(): string | null {
    return this.props.phoneNumber;
  }

  get grade(): number | null {
    return this.props.grade;
  }

  get gender(): UserGender | null {
    return this.props.gender;
  }

  get profilePath(): string | null {
    return this.props.profilePath;
  }

  get role(): UserRole {
    return this.props.role;
  }

  get status(): UserStatus {
    return this.props.status;
  }

  public validate(): void {}
}
