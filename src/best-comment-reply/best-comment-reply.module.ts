import { Module } from '@nestjs/common';
import { BestCommentReplyService } from './best-comment-reply.service';
import { BestCommentReplyController } from './best-comment-reply.controller';

@Module({
  providers: [BestCommentReplyService],
  controllers: [BestCommentReplyController]
})
export class BestCommentReplyModule {}
