import { PartialType } from '@nestjs/swagger';
import { CreateFreeBoardDto } from './create-free-board.dto';

export class UpdateFreeBoardDto extends PartialType(CreateFreeBoardDto) {}
