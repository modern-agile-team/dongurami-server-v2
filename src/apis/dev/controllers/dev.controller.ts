import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('_dev')
@Controller('dev')
export class DevController {
  constructor() {}
}
