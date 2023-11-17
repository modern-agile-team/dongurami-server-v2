import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { AdminOptionService } from '../services/admin-option.service';
import { UserTokenDto } from '../dto/user-token.dto';
import { User } from 'src/common/get-request.decorator';
import { ClubJoinCheck } from '../middlewares/club-join-check';

@Controller('admin-option')
export class AdminOptionController {
  constructor(private adminOptionService: AdminOptionService) {}

  @Get('/:clubId')
  async findOneByClubNum(
    @User() user: UserTokenDto,
    @Param('clubId', ParseIntPipe) clubId: number,
  ) {
    ClubJoinCheck(clubId, user);
    const isAdmin = await this.adminOptionService.checkClubAdmin(clubId, user);

    return '성공';
  }

  @Post('/')
  async checkLeaderAdmin() {
    console.log('a');
  }

  // @Put()
  // async

  // @Put()

  // @Delete()
}
