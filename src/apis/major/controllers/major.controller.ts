import { Body, Controller, Post } from '@nestjs/common';
import { CreateMajorRequestBodyDto } from '../dto/create-major-request-body.dto';
import { MajorDto } from '../dto/major.dto';
import { MajorService } from '../services/major.service';

@Controller()
export class MajorController {
  constructor(private readonly majorService: MajorService) {}
  @Post()
  createNewMajor(
    @Body() createMajorRequestBodyDto: CreateMajorRequestBodyDto,
  ): Promise<MajorDto> {
    return this.majorService.create(createMajorRequestBodyDto);
  }
}
