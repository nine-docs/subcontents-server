import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteCommentDto {
  @ApiProperty({ description: '북마크 ID', example: 1 })
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
