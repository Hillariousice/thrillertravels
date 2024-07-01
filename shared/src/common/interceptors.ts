import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { Observable, map, catchError, throwError } from 'rxjs';

export interface Response<T> {
  status: boolean;
  statusCode: number;
  data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => ({
        status:
          context.switchToHttp().getResponse().statusCode == 200 ||
          context.switchToHttp().getResponse().statusCode == 201
            ? true
            : false,
        statusCode: context.switchToHttp().getResponse().statusCode,
        data: data || null,
      })),
      catchError((error) => {
        if (error instanceof HttpException) {
          return throwError({
            status: false,
            statusCode: error.getStatus(),
            message: error.getResponse(),
          });
        }
        return throwError({
          status: false,
          statusCode: 500,
          message: 'Internal Server Error',
        });
      }),
    );
  }
}
