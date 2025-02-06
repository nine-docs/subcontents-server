import { Injectable } from '@nestjs/common';
import { formatInTimeZone } from 'date-fns-tz';

@Injectable()
export class UtilService {
  formatDateTime(dateTime) {
    const timeZone = 'Asia/Seoul';
    const date = new Date(dateTime);

    return formatInTimeZone(date, timeZone, 'yyyy-MM-dd HH:mm:ss.SSSSSS');
  }
}
