import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class BookmarkDto {
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  articleId: number;
}
