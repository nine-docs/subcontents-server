import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteReplyDto {
  // 안 씀
  @ApiProperty({ description: '답글 ID', example: 1 })
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
