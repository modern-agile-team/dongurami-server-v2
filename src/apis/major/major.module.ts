import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Major } from '@src/entities/Major';
import { MajorController } from './controllers/major.controller';
import { MajorService } from './services/major.service';
import { MajorRepository } from './repositories/major.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Major])],
  controllers: [MajorController],
  providers: [MajorService, MajorRepository],
})
export class MajorModule {}
