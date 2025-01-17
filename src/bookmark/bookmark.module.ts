import { Module } from '@nestjs/common';
import { BookmarkController } from './controller/bookmark.controller';
import { BookmarkService } from './service/bookmark.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [BookmarkController],
  providers: [BookmarkService, PrismaService],
})
export class BookmarkModule {}
