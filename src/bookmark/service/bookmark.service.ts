import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; // PrismaService 경로 확인
import { Bookmark, Prisma } from '@prisma/client';

@Injectable()
export class BookmarkService {
  constructor(private prismaService: PrismaService) {}

  async createBookmark(userId: number, articleId: number): Promise<Bookmark> {
    try {
      return await this.prismaService.createBookmark(userId, articleId);
    } catch (error) {
      throw new ConflictException('이미 존재하는 북마크 정보');
    }
  }

  async readBookmark(userId: number): Promise<Bookmark[]> {
    return await this.prismaService.findOwnBookmarks(userId);
  }

  async deleteBookmark(id: number): Promise<Prisma.BatchPayload> {
    try {
      return await this.prismaService.deleteBookmark(id);
    } catch (error) {
      // db error
      throw new ConflictException('존재하지 않는 북마크 정보');
    }
  }
}
