import { Controller } from '@nestjs/common';

import { RootService } from '@src/apis/root/services/root.service';

@Controller()
export class RootController {
  constructor(private readonly rootService: RootService) {}
}
