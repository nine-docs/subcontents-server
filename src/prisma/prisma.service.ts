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
}
