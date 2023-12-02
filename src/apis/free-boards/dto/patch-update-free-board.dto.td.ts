import { PartialType } from '@nestjs/swagger';
import { CreateFreeBoardDto } from './create-free-board.dto';

export class PatchUpdateFreeBoardDto extends PartialType(CreateFreeBoardDto) {}
