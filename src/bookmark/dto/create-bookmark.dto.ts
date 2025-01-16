import { IsNotEmpty } from 'class-validator';
import { IsBigInt } from 'src/common/decorators/is-bigint.decorator';

export class CreateBookmarkDto {
  @IsNotEmpty()
  @IsBigInt()
  articleId: bigint;
}
