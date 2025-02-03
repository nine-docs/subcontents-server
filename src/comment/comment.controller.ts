import {
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommentService } from './comment.service';

@Controller('comment')
@ApiTags('Bookmark API') // API 태그 추가
@UsePipes(new ValidationPipe())
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  async createComment() {}

  @Get('/list')
  async getComments() {}

  @Delete()
  async deleteComment() {}

  @Put()
  async fixComment() {}
}
