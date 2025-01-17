import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Bookmark, Prisma, PrismaClient } from '@prisma/client';

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

  // 북마크 관련 메서드
  async createBookmark(userId: number, articleId: number): Promise<Bookmark> {
    return await this.prisma.bookmark.create({
      data: { user_id: userId, article_id: articleId },
    });
  }

  async findOwnBookmarks(userId: number): Promise<Bookmark[]> {
    return await this.prisma.bookmark.findMany({ where: { user_id: userId } });
  }

  async isBookmarkExist(userId: number, articleId: number): Promise<boolean> {
    const dataCount = await this.prisma.bookmark.count({
      where: { user_id: userId, article_id: articleId },
    });
    return dataCount > 0;
  }

  async deleteBookmark(
    userId: number,
    articleId: number,
  ): Promise<Prisma.BatchPayload> {
    return await this.prisma.bookmark.deleteMany({
      where: { user_id: userId, article_id: articleId },
    });
  }
}
