import {
  Body,
  Controller,
  DefaultValuePipe,
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
import { UpdateCommentDto } from './dto/UpdateComment.dto';
import { CreateCommentRecommendDto } from './dto/CreateCommentRecommend.dto';
import { SortOrder } from './enums/comment-sort.enum';
// import { SortOrder } from './enums/comment-sort.enum';

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

  @Get('/list/like-sort')
  @ApiOperation({
    summary: '게시글 댓글 목록 조회 (추천순)',
    description: '특정 게시글의 댓글 목록을 추천순으로 조회합니다.',
  })
  @ApiQuery({
    name: 'articleId',
    description: '게시글 ID',
    type: Number,
    example: 1,
  })
  // @ApiQuery({
  //   name: 'cursor',
  //   description: '커서 댓글 ID (첫페이지면 0)',
  //   type: Number,
  //   example: 1,
  // })
  @ApiQuery({
    name: 'limit',
    description: '가져올 개수',
    type: Number,
    example: 10,
  })
  @ApiQuery({
    name: 'userId',
    description: '이용자Id : 숫자 or 파라미터X로 보내면 됩니다',
    type: Number || null,
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
  async getCommentsSortByRecommend(
    @Query('articleId', ParseIntPipe) articleId: number,
    // @Query('cursor', ParseIntPipe) cursor: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('userId', new DefaultValuePipe(null)) userId?: number | null,
  ): Promise<object> {
    try {
      const responseData = await this.commentService.getComments(
        articleId,
        0, //cursor로 대체
        limit,
        userId,
        SortOrder.Likes,
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
    description: '커서 댓글 ID (첫페이지면 0)',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    description: '가져올 개수',
    type: Number,
    example: 10,
  })
  @ApiQuery({
    name: 'userId',
    description: '이용자Id : 숫자 or 파라미터X로 보내면 됩니다',
    type: Number || null,
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
    @Query('userId', new DefaultValuePipe(null)) userId?: number | null,
  ): Promise<object> {
    try {
      const responseData = await this.commentService.getComments(
        articleId,
        cursor,
        limit,
        userId,
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
  @ApiQuery({
    name: 'commentId',
    description: '댓글 ID',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'userId',
    description: '이용자 ID',
    type: Number,
    example: 10,
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
    @Query('commentId', ParseIntPipe) commentId: number,
    @Query('userId', ParseIntPipe) userId: number,
  ): Promise<object> {
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
      const responseData = await this.commentService.fixComment(
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
      if (error.response?.statusCode === HttpStatus.FORBIDDEN) {
        throw new ForbiddenException('댓글 수정 권한 없음'); // 유저 권한 없음
      }
      if (error.response?.statusCode === HttpStatus.NOT_FOUND) {
        throw new NotFoundException('잘못된 접근'); // 삭제된 데이터 접근
      }
      throw new InternalServerErrorException();
    }
  }

  @Post('like')
  @ApiOperation({
    summary: '좋아요 누르기',
    description: '좋아요가 1증가',
  })
  @ApiBody({
    type: CreateCommentRecommendDto, // 요청 본문 DTO
    description: '좋아요 누를 댓글과 유저 정보',
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
    description: '좋아요 생성 성공',
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
              example: '생략',
            },
          },
        },
      },
    },
  }) // 201 Created 응답
  async addRecommend(@Body() createRecommendDto: CreateCommentRecommendDto) {
    try {
      const { commentId, userId } = createRecommendDto;
      const responseData = await this.commentService.addCommentRecommend(
        commentId,
        userId,
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
          errorCode: '이미 추천한 댓글입니다.',
          data: null,
        };
      }
      //여기서부터 에러처리
      console.error(error);
      if (error.response?.statusCode === HttpStatus.NOT_FOUND) {
        // ?. 연산자 추가
        throw new NotFoundException();
      }
      throw new InternalServerErrorException();
    }
  }

  @Delete('like')
  @ApiOperation({
    summary: '좋아요 삭제',
    description: '좋아요를 철회합니다.',
  })
  @ApiQuery({
    name: 'commentId',
    description: '댓글 ID',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'userId',
    description: '이용자 ID',
    type: Number,
    example: 10,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '좋아요 철회 성공',
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
              example: '생략 - 그냥 눌러보세요',
            },
          },
        },
      },
    },
  }) // 201 Created 응답
  async removeRecommend(
    @Query('commentId', ParseIntPipe) commentId: number,
    @Query('userId', ParseIntPipe) userId: number,
  ) {
    try {
      const responseData = await this.commentService.deleteCommentRecommend(
        commentId,
        userId,
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
          errorCode: '추천하지 않은 댓글입니다.',
          data: null,
        };
      }
      //여기서부터 에러처리
      console.error(error);
      if (error.response?.statusCode === HttpStatus.NOT_FOUND) {
        throw new NotFoundException();
      }
      throw new InternalServerErrorException();
    }
  }
}
