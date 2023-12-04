import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/apis/auth/jwt/jwt.guard';
import { ApiFreeBoard } from '@src/apis/free-boards/controllers/free-board.swagger';
import { FindFreeBoardListQueryDto } from '@src/apis/free-boards/dto/find-free-board-list-query.dto';
import { FreeBoardDto } from '@src/apis/free-boards/dto/free-board.dto';
import { FreeBoardsItemDto } from '@src/apis/free-boards/dto/free-boards-item.dto';
import { PatchUpdateFreeBoardDto } from '@src/apis/free-boards/dto/patch-update-free-board.dto.td';
import { PutUpdateFreeBoardDto } from '@src/apis/free-boards/dto/put-update-free-board.dto';
import { UserDto } from '@src/apis/users/dto/user.dto';
import { User } from '@src/decorators/user.decorator';
import { ResponseType } from '@src/interceptors/success-interceptor/constants/success-interceptor.enum';
import { SetResponse } from '@src/interceptors/success-interceptor/decorators/success-response.decorator';
import { ParsePositiveIntPipe } from '@src/pipes/parse-positive-int.pipe';
import { plainToInstance } from 'class-transformer';
import { CreateFreeBoardDto } from '../dto/create-free-board.dto';
import { FreeBoardsService } from '../services/free-board.service';

/**
 * @todo soft delete 로 변경
 */
@ApiTags('free-boards')
@Controller('free-boards')
export class FreeBoardsController {
  constructor(private readonly freeBoardService: FreeBoardsService) {}

  @ApiFreeBoard.Create({ summary: '자유 게시글 생성' })
  @UseGuards(JwtAuthGuard)
  @SetResponse({ key: 'freeBoard', type: ResponseType.Detail })
  @Post()
  create(
    @User() user: UserDto,
    @Body() createFreeBoardDto: CreateFreeBoardDto,
  ) {
    return this.freeBoardService.create(user.id, createFreeBoardDto);
  }

  @ApiFreeBoard.FindAllAndCount({ summary: '자유 게시글 전체조회(pagination)' })
  @SetResponse({ type: ResponseType.Pagination, key: 'freeBoards' })
  @Get()
  async findAllAndCount(
    @Query() findFreeBoardListQueryDto: FindFreeBoardListQueryDto,
  ): Promise<[FreeBoardsItemDto[], number]> {
    const [freeBoards, count] = await this.freeBoardService.findAllAndCount(
      findFreeBoardListQueryDto,
    );

    return [plainToInstance(FreeBoardsItemDto, freeBoards), count];
  }

  @ApiFreeBoard.FindOneOrNotFound({ summary: '자유게시글 상세조회' })
  @SetResponse({ type: ResponseType.Detail, key: 'freeBoard' })
  @Get(':freeBoardId')
  findOneOrNotFound(
    @Param('freeBoardId', ParsePositiveIntPipe) freeBoardId: number,
  ): Promise<FreeBoardDto> {
    return this.freeBoardService.findOneOrNotFound(freeBoardId);
  }

  @ApiFreeBoard.PutUpdate({ summary: '자유게시글 수정' })
  @SetResponse({ type: ResponseType.Detail, key: 'freeBoard' })
  @UseGuards(JwtAuthGuard)
  @Put(':freeBoardId')
  putUpdate(
    @User() user: UserDto,
    @Param('freeBoardId', ParsePositiveIntPipe) freeBoardId: number,
    @Body() putUpdateFreeBoardDto: PutUpdateFreeBoardDto,
  ): Promise<FreeBoardDto> {
    return this.freeBoardService.putUpdate(
      user.id,
      freeBoardId,
      putUpdateFreeBoardDto,
    );
  }

  @ApiFreeBoard.PatchUpdate({ summary: '자유게시글 부분 수정' })
  @UseGuards(JwtAuthGuard)
  @SetResponse({ type: ResponseType.Detail, key: 'freeBoard' })
  @Patch(':freeBoardId')
  patchUpdate(
    @User() user: UserDto,
    @Param('freeBoardId', ParsePositiveIntPipe) freeBoardId: number,
    @Body() patchUpdateFreeBoardDto: PatchUpdateFreeBoardDto,
  ): Promise<FreeBoardDto> {
    return this.freeBoardService.patchUpdate(
      user.id,
      freeBoardId,
      patchUpdateFreeBoardDto,
    );
  }

  /**
   * 테이블 참조 때문에 삭제 불가 개선 예정
   */
  @ApiFreeBoard.Remove({
    summary:
      '자유게시글 삭제 (현재 내부 사정으로 서버에러가 무조건적으로 발생합니다.',
    deprecated: true,
  })
  @SetResponse({ type: ResponseType.Delete })
  @UseGuards(JwtAuthGuard)
  @Delete(':freeBoardId')
  remove(
    @User() user: UserDto,
    @Param('freeBoardId') freeBoardId: number,
  ): Promise<number> {
    return this.freeBoardService.remove(user.id, freeBoardId);
  }
}
