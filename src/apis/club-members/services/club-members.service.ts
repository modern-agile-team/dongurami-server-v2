import { Injectable } from '@nestjs/common';

import { getTsid } from 'tsid-ts';

import { ClubMemberRole } from '@src/apis/club-members/constants/club-member.enum';
import { ClubMemberItemDto } from '@src/apis/club-members/dto/club-member-item.dto';
import { ClubMemberDto } from '@src/apis/club-members/dto/club-member.dto';
import { ClubMemberRepository } from '@src/apis/club-members/repositories/club-member.repository';
import { CLUB_MEMBER_ERROR_CODE } from '@src/constants/error/club-member/club-member-error-code.constant';
import { HttpConflictException } from '@src/http-exceptions/exceptions/http-conflict.exception';

@Injectable()
export class ClubMembersService {
  constructor(private readonly clubMemberRepository: ClubMemberRepository) {}

  async create(
    clubId: string,
    userId: string,
    roles: ClubMemberRole[],
  ): Promise<ClubMemberDto> {
    const isExistMember = await this.clubMemberRepository.exist({
      where: {
        userId,
      },
    });

    if (isExistMember) {
      throw new HttpConflictException({
        code: CLUB_MEMBER_ERROR_CODE.ALREADY_EXIST_CLUB_MEMBER,
      });
    }

    const newMember = this.clubMemberRepository.create({
      id: getTsid().toBigInt().toString(),
      clubId,
      userId,
      roles,
    });

    await this.clubMemberRepository.save(newMember);

    return this.findOneByUserId(clubId, userId);
  }

  async findAllByClubId(clubId: string): Promise<ClubMemberItemDto[]> {
    const clubMembers = await this.clubMemberRepository.find({
      where: {
        clubId,
      },
      relations: {
        user: true,
      },
    });

    return clubMembers.map((clubMember) => {
      const { id, roles, createdAt, updatedAt } = clubMember;
      const {
        majorId,
        studentNumber,
        name,
        nickname,
        email,
        phoneNumber,
        grade,
        gender,
        profilePath,
      } = clubMember.user;

      return new ClubMemberItemDto({
        id,
        roles,
        createdAt,
        updatedAt,
        majorId,
        studentNumber,
        name,
        nickname,
        email,
        phoneNumber,
        grade,
        gender,
        profilePath,
      });
    });
  }

  async findOneByUserId(
    clubId: string,
    userId: string,
  ): Promise<ClubMemberDto | undefined> {
    const clubMember = await this.clubMemberRepository.findOne({
      where: {
        clubId,
        userId,
      },
      relations: {
        user: true,
      },
    });

    if (!clubMember) {
      return;
    }

    const { id, roles, createdAt, updatedAt } = clubMember;
    const {
      majorId,
      studentNumber,
      name,
      nickname,
      email,
      phoneNumber,
      grade,
      gender,
      profilePath,
    } = clubMember.user;

    return new ClubMemberDto({
      id,
      roles,
      createdAt,
      updatedAt,
      majorId,
      studentNumber,
      name,
      nickname,
      email,
      phoneNumber,
      grade,
      gender,
      profilePath,
    });
  }

  isExistClubMember(clubId: string, userId: string): Promise<boolean> {
    return this.clubMemberRepository.exist({
      where: {
        userId,
        clubId,
      },
    });
  }
}
