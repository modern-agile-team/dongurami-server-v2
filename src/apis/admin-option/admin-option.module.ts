import { Module } from '@nestjs/common';
import { AdminOptionController } from './controllers/admin-option.controller';
import { AdminOptionService } from './services/admin-option.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clubs } from 'src/output/entities/Clubs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Clubs])],
  controllers: [AdminOptionController],
  providers: [AdminOptionService],
})
export class AdminOptionModule {}
