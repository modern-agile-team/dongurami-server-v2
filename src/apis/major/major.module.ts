import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@src/core/type-orm/type-orm-ex.module';
import { MajorController } from './controllers/major.controller';
import { MajorRepository } from './repositories/major.repository';
import { MajorService } from './services/major.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([MajorRepository])],
  controllers: [MajorController],
  providers: [MajorService],
})
export class MajorModule {}
