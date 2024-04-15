import { Injectable } from '@nestjs/common';

import { ClubApplicationFormDto } from '@src/apis/club-application-form/dto/club-application-form.dto';
import { CreateClubApplicationFormDto } from '@src/apis/club-application-form/dto/create-club-application-form.dto';
import { PutUpdateClubApplicationFormDto } from '@src/apis/club-application-form/dto/put-update-club-application-form.dto';
import { ClubApplicationFormRepository } from '@src/apis/club-application-form/repositories/club-application-form.repository';
import { SortOrder } from '@src/constants/enum';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { HttpNotFoundException } from '@src/http-exceptions/exceptions/http-not-found.exception';

@Injectable()
export class ClubApplicationFormService {
  constructor(
    private readonly clubApplicationFormRepository: ClubApplicationFormRepository,
  ) {}

  async create(
    clubId: number,
    userId: number,
    createClubApplicationFormDto: CreateClubApplicationFormDto,
  ): Promise<ClubApplicationFormDto> {
    const newClubApplication = this.clubApplicationFormRepository.create({
      clubId,
      userId,
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

  async putUpdate(
    userId: number,
    formId: number,
    putUpdateClubApplicationFormDto: PutUpdateClubApplicationFormDto,
  ): Promise<ClubApplicationFormDto> {
    const oldForm = await this.clubApplicationFormRepository.findOneBy({
      id: formId,
    });

    if (oldForm === null) {
      throw new HttpNotFoundException({
        code: COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      });
    }

    const newForm = this.clubApplicationFormRepository.create({
      ...oldForm,
      ...putUpdateClubApplicationFormDto,
    });

    await this.clubApplicationFormRepository.update(
      {
        id: formId,
      },
      {
        ...newForm,
        userId,
      },
    );

    return new ClubApplicationFormDto(newForm);
  }
}
