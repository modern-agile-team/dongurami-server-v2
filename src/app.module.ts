import { Module } from '@nestjs/common';
import { AdminOptionModule } from '@src/apis/admin-option/admin-option.module';
import { ApiModule } from '@src/apis/api.module';
import { ApplicationModule } from '@src/apis/application/application.module';
import { BoardModule } from '@src/apis/board/board.module';
import { ClubBoardModule } from '@src/apis/club-board/club-board.module';
import { ClubListModule } from '@src/apis/club-list/club-list.module';
import { CommentModule } from '@src/apis/comment/comment.module';
import { EmotionModule } from '@src/apis/emotion/emotion.module';
import { HomeModule } from '@src/apis/home/home.module';
import { ImageModule } from '@src/apis/image/image.module';
import { LetterModule } from '@src/apis/letter/letter.module';
import { MyPageModule } from '@src/apis/my-page/my-page.module';
import { NaverModule } from '@src/apis/naver/naver.module';
import { NotificationModule } from '@src/apis/notification/notification.module';
import { ProfileModule } from '@src/apis/profile/profile.module';
import { ReviewModule } from '@src/apis/review/review.module';
import { RootModule } from '@src/apis/root/root.module';
import { S3Module } from '@src/apis/s3/s3.module';
import { ScheduleModule } from '@src/apis/schedule/schedule.module';
import { SearchModule } from '@src/apis/search/search.module';
import { AppController } from '@src/app.controller';
import { AppService } from '@src/app.service';
import { CoreModule } from '@src/core/core.module';

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
    CoreModule,
    ApiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
