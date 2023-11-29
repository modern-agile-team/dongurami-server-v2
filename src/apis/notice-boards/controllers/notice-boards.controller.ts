import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';

@Controller('notice-boards')
export class NoticeBoardsController {
  @Post()
  create() {}

  @Get()
  findAll() {}

  @Get(':id')
  findOne() {}

  @Patch(':id')
  update() {}

  @Delete(':id')
  remove() {}
}
