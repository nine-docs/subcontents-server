import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { BookmarkService } from '../service/bookmark.service';
import { BookmarkDto } from '../dto/CreateBookmark.dto';
import { BookmarkResponseDto } from '../dto/BookmarkResponse.dto';

@Controller('api/v1/bookmark')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Get(':userId')
  async readBookmark(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<BookmarkResponseDto[]> {
    try {
      const bookmarks = await this.bookmarkService.readBookmark(userId);
      const response = bookmarks.map((bookmark) => ({
        userId: Number(bookmark.user_id), // bigint -> number 변환
        articleId: Number(bookmark.article_id), // bigint -> number 변환
        createdAt: bookmark.created_at,
      }));
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  @Post(':userId')
  @UsePipes(new ValidationPipe())
  async createBookmark(
    @Param('userId', ParseIntPipe) userId: number, // 쿼리 파라미터에서 userId 가져오기
    @Body() createBookmarkDto: BookmarkDto, // 바디에서 articleId 가져오기
  ): Promise<Object> {
    try {
      const { articleId } = createBookmarkDto; // DTO에서 articleId 추출
      await this.bookmarkService.createBookmark(userId, articleId);
      return { message: '북마크가 성공적으로 생성되었습니다.' };
    } catch (error) {
      console.error(error);
    }
  }

  @Delete(':userId')
  @UsePipes(new ValidationPipe())
  async deleteBookmark(
    @Param('userId', ParseIntPipe) userId: number, // 쿼리 파라미터에서 userId 가져오기
    @Body() createBookmarkDto: BookmarkDto, // 바디에서 articleId 가져오기
  ): Promise<Object> {
    try {
      const { articleId } = createBookmarkDto; // DTO에서 articleId 추출
      await this.bookmarkService.deleteBookmark(userId, articleId);
      return { message: '북마크가 성공적으로 삭제되었습니다.' };
    } catch (error) {
      console.error(error);
    }
  }
}
