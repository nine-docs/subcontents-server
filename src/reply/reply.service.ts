import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReplyService {
  constructor(private prismaService: PrismaService) {}

  async createReply(commentId: number, userId: number, content: string) {
    const creationResult = await this.prismaService.createReply(
      userId,
      commentId,
      content,
    );
    if (creationResult) {
      return {
        replyId: Number(creationResult.id),
        commentId: Number(creationResult.comment_id),
        content: creationResult.content,
        createdAt: creationResult.created_at,
      };
    } else {
      throw new InternalServerErrorException();
    }
  }

  async getReplys(commentId: number, cursor: number, limit: number) {
    const replyList = await this.prismaService.getReplysByCursor(
      commentId,
      cursor,
      limit,
    );
    const responseData = replyList.map((reply) => ({
      replyId: Number(reply.id),
      authorId: Number(reply.user_id),
      content: reply.content,
      createdAt: reply.created_at,
      updatedAt: reply.updated_at,
    }));
    const nextCursor =
      responseData.length > 0
        ? responseData[responseData.length - 1].replyId
        : null;
    return {
      cursor: nextCursor,
      items: responseData,
    };
  }

  async fixReply(replyId: number, userId: number, content: string) {
    if (!(await this.prismaService.isReplyExist(replyId))) {
      throw new NotFoundException();
    }
    if (!(await this.prismaService.isOwnedReply(replyId, userId))) {
      throw new ForbiddenException();
    }
    const updateResult = await this.prismaService.updateReply(replyId, content);
    return {
      replyId: Number(updateResult.id),
      content: updateResult.content,
      createdAt: updateResult.created_at,
      updatedAt: updateResult.updated_at,
    };
  }

  async deleteReply(replyId: number, userId: number) {
    if (!(await this.prismaService.isReplyExist(replyId))) {
      throw new NotFoundException(); // soft deleted된 댓글을 한번더 삭제하면 불가능
    }
    if (!(await this.prismaService.isOwnedReply(replyId, userId))) {
      throw new ForbiddenException();
    }
    await this.prismaService.deleteReply(replyId);
  }
}
