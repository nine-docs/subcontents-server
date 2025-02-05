import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  NotFoundException,
} from '@nestjs/common';
import { Bookmark, Comment, Prisma, PrismaClient, Reply } from '@prisma/client';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  public prisma: PrismaClient; // public으로 변경 (리포지토리에서 사용하기 위함)

  constructor() {
    this.prisma = new PrismaClient();
  }

  async onModuleInit() {
    await this.prisma.$connect();
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }

  //Bookmark
  // 북마크 생성 메서드
  async createBookmark(userId: number, articleId: number): Promise<Bookmark> {
    return await this.prisma.bookmark.create({
      data: { user_id: userId, article_id: articleId },
    });
  }

  // 소유한 북마크 목록 반환
  async findOwnBookmarks(userId: number): Promise<Bookmark[]> {
    return await this.prisma.bookmark.findMany({ where: { user_id: userId } });
  }

  async isBookmark(userId: number, articleId: number): Promise<Bookmark> {
    const data = await this.prisma.bookmark.findFirst({
      where: { user_id: userId, article_id: articleId },
    });
    return data;
  }

  // 북마크의 소유자를 확인
  async isOwnedBookmark(userId: number, bookmarkId: number): Promise<boolean> {
    const dataCount = await this.prisma.bookmark.count({
      where: { user_id: userId, id: bookmarkId },
    });
    return dataCount > 0;
  }

  // 해당 북마크가 존재하는지 확인
  async isBookmarkExist(bookmarkId: number): Promise<boolean> {
    const dataCount = await this.prisma.bookmark.count({
      where: { id: bookmarkId },
    });
    return dataCount > 0;
  }

  // 북마크 삭제
  async deleteBookmark(id: number): Promise<Prisma.BatchPayload> {
    return await this.prisma.bookmark.deleteMany({
      where: { id: id },
    });
  }

  //Comment

  //Comment 생성
  async createComment(
    userId: number,
    articleId: number,
    content: string,
  ): Promise<Comment> {
    return await this.prisma.comment.create({
      data: { user_id: userId, article_id: articleId, content: content },
    });
  }

  // 댓글 리스트 반환 (페이지네이션)
  async getCommentsByCursor(
    articleId: number,
    cursor: number,
    limit: number,
  ): Promise<Comment[]> {
    // created 순이 아닌, pkey 순서대로.
    const where = {
      article_id: articleId,
      ...(cursor && { id: { gt: cursor } }), // cursor가 있는 경우, id가 cursor보다 큰 데이터만 조회
    };
    return await this.prisma.comment.findMany({
      where,
      take: limit, // limit 개수만큼 조회
      orderBy: { id: 'asc' }, // id 기준으로 오름차순 정렬 (cursor 기반 페이지네이션에 필수)
    });
  }

  //해당 댓글의 답글개수 확인
  async getCommentReplyCount(commentId: number): Promise<number> {
    return Number(
      (await this.prisma.comment.findUnique({ where: { id: commentId } }))
        .reply_count,
    );
  }

  async isOwnedComment(commentId: number, userId: number): Promise<boolean> {
    const dataCount = await this.prisma.comment.count({
      where: { user_id: userId, id: commentId },
    });
    return dataCount > 0;
  }

  async updateComment(commentId: number, content: string) {
    return await this.prisma.comment.update({
      where: { id: commentId }, // id를 기준으로 댓글 검색
      data: { content: content }, // 수정할 내용
    });
  }

  async hardDeleteComment(commentId: number): Promise<Object> {
    //진짜로 제거
    return await this.prisma.comment.delete({
      where: { id: commentId },
    });
  }

  async softDeleteComment(commentId: number) {
    return await this.prisma.comment.update({
      where: { id: commentId },
      data: { deleted_at: new Date() },
    });
  }

  async isSoftDeleted(commentId: number): Promise<boolean> {
    if (
      (await this.prisma.comment.findUnique({ where: { id: commentId } }))
        .deleted_at === null
    )
      return false;
    else return true;
  }

  async isCommentExist(commentId: number): Promise<boolean> {
    if ((await this.prisma.comment.count({ where: { id: commentId } })) > 0)
      return true; // 해당 댓글이 존재하면 true 반환
    else return false;
  }

  //Reply
  async createReply(
    userId: number,
    commentId: number,
    content: string,
  ): Promise<Reply> {
    return this.prisma.$transaction(async (tx) => {
      const reply = await tx.reply.create({
        data: { user_id: userId, comment_id: commentId, content: content },
      });

      await tx.comment.update({
        where: { id: commentId },
        data: {
          reply_count: {
            increment: 1,
          },
        },
      });

      return reply; // reply 반환
    });
  }

  async getReplysByCursor(
    commentId: number,
    cursor: number,
    limit: number,
  ): Promise<Reply[]> {
    // created 순이 아닌, pkey 순서대로.
    const where = {
      comment_id: commentId,
      ...(cursor && { id: { gt: cursor } }), // cursor가 있는 경우, id가 cursor보다 큰 데이터만 조회
    };
    return await this.prisma.reply.findMany({
      where,
      take: limit, // limit 개수만큼 조회
      orderBy: { id: 'asc' }, // id 기준으로 오름차순 정렬 (cursor 기반 페이지네이션에 필수)
    });
  }

  async isReplyExist(replyId: number): Promise<boolean> {
    if ((await this.prisma.reply.count({ where: { id: replyId } })) > 0)
      return true; // 해당 댓글이 존재하면 true 반환
    else return false;
  }

  async isOwnedReply(replyId: number, userId: number): Promise<boolean> {
    const dataCount = await this.prisma.reply.count({
      where: { user_id: userId, id: replyId },
    });
    return dataCount > 0;
  }

  async updateReply(replyId: number, content: string): Promise<Reply> {
    return await this.prisma.reply.update({
      where: { id: replyId }, // id를 기준으로 댓글 검색
      data: { content: content }, // 수정할 내용
    });
  }

  async deleteReply(replyId: number) {
    let deleteResult: Reply;
    await this.prisma.$transaction(async (tx) => {
      const replyData = await tx.reply.findUnique({ where: { id: replyId } });

      deleteResult = await tx.reply.delete({
        where: { id: replyId },
      });

      const updatedComment = await tx.comment.update({
        where: { id: replyData.comment_id },
        data: {
          reply_count: {
            decrement: 1,
          },
        },
      });

      if (
        Number(updatedComment.reply_count) === 0 &&
        updatedComment.deleted_at !== null
      ) {
        await tx.comment.delete({
          where: { id: updatedComment.id },
        });
      }
    });
    return deleteResult;
  }
}
