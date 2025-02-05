import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // PrismaService 경로 확인
import { Bookmark } from '@prisma/client';
import { UtilService } from 'src/utils/util.service';

@Injectable()
export class BookmarkService {
  constructor(
    private prismaService: PrismaService,
    private utilService: UtilService,
  ) {}

  async createBookmark(userId: number, articleId: number): Promise<Object> {
    try {
      const data = await this.prismaService.createBookmark(userId, articleId);
      return {
        id: Number(data.id),
        user: Number(data.user_id),
        articleId: Number(data.article_id),
        createdAt: this.utilService.formatDateTime(data.created_at),
      };
    } catch (error) {
      if (error.code == 'P2002') {
        throw new ConflictException();
      }
      throw new InternalServerErrorException();
    }
  }

  async getBookmarks(userId: number): Promise<Bookmark[]> {
    return await this.prismaService.findOwnBookmarks(userId);
  }

  async getBookmark(userId: number, articleId: number): Promise<Bookmark> {
    return await this.prismaService.isBookmark(userId, articleId);
  }

  async deleteBookmark(userId: number, id: number) {
    // 애초에 북마크가 없으면 권한이 있는지도 확인 못함, 즉 반대 순서는 불가능
    // 북마크가 존재하는지 => 없으면 200번대 에러 반환
    // 존재한다면 권한이 내가 가지고 있는지
    // 이러면 권한이 없는 상태에서, 소유를 확인 가능
    if (!(await this.prismaService.isBookmarkExist(id))) {
      throw new NotFoundException();
    }
    if (!(await this.prismaService.isOwnedBookmark(userId, id))) {
      // 자기 소유가 아닌 경우
      throw new ForbiddenException();
    }
    return await this.prismaService.deleteBookmark(id);
  }
}
