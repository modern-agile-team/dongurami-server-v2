import fetch from 'node-fetch';
import { GoogleUserResponse, KakaoUserResponse, NaverUserResponse, SnsProfileBase } from '../social/types/auth-social.type';
import { HttpBadRequestException } from '@src/http-exceptions/exceptions/http-bad-request.exception';
import { ERROR_CODE } from '@src/constants/error/error-code.constant';
import { HttpInternalServerErrorException } from '@src/http-exceptions/exceptions/http-internal-server-error.exception';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';

/**
 * SNS에서 사용자 프로필 정보를 가져온다.
 * @param {string} loginType 'GOOGLE','KAKAO','NAVER'
 * @param {string} snsToken SNS에서 발급한 token
 * @returns {Promise<SnsProfileBase>} SNS profile 데이터
 */
export async function getSnsProfile(loginType: string, snsToken: string): Promise<SnsProfileBase> {
  try {
    let result: SnsProfileBase;

    switch (loginType) {
      case 'KAKAO': {
        const response = await fetch('https://kapi.kakao.com/v2/user/me', {
          method: 'GET',
          headers: { Authorization: `Bearer ${snsToken}` },
        });

        const { id: kakaoId } = (await response.json()) as KakaoUserResponse;

        result = { sns_id: kakaoId };
        break;
      }

      case 'GOOGLE': {
        const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          method: 'GET',
          headers: { Authorization: `Bearer ${snsToken}` },
        });

        const { sub: googleSub } = (await response.json()) as GoogleUserResponse;

        result = { sns_id: googleSub };
        break;
      }

      case 'NAVER': {
        const response = await fetch('https://openapi.naver.com/v1/nid/me', {
          method: 'GET',
          headers: { Authorization: `Bearer ${snsToken}` },
        });

        const { resultcode, message, response: naverResponse } = (await response.json()) as NaverUserResponse;

        if (resultcode !== '00') {
          throw new HttpInternalServerErrorException({
            code: COMMON_ERROR_CODE.SERVER_ERROR,
            ctx: `네이버 서버 에러 ${message}`
          })
        }

        result = { sns_id: naverResponse?.id || '' };
        break;
      }

      default:
        throw new HttpBadRequestException({
          code: ERROR_CODE.INVALID_REQUEST_PARAMETER
        });
    }

    return result;
  } catch (error) {
    console.error('Error fetching user information:', error.message);
    return null;
  }
}
