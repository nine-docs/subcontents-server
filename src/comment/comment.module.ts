import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilModule } from 'src/utils/util.module';

@Module({
  imports: [UtilModule],
  providers: [CommentService, PrismaService],
  controllers: [CommentController],
})
export class CommentModule {}
