import { Module } from '@nestjs/common';
import { AdminOptionModule } from './apis/admin-option/admin-option.module';
import { ApplicationModule } from './apis/application/application.module';
import { BoardModule } from './apis/board/board.module';
import { ClubBoardModule } from './apis/club-board/club-board.module';
import { ClubListModule } from './apis/club-list/club-list.module';
import { CommentModule } from './apis/comment/comment.module';
import { EmotionModule } from './apis/emotion/emotion.module';
import { HomeModule } from './apis/home/home.module';
import { ImageModule } from './apis/image/image.module';
import { LetterModule } from './apis/letter/letter.module';
import { MyPageModule } from './apis/my-page/my-page.module';
import { NaverModule } from './apis/naver/naver.module';
import { NotificationModule } from './apis/notification/notification.module';
import { ProfileModule } from './apis/profile/profile.module';
import { ReviewModule } from './apis/review/review.module';
import { RootModule } from './apis/root/root.module';
import { S3Module } from './apis/s3/s3.module';
import { ScheduleModule } from './apis/schedule/schedule.module';
import { SearchModule } from './apis/search/search.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './core/app-config/app-config.module';

@Module({
  imports: [
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
    AppConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
