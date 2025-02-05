import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookmarkDto {
  @ApiProperty({ description: '게시글 ID', example: 123 })
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  articleId: number;

  @ApiProperty({ description: '유저 ID', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  userId: number;
}
