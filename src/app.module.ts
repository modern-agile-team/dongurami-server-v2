import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AdminOptionModule } from './admin-option/admin-option.module';
import { ApplicationModule } from './application/application.module';
import { BoardModule } from './board/board.module';
import { ClubBoardModule } from './club-board/club-board.module';
import { ClubListModule } from './club-list/club-list.module';
import { CommentModule } from './comment/comment.module';
import { EmotionModule } from './emotion/emotion.module';
import { HomeModule } from './home/home.module';
import { ImageModule } from './image/image.module';
import { LetterModule } from './letter/letter.module';
import { MyPageModule } from './my-page/my-page.module';
import { NaverModule } from './naver/naver.module';
import { NotificationModule } from './notification/notification.module';
import { ProfileModule } from './profile/profile.module';
import { ReviewModule } from './review/review.module';
import { RootModule } from './root/root.module';
import { S3Module } from './s3/s3.module';
import { ScheduleModule } from './schedule/schedule.module';
import { SearchModule } from './search/search.module';
import { typeORMConfig } from './config/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(typeORMConfig),
    AdminOptionModule,
    ApplicationModule,
    BoardModule,
    ClubBoardModule,
    ClubListModule,
    CommentModule,
    EmotionModule,
    HomeModule,
    ImageModule,
    LetterModule,
    MyPageModule,
    NaverModule,
    NotificationModule,
    ProfileModule,
    ReviewModule,
    RootModule,
    S3Module,
    ScheduleModule,
    SearchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
