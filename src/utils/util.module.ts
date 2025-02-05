import { Module } from '@nestjs/common';
import { UtilService } from './util.service';

@Module({
  providers: [UtilService],
  exports: [UtilService], // 다른 모듈에서 사용하기 위해 export
})
export class UtilModule {}
