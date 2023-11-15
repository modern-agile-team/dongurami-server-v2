import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import 'dotenv/config';
import { Answers } from 'src/output/entities/Answers.entity';
import { Applicants } from 'src/output/entities/Applicants.entity';
import { BoardCategories } from 'src/output/entities/BoardCategories.entity';
import { BoardEmotions } from 'src/output/entities/BoardEmotions.entity';
import { Boards } from 'src/output/entities/Boards.entity';
import { Clubs } from 'src/output/entities/Clubs.entity';
import { CommentEmotions } from 'src/output/entities/CommentEmotions.entity';
import { Comments } from 'src/output/entities/Comments.entity';
import { Images } from 'src/output/entities/Images.entity';
import { Letters } from 'src/output/entities/Letters.entity';
import { Members } from 'src/output/entities/Members.entity';
import { NotificationCategories } from 'src/output/entities/NotificationCategories.entity';
import { Notifications } from 'src/output/entities/Notifications.entity';
import { Questions } from 'src/output/entities/Questions.entity';
import { ReplyCommentEmotions } from 'src/output/entities/ReplyCommentEmotions.entity';
import { Reviews } from 'src/output/entities/Reviews.entity';
import { Schedules } from 'src/output/entities/Schedules.entity';
import { Scraps } from 'src/output/entities/Scraps.entity';
import { SnsInfo } from 'src/output/entities/SnsInfo.entity';
import { Students } from 'src/output/entities/Students.entity';

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'mariadb',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  // autoLoadEntities: true,
  entities: [
    Answers,
    Applicants,
    BoardCategories,
    BoardEmotions,
    Boards,
    Clubs,
    Comments,
    CommentEmotions,
    Images,
    Letters,
    Members,
    Notifications,
    NotificationCategories,
    Questions,
    ReplyCommentEmotions,
    Reviews,
    Schedules,
    Scraps,
    SnsInfo,
    Students,
  ],
  // entities: ['../output/entities/*.entity.ts'],
  synchronize: true,
  logging: true,
};
