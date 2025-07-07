import { UserLoginType } from '@src/apis/users/constants/user.enum';

export interface SnsProfileBase {
  snsId: string;
}

export interface SnsProfile extends SnsProfileBase {
  loginType: UserLoginType;
  snsToken: string;
}

export interface KakaoUserResponse {
  id: string;
}

export interface GoogleUserResponse {
  sub: string;
}

export interface NaverUserResponse {
  resultcode: string;
  message: string;
  response?: {
    id: string;
  };
}
