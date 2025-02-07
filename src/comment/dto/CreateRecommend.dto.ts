import { IsInt, IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRecommendDto {
  @ApiProperty({ description: '댓글 ID', example: 123 })
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
