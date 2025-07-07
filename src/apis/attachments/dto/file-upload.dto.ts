import { ArrayMaxSize, ArrayMinSize } from 'class-validator';
import { IsFiles, MemoryStoredFile } from 'nestjs-form-data';

import { FILE_ARRAY_SIZE } from '@src/apis/attachments/constants/file.constant';
import { RewriteValidationOptions } from '@src/pipes/decorators/rewrite-validation-options.decorator';

@RewriteValidationOptions({ validationError: { value: false } })
export class FileUploadDto {
  @IsFiles({
    each: true,
  })
  @ArrayMinSize(FILE_ARRAY_SIZE.MIN)
  @ArrayMaxSize(FILE_ARRAY_SIZE.MAX)
  files: MemoryStoredFile[];
}
