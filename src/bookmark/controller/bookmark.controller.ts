// import {
//   Controller,
//   Post,
//   Get,
//   Delete,
//   Body,
//   Param,
//   UsePipes,
//   ValidationPipe,
//   ParseIntPipe,
//   InternalServerErrorException,
// } from '@nestjs/common';
// import { BookmarkService } from '../service/bookmark.service';
// import { BookmarkDto } from '../dto/CreateBookmark.dto';
// import { BookmarkResponseDto } from '../dto/BookmarkResponse.dto';

// @Controller('api/v1/bookmark')
// export class BookmarkController {
//   constructor(private readonly bookmarkService: BookmarkService) {}

//   @Get(':userId')
//   async readBookmark(
//     @Param('userId', ParseIntPipe) userId: number,
//   ): Promise<BookmarkResponseDto[]> {
//     try {
//       const bookmarks = await this.bookmarkService.readBookmark(userId);
//       const response = bookmarks.map((bookmark) => ({
//         userId: Number(bookmark.user_id), // bigint -> number 변환
//         articleId: Number(bookmark.article_id), // bigint -> number 변환
//         createdAt: bookmark.created_at,
//       }));
//       return response;
//     } catch (error) {
//       console.error(error);
//       return;
//     }
//   }

//   @Post(':userId')
//   @UsePipes(new ValidationPipe())
//   async createBookmark(
//     @Param('userId', ParseIntPipe) userId: number, // 쿼리 파라미터에서 userId 가져오기
//     @Body() createBookmarkDto: BookmarkDto, // 바디에서 articleId 가져오기
//   ): Promise<Object> {
//     try {
//       const { articleId } = createBookmarkDto; // DTO에서 articleId 추출
//       await this.bookmarkService.createBookmark(userId, articleId);
//       return { message: '북마크가 성공적으로 생성되었습니다.' };
//     } catch (error) {
//       console.error(error);

//       if (error.response.statusCode === 409) {
//         return {
//           success: true,
//           errorCode: null,
//           data: '이미 존재하는 북마크입니다', // 필요한 경우 추가 데이터
//         };
//       }
//       throw new InternalServerErrorException('Internal Server Error');
//     }
//   }

//   @Delete(':userId')
//   @UsePipes(new ValidationPipe())
//   async deleteBookmark(
//     @Param('userId', ParseIntPipe) userId: number, // 쿼리 파라미터에서 userId 가져오기
//     @Body() createBookmarkDto: BookmarkDto, // 바디에서 articleId 가져오기
//   ): Promise<Object> {
//     try {
//       const { articleId } = createBookmarkDto; // DTO에서 articleId 추출
//       await this.bookmarkService.deleteBookmark(userId, articleId);
//       return { message: '북마크가 성공적으로 삭제되었습니다.' };
//     } catch (error) {
//       if (error.response.statusCode === 409) {
//         return {
//           success: true,
//           errorCode: null,
//           data: '이미 삭제된 북마크입니다', // 필요한 경우 추가 데이터
//         };
//       }
//       throw new InternalServerErrorException('Internal Server Error');
//     }
//   }
// }

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
  }) // userId 파라미터 설명
  @ApiResponse({
    status: HttpStatus.OK,
    description: '북마크 조회 성공',
    type: [BookmarkResponseDto],
  }) // 성공 응답 타입 지정
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '북마크가 존재하지 않음',
  }) // 북마크가 없을 경우
  async readBookmark(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<BookmarkResponseDto[]> {
    try {
      const bookmarks = await this.bookmarkService.readBookmark(userId);
      const response = bookmarks.map((bookmark) => ({
        userId: Number(bookmark.user_id),
        articleId: Number(bookmark.article_id),
        createdAt: bookmark.created_at,
      }));
      return response;
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
            message: {
              type: 'string',
              example: '북마크가 성공적으로 생성되었습니다.',
            },
          },
        },
      },
    },
  }) // 201 Created 응답
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: '이미 존재하는 북마크',
  }) // 409 Conflict 응답
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
      await this.bookmarkService.createBookmark(userId, articleId);
      return { message: '북마크가 성공적으로 생성되었습니다.' };
    } catch (error) {
      console.error(error);
      if (error.response?.statusCode === HttpStatus.CONFLICT) {
        // ?. 연산자 추가
        return {
          success: true,
          errorCode: null,
          data: '이미 존재하는 북마크입니다',
        };
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  @Delete(':userId')
  @ApiOperation({
    summary: '북마크 삭제',
    description: '특정 사용자의 북마크를 삭제합니다.',
  })
  @ApiParam({
    name: 'userId',
    description: '사용자 ID',
    type: Number,
    example: 1,
  }) // userId 파라미터 설명
  @ApiBody({ type: BookmarkDto, description: '삭제할 북마크 정보' }) // 요청 본문 타입 및 설명 추가
  @ApiResponse({
    status: HttpStatus.OK,
    description: '북마크 삭제 성공',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: '북마크가 성공적으로 삭제되었습니다.',
            },
          },
        },
      },
    },
  }) // 200 OK 응답
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '삭제할 북마크가 존재하지 않음',
  }) // 404 Not Found 응답 추가
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: '서버 오류',
  }) // 500 에러 추가
  async deleteBookmark(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() createBookmarkDto: BookmarkDto,
  ): Promise<Object> {
    try {
      const { articleId } = createBookmarkDto;
      await this.bookmarkService.deleteBookmark(userId, articleId);
      return { message: '북마크가 성공적으로 삭제되었습니다.' };
    } catch (error) {
      console.error(error);
      if (error.response?.statusCode === HttpStatus.CONFLICT) {
        // ?. 연산자 추가
        return {
          success: true,
          errorCode: null,
          data: '이미 삭제된 북마크입니다',
        };
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}
