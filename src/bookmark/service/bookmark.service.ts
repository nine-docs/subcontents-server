import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; // PrismaService 경로 확인
import { CreateBookmarkDto } from '../dto/create-bookmark.dto'; // DTO 추가
import {
  BOOKMARK_REPOSITORY,
  BookmarkRepository,
} from '../repository/bookmark.repository.interface';

@Injectable()
export class BookmarkService {
  constructor(
    private prisma: PrismaService,
    @Inject(BOOKMARK_REPOSITORY)
    private readonly bookmarkRepository: BookmarkRepository,
  ) {}

  // async create(userId: bigint, createBookmarkDto: CreateBookmarkDto) {
  //   try {
  //     this.prisma..findUnique({ where: { id } });
  //   } catch (error) {
  //     // 중복 북마크 등의 에러 처리
  //     console.error(error);
  //     throw error;
  //   }
  // }

  // async findAll(userId: bigint) {
  //   return await this.prisma.prisma.bookmark.findMany({
  //     where: { userId },
  //   });
  // }

  // async remove(userId: bigint, articleId: bigint) {
  //   try {
  //     const bookmark = await this.prisma.prisma.bookmark.deleteMany({
  //       where: {
  //         userId,
  //         articleId,
  //       },
  //     });
  //     if (bookmark.count === 0) {
  //       throw new NotFoundException('Bookmark not found');
  //     }
  //     return bookmark;
  //   } catch (error) {
  //     console.error(error);
  //     throw error;
  //   }
  // }
}
