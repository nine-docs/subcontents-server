import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  InternalServerErrorException,
  HttpStatus,
  ForbiddenException,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto } from './dto/CreateBookmark.dto';
import { BookmarkResponseDto } from './dto/BookmarkResponse.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
// import { DeleteBookmarkDto } from './dto/DeleteBookmark.dto';

@ApiTags('Bookmark API') // API 태그 추가
@Controller('bookmark')
@UsePipes(new ValidationPipe())
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Get('/list')
  @ApiOperation({
    summary: '사용자 북마크 조회',
    description: '특정 사용자의 북마크 목록을 조회합니다.',
  })
  @ApiQuery({
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
  async readBookmarks(
    @Query('userId', ParseIntPipe) userId: number,
  ): Promise<object> {
    try {
      const response = await this.bookmarkService.getBookmarks(userId);
      return {
        success: true,
        errorCode: null,
        data: response,
      };
    } catch (error) {
      console.error(error);
      //이용자에게 반환하기 위한 상정 이외의 에러
      throw new InternalServerErrorException();
    }
  }

  @Get('/exists')
  @ApiOperation({
    summary: '사용자 북마크 소유 조회',
    description: '특정 사용자의 북마크 여부를 조회합니다.',
  })
  @ApiQuery({
    name: 'userId',
    description: '사용자 ID',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'articleId',
    description: '게시글 ID',
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
              example: {
                id: 1,
              },
            },
          },
        },
      },
    },
  }) // 201 Created 응답
  async readBookmark(
    @Query('userId', ParseIntPipe) userId: number,
    @Query('articleId', ParseIntPipe) articleId: number,
  ): Promise<object> {
    try {
      const bookmark = await this.bookmarkService.getBookmark(
        userId,
        articleId,
      );

      let tempdata = {
        success: true,
        errorCode: null,
        data: null,
      };
      if (bookmark !== null && bookmark.id !== null) {
        tempdata.data = { id: Number(bookmark.id) };
      }

      return tempdata;
    } catch (error) {
      console.error(error);
      //이용자에게 반환하기 위한 상정 이외의 에러
      throw new InternalServerErrorException();
    }
  }

  @Post()
  @ApiOperation({
    summary: '북마크 생성',
    description: '특정 사용자의 북마크를 생성합니다.',
  })
  @ApiBody({
    type: CreateBookmarkDto, // 요청 본문 DTO
    description: '삭제할 북마크 정보',
    schema: {
      // 스키마 추가 (선택 사항)
      example: {
        id: 1,
        userId: 123,
      },
    },
  })
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
    @Body() createBookmarkDto: CreateBookmarkDto,
  ): Promise<Object> {
    try {
      const { userId, articleId } = createBookmarkDto;
      const responseData = await this.bookmarkService.createBookmark(
        userId,
        articleId,
      );
      return {
        // 원래 reposeData에서 받아올 때, 애초에 필요한 데이터만 와야 함. 실수
        success: true,
        errorCode: null,
        data: responseData,
      };
    } catch (error) {
      //에러에 걸렸지만, 에러로 간주되지 않는 경우
      //return과 throw의 차이점은, controller를 호출한 함수의 try에서 예외가 발생하는지의 차이
      if (error.response?.statusCode === HttpStatus.CONFLICT) {
        // ?. 연산자 추가
        return {
          success: false,
          errorCode: '이미 존재하는 북마크입니다',
          data: null,
        };
      }
      //여기서부터 에러처리
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  @Delete()
  @ApiOperation({
    summary: '북마크 삭제',
    description: '특정 사용자의 북마크를 삭제합니다.',
  })
  @ApiQuery({
    name: 'bookmarkId',
    description: '북마크 ID',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'userId',
    description: '이용자 ID',
    type: Number,
    example: 1,
  })
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
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: '권한 없는 삭제 요청',
  }) // 500 에러 추가
  async deleteBookmark(
    @Query('bookmarkId', ParseIntPipe) id: number,
    @Query('userId', ParseIntPipe) userId: number,
  ): Promise<Object> {
    try {
      const deleteResult = await this.bookmarkService.deleteBookmark(
        userId,
        id,
      );
      if (deleteResult.count !== 1) {
        throw new NotFoundException();
      }
      return {
        success: true,
        errorCode: null,
        data: '북마크를 성공적으로 삭제했습니다.',
      };
    } catch (error) {
      if (error.response?.statusCode === HttpStatus.NOT_FOUND) {
        // ?. 연산자 추가
        return {
          success: false,
          errorCode: '존재하지 않는 북마크입니다.',
          data: null,
        };
      }

      console.error(error);
      //에러의 종류를 나눠서 처리
      if (error.response?.statusCode === HttpStatus.FORBIDDEN) {
        throw new ForbiddenException('권한이 없는 북마크 접근');
      }
      throw new InternalServerErrorException();
    }
  }
}
