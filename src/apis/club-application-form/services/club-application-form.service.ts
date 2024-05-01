import { Injectable } from '@nestjs/common';

import { ClubApplicationFormDto } from '@src/apis/club-application-form/dto/club-application-form.dto';
import { CreateClubApplicationFormDto } from '@src/apis/club-application-form/dto/create-club-application-form.dto';
import { PutUpdateClubApplicationFormDto } from '@src/apis/club-application-form/dto/put-update-club-application-form.dto';
import { ClubApplicationFormRepository } from '@src/apis/club-application-form/repositories/club-application-form.repository';
import { ClubApplicationPeriod } from '@src/apis/club-application-form/types/club-application-form.type';
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

    newClubApplication.setCommonQuestion();

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

    newForm.customQuestion = newForm.customQuestion.map((q) => {
      return newForm.createQuestion(q);
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

  /**
   * entity method로 만드는게 맞지만 service레이어에서 entity가 아닌 dto를 리턴하는 구조이기 떄문에 메서드로 만듬
   */
  isActivePeriod(
    now: Date,
    clubApplicationPeriod: ClubApplicationPeriod,
  ): boolean {
    const { startsAt, endsAt } = clubApplicationPeriod;

    // 지원기간이 무제한인 경우
    if (startsAt === null && endsAt === null) {
      return true;
    }
    // 시작일시는 제한없고 마감일시는 존재하는 경우
    if (startsAt === null && endsAt !== null) {
      return now <= endsAt;
    }
    // 시작일시는 존재허고 마감일시는 존재하지 않는 경우
    if (startsAt !== null && endsAt === null) {
      return startsAt <= now;
    }
    // 시작일시, 마감일시 둘 다 존재하는 경우
    return startsAt <= now && now <= endsAt;
  }
}
