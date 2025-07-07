import { PickType } from '@nestjs/swagger';

import { ClubApplicationFormDto } from '@src/apis/club-application-form/dto/club-application-form.dto';

export class CreateClubApplicationFormDto extends PickType(
  ClubApplicationFormDto,
  ['customQuestion', 'startsAt', 'endsAt'] as const,
) {
  constructor(
    createClubApplicationFormDto: Partial<
      Omit<CreateClubApplicationFormDto, 'commonQuestion'>
    > = {},
  ) {
    super();

    Object.assign(this, createClubApplicationFormDto);
  }
}
