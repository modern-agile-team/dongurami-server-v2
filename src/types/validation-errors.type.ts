import { ApiProperty } from '@nestjs/swagger';

export class ValidationError {
  @ApiProperty({
    description: 'property name',
    example: 'id',
  })
  property: string;

  @ApiProperty({
    description: 'value',
    example: 'unknown',
  })
  value: unknown;

  @ApiProperty({
    description: 'error reason',
  })
  reason: string;
}
