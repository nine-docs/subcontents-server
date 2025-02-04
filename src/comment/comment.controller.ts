import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/CreateComment.dto';
import { DeleteCommentDto } from './dto/DeleteComment.dto';
import { UpdateCommentDto } from './dto/UpdateComment.dto';

@Controller('comment')
@ApiTags('Comment API') // API 태그 추가
@UsePipes(new ValidationPipe())
export class CommentController {
  constructor(private readonly commentService: CommentService) {}
  @Post()
  @ApiOperation({
    summary: '댓글 생성',
    description: '댓글을 작성합니다.',
  })
  @ApiBody({
    type: CreateCommentDto, // 요청 본문 DTO
    description: '생성할 댓글 정보',
    schema: {
      // 스키마 추가 (선택 사항)
      example: {
        articleId: 1,
        userId: 1,
        content: '댓글 내용 (1~1000자)',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '댓글 생성 성공',
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
              type: 'string',
              example: null,
            },
            data: {
              type: 'object',
              example: {
                commentId: 123,
                content: '댓글 내용',
                createdAt: '2024-12-25 12:25:36.650',
              },
            },
          },
        },
      },
    },
  }) // 201 Created 응답
  async createComment(
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<Object> {
    try {
      const { userId, articleId, content } = createCommentDto;
      const responseData = await this.commentService.createComment(
        articleId,
        userId,
        content,
      );
      return {
        success: true,
        errorCode: null,
        data: responseData,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  @Get('/list')
  @ApiOperation({
    summary: '게시글 댓글 목록 조회',
    description: '특정 게시글의 댓글 목록을 조회합니다.',
  })
  @ApiQuery({
    name: 'articleId',
    description: '게시글 ID',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'cursor',
    description: '커서 댓글 ID',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    description: '가져올 개수',
    type: Number,
    example: 10,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '댓글 목록 조회 성공',
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
              type: 'object',
              example: {
                cursor: 21,
                item: [
                  {
                    commentId: 1,
                    authorId: 1,
                    reply: { count: 5 },
                    createdAt: '2024-10-27T10:00:00.000Z',
                    content: '댓글 내용',
                    updatedAt: '2024-10-27T10:00:00.000Z',
                  },
                ],
              },
            },
          },
        },
      },
    },
  })
  async getComments(
    @Query('articleId', ParseIntPipe) articleId: number,
    @Query('cursor', ParseIntPipe) cursor: number,
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<object> {
    try {
      const responseData = await this.commentService.getComments(
        articleId,
        cursor,
        limit,
      );
      return {
        success: true,
        errorCode: null,
        data: responseData,
      };
    } catch (error) {
      console.error(error);
      //이용자에게 반환하기 위한 상정 이외의 에러
      if (error.response?.statusCode === HttpStatus.NOT_FOUND) {
        // 필요 없는 코드
        // 근데, 사실 댓글이 없는 건지, 존재하지 않는 게시글인지를 확인 불가
        // 삭제된 댓글은 볼 수 있는데, 삭제된 게시글은 못 봄 => 내가 예외처리 불가능
      }
      throw new InternalServerErrorException();
    }
  }

  @Delete()
  @ApiOperation({
    summary: '댓글 삭제',
    description: '댓글을 삭제합니다.',
  })
  @ApiBody({
    type: DeleteCommentDto, // 요청 본문 DTO
    description: '삭제할 댓글정보',
    schema: {
      // 스키마 추가 (선택 사항)
      example: {
        commentId: 1,
        userId: 1,
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '댓글 삭제 성공',
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
              type: 'string',
              example: null,
            },
            data: {
              type: 'string',
              example: null,
            },
          },
        },
      },
    },
  }) // 201 Created 응답
  async deleteComment(
    @Body() updateCommentDto: DeleteCommentDto,
  ): Promise<object> {
    const { commentId, userId } = updateCommentDto;
    try {
      await this.commentService.deleteComment(commentId, userId);
      return {
        success: true,
        errorCode: null,
        data: null,
      };
    } catch (error) {
      console.error(error);
      if (error.response?.statusCode === HttpStatus.FORBIDDEN) {
        throw new ForbiddenException('댓글 삭제 권한 없음'); //유저 권한 없음
      }
      if (error.response?.statusCode === HttpStatus.NOT_FOUND) {
        throw new NotFoundException('잘못된 접근'); //삭제된 데이터
      }
      throw new InternalServerErrorException();
    }
  }

  @Put()
  @ApiOperation({
    summary: '댓글 수정',
    description: '댓글을 수정합니다.',
  })
  @ApiBody({
    type: UpdateCommentDto, // 요청 본문 DTO
    description: '수정할 댓글정보',
    schema: {
      // 스키마 추가 (선택 사항)
      example: {
        commentId: 1,
        userId: 1,
        content: '댓글 내용',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '댓글 수정 성공',
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
              type: 'string',
              example: null,
            },
            data: {
              type: 'object',
              example: {
                commentId: 1,
                content: '댓글 내용',
                createdAt: '2024-10-27T10:00:00.000Z',
                updatedAt: '2024-10-27T10:00:00.000Z',
              },
            },
          },
        },
      },
    },
  }) // 201 Created 응답
  async fixComment(
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<object> {
    const { commentId, userId, content } = updateCommentDto;
    try {
      await this.commentService.fixComment(commentId, userId, content);
      return {
        success: true,
        errorCode: null,
        data: null,
      };
    } catch (error) {
      console.error(error);
      if (error.response?.statusCode === HttpStatus.FORBIDDEN) {
        throw new ForbiddenException('댓글 수정 권한 없음'); // 유저 권한 없음
      }
      if (error.response?.statusCode === HttpStatus.NOT_FOUND) {
        throw new NotFoundException('잘못된 접근'); // 삭제된 데이터 접근
      }
      throw new InternalServerErrorException();
    }
  }
}
