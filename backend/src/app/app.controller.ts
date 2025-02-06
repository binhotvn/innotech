import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Public')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOkResponse({ description: 'Get Service Health' })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @ApiOkResponse({ description: 'Get Server Time ' })
  @Get('time')
  getTime(): string {
    return this.appService.getTime();
  }
  @Get('error-sentry')
  error(): string {
    throw new Error('SENTRY_ERROR_TEST');
  }
}
