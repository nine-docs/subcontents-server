import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(private prismaService: PrismaService) {}

  async createComment(articleId: number, userId: number, content: string) {
    const creationResult = await this.prismaService.createComment(
      userId,
      articleId,
      content,
    );
    return {
      commentId: Number(creationResult.id),
      content: creationResult.content,
      createdAt: creationResult.created_at,
    };
  }

  async getComments(articleId: number, cursor: number, limit: number) {
    const commentList = await this.prismaService.getCommentsByCursor(
      articleId,
      cursor,
      limit,
    );
    const responseData = commentList.map((comment) => ({
      commentId: Number(comment.id),
      authorId: comment.deleted_at ? null : Number(comment.user_id),
      reply: {
        count: Number(comment.reply_count),
      },
      content: comment.deleted_at ? null : comment.content,
      createdAt: comment.created_at,
      updatedAt: comment.updated_at,
    }));
    const nextCursor =
      responseData.length > 0
        ? responseData[responseData.length - 1].commentId
        : null;
    return {
      cursor: nextCursor,
      items: responseData,
    };
  }

  async fixComment(commentId: number, userId: number, content: string) {
    if (
      !(await this.prismaService.isCommentExist(commentId)) ||
      (await this.prismaService.isSoftDeleted(commentId))
    ) {
      throw new NotFoundException(); // soft deleted된 댓글을 한번더 삭제하면 불가능
    }
    if (!(await this.prismaService.isOwnedComment(commentId, userId))) {
      throw new ForbiddenException();
    }
    const updateResult = await this.prismaService.updateComment(
      commentId,
      content,
    );
    return {
      commentId: Number(updateResult.id),
      content: updateResult.content,
      createdAt: updateResult.created_at,
      updatedAt: updateResult.updated_at,
    };
  }

  async deleteComment(commentId: number, userId: number) {
    //Hard Delete + Soft delete
    if (
      !(await this.prismaService.isCommentExist(commentId)) ||
      (await this.prismaService.isSoftDeleted(commentId))
    ) {
      throw new NotFoundException(); // soft deleted된 댓글을 한번더 삭제하면 불가능
    }
    if (!(await this.prismaService.isOwnedComment(commentId, userId))) {
      throw new ForbiddenException();
    }
    //soft delete를 고려
    //만약 reply count가 0이면 그냥 hard delete
    //0이 아니라면, soft delete

    if ((await this.prismaService.getCommentReplyCount(commentId)) <= 0) {
      //hard delete
      try {
        this.prismaService.hardDeleteComment(commentId);
      } catch (error) {
        if (error.code === 'P2025') {
          //사실 위에서 방지함 - 코멘트 존재 (하드딜리트 확인), 소프트 딜리트 확인 문장
          throw new NotFoundException(`Comment with id ${commentId} not found`);
        }
        throw error; // 다른 종류의 오류는 그대로 던짐
      }
    } else {
      if (this.prismaService.softDeleteComment(commentId) === null) {
        throw new NotFoundException(`Comment with id ${commentId} not found`);
      }
    }
  }
}
