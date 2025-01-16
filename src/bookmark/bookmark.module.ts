import { Module } from '@nestjs/common';
import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';

@Module({
  controllers: [BookmarkController], // 컨트롤러 등록
  providers: [BookmarkService], // 서비스 등록
})
export class BookmarkModule {}
