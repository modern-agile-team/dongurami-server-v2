import { Injectable } from '@nestjs/common';
import { CreateMajorRequestBodyDto } from '../dto/create-major-request-body.dto';
import { MajorRepository } from '../repositories/major.repository';
import { HttpConflictException } from '@src/http-exceptions/exceptions/http-conflict.exception';
import { MAJOR_ERROR_CODE } from '@src/constants/error/major/major-error-code.constant';

@Injectable()
export class MajorService {
  constructor(private readonly majorRepository: MajorRepository) {}
  async create(createMajorRequestBodyDto: CreateMajorRequestBodyDto) {
    const existMajor = await this.majorRepository.findOne({
      select: { code: true, name: true },
      where: [
        { name: createMajorRequestBodyDto.name },
        createMajorRequestBodyDto.code && {
          code: createMajorRequestBodyDto.code,
        },
      ],
    });

    if (existMajor) {
      if (createMajorRequestBodyDto.name === existMajor.name) {
        throw new HttpConflictException({
          code: MAJOR_ERROR_CODE.ALREADY_EXIST_MAJOR_NAME,
        });
      }
    }
  }
}
