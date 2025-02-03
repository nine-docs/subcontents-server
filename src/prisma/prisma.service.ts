import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Bookmark, Comment, Prisma, PrismaClient } from '@prisma/client';

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
  async createComment(
    userId: number,
    articleId: number,
    content: string,
  ): Promise<Comment> {
    return await this.prisma.comment.create({
      data: { user_id: userId, article_id: articleId, content: content },
    });
  }

  //Reply
  async getComments(
    articleId: bigint,
    cursor: bigint | null,
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
}
