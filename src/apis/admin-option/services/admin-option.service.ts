import { BadRequestException, Injectable } from '@nestjs/common';
import { UserTokenDto } from '../dto/user-token.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Clubs } from 'src/output/entities/Clubs.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminOptionService {
  constructor(
    @InjectRepository(Clubs)
    private clubsRepository: Repository<Clubs>,
  ) {}
  async checkClubAdmin(clubId: number, user: UserTokenDto) {
    const leader = await this.findLeaderByClubId(clubId);
    if (leader[0].id !== user.id) {
      throw new BadRequestException('회장만 접근이 가능합니다.');
    }
    return { success: true, msg: '권한 있음', status: 200 };
  }

  async findLeaderByClubId(clubId: number) {
    return this.clubsRepository.find({
      select: { leaderId: true },
      where: { id: clubId },
      relations: ['leader'],
    });
  }
}
