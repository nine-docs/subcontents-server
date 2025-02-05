import { Module } from '@nestjs/common';
import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilModule } from 'src/utils/util.module';

@Module({
  imports: [UtilModule],
  controllers: [BookmarkController],
  providers: [BookmarkService, PrismaService],
})
export class BookmarkModule {}
