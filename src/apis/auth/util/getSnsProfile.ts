import fetch from 'node-fetch';
import { GoogleUserResponse, KakaoUserResponse, NaverUserResponse, SnsProfileBase } from '../social/types/auth-social.type';
import { HttpInternalServerErrorException } from '@src/http-exceptions/exceptions/http-internal-server-error.exception';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { UserLoginType } from '@src/apis/users/constants/user.enum';

/**
 * SNS에서 사용자 프로필 정보를 가져온다.
 * @param {string} loginType 'GOOGLE','KAKAO','NAVER'
 * @param {string} snsToken SNS에서 발급한 token
 * @returns {Promise<SnsProfileBase>} SNS profile 데이터
 */
export async function getSnsProfile(loginType: UserLoginType, snsToken: string): Promise<SnsProfileBase | null> {
  try {
    let result: SnsProfileBase;

    switch (loginType) {
      case UserLoginType.Kakao: {
        const response = await fetch('https://kapi.kakao.com/v2/user/me', {
          method: 'GET',
          headers: { Authorization: `Bearer ${snsToken}` },
        });

        const { id: kakaoId } = (await response.json()) as KakaoUserResponse;

        result = { snsId: kakaoId };
        break;
      }

      case UserLoginType.Google: {
        const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          method: 'GET',
          headers: { Authorization: `Bearer ${snsToken}` },
        });

        const { sub: googleSub } = (await response.json()) as GoogleUserResponse;

        result = { snsId: googleSub };
        break;
      }

      case UserLoginType.Naver: {
        const response = await fetch('https://openapi.naver.com/v1/nid/me', {
          method: 'GET',
          headers: { Authorization: `Bearer ${snsToken}` },
        });

        const { resultcode, message, response: naverResponse } = (await response.json()) as NaverUserResponse;

        if (resultcode !== '00') {
          throw new HttpInternalServerErrorException({
            code: COMMON_ERROR_CODE.SERVER_ERROR,
            ctx: '네이버 서버 에러',
            stack: message
          })
        }

        result = { snsId: naverResponse?.id || '' };
        break;
      }

      default:
        throw new HttpInternalServerErrorException({
          code: COMMON_ERROR_CODE.SERVER_ERROR,
          ctx: '소셜 프로필 조회 중 알 수 없는 에러',
        });
    }

    return result;
  } catch (error) {
    console.error('Error fetching getSnsProfile : ', error.message);
    return null;
  }
}
