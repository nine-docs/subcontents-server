import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class CreateBookmarkDto {
  @Transform(({ value }) => BigInt(value))
  @IsNumber()
  articleId: bigint;
}
