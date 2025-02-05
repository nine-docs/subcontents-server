import { Module } from '@nestjs/common';
import { ReplyController } from './reply.controller';
import { ReplyService } from './reply.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilModule } from 'src/utils/util.module';

@Module({
  imports: [UtilModule],
  controllers: [ReplyController],
  providers: [ReplyService, PrismaService],
})
export class ReplyModule {}
