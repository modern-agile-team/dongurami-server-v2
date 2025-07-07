import { Injectable } from '@nestjs/common';

import { getTsid } from 'tsid-ts';
import { IsNull } from 'typeorm';

import { ClubApplicationFormService } from '@src/apis/club-application-form/services/club-application-form.service';
import { ClubApplicationStatus } from '@src/apis/club-applications/constants/club-application.enum';
import { ClubApplicationAnswerItemDto } from '@src/apis/club-applications/dto/club-application-answer-item.dto';
import { ClubApplicationDto } from '@src/apis/club-applications/dto/club-application.dto';
import { ClubApplicationsItemDto } from '@src/apis/club-applications/dto/club-applications-item.dto';
import { CreateClubApplicationDto } from '@src/apis/club-applications/dto/create-club-application.dto';
import { FindClubApplicationListQueryDto } from '@src/apis/club-applications/dto/find-club-application-list-query.dto';
import { PatchUpdateClubApplicationDto } from '@src/apis/club-applications/dto/patch-update-club-application.dto';
import { ClubApplicationRepository } from '@src/apis/club-applications/repositories/club-application.repository';
import { ClubMembersService } from '@src/apis/club-members/services/club-members.service';
import { CLUB_APPLICATION_ERROR_CODE } from '@src/constants/error/club-application/club-application-error-code.constant';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { QueryHelper } from '@src/helpers/query.helper';
import { HttpBadRequestException } from '@src/http-exceptions/exceptions/http-bad-request.exception';
import { HttpConflictException } from '@src/http-exceptions/exceptions/http-conflict.exception';
import { HttpForbiddenException } from '@src/http-exceptions/exceptions/http-forbidden.exception';
import { HttpNotFoundException } from '@src/http-exceptions/exceptions/http-not-found.exception';

@Injectable()
export class ClubApplicationsService {
  constructor(
    private readonly clubApplicationFormService: ClubApplicationFormService,
    private readonly clubMembersService: ClubMembersService,

    private readonly clubApplicationRepository: ClubApplicationRepository,

    private readonly queryHelper: QueryHelper,
  ) {}

  async create(
    createClubApplicationDto: CreateClubApplicationDto,
  ): Promise<ClubApplicationDto> {
    const {
      userId,
      clubId,
      answers: userAnswers,
      status,
    } = createClubApplicationDto;

    const isAlreadyMember = await this.clubMembersService.isExistClubMember(
      clubId,
      userId,
    );

    if (isAlreadyMember) {
      throw new HttpConflictException({
        code: CLUB_APPLICATION_ERROR_CODE.ALREADY_CLUB_MEMBER,
      });
    }

    const existUserApplication = await this.clubApplicationRepository.findOne({
      select: {
        status: true,
      },
      where: {
        userId,
      },
    });

    if (existUserApplication !== null && !existUserApplication.isProcessed()) {
      throw new HttpConflictException({
        code: CLUB_APPLICATION_ERROR_CODE.PROCESSING_APPLICATION,
      });
    }

    const latestApplicationForm =
      await this.clubApplicationFormService.findLatestByClubId(clubId);

    const isActiveApplicationForm =
      this.clubApplicationFormService.isActivePeriod(new Date(), {
        startsAt: latestApplicationForm.startsAt,
        endsAt: latestApplicationForm.endsAt,
      });

    if (!isActiveApplicationForm) {
      throw new HttpBadRequestException({
        code: CLUB_APPLICATION_ERROR_CODE.NOT_APPLICATION_PERIOD,
      });
    }

    const questions = [
      ...latestApplicationForm.commonQuestion,
      ...latestApplicationForm.customQuestion,
    ];

    if (
      JSON.stringify(questions.map((q) => q.id)) !==
      JSON.stringify(userAnswers.map((a) => a.questionId))
    ) {
      throw new HttpBadRequestException({
        code: CLUB_APPLICATION_ERROR_CODE.INVALID_APPLICATION_FORM,
      });
    }

    const answers: ClubApplicationAnswerItemDto[] = questions.map(
      (question) => {
        const answer = userAnswers.find(
          (answer) => answer.questionId === question.id,
        );

        return {
          id: question.id,
          question: question.question,
          inputType: question.inputType,
          isRequired: question.isRequired,
          allowValues: question.allowValues,
          answer: answer.answer,
        };
      },
    );

    answers.forEach((answer) => {
      if (answer.isRequired === true && answer.answer === undefined) {
        throw new HttpBadRequestException({
          code: CLUB_APPLICATION_ERROR_CODE.MISSING_REQUIRED_QUESTION,
        });
      }

      if (
        answer.allowValues !== undefined &&
        !answer.allowValues.includes(answer.answer)
      ) {
        throw new HttpBadRequestException({
          code: CLUB_APPLICATION_ERROR_CODE.NOT_ALLOWED_ANSWER,
        });
      }
    });

    const newClubApplication = this.clubApplicationRepository.create({
      id: getTsid().toBigInt().toString(),
      clubId,
      userId,
      answers,
      status,
    });

    await this.clubApplicationRepository.save(newClubApplication);

    return new ClubApplicationDto({ ...newClubApplication });
  }

  async findAllAndCount(
    findClubApplicationListQueryDto: FindClubApplicationListQueryDto,
  ): Promise<[ClubApplicationsItemDto[], number]> {
    const { page, pageSize, order, ...filter } =
      findClubApplicationListQueryDto;

    const where = this.queryHelper.buildWherePropForFind(filter);

    return this.clubApplicationRepository.findAndCount({
      select: {
        id: true,
        clubId: true,
        userId: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      where: {
        ...where,
        deletedAt: IsNull(),
      },
      order,
      skip: page * pageSize,
      take: pageSize,
      relations: {
        user: true,
      },
    });
  }

  async findOne(
    applicationId: string,
  ): Promise<ClubApplicationDto | undefined> {
    const clubApplication = await this.clubApplicationRepository.findOneBy({
      id: applicationId,
      deletedAt: IsNull(),
    });

    if (!clubApplication) {
      return;
    }

    return new ClubApplicationDto(clubApplication);
  }

  async isExistOrNotFOund(applicationId: string): Promise<true> {
    const isExist = await this.clubApplicationRepository.exist({
      where: {
        id: applicationId,
        deletedAt: IsNull(),
      },
    });

    if (!isExist) {
      throw new HttpNotFoundException({
        code: COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      });
    }

    return isExist;
  }

  async patchUpdate(
    userId: string,
    applicationId: string,
    patchUpdateClubApplicationDto: PatchUpdateClubApplicationDto,
  ): Promise<ClubApplicationDto> {
    const application = await this.clubApplicationRepository.findOneBy({
      id: applicationId,
      deletedAt: IsNull(),
    });

    if (!application) {
      throw new HttpNotFoundException({
        code: COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      });
    }

    if (application.isProcessed()) {
      throw new HttpBadRequestException({
        code: CLUB_APPLICATION_ERROR_CODE.PROCESSED_APPLICATION,
      });
    }

    if (application.userId !== userId) {
      throw new HttpForbiddenException({
        code: COMMON_ERROR_CODE.PERMISSION_DENIED,
      });
    }

    const { answers: userAnswers } = patchUpdateClubApplicationDto;

    if (!userAnswers) {
      return application;
    }

    const latestApplicationForm =
      await this.clubApplicationFormService.findLatestByClubId(
        application.clubId,
      );

    const questions = [
      ...latestApplicationForm.commonQuestion,
      ...latestApplicationForm.customQuestion,
    ];

    if (
      JSON.stringify(questions.map((q) => q.id)) !==
      JSON.stringify(userAnswers.map((a) => a.questionId))
    ) {
      throw new HttpBadRequestException({
        code: CLUB_APPLICATION_ERROR_CODE.INVALID_APPLICATION_FORM,
      });
    }

    const newAnswers: ClubApplicationAnswerItemDto[] = questions.map(
      (question) => {
        const answer = userAnswers.find(
          (answer) => answer.questionId === question.id,
        );

        return {
          id: question.id,
          question: question.question,
          inputType: question.inputType,
          isRequired: question.isRequired,
          allowValues: question.allowValues,
          answer: answer.answer,
        };
      },
    );

    newAnswers.forEach((answer) => {
      if (answer.isRequired === true && answer.answer === undefined) {
        throw new HttpBadRequestException({
          code: CLUB_APPLICATION_ERROR_CODE.MISSING_REQUIRED_QUESTION,
        });
      }

      if (
        answer.allowValues !== undefined &&
        !answer.allowValues.includes(answer.answer)
      ) {
        throw new HttpBadRequestException({
          code: CLUB_APPLICATION_ERROR_CODE.NOT_ALLOWED_ANSWER,
        });
      }
    });

    await this.clubApplicationRepository.update(
      {
        id: applicationId,
      },
      {
        answers: newAnswers,
      },
    );

    return new ClubApplicationDto({
      ...application,
      answers: newAnswers,
    });
  }

  async updateStatus(
    applicationId: string,
    status: ClubApplicationStatus,
  ): Promise<ClubApplicationDto> {
    const application = await this.clubApplicationRepository.findOneBy({
      id: applicationId,
      deletedAt: IsNull(),
    });

    if (!application) {
      throw new HttpNotFoundException({
        code: COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      });
    }

    if (application.isProcessed()) {
      throw new HttpBadRequestException({
        code: CLUB_APPLICATION_ERROR_CODE.PROCESSED_APPLICATION,
      });
    }

    if (status === ClubApplicationStatus.Viewed) {
      application.view();
    }

    if (status === ClubApplicationStatus.Accept) {
      application.accept();
    }

    if (status === ClubApplicationStatus.Reject) {
      application.reject();
    }

    await this.clubApplicationRepository.update(
      {
        id: applicationId,
      },
      application,
    );

    return new ClubApplicationDto(application);
  }
}
