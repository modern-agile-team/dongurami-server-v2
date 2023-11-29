import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/apis/auth/jwt/jwt.guard';
import { UserDto } from '@src/apis/users/dto/user.dto';
import { User } from '@src/decorators/user.decorator';
import { CreateFreeBoardDto } from '../dto/create-free-board.dto';
import { FreeBoardsService } from '../services/free-board.service';

@ApiTags('free-boards')
@Controller('free-boards')
export class FreeBoardsController {
  constructor(private readonly freeBoardService: FreeBoardsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @User() user: UserDto,
    @Body() createFreeBoardDto: CreateFreeBoardDto,
  ) {
    return this.freeBoardService.create(user.id, createFreeBoardDto);
  }

  // @Get()
  // findAll() {
  //   return this.freeBoardService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.freeBoardService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateFreeBoardDto: UpdateFreeBoardDto,
  // ) {
  //   return this.freeBoardService.update(+id, updateFreeBoardDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.freeBoardService.remove(+id);
  // }
}
