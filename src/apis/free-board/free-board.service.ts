import { Injectable } from '@nestjs/common';
import { CreateFreeBoardDto } from './dto/create-free-board.dto';
import { UpdateFreeBoardDto } from './dto/update-free-board.dto';

@Injectable()
export class FreeBoardService {
  create(createFreeBoardDto: CreateFreeBoardDto) {
    return 'This action adds a new freeBoard';
  }

  findAll() {
    return `This action returns all freeBoard`;
  }

  findOne(id: number) {
    return `This action returns a #${id} freeBoard`;
  }

  update(id: number, updateFreeBoardDto: UpdateFreeBoardDto) {
    return `This action updates a #${id} freeBoard`;
  }

  remove(id: number) {
    return `This action removes a #${id} freeBoard`;
  }
}
