import { ApiProperty } from '@nestjs/swagger';

import { IsIn } from 'class-validator';

import { ClubApplicationStatus } from '@src/apis/club-applications/constants/club-application.enum';
import { CreateClubApplicationDto } from '@src/apis/club-applications/dto/create-club-application.dto';

export class UpdateClubApplicationStatusDto
  implements Partial<CreateClubApplicationDto>
{
  @ApiProperty({
    description: '지원서 상태',
    enum: [ClubApplicationStatus.Accept, ClubApplicationStatus.Reject],
    enumName: 'UpdateStatusClubApplicationStatusEnum',
  })
  @IsIn([ClubApplicationStatus.Accept, ClubApplicationStatus.Reject])
  status: ClubApplicationStatus.Accept | ClubApplicationStatus.Reject;
}
