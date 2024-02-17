import { Injectable } from '@nestjs/common';

import { FindOneOptions } from 'typeorm';

import { CreateMajorRequestBodyDto } from '@src/apis/major/dto/create-major-request-body.dto';
import { MajorDto } from '@src/apis/major/dto/major.dto';
import { MajorRepository } from '@src/apis/major/repositories/major.repository';
import { MAJOR_ERROR_CODE } from '@src/constants/error/major/major-error-code.constant';
import { Major } from '@src/entities/Major';
import { HttpConflictException } from '@src/http-exceptions/exceptions/http-conflict.exception';

@Injectable()
export class MajorService {
  constructor(private readonly majorRepository: MajorRepository) {}

  findAllMajors() {
    return this.majorRepository.find();
  }

  findOneMajor(options: FindOneOptions<Major>): Promise<Major> {
    return this.majorRepository.findOne(options);
  }

  async create(createMajorRequestBodyDto: CreateMajorRequestBodyDto) {
    const existMajor = await this.findOneMajor({
      select: { code: true, name: true },
      where: [
        { name: createMajorRequestBodyDto.name },
        { code: createMajorRequestBodyDto.code },
      ],
    });

    if (existMajor) {
      if (createMajorRequestBodyDto.name === existMajor.name) {
        throw new HttpConflictException({
          code: MAJOR_ERROR_CODE.ALREADY_EXIST_MAJOR_NAME,
        });
      }

      if (createMajorRequestBodyDto.code === existMajor.code) {
        throw new HttpConflictException({
          code: MAJOR_ERROR_CODE.ALREADY_EXIST_MAJOR_CODE,
        });
      }
    }

    const newMajor = this.majorRepository.create(createMajorRequestBodyDto);

    await this.majorRepository.save(newMajor);

    return new MajorDto(newMajor);
  }
}
