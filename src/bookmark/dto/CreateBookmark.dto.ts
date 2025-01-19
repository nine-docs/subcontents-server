import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BookmarkDto {
  @ApiProperty({ description: '게시글 ID', example: 123 })
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  articleId: number;
}
