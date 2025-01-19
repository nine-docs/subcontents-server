import { ApiProperty } from '@nestjs/swagger';

export class BookmarkResponseDto {
  @ApiProperty({ description: '사용자 ID', example: 1 })
  userId: number;

  @ApiProperty({ description: '게시글 ID', example: 123 })
  articleId: number;

  @ApiProperty({
    description: '북마크 생성 시간',
    example: '2024-10-27T10:00:00.000Z',
    nullable: true,
  })
  createdAt: Date | null;
}
