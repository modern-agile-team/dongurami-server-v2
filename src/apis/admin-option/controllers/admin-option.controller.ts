import { Body, Controller, Delete, Get, Headers, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { AdminOptionService } from '../services/admin-option.service';
import { FindOneByClubNumBodyDto, UserTokenDto } from '../dto/find-one-by-club-num.dto';
import { User } from 'src/common/get-request.decorator';

@Controller('admin-option')
export class AdminOptionController {
    constructor(private adminOptionService: AdminOptionService) {}
    
    @Get('/:clubId')
    async findOneByClubNum(@Param('clubId', ParseIntPipe) clubNum: number, @User()user: UserTokenDto) {
        const isAdmin = await this.adminOptionService.checkClubAdmin(user);
    }

    @Post('/')
    async checkLeaderAdmin() {

    }

    @Put()
    async c

    @Put()

    @Delete()



}
