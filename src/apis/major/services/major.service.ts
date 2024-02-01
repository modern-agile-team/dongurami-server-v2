import { Injectable } from '@nestjs/common';
import { MAJOR_ERROR_CODE } from '@src/constants/error/major/major-error-code.constant';
import { HttpConflictException } from '@src/http-exceptions/exceptions/http-conflict.exception';
import { CreateMajorRequestBodyDto } from '../dto/create-major-request-body.dto';
import { MajorDto } from '../dto/major.dto';
import { MajorRepository } from '../repositories/major.repository';
import { UserMajor } from '@src/entities/Major';
import { FindOneOptions } from 'typeorm';

@Injectable()
export class MajorService {
  constructor(private readonly majorRepository: MajorRepository) {}

  findAllMajors() {
    return this.majorRepository.find();
  }

  findOneMajor(options: FindOneOptions<UserMajor>): Promise<UserMajor> {
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
