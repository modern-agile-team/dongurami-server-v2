import { Injectable } from '@nestjs/common';
import { PAGE_SIZE } from '@src/constants/constant';
import { ERROR_CODE } from '@src/constants/error/error-code.constant';
import { PageDto } from '@src/dto/page.dto';
import { HttpInternalServerErrorException } from '@src/http-exceptions/exceptions/http-internal-server-error.exception';
import { CommonResponseDto } from '@src/interceptors/success-interceptor/dto/common-response.dto';
import { DeleteResponseDto } from '@src/interceptors/success-interceptor/dto/delete-response.dto';
import { DetailResponseDto } from '@src/interceptors/success-interceptor/dto/detail-response.dto';
import { PaginationResponseDto } from '@src/interceptors/success-interceptor/dto/pagination-response.dto';
import { isObject } from 'class-validator';

interface Res {
  data: unknown;
  key: string;
}

@Injectable()
export class ResponseBuilder {
  /**
   * 모든 값을 허용합니다.
   */
  common(res: Res) {
    const { key, data } = res;

    return new CommonResponseDto({
      [key]: data,
    });
  }

  /**
   * plain object 와 class instance 만 허용합니다.
   */
  detail(res: Res) {
    const { key, data } = res;

    if (!isObject(res)) {
      throw new HttpInternalServerErrorException({
        code: ERROR_CODE.SERVER_ERROR,
        ctx: 'delete response build 중 object formant 이 아님',
      });
    }

    return new DetailResponseDto({
      [key]: data,
    });
  }

  /**
   * number type integer format 만 허용합니다.
   */
  delete(res: Pick<Res, 'data'>) {
    const { data } = res;

    if (typeof data !== 'number') {
      throw new HttpInternalServerErrorException({
        code: ERROR_CODE.SERVER_ERROR,
        ctx: 'delete response build 중 number type 이 아님',
      });
    }

    if (!Number.isInteger(data)) {
      throw new HttpInternalServerErrorException({
        code: ERROR_CODE.SERVER_ERROR,
        ctx: 'delete response build 중 integer format 이 아님',
      });
    }

    return new DeleteResponseDto(data);
  }

  /**
   * array type 만 허용합니다.
   * 클라이언트 요청으로 contents 로 통일합니다.
   */
  pagination(res: Res, pageDto: PageDto) {
    const { data } = res;

    if (!Array.isArray(data)) {
      throw new HttpInternalServerErrorException({
        code: ERROR_CODE.SERVER_ERROR,
        ctx: 'pagination response build 중 data 가 array type 이 아님',
      });
    }

    const [array, totalCount] = data;

    if (!Array.isArray(array)) {
      throw new HttpInternalServerErrorException({
        code: ERROR_CODE.SERVER_ERROR,
        ctx: 'pagination response build 중 조회된 객체가 array type 이 아님',
      });
    }

    if (typeof totalCount !== 'number') {
      throw new HttpInternalServerErrorException({
        code: ERROR_CODE.SERVER_ERROR,
        ctx: 'pagination response build 중 totalCount 가 number type 이 아님',
      });
    }

    if (!Number.isInteger(totalCount)) {
      throw new HttpInternalServerErrorException({
        code: ERROR_CODE.SERVER_ERROR,
        ctx: 'pagination response build 중 totalCount 가 integer format 이 아님',
      });
    }

    const currentPage = Number(pageDto.page) || 1;
    const pageSize = Number(pageDto.pageSize) || PAGE_SIZE.DEFAULT;
    const nextPage = pageSize * currentPage < totalCount ? pageSize + 1 : null;
    const hasNext = pageSize * currentPage < totalCount;
    const lastPage = Math.ceil(totalCount / pageSize);

    return new PaginationResponseDto(
      { contents: array },
      {
        totalCount,
        currentPage,
        pageSize,
        nextPage,
        hasNext,
        lastPage,
      },
    );
  }
}
