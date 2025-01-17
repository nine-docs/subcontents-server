import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { BookmarkModule } from './bookmark/bookmark.module';
import { APP_PIPE } from '@nestjs/core'; // APP_PIPE import

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [],
      isGlobal: true, // 전역 모듈로 사용
    }),
    BookmarkModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
