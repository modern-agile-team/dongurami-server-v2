import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateMajorRequestBodyDto } from '../dto/create-major-request-body.dto';
import { MajorDto } from '../dto/major.dto';
import { MajorService } from '../services/major.service';

@Controller('major')
export class MajorController {
  constructor(private readonly majorService: MajorService) {}

  // @Get()
  @Post()
  createNewMajor(
    @Body() createMajorRequestBodyDto: CreateMajorRequestBodyDto,
  ): Promise<{ major: MajorDto }> {
    return this.majorService.create(createMajorRequestBodyDto);
  }
}
