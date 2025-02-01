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
  InternalServerErrorException,
  HttpStatus,
} from '@nestjs/common';
import { BookmarkService } from '../service/bookmark.service';
import { BookmarkDto } from '../dto/CreateBookmark.dto';
import { BookmarkResponseDto } from '../dto/BookmarkResponse.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Bookmark API') // API 태그 추가
@Controller('api/v1/bookmark')
@UsePipes(new ValidationPipe())
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Get(':userId')
  @ApiOperation({
    summary: '사용자 북마크 조회',
    description: '특정 사용자의 북마크 목록을 조회합니다.',
  })
  @ApiParam({
    name: 'userId',
    description: '사용자 ID',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '북마크 조회 성공',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            errorCode: {
              type: 'number',
              example: null,
            },
            data: {
              type: 'array',
              example: [
                {
                  id: 1,
                  userId: 1,
                  articleId: 123,
                  createdAt: '2024-10-27T10:00:00.000Z',
                },
              ],
            },
          },
        },
      },
    },
  }) // 201 Created 응답
  async readBookmark(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<object> {
    try {
      const bookmarks = await this.bookmarkService.readBookmark(userId);
      const response = bookmarks.map((bookmark) => ({
        id: Number(bookmark.id),
        userId: Number(bookmark.user_id),
        articleId: Number(bookmark.article_id),
        createdAt: bookmark.created_at,
      }));
      return {
        success: true,
        errorCode: null,
        data: response,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Internal Server Error'); // 500 에러를 던지는 것이 더 적절합니다.
    }
  }

  @Post(':userId')
  @ApiOperation({
    summary: '북마크 생성',
    description: '특정 사용자의 북마크를 생성합니다.',
  })
  @ApiParam({
    name: 'userId',
    description: '사용자 ID',
    type: Number,
    example: 1,
  }) // userId 파라미터 설명
  @ApiBody({ type: BookmarkDto, description: '생성할 북마크 정보' }) // 요청 본문 타입 및 설명 추가
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '북마크 생성 성공',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            errorCode: {
              type: 'number',
              example: null,
            },
            data: {
              type: 'string',
              example: {
                id: 1,
              },
            },
          },
        },
      },
    },
  }) // 201 Created 응답
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '이미 존재하는 북마크 (형식은 위의 200과 같음)',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: '서버 오류',
  }) // 500 에러 추가
  async createBookmark(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() createBookmarkDto: BookmarkDto,
  ): Promise<Object> {
    try {
      const { articleId } = createBookmarkDto;
      const responseData = await this.bookmarkService.createBookmark(
        userId,
        articleId,
      );
      return {
        success: true,
        errorCode: null,
        data: { id: Number(responseData.id) },
      };
    } catch (error) {
      if (error.response?.statusCode === HttpStatus.CONFLICT) {
        // ?. 연산자 추가
        return {
          success: false,
          errorCode: null,
          data: '이미 존재하는 북마크입니다',
        };
      }
      console.error(error);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  @Delete(':id')
  @ApiOperation({
    summary: '북마크 삭제',
    description: '특정 사용자의 북마크를 삭제합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '북마크 PKEY',
    type: Number,
    example: 1,
  }) // userId 파라미터 설명
  @ApiResponse({
    status: HttpStatus.OK,
    description: '북마크 삭제 성공',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            errorCode: {
              type: 'number',
              example: null,
            },
            data: {
              type: 'string',
              example: '북마크가 성공적으로 삭제되었습니다.',
            },
          },
        },
      },
    },
  }) // 200 OK 응답
  @ApiResponse({
    status: HttpStatus.OK,
    description: '(형식은 위의 200과 같음)',
  }) // 404 Not Found 응답 추가
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: '서버 오류',
  }) // 500 에러 추가
  async deleteBookmark(@Param('id', ParseIntPipe) id: number): Promise<Object> {
    try {
      const deleteResult = await this.bookmarkService.deleteBookmark(id);
      if (deleteResult.count === 0) {
        return {
          success: false,
          errorCode: null,
          data: '이미 삭제된 북마크입니다',
        };
      }
      return {
        success: true,
        errorCode: null,
        data: '북마크를 성공적으로 삭제했습니다.',
      };
    } catch (error) {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}
