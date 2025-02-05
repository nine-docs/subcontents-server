import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteCommentDto {
  // 안 씀
  @ApiProperty({ description: '댓글 ID', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  commentId: number;

  @ApiProperty({ description: '유저 ID', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  userId: number;
}
