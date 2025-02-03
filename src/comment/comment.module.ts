import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [CommentService],
  controllers: [CommentController, PrismaService],
})
export class CommentModule {}
