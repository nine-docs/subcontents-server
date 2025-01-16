import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // PrismaService 경로 확인
import { CreateBookmarkDto } from './dto/create-bookmark.dto'; // DTO 추가

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  //   async create(userId: bigint, createBookmarkDto: CreateBookmarkDto) {
  //     try {
  //       return await this.prisma.bookmarks.create({
  //         data: {
  //           userId,
  //           articleId: createBookmarkDto.articleId,
  //         },
  //       });
  //     } catch (error) {
  //       // 중복 북마크 등의 에러 처리
  //       console.error(error);
  //       throw error;
  //     }
  //   }

  //   async findAll(userId: bigint) {
  //     return await this.prisma.bookmarks.findMany({
  //       where: { userId },
  //       include: { article: true }, // 게시글 정보 포함
  //     });
  //   }

  //   async remove(userId: bigint, articleId: bigint) {
  //     try {
  //       const bookmark = await this.prisma.bookmarks.deleteMany({
  //         where: {
  //           userId,
  //           articleId,
  //         },
  //       });
  //       if (bookmark.count === 0) {
  //         throw new NotFoundException('Bookmark not found');
  //       }
  //       return bookmark;
  //     } catch (error) {
  //       console.error(error);
  //       throw error;
  //     }
  //   }
}
