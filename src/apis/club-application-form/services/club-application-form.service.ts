import { Injectable } from '@nestjs/common';

import { ClubApplicationFormDto } from '@src/apis/club-application-form/dto/club-application-form.dto';
import { CreateClubApplicationFormDto } from '@src/apis/club-application-form/dto/create-club-application-form.dto';
import { ClubApplicationFormRepository } from '@src/apis/club-application-form/repositories/club-application-form.repository';
import { SortOrder } from '@src/constants/enum';

@Injectable()
export class ClubApplicationFormService {
  constructor(
    private readonly clubApplicationFormRepository: ClubApplicationFormRepository,
  ) {}

  async create(
    clubId: number,
    createClubApplicationFormDto: CreateClubApplicationFormDto,
  ): Promise<ClubApplicationFormDto> {
    const newClubApplication = this.clubApplicationFormRepository.create({
      clubId,
      ...createClubApplicationFormDto,
    });

    await this.clubApplicationFormRepository.save(newClubApplication);

    return new ClubApplicationFormDto(newClubApplication);
  }

  async findLatestByClubId(
    clubId: number,
  ): Promise<ClubApplicationFormDto | undefined> {
    const clubApplicationForm =
      await this.clubApplicationFormRepository.findOne({
        where: {
          clubId,
        },
        order: {
          id: SortOrder.Desc,
        },
      });

    if (clubApplicationForm === null) {
      return;
    }

    return new ClubApplicationFormDto(clubApplicationForm);
  }
}
