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
import { ReplyService } from './reply.service';
import { CreateReplyDto } from './dto/CreateReply.dto';
import { CreateCommentDto } from 'src/comment/dto/CreateComment.dto';
import { DeleteReplyDto } from './dto/DeleteReply.dto';
import { UpdateReplyDto } from './dto/UpdateReply.dto';

@Controller('reply')
@ApiTags('Reply API') // API 태그 추가
@UsePipes(new ValidationPipe())
export class ReplyController {
  constructor(private readonly replyService: ReplyService) {}

  @Post()
  @ApiOperation({
    summary: '답글 생성',
    description: '답글을 작성합니다.',
  })
  @ApiBody({
    type: CreateReplyDto, // 요청 본문 DTO
    description: '생성할 답글 정보',
    schema: {
      // 스키마 추가 (선택 사항)
      example: {
        commentId: 1,
        userId: 1,
        content: '답글 내용 (1~1000자)',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '답글 생성 성공',
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
                replyId: 123,
                content: '답글 내용',
                createdAt: '2024-12-25 12:25:36.650',
              },
            },
          },
        },
      },
    },
  }) // 201 Created 응답
  @Post()
  async createReply(@Body() createReplyDto: CreateReplyDto): Promise<Object> {
    try {
      const { userId, commentId, content } = createReplyDto;
      const responseData = await this.replyService.createReply(
        commentId,
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
    summary: '답글 목록 조회',
    description: '특정 댓글의 답글 목록을 조회합니다.',
  })
  @ApiQuery({
    name: 'commentId',
    description: '댓글 ID',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'cursor',
    description: '커서 답글 ID',
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
    description: '답글 목록 조회 성공',
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
                    replyId: 1,
                    authorId: 1,
                    content: '답글 내용',
                    createdAt: '2024-10-27T10:00:00.000Z',
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
  async getReplys(
    @Query('articleId', ParseIntPipe) commentId: number,
    @Query('cursor', ParseIntPipe) cursor: number,
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<object> {
    try {
      const responseData = await this.replyService.getReplys(
        commentId,
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
      if (error.response?.statusCode === HttpStatus.NOT_FOUND) {
      }
      throw new InternalServerErrorException();
    }
  }

  @Delete()
  @ApiOperation({
    summary: '답글 삭제',
    description: '답글을 삭제합니다.',
  })
  @ApiBody({
    type: DeleteReplyDto, // 요청 본문 DTO
    description: '삭제할 답글정보',
    schema: {
      // 스키마 추가 (선택 사항)
      example: {
        replyId: 1,
        userId: 1,
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '답글 삭제 성공',
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
  async deleteReply(@Body() deleteReplyDto: DeleteReplyDto): Promise<object> {
    const { replyId, userId } = deleteReplyDto;
    try {
      await this.replyService.deleteReply(replyId, userId);
      return {
        success: true,
        errorCode: null,
        data: null,
      };
    } catch (error) {
      console.error(error);
      if (error.response?.statusCode === HttpStatus.FORBIDDEN) {
        throw new ForbiddenException('답글 삭제 권한 없음'); //유저 권한 없음
      }
      if (error.response?.statusCode === HttpStatus.NOT_FOUND) {
        throw new NotFoundException('잘못된 접근'); //삭제된 데이터
      } // 삭제 트랜잭션 실패는 InternalServer Error
      throw new InternalServerErrorException();
    }
  }

  @Put()
  @ApiOperation({
    summary: '답글 수정',
    description: '답글을 수정합니다.',
  })
  @ApiBody({
    type: UpdateReplyDto, // 요청 본문 DTO
    description: '수정할 답글정보',
    schema: {
      // 스키마 추가 (선택 사항)
      example: {
        replyId: 1,
        userId: 1,
        content: '답글 내용',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '답글 수정 성공',
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
                replyId: 1,
                content: '답글 내용',
                createdAt: '2024-10-27T10:00:00.000Z',
                updatedAt: '2024-10-27T10:00:00.000Z',
              },
            },
          },
        },
      },
    },
  }) // 201 Created 응답
  async fixReply(@Body() updateReplyDto: UpdateReplyDto): Promise<object> {
    const { replyId, userId, content } = updateReplyDto;
    try {
      await this.replyService.fixReply(replyId, userId, content);
      return {
        success: true,
        errorCode: null,
        data: null,
      };
    } catch (error) {
      console.error(error);
      if (error.response?.statusCode === HttpStatus.FORBIDDEN) {
        throw new ForbiddenException('답글 수정 권한 없음'); // 유저 권한 없음
      }
      if (error.response?.statusCode === HttpStatus.NOT_FOUND) {
        throw new NotFoundException('잘못된 접근'); // 삭제된 데이터 접근
      }
      throw new InternalServerErrorException();
    }
  }
}
