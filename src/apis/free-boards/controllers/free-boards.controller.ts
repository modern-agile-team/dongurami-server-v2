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
import { FreeBoardsService } from '../services/free-board.service';

@Controller('free-boards')
export class FreeBoardsController {
  constructor(private readonly freeBoardService: FreeBoardsService) {}

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
