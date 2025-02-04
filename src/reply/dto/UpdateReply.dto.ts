import { IsInt, IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateReplyDto {
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

  @ApiProperty({ description: '답글 내용', example: '이의 있습니다.' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 1000)
  content: string;
}
