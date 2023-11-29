import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateFreeBoardDto } from '../dto/create-free-board.dto';
import { UpdateFreeBoardDto } from '../dto/update-free-board.dto';
import { FreeBoardService } from '../free-board.service';

@Controller('free-board')
export class FreeBoardController {
  constructor(private readonly freeBoardService: FreeBoardService) {}

  @Post()
  create(@Body() createFreeBoardDto: CreateFreeBoardDto) {
    return this.freeBoardService.create(createFreeBoardDto);
  }

  @Get()
  findAll() {
    return this.freeBoardService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.freeBoardService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFreeBoardDto: UpdateFreeBoardDto,
  ) {
    return this.freeBoardService.update(+id, updateFreeBoardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.freeBoardService.remove(+id);
  }
}
