import { Module } from '@nestjs/common';
import { MajorService } from './services/major.service';
import { MajorRepository } from './repositories/major.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MajorController } from './controllers/major.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MajorRepository])],
  providers: [MajorService, MajorRepository],
  controllers: [MajorController],
})
export class MajorModule {}
