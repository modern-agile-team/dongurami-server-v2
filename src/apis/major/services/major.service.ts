import { Injectable } from '@nestjs/common';
import { CreateMajorRequestBodyDto } from '../dto/create-major-request-body.dto';
import { MajorRepository } from '../repositories/major.repository';

@Injectable()
export class MajorService {
  constructor(private readonly majorRepository: MajorRepository) {}
  create(createMajorRequestBodyDto: CreateMajorRequestBodyDto) {
    const existMajor = await this.majorRepository.findOne({
      select: { code: true, name: true },
      where: [
        { name: createMajorRequestBodyDto.name },
        createMajorRequestBodyDto.code && {
          code: createMajorRequestBodyDto.code,
        },
      ],
    });
  }
}
