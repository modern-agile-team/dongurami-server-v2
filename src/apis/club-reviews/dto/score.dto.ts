import { ApiProperty } from '@nestjs/swagger';

export class ScoreDto {
  @ApiProperty({
    description: '별점 5의 개수',
    format: 'integer',
  })
  five: number;

  @ApiProperty({
    description: '별점 4의 개수',
    format: 'integer',
  })
  four: number;

  @ApiProperty({
    description: '별점 3의 개수',
    format: 'integer',
  })
  three: number;

  @ApiProperty({
    description: '별점 2의 개수',
    format: 'integer',
  })
  two: number;

  @ApiProperty({
    description: '별점 1의 개수',
    format: 'integer',
  })
  one: number;

  @ApiProperty({
    description: '별점의 평균 값',
    format: 'float',
  })
  average: number;

  constructor(scoreDto: Partial<ScoreDto> = {}) {
    Object.assign(this, scoreDto);
  }
}
