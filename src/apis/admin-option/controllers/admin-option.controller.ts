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
import { UserTokenDto } from '../dto/find-one-by-club-num.dto';
import { User } from 'src/common/get-request.decorator';

@Controller('admin-option')
export class AdminOptionController {
  constructor(private adminOptionService: AdminOptionService) {}

  @Get('/:clubId')
  async findOneByClubNum(
    @User() user: UserTokenDto,
    @Param('clubId', ParseIntPipe) clubId: number,
  ) {
    return user;
    // const isAdmin = await this.adminOptionService.checkClubAdmin(user, clubId);
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
