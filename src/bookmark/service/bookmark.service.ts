import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; // PrismaService 경로 확인
import { Bookmark, Prisma } from '@prisma/client';

@Injectable()
export class BookmarkService {
  constructor(private prismaService: PrismaService) {}

  async createBookmark(userId: number, articleId: number): Promise<Bookmark> {
    try {
      if (await this.prismaService.isBookmarkExist(userId, articleId)) {
        // 유저가 해당 글을 이미 북마크했으면 200번대로 반환하고, 메시지로 문제 알리기
        throw new Error(); // 여기서 던지거나, 아니면 db에서 에러 발생
      } else {
        //존재 안하면 생성
        return await this.prismaService.createBookmark(userId, articleId);
      }
    } catch (error) {
      // db error
      throw new ConflictException('이미 존재하는 북마크 정보');
    }
  }

  async readBookmark(userId: number): Promise<Bookmark[]> {
    return await this.prismaService.findOwnBookmarks(userId);
  }

  async deleteBookmark(
    userId: number,
    articleId: number,
  ): Promise<Prisma.BatchPayload> {
    try {
      if (await this.prismaService.isBookmarkExist(userId, articleId)) {
        //존재한다면 삭제
        return await this.prismaService.deleteBookmark(userId, articleId);
      } else {
        // 해당 북마크가 없으면 200번대로 반환하고, 메시지로 문제 알리기
        throw new Error();
      }
    } catch (error) {
      // db error
      throw new ConflictException('존재하지 않는 북마크 정보');
    }
  }
}
