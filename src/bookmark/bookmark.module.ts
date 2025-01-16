import { Module } from '@nestjs/common';
import { BookmarkController } from './controller/bookmark.controller';
import { BookmarkService } from './service/bookmark.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaBookmarkRepository } from './repository/bookmark.repository';
import { BOOKMARK_REPOSITORY } from './repository/bookmark.repository.interface';

@Module({
  controllers: [BookmarkController],
  providers: [
    BookmarkService,
    PrismaService,
    { provide: BOOKMARK_REPOSITORY, useClass: PrismaBookmarkRepository },
  ],
})
export class BookmarkModule {}
