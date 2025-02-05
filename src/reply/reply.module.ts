import { Module } from '@nestjs/common';
import { ReplyController } from './reply.controller';
import { ReplyService } from './reply.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ReplyController],
  providers: [ReplyService, PrismaService],
})
export class ReplyModule {}
