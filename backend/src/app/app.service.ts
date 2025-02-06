import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Pong!';
  }
  getTime(): string {
    return new Date().toISOString();
  }
}
