import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { WithSentry } from '@sentry/nestjs';

interface ResponseBody {
  message: string;
  statusCode?: number;
  timestamp?: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
  @WithSentry()
  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse =
      exception instanceof HttpException
        ? (exception.getResponse() as ResponseBody)
        : ({ message: 'BAD_REQUEST' } as ResponseBody);

    let messageException =
      exception instanceof Error ? exception.message : 'INTERNAL_SERVER_ERROR';
    if (httpStatus === HttpStatus.NOT_FOUND) {
      messageException = 'NOT_FOUND';
    }
    if (httpStatus === HttpStatus.TOO_MANY_REQUESTS) {
      messageException = 'TOO_MANY_REQUESTS';
    }
    if (httpStatus === HttpStatus.BAD_REQUEST) {
      messageException = exceptionResponse.message;
    }
    const responseBody = {
      statusCode: httpStatus,
      message:
        exception instanceof Error ? messageException : 'INTERNAL_SERVER_ERROR',
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
