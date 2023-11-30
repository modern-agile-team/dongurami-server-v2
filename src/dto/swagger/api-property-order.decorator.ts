import { applyDecorators } from '@nestjs/common';
import { ApiPropertyOptional } from '@nestjs/swagger';

export const ApiPropertyOrder = (
  allowFields: readonly string[],
): PropertyDecorator => {
  return applyDecorators(
    ApiPropertyOptional({
      description:
        '정렬 필드<br>' +
        'csv 형태로 보내야합니다.<br>' +
        '- 가 붙으면 내림차순 - 가 붙지 않으면 오름차순<br>' +
        '허용된 filed: ' +
        allowFields.join(' '),
      example: '-id,updatedAt',
      default: 'id',
      format: 'csv',
      type: () => String,
    }),
  );
};
