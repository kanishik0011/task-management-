import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { Response } from 'express';

type ErrorBody = {
  statusCode: number;
  message: string | string[];
  error?: string;
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();
      const normalized = this.normalizeBody(status, body);
      response.status(status).json({
        ...normalized,
        timestamp: new Date().toISOString()
      });
      return;
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Something went wrong. Please try again.',
      timestamp: new Date().toISOString()
    });
  }

  private normalizeBody(status: number, body: string | object): ErrorBody {
    if (typeof body === 'string') {
      return { statusCode: status, message: body };
    }

    const maybeBody = body as Partial<ErrorBody>;
    return {
      statusCode: maybeBody.statusCode ?? status,
      message: maybeBody.message ?? 'Request failed',
      error: maybeBody.error
    };
  }
}
