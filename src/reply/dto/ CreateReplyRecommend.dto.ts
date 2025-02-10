import { IsInt, IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReplyRecommendDto {
  @ApiProperty({ description: '답글 ID', example: 123 })
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  replyId: number;

  @ApiProperty({ description: '유저 ID', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  userId: number;
}
