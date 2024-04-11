import { Injectable } from '@nestjs/common';

import { ClubMemberItemDto } from '@src/apis/club-members/dto/club-member-item.dto';
import { ClubMemberRepository } from '@src/apis/club-members/repositories/club-member.repository';

@Injectable()
export class ClubMembersService {
  constructor(private readonly clubMemberRepository: ClubMemberRepository) {}

  async findAllByClubId(clubId: number): Promise<ClubMemberItemDto[]> {
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

  isExistClubMember(clubId: number, userId: number): Promise<boolean> {
    return this.clubMemberRepository.exist({
      where: {
        userId,
        clubId,
      },
    });
  }
}
